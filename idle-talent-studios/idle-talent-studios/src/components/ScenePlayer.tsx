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
} from '@/engine/dialogueEngine'
import { validateScene } from '@/engine/dialogueEngine'
import { usePlayerStore } from '@/store/playerStore'
import { useRosterStore } from '@/store/rosterStore'
import { useProgressStore } from '@/store/progressStore'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { ALL_CHARACTERS } from '@/data/characters'
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
  portrait,
  accentColor,
  isMonologue,
}: {
  portrait: string
  accentColor: string
  isMonologue: boolean
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Ambient glow from accent color */}
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

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

      {/* Character portrait area */}
      <div className="absolute inset-x-0 top-16 flex flex-col items-center pointer-events-none">
        {/* Glow ring behind portrait */}
        <motion.div
          animate={{
            opacity: isMonologue ? 0 : 0.35,
            scale: isMonologue ? 0.8 : 1,
          }}
          transition={{ duration: 0.8 }}
          className="w-52 h-52 rounded-full blur-3xl mb-[-6rem]"
          style={{ backgroundColor: accentColor }}
        />

        {/* Portrait */}
        <motion.div
          animate={{
            opacity: isMonologue ? 0.15 : 1,
            scale: isMonologue ? 0.85 : 1,
            y: isMonologue ? 10 : 0,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative z-10 text-[7rem] drop-shadow-2xl"
          style={{ filter: isMonologue ? 'grayscale(0.8)' : 'none' }}
        >
          {portrait}
        </motion.div>

        {/* Decorative line under portrait */}
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

// ─── ScenePlayer ──────────────────────────────────────────────────────────────

interface ScenePlayerProps {
  sceneData: object
  onComplete: () => void
  onClose: () => void
}

export function ScenePlayer({ sceneData, onComplete, onClose }: ScenePlayerProps) {
  const [scene] = useState<DialogueScene>(() => validateScene(sceneData))
  const [dlgState, setDlgState] = useState<DialogueState>(() =>
    initDialogue(scene)
  )
  const [affectionEvent, setAffectionEvent] = useState<AffectionEvent | null>(null)
  const affectionKeyRef = useRef(0)
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stats = usePlayerStore((s) => s.stats)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const setFlag = usePlayerStore((s) => s.setFlag)
  const updateAffection = useRosterStore((s) => s.updateAffection)
  const markSceneComplete = useProgressStore((s) => s.markSceneComplete)
  const recordChoice = useProgressStore((s) => s.recordChoice)
  const consumeAffinityBonus = useWardrobeStore((s) => s.consumeAffinityBonus)

  const character = ALL_CHARACTERS.find((c) => c.id === scene.characterId)
  const accentColor = character?.accentColor ?? '#e879f9'
  const portrait = character?.portraitPlaceholder ?? '🎭'

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

  // Apply node-entry side effects when currentNodeId changes
  useEffect(() => {
    if (!currentNode) return

    if (currentNode.statDeltas?.length) {
      applyStatDeltas(currentNode.statDeltas)
    }

    if (currentNode.affectionDeltas?.length) {
      for (const { characterId, delta } of currentNode.affectionDeltas) {
        updateAffection(characterId, delta)
        triggerAffectionPopup(delta)
      }
    }

    if (currentNode.setFlags) {
      for (const [key, value] of Object.entries(currentNode.setFlags)) {
        setFlag(key, value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dlgState.currentNodeId])

  // Auto-advance timer for inner_monologue nodes
  useEffect(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current)
    if (!currentNode) return

    const ms = getNodeAutoAdvanceMs(currentNode)
    if (ms === null) return

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
  }, [dlgState.currentNodeId, dlgState.lineIndex])

  function triggerAffectionPopup(delta: number) {
    affectionKeyRef.current += 1
    setAffectionEvent({ delta, key: affectionKeyRef.current })
    setTimeout(() => setAffectionEvent(null), 1600)
  }

  const handleAdvance = useCallback(() => {
    if (atEnd) {
      finishScene()
      return
    }

    if (canAdvanceLine(dlgState)) {
      setDlgState((prev) => advanceLine(prev))
      return
    }

    // Try auto-next
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

      if (choice.affectionDelta) {
        updateAffection(choice.affectionDelta.characterId, choice.affectionDelta.delta)
        triggerAffectionPopup(choice.affectionDelta.delta)
      }

      if (choice.statDeltas?.length) {
        applyStatDeltas(choice.statDeltas)
      }

      setDlgState((prev) => selectChoice(prev, choiceId))
    },
    [dlgState, scene.id, recordChoice, updateAffection, applyStatDeltas]
  )

  function finishScene() {
    markSceneComplete(scene.id)
    onComplete()
  }

  const choices = atChoices ? getAvailableChoices(dlgState, stats) : undefined

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
        portrait={portrait}
        accentColor={accentColor}
        isMonologue={nodeType === 'inner_monologue'}
      />

      {/* Header bar */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-safe-top pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs text-white/50 font-medium">
            {scene.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/15 transition-all text-sm"
        >
          ✕
        </button>
      </div>

      {/* Spacer — fills the VN art area */}
      <div className="flex-1 relative z-20 pointer-events-none" />

      {/* Affection popup (sits above dialogue box) */}
      <div className="relative z-30">
        <AffectionPopup event={affectionEvent} />
      </div>

      {/* Dialogue box */}
      <div className="relative z-30">
        <DialogueBox
          line={currentLine}
          nodeType={nodeType}
          accentColor={accentColor}
          choices={choices}
          showChoices={!!atChoices}
          onAdvance={handleAdvance}
          onChoice={handleChoice}
          stats={stats}
        />
      </div>

      {/* Scene end CTA */}
      <AnimatePresence>
        {atEnd && (
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
    </motion.div>
  )
}
