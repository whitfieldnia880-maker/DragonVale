import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ScandalTwist } from '@/systems/scandal'
import { SOURCE_PERKS, applySourcePerk } from '@/systems/scandal'

interface BreakingNewsProps {
  twist: ScandalTwist | null
  scandalLevel: number
  stackCount?: number
  onResolve: (twistId: string, choiceId?: string) => void
}

export function BreakingNews({
  twist,
  scandalLevel,
  stackCount = 0,
  onResolve,
}: BreakingNewsProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

  const isMaxScandal = scandalLevel >= 100
  const sourceInfo = twist ? SOURCE_PERKS[twist.source] : null
  const effectivePenalty = twist
    ? applySourcePerk(twist.source, twist.baseStatPenalty)
    : {}
  const hasChoices = !!(twist?.choices?.length)

  const handleResolve = () => {
    if (!twist) return
    if (hasChoices && !selectedChoice) return
    onResolve(twist.id, selectedChoice ?? undefined)
    setSelectedChoice(null)
  }

  return (
    <AnimatePresence>
      {twist && (
        <>
          {/* Backdrop */}
          <motion.div
            key="breaking-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-[2px]"
          />

          {/* Panel — slides up from bottom */}
          <motion.div
            key="breaking-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-[100]',
              'bg-gradient-to-t from-red-950 via-slate-900 to-slate-900',
              'border-t border-red-700/40 rounded-t-2xl',
              'max-h-[88vh] overflow-hidden flex flex-col'
            )}
            style={isMaxScandal ? { animation: 'scandal-jitter 0.45s ease-in-out infinite' } : undefined}
          >
            {/* Red accent bar */}
            <div className="h-[3px] bg-gradient-to-r from-red-600 via-red-400 to-red-600 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-red-900/40 shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[9px] font-bold tracking-[0.3em] text-red-400',
                    isMaxScandal ? 'animate-pulse' : 'opacity-80'
                  )}
                >
                  ● BREAKING NEWS
                </span>
                {isMaxScandal && (
                  <span className="text-[9px] font-bold text-red-300 tracking-widest animate-pulse">
                    ● SCANDAL: MAX
                  </span>
                )}
              </div>
              {sourceInfo && !sourceInfo.hiddenByline && (
                <span className="text-[10px] text-white/35 italic">
                  {sourceInfo.byline}
                </span>
              )}
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3 relative">
              {/* Source stamp */}
              {sourceInfo && !sourceInfo.hiddenByline && (
                <div
                  className="absolute top-4 right-4 text-[8px] font-black text-red-400/25
                             uppercase tracking-widest border border-red-400/15 px-2 py-0.5
                             pointer-events-none select-none"
                  style={{ transform: 'rotate(-6deg)' }}
                >
                  {sourceInfo.displayName}
                </div>
              )}

              <h2 className="text-[22px] font-black text-white leading-tight pr-14 tracking-tight">
                {twist.headline}
              </h2>

              <p className="text-sm text-red-200/70 leading-relaxed">{twist.subtext}</p>

              {/* Effective penalties */}
              {Object.keys(effectivePenalty).length > 0 && (
                <div className="space-y-1 pt-0.5">
                  {Object.entries(effectivePenalty)
                    .filter(([, v]) => v !== 0)
                    .map(([stat, delta]) => (
                      <div key={stat} className="flex items-center gap-2 text-xs">
                        <span className="text-red-600/70">—</span>
                        <span className="capitalize text-white/50">{stat}</span>
                        <span
                          className={cn(
                            'font-mono font-semibold ml-auto',
                            (delta ?? 0) > 0 ? 'text-orange-400' : 'text-red-400'
                          )}
                        >
                          {(delta ?? 0) > 0 ? `+${delta}` : delta}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* Choices */}
              {hasChoices ? (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                    How do you respond?
                  </p>
                  {twist.choices!.map((choice) => (
                    <motion.button
                      key={choice.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedChoice(choice.id)}
                      className={cn(
                        'w-full text-left rounded-xl px-4 py-3 border transition-all duration-150',
                        selectedChoice === choice.id
                          ? 'bg-red-900/50 border-red-500/70 shadow-red-900/30 shadow-sm'
                          : 'bg-white/4 border-white/8 hover:border-red-600/30'
                      )}
                    >
                      <p className="text-sm font-semibold text-white leading-snug">
                        {choice.label}
                      </p>
                      <p className="text-xs text-white/35 mt-0.5 leading-snug">
                        {choice.subtext}
                      </p>
                      {/* Choice stat preview */}
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                        {Object.entries(choice.statDeltas)
                          .filter(([, v]) => v !== 0)
                          .slice(0, 3)
                          .map(([stat, delta]) => (
                            <span
                              key={stat}
                              className={cn(
                                'text-[10px] font-mono',
                                (delta ?? 0) > 0 ? 'text-green-400/70' : 'text-red-400/70'
                              )}
                            >
                              {stat} {(delta ?? 0) > 0 ? `+${delta}` : delta}
                            </span>
                          ))}
                      </div>
                    </motion.button>
                  ))}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResolve}
                    disabled={!selectedChoice}
                    className={cn(
                      'w-full rounded-xl text-white text-sm font-semibold py-3 transition-all mt-1',
                      selectedChoice
                        ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/40'
                        : 'bg-white/8 opacity-40 cursor-not-allowed'
                    )}
                  >
                    Commit
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResolve}
                  className="w-full rounded-xl bg-red-700/70 hover:bg-red-600 text-white text-sm font-semibold py-3 transition-colors mt-2"
                >
                  Handle the fallout
                </motion.button>
              )}

              {/* Stack indicator */}
              {stackCount > 0 && (
                <p className="text-center text-[10px] text-white/25 pb-1">
                  +{stackCount} more {stackCount === 1 ? 'story' : 'stories'} incoming
                </p>
              )}
            </div>
          </motion.div>

          <style>{`
            @keyframes scandal-jitter {
              0%,100% { transform: translateY(0) rotate(0deg); }
              10% { transform: translateY(-1px) rotate(-0.15deg); }
              20% { transform: translateY(1px) rotate(0.15deg); }
              30% { transform: translateY(-1px) rotate(-0.1deg); }
              40% { transform: translateY(1px) rotate(0.1deg); }
              50% { transform: translateY(-2px) rotate(-0.2deg); }
              60% { transform: translateY(2px) rotate(0.2deg); }
              70% { transform: translateY(-1px) rotate(-0.15deg); }
              80% { transform: translateY(1px) rotate(0.1deg); }
              90% { transform: translateY(-1px) rotate(0.15deg); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}
