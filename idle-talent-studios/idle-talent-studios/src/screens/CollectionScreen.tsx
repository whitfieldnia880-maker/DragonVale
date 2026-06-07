import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ALL_CHARACTERS } from '@/data/characters'
import { ALL_BANNERS } from '@/data/banners'
import type { Character } from '@/data/characters/types'
import type { Rarity } from '@/engine/gachaEngine'
import { useRosterStore } from '@/store/rosterStore'
import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import { useGachaStore } from '@/store/gachaStore'
import { getCharacterAssets } from '@/data/characters/assets'

interface CollectionScreenProps {
  onBack: () => void
  onGoToRoutes: () => void
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'SSR' | 'SR' | 'R' | 'unlocked' | 'locked'
type SortMode = 'rarity' | 'affection' | 'recent'

const RARITY_ORDER: Record<Rarity, number> = { SSR: 0, SR: 1, R: 2 }
const RARITY_COLOR: Record<Rarity, string> = {
  SSR: '#f59e0b',
  SR: '#a855f7',
  R: '#64748b',
}
const RARITY_STARS: Record<Rarity, number> = { SSR: 3, SR: 2, R: 1 }

function rarityStars(rarity: Rarity) {
  return '★'.repeat(RARITY_STARS[rarity])
}

// ─── Character card ───────────────────────────────────────────────────────────

function CharacterCard({
  character,
  owned,
  affection,
  affectionHidden,
  onTap,
}: {
  character: Character
  owned: boolean
  affection: number
  affectionHidden: boolean
  onTap: () => void
}) {
  const color = RARITY_COLOR[character.rarity]
  const assets = getCharacterAssets(character.id)

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className="relative flex flex-col rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] bg-slate-900"
      style={{
        boxShadow: owned ? `0 0 0 1.5px ${color}44` : 'none',
      }}
    >
      {/* Portrait or silhouette */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{
          background: owned
            ? `linear-gradient(160deg, ${character.accentColor}33 0%, #0f172a 100%)`
            : 'linear-gradient(160deg, #1e293b 0%, #0a0f1a 100%)',
        }}
      >
        {owned ? (
          assets ? (
            <img
              src={assets.thumbnail}
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <span className="text-5xl">{character.portraitPlaceholder}</span>
          )
        ) : (
          <>
            {assets ? (
              <img
                src={assets.silhouette}
                alt=""
                className="w-full h-full object-cover opacity-20"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <span className="text-5xl opacity-20 grayscale">{character.portraitPlaceholder}</span>
            )}
            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
              <span className="text-white/20 text-2xl">?</span>
            </div>
          </>
        )}

        {/* Rarity badge top-left */}
        <div
          className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: `${color}33`, color }}
        >
          {character.rarity}
        </div>
      </div>

      {/* Bottom info */}
      <div className="px-2 py-2 space-y-1">
        <p className="text-xs font-semibold text-white truncate leading-tight">
          {owned ? character.name : '???'}
        </p>
        <p className="text-[9px]" style={{ color }}>
          {rarityStars(character.rarity)}
        </p>

        {owned && (
          <div>
            {affectionHidden ? (
              <p className="text-[9px] text-white/30">??? Affection</p>
            ) : (
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${affection}%`,
                    background: `linear-gradient(90deg, ${character.accentColor}, #e879f9)`,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.button>
  )
}

// ─── Affection card with reveal animation ─────────────────────────────────────

function AffectionCard({
  affection,
  affectionHidden,
  accentColor,
  chemistry,
  stabilityScore,
  visibilityScore,
  color,
}: {
  affection: number
  affectionHidden: boolean
  accentColor: string
  chemistry: number
  stabilityScore: number
  visibilityScore: number
  color: string
}) {
  const wasHiddenRef = useRef(affectionHidden)
  const [justRevealed, setJustRevealed] = useState(false)

  useEffect(() => {
    if (wasHiddenRef.current && !affectionHidden) {
      setJustRevealed(true)
      wasHiddenRef.current = false
      const t = setTimeout(() => setJustRevealed(false), 2500)
      return () => clearTimeout(t)
    }
  }, [affectionHidden])

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
      {/* Affection row */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Affection</p>
          <p className="text-sm font-bold" style={{ color }}>
            {affectionHidden ? '???' : `${affection}/100`}
          </p>
        </div>
        {affectionHidden ? (
          <>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-full bg-white/5 rounded-full" />
            </div>
            <p className="text-[10px] text-white/30 italic">
              Affection is hidden. Continue the story to reveal it.
            </p>
          </>
        ) : (
          <div
            className={cn(
              'h-2 rounded-full overflow-hidden relative',
              justRevealed && 'shadow-[0_0_12px_rgba(220,38,38,0.7)]'
            )}
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: justRevealed ? '0%' : `${affection}%` }}
              animate={{ width: `${affection}%` }}
              transition={
                justRevealed
                  ? { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }
                  : { duration: 0.6, ease: 'easeOut' }
              }
              style={{
                background: justRevealed
                  ? 'linear-gradient(90deg, #dc2626, #f87171)'
                  : `linear-gradient(90deg, ${accentColor}, #e879f9)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Chemistry + Stability + Visibility */}
      {!affectionHidden && (
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/8">
          <StatMeter label="Chemistry" value={chemistry} color="#f472b6" />
          <StatMeter label="Stability" value={stabilityScore} color="#34d399" />
          <StatMeter label="Visibility" value={visibilityScore} color="#fb923c" />
        </div>
      )}
    </div>
  )
}

function StatMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-semibold text-white/35 uppercase tracking-wider">{label}</p>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ background: color }}
        />
      </div>
      <p className="text-[9px] font-mono text-white/40">{value}</p>
    </div>
  )
}

// ─── Character profile bottom sheet ───────────────────────────────────────────

function CharacterProfileSheet({
  character,
  owned,
  affection,
  affectionHidden,
  completedChapters,
  totalChapters,
  bondFragments,
  bondScenesUnlocked,
  endingsUnlocked,
  chemistry,
  stabilityScore,
  visibilityScore,
  onClose,
  onGoToRoutes,
}: {
  character: Character
  owned: boolean
  affection: number
  affectionHidden: boolean
  completedChapters: number
  totalChapters: number
  bondFragments: number
  bondScenesUnlocked: number
  endingsUnlocked: { type: string; label: string }[]
  chemistry: number
  stabilityScore: number
  visibilityScore: number
  onClose: () => void
  onGoToRoutes: () => void
}) {
  const color = RARITY_COLOR[character.rarity]
  const assets = getCharacterAssets(character.id)
  const fragsTowardNext = bondFragments - bondScenesUnlocked * 5

  // Banners that feature this character
  const availableOn = ALL_BANNERS.filter(
    (b) => b.isActive && b.featuredCharacters.includes(character.id)
  )
  const onStandardPool = !availableOn.length

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #12102a 0%, #0a0914 100%)',
        borderTop: `1.5px solid ${color}44`,
        maxHeight: '88dvh',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(88dvh - 1rem)' }}>
        {/* Hero section */}
        <div
          className="relative flex items-end gap-4 px-5 pb-4 pt-6"
          style={{
            background: `linear-gradient(160deg, ${character.accentColor}22 0%, transparent 60%)`,
          }}
        >
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-5xl"
              style={{
                background: owned
                  ? `linear-gradient(135deg, ${character.accentColor}33, ${character.accentColor}11)`
                  : '#1e293b',
              }}
            >
              {assets ? (
                <img
                  src={owned ? assets.portrait : assets.silhouette}
                  alt={owned ? character.name : ''}
                  className={cn('w-full h-full object-cover object-top', !owned && 'opacity-20')}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : owned ? (
                character.portraitPlaceholder
              ) : (
                <span className="opacity-20 grayscale">{character.portraitPlaceholder}</span>
              )}
            </div>
            <div
              className="absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: `${color}33`, color }}
            >
              {character.rarity}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">{character.role}</p>
            <h2 className="text-lg font-bold text-white leading-tight">{character.name}</h2>
            <p className="text-xs text-white/50 mt-0.5 italic">&ldquo;{character.tagline}&rdquo;</p>
            <div className="mt-1.5">
              <p style={{ color }} className="text-xs">{rarityStars(character.rarity)}</p>
            </div>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white text-xl">×</button>
        </div>

        <div className="px-5 pb-8 space-y-5">
          {/* Locked state */}
          {!owned ? (
            <div className="space-y-3">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-sm font-semibold text-white/60 mb-2">How to unlock</p>
                {availableOn.length > 0 ? (
                  <div className="space-y-1.5">
                    {availableOn.map((b) => (
                      <div key={b.id} className="flex items-center gap-2">
                        <span className="text-pink-400 text-xs">⭐</span>
                        <p className="text-xs text-white/60">Available on: <span className="text-white">{b.name}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40">
                    Available in the {onStandardPool ? 'Standard' : 'event'} banner pool.
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/10 text-white/60 text-sm font-semibold border border-white/10"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Affection — with crimson reveal animation */}
              <AffectionCard
                affection={affection}
                affectionHidden={affectionHidden}
                accentColor={character.accentColor}
                chemistry={chemistry}
                stabilityScore={stabilityScore}
                visibilityScore={visibilityScore}
                color={color}
              />

              {/* Chapter progress */}
              {character.route && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Story Progress</p>
                    <p className="text-sm font-bold text-white">{completedChapters}/{totalChapters}</p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: totalChapters > 0 ? `${(completedChapters / totalChapters) * 100}%` : '0%',
                        background: `linear-gradient(90deg, ${character.accentColor}, #e879f9)`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30">
                    {completedChapters >= totalChapters
                      ? 'All chapters complete'
                      : `Chapter ${completedChapters + 1} available`}
                  </p>
                </div>
              )}

              {/* Stat & wardrobe affinities */}
              {character.route && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(character.route.statAffinities).length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Stat Affinity</p>
                      <div className="space-y-1">
                        {Object.entries(character.route.statAffinities).map(([stat, val]) => (
                          <div key={stat} className="flex justify-between">
                            <p className="text-xs capitalize text-white/60">{stat}</p>
                            <p className="text-xs text-green-400">+{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {character.route.wardrobeAffinities.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Wardrobe</p>
                      <div className="space-y-1">
                        {character.route.wardrobeAffinities.map((w) => (
                          <p key={w} className="text-xs text-white/50 capitalize">{w}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bond fragments */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Bond Fragments</p>
                  <p className="text-sm font-bold text-amber-400">{bondFragments} total</p>
                </div>

                {bondScenesUnlocked > 0 && (
                  <p className="text-xs text-purple-400">{bondScenesUnlocked} bond scene{bondScenesUnlocked > 1 ? 's' : ''} unlocked</p>
                )}

                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-full"
                      style={{
                        background: i < fragsTowardNext ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/30">
                  {fragsTowardNext}/5 toward next bond scene
                  {bondFragments === 0 && ' — collect by pulling duplicates'}
                </p>
              </div>

              {/* Endings unlocked */}
              {endingsUnlocked.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Endings</p>
                  {endingsUnlocked.map((e) => (
                    <div key={e.type} className="flex items-center gap-2">
                      <span className="text-sm">
                        {e.type === 'true' ? '⭐' : e.type === 'good' ? '💛' : e.type === 'secret' ? '🔮' : '💔'}
                      </span>
                      <p className="text-xs text-white/70">{e.label}</p>
                      <span
                        className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded capitalize"
                        style={{
                          background:
                            e.type === 'true'
                              ? '#f59e0b22'
                              : e.type === 'secret'
                              ? '#a855f722'
                              : '#ffffff11',
                          color:
                            e.type === 'true'
                              ? '#f59e0b'
                              : e.type === 'secret'
                              ? '#a855f7'
                              : '#64748b',
                        }}
                      >
                        {e.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="py-3.5 rounded-2xl font-semibold text-sm border border-white/15 bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                >
                  Visit
                </button>
                <button
                  onClick={() => { onClose(); onGoToRoutes() }}
                  className="py-3.5 rounded-2xl font-semibold text-sm text-white"
                  style={{
                    background: `linear-gradient(135deg, ${character.accentColor}, #e879f9)`,
                  }}
                >
                  Continue Story
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function CollectionScreen({ onBack, onGoToRoutes }: CollectionScreenProps) {
  const [filter, setFilter] = useState<FilterTab>('all')
  const [sort, setSort] = useState<SortMode>('rarity')
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)

  const owned = useRosterStore((s) => s.owned)
  const getAffection = useRosterStore((s) => s.getAffection)
  const isHidden = useRosterStore((s) => s.isHidden)
  const relationships = useRosterStore((s) => s.relationships)
  const flags = usePlayerStore((s) => s.storyFlags)
  const isSceneComplete = useProgressStore((s) => s.isSceneComplete)
  const endingsUnlocked = useProgressStore((s) => s.endingsUnlocked)
  const bondFragments = useGachaStore((s) => s.bondFragments)
  const bondScenesUnlocked = useGachaStore((s) => s.bondScenesUnlocked)
  const pullHistory = useGachaStore((s) => s.pullHistory)

  const ownedIds = new Set(owned.map((c) => c.id))

  // ── Apply filter ────────────────────────────────────────────────────────────
  const filtered = ALL_CHARACTERS.filter((c) => {
    if (filter === 'unlocked') return ownedIds.has(c.id)
    if (filter === 'locked') return !ownedIds.has(c.id)
    if (filter === 'SSR' || filter === 'SR' || filter === 'R') return c.rarity === filter
    return true
  })

  // ── Apply sort ──────────────────────────────────────────────────────────────
  const recentPullIndex = (charId: string) => {
    const idx = pullHistory.findIndex((h) => h.characterId === charId)
    return idx === -1 ? Infinity : idx
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rarity') {
      const ownedDiff =
        (ownedIds.has(b.id) ? 0 : 1) - (ownedIds.has(a.id) ? 0 : 1)
      if (ownedDiff !== 0) return ownedDiff
      return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]
    }
    if (sort === 'affection') {
      const aff = (id: string) =>
        ownedIds.has(id) ? getAffection(id) : -1
      return aff(b.id) - aff(a.id)
    }
    if (sort === 'recent') {
      return recentPullIndex(a.id) - recentPullIndex(b.id)
    }
    return 0
  })

  // ── Derive sheet data ───────────────────────────────────────────────────────
  function getCompletedChapters(character: Character): number {
    if (!character.route) return 0
    return character.route.chapters.filter((ch) =>
      isSceneComplete(ch.sceneRef)
    ).length
  }

  function getCharEndings(characterId: string) {
    return endingsUnlocked
      .filter((e) => e.characterId === characterId)
      .map((e) => ({ type: e.endingType, label: e.label }))
  }

  const FILTER_TABS: FilterTab[] = ['all', 'SSR', 'SR', 'R', 'unlocked', 'locked']
  const FILTER_LABELS: Record<FilterTab, string> = {
    all: 'All',
    SSR: 'SSR',
    SR: 'SR',
    R: 'R',
    unlocked: 'Owned',
    locked: 'Locked',
  }

  return (
    <>
      <div className="min-h-svh bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 flex items-center gap-3 px-5 py-4">
          <button onClick={onBack} className="text-white/50 hover:text-white text-xl leading-none">←</button>
          <h1 className="text-base font-semibold text-white flex-1">Collection</h1>
          <p className="text-xs text-white/30">{owned.length}/{ALL_CHARACTERS.length}</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3 border-b border-white/10">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors',
                filter === tab
                  ? 'bg-white/15 text-white'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              {FILTER_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Sort row */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/5">
          <p className="text-xs text-white/30 mr-1">Sort:</p>
          {(['rarity', 'affection', 'recent'] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors capitalize',
                sort === mode ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
              )}
            >
              {mode === 'recent' ? 'Recently Pulled' : mode === 'affection' ? 'Affection' : 'Rarity'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {sorted.length === 0 ? (
            <div className="text-center py-20 text-white/30 text-sm">No characters found.</div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {sorted.map((character) => {
                const isOwned = ownedIds.has(character.id)
                const affectionHidden = isHidden(character.id, flags)
                const affection = getAffection(character.id)
                return (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    owned={isOwned}
                    affection={affection}
                    affectionHidden={affectionHidden}
                    onTap={() => setSelectedChar(character)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {selectedChar && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChar(null)}
            />
            <CharacterProfileSheet
              character={selectedChar}
              owned={ownedIds.has(selectedChar.id)}
              affection={getAffection(selectedChar.id)}
              affectionHidden={isHidden(selectedChar.id, flags)}
              completedChapters={getCompletedChapters(selectedChar)}
              totalChapters={selectedChar.route?.chapters.length ?? 0}
              bondFragments={bondFragments[selectedChar.id] ?? 0}
              bondScenesUnlocked={bondScenesUnlocked[selectedChar.id] ?? 0}
              endingsUnlocked={getCharEndings(selectedChar.id)}
              chemistry={relationships[selectedChar.id]?.chemistry ?? 0}
              stabilityScore={relationships[selectedChar.id]?.stabilityScore ?? 50}
              visibilityScore={relationships[selectedChar.id]?.visibilityScore ?? 0}
              onClose={() => setSelectedChar(null)}
              onGoToRoutes={onGoToRoutes}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
