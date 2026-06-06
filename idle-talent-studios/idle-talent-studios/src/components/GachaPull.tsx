import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { GachaPullResult } from '@/engine/gachaEngine'

interface GachaPullProps {
  results: GachaPullResult[]
  onDismiss: () => void
}

// ─── Rarity theme ─────────────────────────────────────────────────────────────

const RARITY_COLORS: Record<string, string> = {
  SSR: '#f59e0b',
  SR: '#a855f7',
  R: '#94a3b8',
}

const RARITY_GLOW: Record<string, string> = {
  SSR: 'shadow-amber-400/60 border-amber-400',
  SR: 'shadow-purple-400/50 border-purple-400',
  R: 'shadow-white/10 border-white/20',
}

const RARITY_BG: Record<string, string> = {
  SSR: 'from-amber-950 to-yellow-900',
  SR: 'from-purple-950 to-violet-900',
  R: 'from-slate-900 to-slate-800',
}

const RARITY_STARS: Record<string, number> = { SSR: 5, SR: 4, R: 3 }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex justify-center gap-0.5 mt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={i < count ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.7 }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 400 }}
          style={{ color: i < count ? color : '#ffffff33', fontSize: 14 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  )
}

function RarityBleed({ rarity, active }: { rarity: string; active: boolean }) {
  const color = RARITY_COLORS[rarity] ?? '#94a3b8'
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-3xl"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: [0, 0.35, 0.18] } : { opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
      }}
    />
  )
}

function CardBack() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl border border-white/10 flex items-center justify-center">
      <div className="text-6xl opacity-40">🎴</div>
    </div>
  )
}

