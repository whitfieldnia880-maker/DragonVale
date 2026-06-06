import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GigOutcome } from '@/systems/gigSystem'
import { OUTCOME_LABELS, OUTCOME_COLORS } from '@/systems/gigSystem'
import type { StatDelta } from '@/engine/statEngine'

interface OutcomeRevealProps {
  outcome: GigOutcome
  gigTitle: string
  onDismiss: () => void
}

export function OutcomeReveal({ outcome, gigTitle, onDismiss }: OutcomeRevealProps) {
  const [phase, setPhase] = useState<'flash' | 'detail'>('flash')
  const color = OUTCOME_COLORS[outcome.tier]
  const label = OUTCOME_LABELS[outcome.tier]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      {/* Background pulse */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2.5, opacity: 0.08 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <AnimatePresence mode="wait">
        {phase === 'flash' ? (
          <motion.div
            key="flash"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'backOut' }}
            className="relative z-10 text-center space-y-4 px-8"
          >
            <div
              className="text-7xl font-black tracking-tight"
              style={{ color }}
            >
              {label.toUpperCase()}
            </div>
            <p className="text-sm text-white/50">{gigTitle}</p>
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setPhase('detail')}
              className="mt-4 text-xs text-white/40 border border-white/15 px-4 py-2 rounded-full"
            >
              See breakdown →
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-sm px-6 space-y-5"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <div
                className="text-4xl font-black tracking-tight"
                style={{ color }}
              >
                {label}
              </div>
              <p className="text-xs text-white/40">{gigTitle}</p>
            </div>

            {/* Narration */}
            <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-3">
              <p className="text-xs italic text-white/60 leading-relaxed">
                "{outcome.narration}"
              </p>
            </div>

            {/* Reward breakdown */}
            <div className="space-y-2">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Rewards</p>

              <div className="flex items-center justify-between py-1.5 border-b border-white/6">
                <span className="text-xs text-white/60">Spotlight</span>
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: outcome.spotlight > 0 ? '#fbbf24' : '#ef4444' }}
                >
                  {outcome.spotlight > 0 ? '+' : ''}{outcome.spotlight} ✨
                </span>
              </div>

              {outcome.statDeltas.map((d) => (
                <StatRow key={d.stat} delta={d} />
              ))}

              {outcome.fascinationDelta !== 0 && (
                <div className="flex items-center justify-between py-1 border-b border-white/6">
                  <span className="text-xs text-white/60">Fascination</span>
                  <span className="text-xs font-semibold text-purple-400">
                    +{outcome.fascinationDelta}
                  </span>
                </div>
              )}

              {outcome.scandalDelta > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-white/6">
                  <span className="text-xs text-white/60">Scandal</span>
                  <span className="text-xs font-semibold text-red-400">
                    +{outcome.scandalDelta}
                  </span>
                </div>
              )}

              {outcome.visibilityEscalate && (
                <div className="flex items-center gap-2 py-1.5 text-pink-400">
                  <span className="text-[10px]">♥</span>
                  <span className="text-[10px]">Relationship visibility escalated</span>
                </div>
              )}
            </div>

            {/* Dismiss */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onDismiss}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white border border-white/15 bg-white/6"
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StatRow({ delta }: { delta: StatDelta }) {
  const positive = delta.delta > 0
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/6">
      <span className="text-xs text-white/60 capitalize">{delta.stat}</span>
      <span
        className="text-xs font-semibold"
        style={{ color: positive ? '#4ade80' : '#f87171' }}
      >
        {positive ? '+' : ''}{delta.delta}
      </span>
    </div>
  )
}
