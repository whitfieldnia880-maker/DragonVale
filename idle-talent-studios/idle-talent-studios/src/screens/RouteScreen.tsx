import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRosterStore } from '@/store/rosterStore'
import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import { CharacterCard } from '@/components/CharacterCard'
import { ScenePlayer } from '@/components/ScenePlayer'
import { shouldRevealMeter } from '@/systems/relationship'
import { ALL_CHARACTERS } from '@/data/characters'
import { SCENE_REGISTRY } from '@/data/scenes/registry'
import { validateScene } from '@/engine/dialogueEngine'
import type { Character, CharacterChapter, UnlockRequirements } from '@/data/characters/types'

interface RouteScreenProps {
  onBack: () => void
}

function meetsRequirements(
  req: UnlockRequirements | undefined,
  affection: number,
  stats: Record<string, number>,
  flags: Record<string, boolean>,
  hiddenNotes: number[]
): boolean {
  if (!req) return true
  if (req.requiredAffection !== undefined && affection < req.requiredAffection) return false
  if (req.requiredStats) {
    for (const [stat, val] of Object.entries(req.requiredStats)) {
      if ((stats[stat] ?? 0) < val) return false
    }
  }
  if (req.requiredFlags) {
    for (const [flag, expected] of Object.entries(req.requiredFlags)) {
      if (!!flags[flag] !== expected) return false
    }
  }
  if (req.requiredNotes !== undefined && hiddenNotes.length < req.requiredNotes) return false
  return true
}

function getNextAvailableChapter(
  chapters: CharacterChapter[],
  completedScenes: string[],
  affection: number,
  stats: Record<string, number>,
  flags: Record<string, boolean>,
  hiddenNotes: number[]
): CharacterChapter | null {
  for (const ch of chapters) {
    const sceneId = ch.sceneRef
    if (completedScenes.includes(sceneId)) continue
    if (!meetsRequirements(ch.unlockRequirements, affection, stats, flags, hiddenNotes)) continue
    return ch
  }
  return null
}

// ─── Detail sheet ─────────────────────────────────────────────────────────────

interface ChapterSheetProps {
  character: Character
  affection: number
  stats: Record<string, number>
  flags: Record<string, boolean>
  completedScenes: string[]
  hiddenNotes: number[]
  showAffection: boolean
  onPlayChapter: (ch: CharacterChapter) => void
  onClose: () => void
}

