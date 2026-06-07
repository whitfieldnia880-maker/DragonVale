import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DialogueBox } from './DialogueBox'
import type { DialogueScene, DialogueState } from '@/engine/dialogueEngine'
import {
  initDialogue,
  getCurrentNode,
  getCurrentLine,
  canAdvanceLine,
  advanceLine,
  isAtChoices,
  isSceneEnd,
  getAvailableChoices,
  selectChoice,
  advanceAuto,
  getNodeAutoAdvanceMs,
  routeStatCheck,
  validateScene,
} from '@/engine/dialogueEngine'
import { usePlayerStore } from '@/store/playerStore'
import { useRosterStore } from '@/store/rosterStore'
import { useProgressStore } from '@/store/progressStore'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { ALL_CHARACTERS } from '@/data/characters'
import { getCharacterAssets } from '@/data/characters/assets'
import {
  syncChapterProgress,
  syncStoryFlag,
  syncCharacterAffection,
} from '@/systems/saveSystem'
import { cn } from '@/lib/utils'

// ─── Affection popup ──────────────────────────────────────────────────────────

interface AffectionEvent {
  delta: number
  key: number
}

function AffectionPopup({ event }: { event: AffectionEvent | null }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.key}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -24, scale: 1 }}
          exit={{ opacity: 0, y: -48, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute bottom-56 left-1/2 -translate-x-1/2 pointer-events-none z-40"
        >
          <div className="bg-pink-900/80 border border-pink-500/40 rounded-full px-3 py-1 flex items-center gap-1.5 backdrop-blur-sm shadow-lg shadow-pink-500/20">
            <span className="text-pink-300 text-sm font-bold">+{event.delta}</span>
            <span className="text-xs">♥</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Character art backdrop ───────────────────────────────────────────────────

function VNBackground({
  characterId,
  portrait,
  accentColor,
  isMonologue,
  isMemory,
}: {
  characterId: string
  portrait: string
  accentColor: string
  isMonologue: boolean
  isMemory: boolean
}) {
  const assets = getCharacterAssets(characterId)

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={isMemory ? { filter: 'sepia(0.7) brightness(0.85)' } : undefined}
    >
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Ambient glow */}
      <motion.div
        animate={{
          opacity: isMonologue ? 0.12 : 0.22,
          scale: isMonologue ? 1 : 1.05,
        }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 38%, ${accentColor}55 0%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

      {/* Character art */}
      <div className="absolute inset-x-0 top-16 flex flex-col items-center pointer-events-none">
        <motion.div
          animate={{
            opacity: isMonologue ? 0 : 0.35,
            scale: isMonologue ? 0.8 : 1,
          }}
          transition={{ duration: 0.8 }}
          className="w-52 h-52 rounded-full blur-3xl mb-[-6rem]"
          style={{ backgroundColor: accentColor }}
        />

        <motion.div
          animate={{
            opacity: isMonologue ? 0.15 : 1,
            scale: isMonologue ? 0.85 : 1,
            y: isMonologue ? 10 : 0,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative z-10 drop-shadow-2xl"
          style={{ filter: isMonologue ? 'grayscale(0.8)' : 'none' }}
        >
          {assets ? (
            <img
              src={assets.bust}
              alt=""
              className="h-72 w-auto object-contain object-bottom"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.insertAdjacentHTML(
                  'beforeend',
                  `<span style="font-size:7rem">${portrait}</span>`
                )
              }}
            />
          ) : (
            <span className="text-[7rem]">{portrait}</span>
          )}
        </motion.div>

        {!isMonologue && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 h-px w-24 rounded-full"
            style={{ backgroundColor: `${accentColor}60` }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Chapter complete overlay ─────────────────────────────────────────────────

function ChapterCompleteOverlay({
  characterName,
  chapterNumber,
  totalAffection,
  accentColor,
  onContinue,
}: {
  characterName: string
  chapterNumber: number
  totalAffection: number
  accentColor: string
  onContinue: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="mx-6 w-full max-w-sm rounded-3xl border border-white/10 p-8 text-center"
        style={{
          background: `linear-gradient(160deg, ${accentColor}18 0%, #0a0914 100%)`,
          borderColor: `${accentColor}30`,
        }}
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="text-4xl mb-4"
        >
          ✦
        </motion.div>

        <p className="text-[11px] font-semibold tracking-widest text-white/40 uppercase mb-1">
          Chapter {chapterNumber} Complete
        </p>
        <h2 className="text-xl font-bold text-white mb-1">{characterName}</h2>

        {totalAffection > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-3 mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
          >
            <span className="text-sm font-bold" style={{ color: accentColor }}>
              +{totalAffection} ♥
            </span>
            <span className="text-xs text-white/40">affection</span>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="mt-4 w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
          style={{
            background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`,
          }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── ScenePlayer ──────────────────────────────────────────────────────────────

interface ScenePlayerProps {
  sceneData: object
  onComplete: () => void
  onClose: () => void
}

export function ScenePlayer({ sceneData, onComplete, onClose }: ScenePlayerProps) {
  const [scene] = useState<DialogueScene>(() => validateScene(sceneData))
  const [dlgState, setDlgState] = useState<DialogueState>(() => initDialogue(scene))
  const [affectionEvent, setAffectionEvent] = useState<AffectionEvent | null>(null)
  const [showChapterComplete, setShowChapterComplete] = useState(false)
  const affectionKeyRef = useRef(0)
  const sessionAffectionRef = useRef(0)
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stats = usePlayerStore((s) => s.stats)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const setPlayerFlag = usePlayerStore((s) => s.setFlag)
  const updateAffection = useRosterStore((s) => s.updateAffection)
  const markSceneComplete = useProgressStore((s) => s.markSceneComplete)
  const recordChoice = useProgressStore((s) => s.recordChoice)
  const setProgressFlag = useProgressStore((s) => s.setFlag)
  const chapterComplete = useProgressStore((s) => s.chapterComplete)
  const consumeAffinityBonus = useWardrobeStore((s) => s.consumeAffinityBonus)

  const character = ALL_CHARACTERS.find((c) => c.id === scene.characterId)
  const accentColor = character?.accentColor ?? '#e879f9'
  const portrait = character?.portraitPlaceholder ?? '🎭'
  const assets = getCharacterAssets(scene.characterId)

  const currentNode = getCurrentNode(dlgState)
  const currentLine = getCurrentLine(dlgState)
  const nodeType = currentNode?.type ?? 'dialogue'
  const atChoices = isAtChoices(dlgState)
  const atEnd = isSceneEnd(dlgState)

  // Apply wardrobe affinity bonus once on scene mount
  useEffect(() => {
    const bonus = consumeAffinityBonus(scene.characterId)
    if (bonus > 0) {
      updateAffection(scene.characterId, bonus)
      triggerAffectionPopup(bonus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply node-entry side effects
  useEffect(() => {
    if (!currentNode) return

    // Silently route stat_check nodes
    if (currentNode.type === 'stat_check') {
      const next = routeStatCheck(dlgState, stats)
      if (next) { setDlgState(next); return }
    }

    if (currentNode.statDeltas?.length) {
      applyStatDeltas(currentNode.statDeltas)
    }

    if (currentNode.affectionDeltas?.length) {
      for (const { characterId, delta } of currentNode.affectionDeltas) {
        updateAffection(characterId, delta)
        sessionAffectionRef.current += delta
        triggerAffectionPopup(delta)
      }
    }

    if (currentNode.setFlags) {
      const playerId = usePlayerStore.getState().playerId
      for (const [key, value] of Object.entries(currentNode.setFlags)) {
        setPlayerFlag(key, value)
        setProgressFlag(key, value)
        if (playerId) syncStoryFlag(playerId, key, value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dlgState.currentNodeId])

  // Auto-advance timer for inner_monologue / memory nodes
  useEffect(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current)
    if (!currentNode) return

    const ms = getNodeAutoAdvanceMs(currentNode)
    if (ms === null) return
    // Don't auto-advance away from choices
    if (atChoices) return

    autoAdvanceTimerRef.current = setTimeout(() => {
      setDlgState((prev) => {
        if (canAdvanceLine(prev)) return advanceLine(prev)
        const next = advanceAuto(prev)
        if (next) return next
        return prev
      })
    }, ms)

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dlgState.currentNodeId, dlgState.lineIndex, atChoices])

  function triggerAffectionPopup(delta: number) {
    if (delta <= 0) return
    affectionKeyRef.current += 1
    setAffectionEvent({ delta, key: affectionKeyRef.current })
    setTimeout(() => setAffectionEvent(null), 1600)
  }

  const handleAdvance = useCallback(() => {
    // Clear pending auto-advance timer on tap
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }

    if (atEnd) {
      finishScene()
      return
    }

    if (canAdvanceLine(dlgState)) {
      setDlgState((prev) => advanceLine(prev))
      return
    }

    setDlgState((prev) => {
      const next = advanceAuto(prev)
      return next ?? prev
    })
  }, [dlgState, atEnd])

  const handleChoice = useCallback(
    (choiceId: string) => {
      const node = getCurrentNode(dlgState)
      const choice = node?.choices?.find((c) => c.id === choiceId)
      if (!choice) return

      recordChoice(scene.id, choiceId)

      // Apply choice-level affection delta (only when no failNodeId — those use node-entry deltas)
      if (choice.affectionDelta && !choice.failNodeId) {
        updateAffection(choice.affectionDelta.characterId, choice.affectionDelta.delta)
        sessionAffectionRef.current += choice.affectionDelta.delta
        triggerAffectionPopup(choice.affectionDelta.delta)
      }

      if (choice.statDeltas?.length) {
        applyStatDeltas(choice.statDeltas)
      }

      setDlgState((prev) => selectChoice(prev, choiceId, stats))
    },
    [dlgState, scene.id, stats, recordChoice, updateAffection, applyStatDeltas]
  )

  function finishScene() {
    markSceneComplete(scene.id)
    chapterComplete(scene.characterId, scene.chapter)

    // Fire-and-forget Supabase sync
    const playerId = usePlayerStore.getState().playerId
    if (playerId) {
      syncChapterProgress(playerId, scene.characterId, scene.chapter, scene.id)
      const finalAffection = useRosterStore.getState().getAffection(scene.characterId)
      syncCharacterAffection(playerId, scene.characterId, finalAffection)
    }

    setShowChapterComplete(true)
  }

  function handleChapterContinue() {
    setShowChapterComplete(false)
    onComplete()
  }

  const choices = atChoices ? getAvailableChoices(dlgState, stats) : undefined

  // Speaker bust — look up from assets, use current line's speaker
  const speakerBust = (() => {
    if (!assets || nodeType === 'inner_monologue' || nodeType === 'memory') return undefined
    if (!currentLine?.speaker || currentLine.speaker === 'You' || currentLine.speaker === '') return undefined
    return assets.bust
  })()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ maxHeight: '100svh' }}
    >
      {/* VN background */}
      <VNBackground
        characterId={scene.characterId}
        portrait={portrait}
        accentColor={accentColor}
        isMonologue={nodeType === 'inner_monologue'}
        isMemory={nodeType === 'memory'}
      />

      {/* Header bar */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-xs text-white/50 font-medium">{scene.title}</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 transition-all text-sm"
        >
          ✕
        </button>
      </div>

      {/* Memory label */}
      <AnimatePresence>
        {nodeType === 'memory' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex justify-center"
          >
            <span className="text-[10px] tracking-widest uppercase text-amber-300/50 font-medium">
              ◈ memory
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative z-20 pointer-events-none" />

      {/* Affection popup */}
      <div className="relative z-30">
        <AffectionPopup event={affectionEvent} />
      </div>

      {/* Dialogue box */}
      <div className="relative z-30">
        <DialogueBox
          line={currentLine}
          nodeType={nodeType}
          accentColor={accentColor}
          speakerBust={speakerBust}
          choices={choices}
          showChoices={!!atChoices}
          onAdvance={handleAdvance}
          onChoice={handleChoice}
          stats={stats}
        />
      </div>

      {/* Scene end CTA (before chapter-complete overlay) */}
      <AnimatePresence>
        {atEnd && !showChapterComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-30 px-4 pb-8 pt-2"
          >
            <button
              onClick={finishScene}
              className={cn(
                'w-full py-3.5 rounded-2xl font-semibold text-sm text-white',
                'border border-white/20 bg-white/10 hover:bg-white/15 transition-colors'
              )}
              style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}18` }}
            >
              Continue →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter complete overlay */}
      <AnimatePresence>
        {showChapterComplete && (
          <ChapterCompleteOverlay
            characterName={character?.name ?? scene.characterId}
            chapterNumber={scene.chapter}
            totalAffection={sessionAffectionRef.current}
            accentColor={accentColor}
            onContinue={handleChapterContinue}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