function CardFront({
  result,
  revealed,
  isNew,
}: {
  result: GachaPullResult
  revealed: boolean
  isNew?: boolean
}) {
  const color = RARITY_COLORS[result.rarity] ?? '#94a3b8'
  const starCount = RARITY_STARS[result.rarity] ?? 3

  return (
    <div
      className={cn(
        'w-full h-full rounded-3xl border-2 shadow-2xl overflow-hidden select-none relative',
        'bg-gradient-to-b',
        RARITY_GLOW[result.rarity],
        RARITY_BG[result.rarity]
      )}
    >
      <RarityBleed rarity={result.rarity} active={revealed} />

      {/* Portrait */}
      <div
        className="aspect-[3/4] flex items-center justify-center text-7xl relative gacha-shimmer"
        style={{ background: `${color}22` }}
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
        >
          {result.character.portraitPlaceholder}
        </motion.span>

        {/* NEW stamp */}
        {isNew && revealed && (
          <motion.div
            className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-black px-2 py-1 rounded-lg rotate-6 shadow-lg"
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 6 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
          >
            NEW
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4 space-y-1 text-center">
        <p className="text-[10px] font-bold tracking-widest" style={{ color }}>
          {result.rarity}
        </p>
        <StarRow count={starCount} color={color} />
        <motion.p
          className="text-lg font-bold text-white mt-1"
          initial={{ opacity: 0, y: 6 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ delay: 0.3 }}
        >
          {result.character.name}
        </motion.p>
        <motion.p
          className="text-xs text-white/50"
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          {result.character.role}
        </motion.p>
        {/* Tagline as source commentary on new pull */}
        {isNew && revealed && (
          <motion.p
            className="text-[10px] italic text-white/40 mt-1 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            "{result.character.tagline}"
          </motion.p>
        )}
        {result.isDuplicate && revealed && (
          <motion.div
            className="space-y-0.5 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-amber-400">+{result.spotlightConverted} ✨</p>
            {result.affectionDelta > 0 && (
              <p className="text-xs text-pink-400">+{result.affectionDelta} ❤️</p>
            )}
            {result.bondFragmentGranted && (
              <p className="text-xs text-purple-400">+1 Bond Fragment 🔮</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Flip card ────────────────────────────────────────────────────────────────

function FlipCard({
  result,
  autoFlip = false,
  flipDelay = 0,
  onFlipped,
}: {
  result: GachaPullResult
  autoFlip?: boolean
  flipDelay?: number
  onFlipped?: () => void
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!autoFlip) return
    const t = setTimeout(() => {
      setFlipped(true)
      onFlipped?.()
    }, flipDelay)
    return () => clearTimeout(t)
  }, [autoFlip, flipDelay, onFlipped])

  function handleTap() {
    if (!autoFlip) {
      setFlipped(true)
    }
  }

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleTap}
    >
      {/* Back face */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: flipped ? -180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: flipDelay * 0.001 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <CardBack />
      </motion.div>

      {/* Front face */}
      <motion.div
        className="relative"
        animate={{ rotateY: flipped ? 0 : 180 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: flipDelay * 0.001 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <CardFront result={result} revealed={flipped} isNew={result.isNew} />
      </motion.div>
    </div>
  )
}

// ─── SSR shake wrapper ────────────────────────────────────────────────────────

function SSRShakeWrapper({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  const SHAKE = active
    ? { x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, -4, 4, -2, 2, 0] }
    : {}

  return (
    <motion.div animate={SHAKE} transition={{ duration: 0.5, delay: 0.4 }}>
      {children}
    </motion.div>
  )
}

// ─── Single reveal ────────────────────────────────────────────────────────────

function SingleReveal({
  result,
  onDismiss,
}: {
  result: GachaPullResult
  onDismiss: () => void
}) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4 px-8 w-full">
      <SSRShakeWrapper active={revealed && result.rarity === 'SSR'}>
        <div className="w-64 max-w-full" onClick={() => !revealed && setRevealed(true)}>
          <div className="relative" style={{ perspective: '1000px' }}>
            {/* Back */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotateY: revealed ? -180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <CardBack />
            </motion.div>

            {/* Front */}
            <motion.div
              animate={{ rotateY: revealed ? 0 : 180 }}
              initial={{ rotateY: 180 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <CardFront result={result} revealed={revealed} isNew={result.isNew} />
            </motion.div>
          </div>
        </div>
      </SSRShakeWrapper>

      {!revealed && (
        <motion.p
          className="text-white/30 text-xs animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          tap to reveal
        </motion.p>
      )}

      {revealed && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onDismiss}
          className="mt-2 px-8 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-semibold"
        >
          Continue
        </motion.button>
      )}
    </div>
  )
}

// ─── Multi reveal ─────────────────────────────────────────────────────────────

function MultiReveal({
  results,
  onDismiss,
}: {
  results: GachaPullResult[]
  onDismiss: () => void
}) {
  const [phase, setPhase] = useState<'cards' | 'summary'>('cards')
  const [flippedCount, setFlippedCount] = useState(0)

  const allFlipped = flippedCount >= results.length
  const highestRarity = results.reduce<string>((acc, r) => {
    if (r.rarity === 'SSR') return 'SSR'
    if (r.rarity === 'SR' && acc !== 'SSR') return 'SR'
    return acc
  }, 'R')

  const totalSpotlight = results.reduce((sum, r) => sum + r.spotlightConverted, 0)
  const newCount = results.filter((r) => r.isNew).length

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {phase === 'cards' ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* SSR flash backdrop */}
            {allFlipped && highestRarity === 'SSR' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.8 }}
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, #f59e0b 0%, transparent 60%)',
                }}
              />
            )}

            {/* Card grid 5x2 */}
            <div className="flex-1 overflow-hidden px-3 pt-2 pb-3">
              <div className="grid grid-cols-5 gap-2 h-full">
                {results.map((result, i) => (
                  <FlipCard
                    key={i}
                    result={result}
                    autoFlip
                    flipDelay={i * 180}
                    onFlipped={() => setFlippedCount((c) => c + 1)}
                  />
                ))}
              </div>
            </div>

            {allFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 pb-3 pt-2"
              >
                <button
                  onClick={() => setPhase('summary')}
                  className="w-full py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-semibold"
                >
                  See Summary →
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col px-5 pb-4 pt-2 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base">Pull Summary</h3>
              <div className="flex gap-3 text-xs text-white/50">
                {newCount > 0 && (
                  <span className="text-green-400 font-semibold">{newCount} new</span>
                )}
                {totalSpotlight > 0 && (
                  <span className="text-amber-400 font-semibold">+{totalSpotlight} ✨</span>
                )}
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 border',
                    r.rarity === 'SSR'
                      ? 'bg-amber-950/40 border-amber-500/30'
                      : r.rarity === 'SR'
                      ? 'bg-purple-950/40 border-purple-500/30'
                      : 'bg-white/5 border-white/10'
                  )}
                >
                  <span className="text-2xl flex-shrink-0">{r.character.portraitPlaceholder}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {r.character.name}
                    </p>
                    <p className="text-xs text-white/40">{r.rarity} · {r.character.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    {r.isNew && (
                      <p className="text-[10px] font-bold text-green-400 uppercase">New!</p>
                    )}
                    {r.spotlightConverted > 0 && (
                      <p className="text-[10px] text-amber-400">+{r.spotlightConverted} ✨</p>
                    )}
                    {r.bondFragmentGranted && (
                      <p className="text-[10px] text-purple-400">+1 🔮</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onDismiss}
              className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-sm"
            >
              Collect & Continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GachaPull({ results, onDismiss }: GachaPullProps) {
  const isSingle = results.length === 1

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Ambient background based on highest rarity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {results.some((r) => r.rarity === 'SSR') && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, #f59e0b 0%, transparent 70%)',
            }}
          />
        )}
        {!results.some((r) => r.rarity === 'SSR') &&
          results.some((r) => r.rarity === 'SR') && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, #a855f7 0%, transparent 70%)',
              }}
            />
          )}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-safe-top pt-4 pb-3 border-b border-white/10 flex-shrink-0">
        <p className="text-sm font-semibold text-white">
          {isSingle ? 'Single Pull' : '10× Pull'}
        </p>
        <button onClick={onDismiss} className="text-white/30 hover:text-white text-2xl leading-none px-1">
          ×
        </button>
      </div>

      {/* Pull reveal area */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
        {isSingle ? (
          <SingleReveal result={results[0]} onDismiss={onDismiss} />
        ) : (
          <div className="w-full h-full">
            <MultiReveal results={results} onDismiss={onDismiss} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
