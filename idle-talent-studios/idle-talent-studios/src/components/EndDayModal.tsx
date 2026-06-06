import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DecayModifiers } from '@/engine/statEngine'
import {
  computeStatDecay,
  computeEnergyDecay,
  getStatColor,
  getStatLabel,
} from '@/engine/statEngine'
import { computeSpotlightGrant } from '@/systems/dailyReset'

interface EndDayModalProps {
  open: boolean
  currentDay: number
  loginStreak: number
  currentChapter: number
  decayModifiers: DecayModifiers
  energy: number
  onConfirm: () => void
  onCancel: () => void
}

export function EndDayModal({
  open,
  currentDay,
  loginStreak,
  currentChapter,
  decayModifiers,
  energy,
  onConfirm,
  onCancel,
}: EndDayModalProps) {
  const decayDeltas = computeStatDecay(decayModifiers)
  const energyDecay = computeEnergyDecay(decayModifiers.apartmentTier)
  const newStreak = loginStreak + 1
  const spotlight = computeSpotlightGrant(currentChapter, newStreak)
  const streakBonus = Math.min(50, loginStreak * 5)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border-t border-white/10 rounded-t-3xl px-5 pb-8 pt-5 space-y-5"
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />

            <div>
              <h2 className="text-base font-bold text-white">End Day {currentDay}?</h2>
              <p className="text-xs text-white/40 mt-0.5">
                The city doesn't sleep. Neither does the press cycle.
              </p>
            </div>

            {/* Decay preview */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Overnight decay
              </p>
              <div className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/8">
                <DecayRow
                  label="Energy"
                  delta={-energyDecay}
                  color="#60a5fa"
                  note={
                    decayModifiers.apartmentTier > 1
                      ? `apt. tier ${decayModifiers.apartmentTier} offset`
                      : undefined
                  }
                />
                {decayDeltas.map((d) => (
                  <DecayRow
                    key={d.stat}
                    label={getStatLabel(d.stat)}
                    delta={d.delta}
                    color={getStatColor(d.stat)}
                    note={
                      d.stat === 'confidence' && decayModifiers.hasActiveRomance
                        ? 'active romance +3'
                        : d.stat === 'reputation' && decayModifiers.scandal > 75
                        ? 'paused — press watching'
                        : undefined
                    }
                  />
                ))}
                <DecayRow
                  label="Wisdom"
                  delta={0}
                  color="#60a5fa"
                  note="permanent gains only"
                />
              </div>
            </div>

            {/* Spotlight grant */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Morning Spotlight
              </p>
              <div className="bg-pink-950/40 border border-pink-500/20 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    +{spotlight} ✨
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Base 50
                    {streakBonus > 0 && ` · Streak +${streakBonus}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-400">
                    {newStreak > 1 ? `${newStreak}🔥` : ''}
                  </p>
                  <p className="text-xs text-white/30">
                    {newStreak === 1 ? 'Start a streak' : `Day ${newStreak} streak`}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={onCancel}
                className="py-3 rounded-xl bg-white/8 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/12 transition-colors"
              >
                Not yet
              </button>
              <button
                onClick={onConfirm}
                className={cn(
                  'py-3 rounded-xl text-sm font-semibold text-white transition-all',
                  'bg-gradient-to-r from-indigo-600 to-purple-600',
                  'shadow-lg shadow-purple-600/20',
                  energy <= 20 && 'from-slate-600 to-slate-700 shadow-none'
                )}
              >
                {energy <= 20 ? 'Collapse into bed →' : 'Sleep →'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DecayRow({
  label,
  delta,
  color,
  note,
}: {
  label: string
  delta: number
  color: string
  note?: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-white/70">{label}</span>
        {note && <span className="text-[10px] text-white/25 italic">{note}</span>}
      </div>
      <span
        className={cn(
          'font-mono text-xs font-semibold',
          delta < 0 ? 'text-red-400' : delta > 0 ? 'text-green-400' : 'text-white/25'
        )}
      >
        {delta === 0 ? '—' : delta > 0 ? `+${delta}` : delta}
      </span>
    </div>
  )
}
