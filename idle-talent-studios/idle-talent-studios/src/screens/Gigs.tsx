import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useRosterStore } from '@/store/rosterStore'
import { useGigStore, selectActiveGigProgress } from '@/store/gigStore'
import { GigCard } from '@/components/GigCard'
import { PrepSheet } from '@/components/PrepSheet'
import { OutcomeReveal } from '@/components/OutcomeReveal'
import { getCareerTierConfig, CAREER_TIERS } from '@/systems/gigSystem'
import type { Gig, PrepChoiceId } from '@/systems/gigSystem'
import { GIG_INDEX } from '@/data/gigs/catalog'

const OFFER_REFRESH_COST = 100

interface GigsProps {
  onBack: () => void
}

export function Gigs({ onBack }: GigsProps) {
  const [prepGig, setPrepGig] = useState<Gig | null>(null)
  const [showOutcome, setShowOutcome] = useState(false)
  const [showTierAdvance, setShowTierAdvance] = useState(false)

  // Player state
  const stats = usePlayerStore((s) => s.stats)
  const currentDay = usePlayerStore((s) => s.currentDay)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const applyStatDelta = useCallback(
    (deltas: import('@/engine/statEngine').StatDelta[]) => applyStatDeltas(deltas),
    [applyStatDeltas]
  )

  // Currency
  const balance = useCurrencyStore((s) => s.balance)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)
  const spendCurrency = useCurrencyStore((s) => s.spendCurrency)

  // Roster (for romance hook affection)
  const relationships = useRosterStore((s) => s.relationships)
  const getAffection = useCallback(
    (charId: string) => relationships[charId]?.affection ?? 0,
    [relationships]
  )

  // Gig store
  const careerTier = useGigStore((s) => s.careerTier)
  const currentOffers = useGigStore((s) => s.currentOffers)
  const offersGeneratedOnDay = useGigStore((s) => s.offersGeneratedOnDay)
  const activeGig = useGigStore((s) => s.activeGig)
  const pendingOutcome = useGigStore((s) => s.pendingOutcome)
  const pendingTierAdvance = useGigStore((s) => s.pendingTierAdvance)
  const refreshOffers = useGigStore((s) => s.refreshOffers)
  const startGig = useGigStore((s) => s.startGig)
  const resolveGig = useGigStore((s) => s.resolveGig)
  const clearOutcome = useGigStore((s) => s.clearOutcome)
  const addFascination = useGigStore((s) => s.addFascination)
  const recalcCareerTier = useGigStore((s) => s.recalcCareerTier)
  const dismissTierAdvance = useGigStore((s) => s.dismissTierAdvance)

  const tierConfig = getCareerTierConfig(careerTier)
  const tierColor = tierConfig.color

  // Auto-refresh offers if stale
  useEffect(() => {
    if (offersGeneratedOnDay !== currentDay || currentOffers.length === 0) {
      refreshOffers(currentDay, careerTier)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show pending outcome if one exists (e.g. after navigating back)
  useEffect(() => {
    if (pendingOutcome) setShowOutcome(true)
  }, [pendingOutcome])

  function handleManualRefresh() {
    const result = spendCurrency('spotlight', OFFER_REFRESH_COST, 'gig_refresh')
    if (!result.success) return
    refreshOffers(currentDay, careerTier)
  }

  function handlePrepConfirm(gigId: string, prep: PrepChoiceId) {
    startGig(gigId, prep, currentDay)
    setPrepGig(null)
  }

  function handleComplete() {
    const outcome = resolveGig(stats, getAffection, currentDay)
    if (!outcome) return

    // Apply rewards
    if (outcome.spotlight > 0) {
      grantCurrency('spotlight', outcome.spotlight, 'gig_complete')
    }
    if (outcome.statDeltas.length > 0) {
      applyStatDelta(outcome.statDeltas)
    }
    if (outcome.scandalDelta > 0) {
      applyStatDeltas([{ stat: 'scandal', delta: outcome.scandalDelta }])
    }
    if (outcome.fascinationDelta > 0) {
      addFascination(outcome.fascinationDelta)
    }

    // Recalc with updated reputation (outcome stat deltas applied above)
    const updatedReputation = stats.reputation + outcome.statDeltas.reduce(
      (acc, d) => (d.stat === 'reputation' ? acc + d.delta : acc), 0
    )
    const updatedScandal = stats.scandal + outcome.statDeltas.reduce(
      (acc, d) => (d.stat === 'scandal' ? acc + d.delta : acc), 0
    ) + (outcome.scandalDelta ?? 0)

    recalcCareerTier(
      updatedReputation,
      updatedScandal,
      false, // SSR route check — wired when route system exposes flag
      false
    )

    setShowOutcome(true)
  }

  function handleOutcomeDismiss() {
    clearOutcome()
    setShowOutcome(false)
    if (pendingTierAdvance) {
      setShowTierAdvance(true)
    } else {
      refreshOffers(currentDay, careerTier)
    }
  }

  function handleTierAdvanceDismiss() {
    dismissTierAdvance()
    setShowTierAdvance(false)
    refreshOffers(currentDay, careerTier)
  }

  const gigProgress = selectActiveGigProgress(activeGig, currentDay)
  const activeGigData = activeGig ? GIG_INDEX[activeGig.gigId] : null

  const offeredGigs = currentOffers
    .map((id) => GIG_INDEX[id])
    .filter(Boolean) as Gig[]

  return (
    <div className="min-h-svh bg-slate-950 flex flex-col">
      {/* Outcome reveal overlay */}
      <AnimatePresence>
        {showOutcome && pendingOutcome && (
          <OutcomeReveal
            outcome={pendingOutcome}
            gigTitle={activeGigData?.title ?? 'Gig'}
            gigVoice={activeGigData?.voice ?? 'your_publicist'}
            onDismiss={handleOutcomeDismiss}
          />
        )}
      </AnimatePresence>

      {/* Tier advance celebration overlay */}
      <AnimatePresence>
        {showTierAdvance && pendingTierAdvance && (
          <TierAdvanceCelebration
            toTier={pendingTierAdvance.toTier}
            onDismiss={handleTierAdvanceDismiss}
          />
        )}
      </AnimatePresence>

      {/* Prep sheet */}
      <AnimatePresence>
        {prepGig && (
          <PrepSheet
            gig={prepGig}
            tierColor={tierColor}
            wisdomStat={stats.wisdom}
            onConfirm={handlePrepConfirm}
            onClose={() => setPrepGig(null)}
          />
        )}
      </AnimatePresence>

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
            <h1 className="text-sm font-bold text-white">Gigs</h1>
            <p className="text-[10px] text-white/35">
              <span style={{ color: tierColor }}>●</span>{' '}
              {tierConfig.name}
            </p>
          </div>
          <div className="text-xs text-yellow-400/70 font-mono">✨{balance.spotlight}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 space-y-6 pt-4">
        {/* Active gig section */}
        {activeGig && activeGigData && (
          <section className="px-4">
            <h2 className="text-[10px] text-white/35 uppercase tracking-widest mb-2">
              In Progress
            </h2>
            <div
              className="rounded-2xl border p-4 space-y-3"
              style={{
                borderColor: `${tierColor}25`,
                background: `linear-gradient(135deg, ${tierColor}08 0%, transparent 60%)`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-white">{activeGigData.title}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {gigProgress.isComplete
                      ? 'Ready to collect'
                      : `${gigProgress.daysLeft} day${gigProgress.daysLeft !== 1 ? 's' : ''} remaining`}
                  </p>
                </div>
                {gigProgress.isComplete && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleComplete}
                    className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: `${tierColor}35`, borderColor: `${tierColor}50` }}
                  >
                    Collect Outcome →
                  </motion.button>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${gigProgress.progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    backgroundColor: gigProgress.isComplete ? tierColor : `${tierColor}70`,
                  }}
                />
              </div>
              <p className="text-[10px] text-white/25 italic">
                Prep: {activeGig.prepChoice.replace(/_/g, ' ')}
              </p>
            </div>
          </section>
        )}

        {/* Offers section */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] text-white/35 uppercase tracking-widest">
              Today's Offers
            </h2>
            {!activeGig && (
              <button
                onClick={handleManualRefresh}
                disabled={balance.spotlight < OFFER_REFRESH_COST}
                className="text-[10px] text-white/35 hover:text-white/60 transition-colors disabled:opacity-30"
              >
                Refresh · ✨{OFFER_REFRESH_COST}
              </button>
            )}
          </div>

          {activeGig ? (
            <p className="text-xs text-white/30 text-center py-8">
              Finish your current gig to unlock new offers.
            </p>
          ) : offeredGigs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl mb-2">🎬</p>
              <p className="text-sm text-white/30">No offers available.</p>
              <p className="text-xs text-white/20 mt-1">Come back tomorrow or refresh.</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {offeredGigs.map((gig) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  tierColor={tierColor}
                  onTap={() => setPrepGig(gig)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Risk legend */}
        <section className="px-4">
          <div className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 space-y-1.5">
            <p className="text-[9px] text-white/25 uppercase tracking-widest">How prep works</p>
            <p className="text-[10px] text-white/35 leading-relaxed">
              Choose how to approach each gig before it starts. Riskier choices can yield much better outcomes
              — or much worse. Your stats (Confidence, Looks, Wisdom) and Scandal level shift the odds invisibly.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

// ─── Tier advance congratulation lines ────────────────────────────────────────

const TIER_CONGRATS: Record<number, { source: string; line: string }> = {
  2: {
    source: 'Editor',
    line: 'The industry just learned your name. We suggest learning theirs back.',
  },
  3: {
    source: 'Paparazzo',
    line: "She's not nobody anymore. This changes our whole route.",
  },
  4: {
    source: 'PR Whisperer',
    line: "Tier four. We've been preparing for this conversation.",
  },
  5: {
    source: 'Insider',
    line: "There are maybe twelve people alive who get here. She's one of them now.",
  },
  6: {
    source: 'Driver',
    line: '...',
  },
}

// ─── Tier advance celebration ──────────────────────────────────────────────────

function TierAdvanceCelebration({
  toTier,
  onDismiss,
}: {
  toTier: number
  onDismiss: () => void
}) {
  const tierDef = CAREER_TIERS.find((t) => t.tier === toTier)
  if (!tierDef) return null

  const congrats = TIER_CONGRATS[toTier]

  const CONFETTI = ['✨', '🌟', '💫', '⭐', '🎉', '🎊', '💥', '🔥']
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    emoji: CONFETTI[i % CONFETTI.length],
    angle: (360 / 18) * i,
    delay: (i % 4) * 0.06,
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#07070c' }}
    >
      {/* Confetti burst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {pieces.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180
          const dist = 140 + (i % 3) * 30
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: Math.cos(rad) * dist,
                y: Math.sin(rad) * dist,
                scale: [0, 1.4, 1],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.0, delay: p.delay, ease: 'easeOut' }}
              className="absolute text-xl"
            >
              {p.emoji}
            </motion.span>
          )
        })}
      </div>

      <div className="relative z-10 text-center space-y-4 px-8">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] uppercase tracking-[0.25em] text-white/40"
        >
          Career Advance
        </motion.p>

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 22 }}
          className="text-6xl font-black tracking-tight"
          style={{ color: tierDef.color }}
        >
          {tierDef.name.toUpperCase()}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-white/50 leading-relaxed"
        >
          {tierDef.description}
        </motion.p>

        {congrats && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-xs italic leading-relaxed max-w-xs mx-auto"
            style={{ color: `${tierDef.color}cc` }}
          >
            "{congrats.line}"
            <br />
            <span className="not-italic text-white/30 text-[10px]">— {congrats.source}</span>
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-[10px] uppercase tracking-widest"
          style={{ color: `${tierDef.color}80` }}
        >
          Tier {toTier} Unlocked
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          aria-label="Continue to next screen"
          className="mt-4 px-8 py-3 rounded-xl text-sm font-bold text-white border border-white/15 bg-white/6"
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  )
}
