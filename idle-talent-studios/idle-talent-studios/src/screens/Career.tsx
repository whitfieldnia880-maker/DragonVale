import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useGigStore } from '@/store/gigStore'
import {
  CAREER_TIERS,
  OUTCOME_COLORS,
  getCareerTierConfig,
  getNextTierRequirements,
  IDLE_RATES,
  IDLE_CAP_HOURS,
  IDLE_CAP_HOURS_EXTENDED,
} from '@/systems/gigSystem'
import { GIG_INDEX } from '@/data/gigs/catalog'

interface CareerProps {
  onBack: () => void
}

export function Career({ onBack }: CareerProps) {
  const stats = usePlayerStore((s) => s.stats)
  const balance = useCurrencyStore((s) => s.balance)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)

  const careerTier = useGigStore((s) => s.careerTier)
  const completedGigCount = useGigStore((s) => s.completedGigCount)
  const completedGigHistory = useGigStore((s) => s.completedGigHistory)
  const fascination = useGigStore((s) => s.fascination)
  const idle = useGigStore((s) => s.idle)
  const collectIdle = useGigStore((s) => s.collectIdle)
  const tickIdleAccrual = useGigStore((s) => s.tickIdleAccrual)

  const tierConfig = getCareerTierConfig(careerTier)
  const nextTier = getNextTierRequirements(careerTier)
  const tierColor = tierConfig.color

  useEffect(() => {
    tickIdleAccrual(careerTier)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCollect() {
    const earned = collectIdle(careerTier)
    if (earned > 0) grantCurrency('spotlight', earned, 'idle_collect')
  }

  const idleRate = IDLE_RATES[Math.min(6, Math.max(1, careerTier))]
  const capHours = idle.extendedCap ? IDLE_CAP_HOURS_EXTENDED : IDLE_CAP_HOURS
  const hasUncollected = idle.uncollected > 0

  const gigProgress = nextTier ? Math.min(1, completedGigCount / nextTier.gigCount) : 1
  const repProgress = nextTier ? Math.min(1, stats.reputation / nextTier.reputationMin) : 1
  const scandalOK = nextTier ? stats.scandal <= nextTier.scandalMax : true

  return (
    <div className="min-h-svh bg-slate-950 flex flex-col">
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(10,10,15,0.92)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/50 text-sm"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-white">Career</h1>
            <p className="text-[10px] text-white/35">Progression &amp; earnings</p>
          </div>
          <div className="text-xs text-yellow-400/70 font-mono">✨{balance.spotlight}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 space-y-5 pt-4 px-4">
        {/* Current tier card */}
        <section>
          <div
            className="rounded-2xl border p-5 space-y-3 relative overflow-hidden"
            style={{
              borderColor: `${tierColor}30`,
              background: `linear-gradient(135deg, ${tierColor}12 0%, transparent 55%)`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: tierColor }} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/35 uppercase tracking-widest">Career Tier</p>
                <h2 className="text-2xl font-black mt-1" style={{ color: tierColor }}>
                  {tierConfig.name}
                </h2>
                <p className="text-xs text-white/40 mt-1">{tierConfig.description}</p>
              </div>
              <div
                className="w-12 h-12 flex items-center justify-center rounded-full border text-sm font-black"
                style={{ borderColor: `${tierColor}30`, backgroundColor: `${tierColor}10`, color: tierColor }}
              >
                T{careerTier}
              </div>
            </div>
            <div className="flex gap-3 text-xs text-white/40 flex-wrap">
              <span>{completedGigCount} gigs</span>
              <span>·</span>
              <span>Rep {stats.reputation}</span>
              <span>·</span>
              <span>Scandal {stats.scandal}</span>
            </div>
          </div>
        </section>

        {/* Next tier requirements */}
        {nextTier && (
          <section>
            <h2 className="text-[10px] text-white/35 uppercase tracking-widest mb-2">
              Path to {nextTier.name}
            </h2>
            <div className="rounded-xl bg-white/4 border border-white/8 p-4 space-y-3">
              <RequirementRow
                label="Gigs Completed"
                current={completedGigCount}
                required={nextTier.gigCount}
                progress={gigProgress}
                color={tierColor}
              />
              <RequirementRow
                label="Reputation"
                current={stats.reputation}
                required={nextTier.reputationMin}
                progress={repProgress}
                color={tierColor}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Scandal</span>
                <span className="text-xs font-semibold" style={{ color: scandalOK ? '#4ade80' : '#ef4444' }}>
                  {scandalOK
                    ? `${stats.scandal} ≤ ${nextTier.scandalMax} ✓`
                    : `${stats.scandal} (must be ≤ ${nextTier.scandalMax})`}
                </span>
              </div>
              {nextTier.requiresSSRRoute && (
                <p className="text-[10px] text-white/30">Also requires: SSR route at Ch.6+</p>
              )}
              {nextTier.requiresTrueEnding && (
                <p className="text-[10px] text-white/30">Also requires: one true ending unlocked</p>
              )}
            </div>
          </section>
        )}

        {careerTier >= 6 && (
          <div
            className="rounded-xl border px-4 py-3 text-center"
            style={{ borderColor: `${tierColor}30`, backgroundColor: `${tierColor}08` }}
          >
            <p className="text-xs font-bold" style={{ color: tierColor }}>
              Maximum tier reached. You are a Legend.
            </p>
          </div>
        )}

        {/* Fascination */}
        <section>
          <h2 className="text-[10px] text-white/35 uppercase tracking-widest mb-2">
            Public Fascination
          </h2>
          <div className="rounded-xl bg-white/4 border border-white/8 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Fascination</span>
              <span
                className="text-xs font-bold"
                style={{ color: fascination >= 70 ? '#a855f7' : '#94a3b8' }}
              >
                {fascination}/100
              </span>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${fascination}%` }}
                transition={{ duration: 0.5 }}
                style={{ backgroundColor: '#a855f7' }}
              />
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed">
              {fascination >= 70
                ? 'High — paparazzi pressure elevated. Romance exposure risk increased. Brand deals improved.'
                : 'Grows from viral prep, big outcomes, and breaking news. Decays 3/day naturally.'}
            </p>
          </div>
        </section>

        {/* Idle earnings */}
        <section>
          <h2 className="text-[10px] text-white/35 uppercase tracking-widest mb-2">
            Passive Earnings
          </h2>
          <div className="rounded-xl bg-white/4 border border-white/8 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60 font-semibold">Idle Rate</p>
                <p className="text-[10px] text-white/35 mt-0.5">
                  ✨{idleRate}/hr · Cap: {capHours}hr
                </p>
              </div>
              <div
                className="text-sm font-bold font-mono"
                style={{ color: hasUncollected ? '#fbbf24' : '#6b7280' }}
              >
                +{idle.uncollected} ✨
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCollect}
              disabled={!hasUncollected}
              className="w-full py-3 rounded-xl text-xs font-bold text-white border transition-all"
              style={
                hasUncollected
                  ? { backgroundColor: '#fbbf2420', borderColor: '#fbbf2440' }
                  : { backgroundColor: '#ffffff08', borderColor: '#ffffff10', opacity: 0.4 }
              }
            >
              {hasUncollected ? `Collect ✨${idle.uncollected}` : 'Nothing to collect yet'}
            </motion.button>
            {!idle.extendedCap && (
              <p className="text-[10px] text-white/20 text-center">
                Spend 💎 Prestige to extend cap to 16hr
              </p>
            )}
          </div>
        </section>

        {/* All tiers overview */}
        <section>
          <h2 className="text-[10px] text-white/35 uppercase tracking-widest mb-2">
            Career Path
          </h2>
          <div className="space-y-2">
            {CAREER_TIERS.map((t) => {
              const isCurrent = t.tier === careerTier
              const isPast = t.tier < careerTier
              return (
                <div
                  key={t.tier}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                  style={{
                    borderColor: isCurrent ? `${t.color}40` : '#ffffff0a',
                    backgroundColor: isCurrent ? `${t.color}0c` : 'transparent',
                    opacity: t.tier > careerTier + 1 ? 0.4 : 1,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isPast || isCurrent ? t.color : '#4b5563' }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isCurrent ? t.color : isPast ? '#6b7280' : '#9ca3af' }}
                    >
                      Tier {t.tier} — {t.name}
                    </span>
                    <p className="text-[10px] text-white/25 mt-0.5">{t.description}</p>
                  </div>
                  {isCurrent && (
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ color: t.color, backgroundColor: `${t.color}20` }}
                    >
                      Now
                    </span>
                  )}
                  {isPast && <span className="text-[10px] text-green-400/60">✓</span>}
                </div>
              )
            })}
          </div>
        </section>

        {/* Recent gigs */}
        {completedGigHistory.length > 0 && (
          <section>
            <h2 className="text-[10px] text-white/35 uppercase tracking-widest mb-2">
              Recent Gigs
            </h2>
            <div className="space-y-1.5">
              {completedGigHistory.slice(0, 8).map((record, i) => {
                const gigData = GIG_INDEX[record.gigId]
                const outcomeColor = OUTCOME_COLORS[record.outcomeTier]
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/3 border border-white/6"
                  >
                    <div>
                      <p className="text-xs text-white/60 font-medium">
                        {gigData?.title ?? record.gigId}
                      </p>
                      <p className="text-[10px] text-white/25">Day {record.dayCompleted}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[10px] font-bold uppercase"
                        style={{ color: outcomeColor }}
                      >
                        {record.outcomeTier}
                      </p>
                      <p className="text-[10px] text-yellow-400/50 font-mono">
                        +{record.spotlight}✨
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RequirementRow({
  label,
  current,
  required,
  progress,
  color,
}: {
  label: string
  current: number
  required: number
  progress: number
  color: string
}) {
  const met = progress >= 1
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span style={{ color: met ? '#4ade80' : '#9ca3af' }}>
          {current} / {required}{met ? ' ✓' : ''}
        </span>
      </div>
      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4 }}
          style={{ backgroundColor: met ? '#4ade80' : color }}
        />
      </div>
    </div>
  )
}
