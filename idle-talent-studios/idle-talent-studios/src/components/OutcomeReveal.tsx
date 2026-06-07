import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GigOutcome, GigVoice } from '@/systems/gigSystem'
import { OUTCOME_LABELS, OUTCOME_COLORS, VOICE_DISPLAY } from '@/systems/gigSystem'
import type { StatDelta } from '@/engine/statEngine'

interface OutcomeRevealProps {
  outcome: GigOutcome
  gigTitle: string
  gigVoice: GigVoice
  onDismiss: () => void
}

export function OutcomeReveal({ outcome, gigTitle, gigVoice, onDismiss }: OutcomeRevealProps) {
  const [phase, setPhase] = useState<'flash' | 'detail'>('flash')
  const color = OUTCOME_COLORS[outcome.tier]
  const label = OUTCOME_LABELS[outcome.tier]

  useEffect(() => {
    setPhase('flash')
  }, [outcome])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#07070c' }}
    >
      {/* Background radial bloom */}
      <motion.div
        key={`bloom-${phase}`}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 2.8, opacity: phase === 'flash' ? 0.12 : 0.06 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <AnimatePresence mode="wait">
        {phase === 'flash' ? (
          <FlashPhase
            key="flash"
            label={label}
            color={color}
            gigTitle={gigTitle}
            voiceDisplay={VOICE_DISPLAY[gigVoice]}
            onAdvance={() => setPhase('detail')}
          />
        ) : (
          <DetailPhase
            key="detail"
            outcome={outcome}
            label={label}
            color={color}
            voiceDisplay={VOICE_DISPLAY[gigVoice]}
            onDismiss={onDismiss}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Flash phase ──────────────────────────────────────────────────────────────

function FlashPhase({
  label,
  color,
  gigTitle,
  voiceDisplay,
  onAdvance,
}: {
  label: string
  color: string
  gigTitle: string
  voiceDisplay: string
  onAdvance: () => void
}) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.08, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative z-10 text-center space-y-3 px-8"
    >
      <div className="text-7xl font-black tracking-tight leading-none" style={{ color }}>
        {label.toUpperCase()}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-white/50"
      >
        {gigTitle}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-[10px] tracking-widest uppercase"
        style={{ color: `${color}80` }}
      >
        — {voiceDisplay}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onAdvance}
        className="mt-3 text-xs text-white/35 border border-white/12 px-5 py-2 rounded-full hover:text-white/55 transition-colors"
      >
        See breakdown →
      </motion.button>
    </motion.div>
  )
}

// ─── Detail phase ─────────────────────────────────────────────────────────────

function DetailPhase({
  outcome,
  label,
  color,
  voiceDisplay,
  onDismiss,
}: {
  outcome: GigOutcome
  label: string
  color: string
  voiceDisplay: string
  onDismiss: () => void
}) {
  const fullNarration = `"${outcome.narration}"`
  const [visibleNarration, setVisibleNarration] = useState('')

  useEffect(() => {
    setVisibleNarration('')
    let i = 0
    const id = setInterval(() => {
      setVisibleNarration(fullNarration.slice(0, i + 1))
      i++
      if (i >= fullNarration.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullNarration])

  const [displayedSpotlight, setDisplayedSpotlight] = useState(0)
  useEffect(() => {
    const target = outcome.spotlight
    const duration = 900
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayedSpotlight(Math.round(eased * target))
      if (t >= 1) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [outcome.spotlight])

  const extraRows = (outcome.fascinationDelta !== 0 ? 1 : 0) + (outcome.scandalDelta > 0 ? 1 : 0)
  const continueDelay = 0.6 + (outcome.statDeltas.length + extraRows) * 0.12 + 0.4

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 w-full max-w-sm px-6 space-y-5"
    >
      <div className="text-center space-y-0.5">
        <div className="text-4xl font-black tracking-tight" style={{ color }}>
          {label}
        </div>
        <p className="text-[10px] tracking-widest uppercase" style={{ color: `${color}70` }}>
          — {voiceDisplay}
        </p>
      </div>

      <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-3 min-h-[3.5rem] flex items-center">
        <p className="text-xs italic text-white/60 leading-relaxed">
          {visibleNarration}
          {visibleNarration.length < fullNarration.length && (
            <span className="animate-pulse opacity-70">▍</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">Results</p>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between py-1.5 border-b border-white/6"
        >
          <span className="text-xs text-white/60">Spotlight</span>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: outcome.spotlight > 0 ? '#fbbf24' : '#ef4444' }}
          >
            {outcome.spotlight > 0 ? '+' : ''}{displayedSpotlight} ✨
          </span>
        </motion.div>

        {outcome.statDeltas.map((d, i) => (
          <motion.div
            key={`${d.stat}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
          >
            <StatRow delta={d} />
          </motion.div>
        ))}

        {outcome.fascinationDelta !== 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + outcome.statDeltas.length * 0.12 }}
            className="flex items-center justify-between py-1 border-b border-white/6"
          >
            <span className="text-xs text-white/60">Fascination</span>
            <span className="text-xs font-semibold text-purple-400">
              +{outcome.fascinationDelta}
            </span>
          </motion.div>
        )}

        {outcome.scandalDelta > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.2 + (outcome.statDeltas.length + (outcome.fascinationDelta !== 0 ? 1 : 0)) * 0.12,
            }}
            className="flex items-center justify-between py-1 border-b border-white/6"
          >
            <span className="text-xs text-white/60">Scandal</span>
            <span className="text-xs font-semibold text-red-400">
              +{outcome.scandalDelta}
            </span>
          </motion.div>
        )}

        {outcome.visibilityEscalate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: continueDelay - 0.2 }}
            className="flex items-center gap-2 py-1.5 text-pink-400"
          >
            <span className="text-[10px]">♥</span>
            <span className="text-[10px]">Relationship visibility escalated</span>
          </motion.div>
        )}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: continueDelay }}
        whileTap={{ scale: 0.98 }}
        onClick={onDismiss}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white border border-white/15 bg-white/6"
      >
        Continue
      </motion.button>
    </motion.div>
  )
}

// ─── Stat row ─────────────────────────────────────────────────────────────────

function StatRow({ delta }: { delta: StatDelta }) {
  const positive = delta.delta > 0
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/6">
      <span className="text-xs text-white/60 capitalize">{delta.stat}</span>
      <span className="text-xs font-semibold" style={{ color: positive ? '#4ade80' : '#f87171' }}>
        {positive ? '+' : ''}{delta.delta}
      </span>
    </div>
  )
}