function ChapterSheet({
  character,
  affection,
  stats,
  flags,
  completedScenes,
  hiddenNotes,
  showAffection,
  onPlayChapter,
  onClose,
}: ChapterSheetProps) {
  const route = character.route
  if (!route) return null

  const isHardLocked = !meetsRequirements(
    route.hardLockRequirements,
    affection,
    stats,
    flags,
    hiddenNotes
  )

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 bg-slate-900 rounded-t-3xl border-t border-white/10 max-h-[80svh] flex flex-col"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-5 pt-5 pb-3 border-b border-white/10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${character.accentColor}22` }}
          >
            {character.portraitPlaceholder}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-white">{character.name}</h2>
            <p className="text-xs text-white/40">{character.role} · {character.rarity}</p>
            {showAffection && !route.affectionMeter.hidden && (
              <div className="mt-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${affection}%`,
                        background: character.accentColor,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">{affection}</span>
                </div>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white ml-2 text-xl">×</button>
        </div>

        {isHardLocked && (
          <div className="px-5 py-3 bg-red-900/20 border-b border-red-500/20">
            <p className="text-xs text-red-400">
              Route locked — requirements not met. Check career tier, stats, and wardrobe.
            </p>
          </div>
        )}

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 pb-8">
          {route.chapters.map((ch) => {
            const done = completedScenes.includes(ch.sceneRef)
            const unlocked =
              !isHardLocked &&
              meetsRequirements(ch.unlockRequirements, affection, stats, flags, hiddenNotes)
            const hasScene = ch.sceneRef in SCENE_REGISTRY

            return (
              <motion.button
                key={ch.number}
                whileTap={{ scale: 0.98 }}
                disabled={!unlocked || !hasScene}
                onClick={() => onPlayChapter(ch)}
                className={[
                  'w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 border transition-colors',
                  done
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : unlocked && hasScene
                    ? 'bg-white/[0.06] border-white/10 hover:bg-white/10 active:bg-white/15'
                    : 'bg-white/[0.03] border-white/5 opacity-40 cursor-not-allowed',
                ].join(' ')}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: done
                      ? '#ffffff22'
                      : unlocked
                      ? `${character.accentColor}33`
                      : '#ffffff11',
                    color: done ? '#ffffff66' : unlocked ? character.accentColor : '#ffffff33',
                  }}
                >
                  {done ? '✓' : ch.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{ch.title}</p>
                  {ch.passiveScandalPerDay && (
                    <p className="text-[10px] text-red-400/70">+{ch.passiveScandalPerDay} scandal/day while active</p>
                  )}
                  {ch.isInterstitial && (
                    <p className="text-[10px] text-white/30">Memory sequence</p>
                  )}
                </div>
                {!unlocked && !done && (
                  <span className="text-white/20 text-sm">🔒</span>
                )}
                {unlocked && !done && (
                  <span className="text-white/30 text-sm">›</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function RouteScreen({ onBack }: RouteScreenProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [activeScene, setActiveScene] = useState<object | null>(null)

  const owned = useRosterStore((s) => s.owned)
  const relationships = useRosterStore((s) => s.relationships)
  const currentChapter = usePlayerStore((s) => s.currentChapter)
  const playerFlags = usePlayerStore((s) => s.storyFlags)
  const stats = usePlayerStore((s) => s.stats)
  const completedScenes = useProgressStore((s) => s.completedScenes)
  const progressFlags = useProgressStore((s) => s.storyFlags)
  const hiddenNotes = useProgressStore((s) => s.hiddenNotes)

  // Merge flags from both stores — progressStore is authoritative for dialogue flags
  const storyFlags = { ...playerFlags, ...progressFlags } as Record<string, boolean>

  const ownedIds = new Set(owned.map((c) => c.id))

  function handleCharacterTap(character: Character) {
    if (!ownedIds.has(character.id)) return
    if (!character.route) return

    // Auto-load ch1 for Amy if she hasn't been met yet
    if (character.id === 'amy-crawford' && !storyFlags['amy_met']) {
      const raw = SCENE_REGISTRY['amy/ch1_first_meeting']
      if (raw) {
        try {
          validateScene(raw)
          setActiveScene(raw as object)
          return
        } catch (e) {
          console.error('Amy ch1 validation failed:', e)
        }
      }
    }

    setSelectedCharacter(character)
  }

  function handlePlayChapter(ch: CharacterChapter) {
    const raw = SCENE_REGISTRY[ch.sceneRef]
    if (!raw) return
    try {
      validateScene(raw)
      setActiveScene(raw as object)
      setSelectedCharacter(null)
    } catch (e) {
      console.error('Scene validation failed:', e)
    }
  }

  function handleSceneComplete() {
    setActiveScene(null)
  }

  const selectedRel = selectedCharacter ? relationships[selectedCharacter.id] : null
  const selectedAffection = selectedRel?.affection ?? 0
  const selectedShowAffection = selectedRel
    ? shouldRevealMeter(selectedRel, currentChapter)
    : false
  const selectedHiddenNotes = selectedCharacter
    ? (hiddenNotes[selectedCharacter.id] ?? [])
    : []

  return (
    <>
      <div className="min-h-svh bg-slate-950 flex flex-col">
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="text-white/50 hover:text-white text-xl leading-none">←</button>
          <h1 className="text-base font-semibold text-white">Your Cast</h1>
          <span className="ml-auto text-xs text-white/30">
            {owned.length} / {ALL_CHARACTERS.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
          {owned.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Your Roster
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {owned.map((character) => {
                  const rel = relationships[character.id]
                  const showAffection = rel && shouldRevealMeter(rel, currentChapter)
                  const affection = rel?.affection ?? 0
                  const charHiddenNotes = hiddenNotes[character.id] ?? []
                  const hasNext = character.route
                    ? !!getNextAvailableChapter(
                        character.route.chapters,
                        completedScenes,
                        affection,
                        stats,
                        storyFlags,
                        charHiddenNotes
                      )
                    : false

                  return (
                    <motion.div
                      key={character.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 }}
                      className="relative"
                    >
                      <CharacterCard
                        character={character}
                        isOwned
                        affection={showAffection ? affection : undefined}
                        onClick={() => handleCharacterTap(character)}
                      />
                      {hasNext && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-400 shadow-pink-400/60 shadow-sm animate-pulse" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-semibold text-white/25 uppercase tracking-wider mb-3">
              Not Yet Met
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {ALL_CHARACTERS.filter((c) => !ownedIds.has(c.id)).map((character) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 }}
                >
                  <CharacterCard character={character} isOwned={false} />
                </motion.div>
              ))}
            </div>
          </section>

          {owned.length === 0 && (
            <div className="text-center py-16 text-white/30 space-y-2">
              <p className="text-4xl">🎴</p>
              <p className="text-sm">No characters yet. Head to the gacha stage.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chapter bottom sheet */}
      <AnimatePresence>
        {selectedCharacter && (
          <ChapterSheet
            character={selectedCharacter}
            affection={selectedAffection}
            stats={stats}
            flags={storyFlags}
            completedScenes={completedScenes}
            hiddenNotes={selectedHiddenNotes}
            showAffection={selectedShowAffection}
            onPlayChapter={handlePlayChapter}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
      </AnimatePresence>

      {/* Scene overlay */}
      <AnimatePresence>
        {activeScene && (
          <ScenePlayer
            sceneData={activeScene}
            onComplete={handleSceneComplete}
            onClose={() => setActiveScene(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
