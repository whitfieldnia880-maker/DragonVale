import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProgressStore } from '@/store/progressStore'
import { useRosterStore } from '@/store/rosterStore'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { useGigStore } from '@/store/gigStore'
import { useDailyReset } from '@/hooks/useDailyReset'
import { Apartment } from '@/components/Apartment'
import { StatsPanel } from '@/components/StatsPanel'
import { BreakingNews } from '@/components/BreakingNews'
import { EndDayModal } from '@/components/EndDayModal'
import { DailyToast } from '@/components/DailyToast'
import { CharacterEventCard } from '@/components/CharacterEventCard'
import { PressTicker } from '@/components/PressTicker'
import { Wardrobe } from '@/components/Wardrobe'
import { ScenePlayer } from '@/components/ScenePlayer'
import { ActiveGigBar } from '@/components/ActiveGigBar'
import { DailyReward } from '@/components/DailyReward'
import { selectTwist, applySourcePerk } from '@/systems/scandal'
import {
  MEAL_OPTIONS,
  APARTMENT_TIERS,
  getVisitSlots,
} from '@/systems/wardrobeSystem'
import { getCareerTierConfig } from '@/systems/gigSystem'
import type { ApartmentZone, MealOption } from '@/systems/wardrobeSystem'
import type { DailyResetResult } from '@/systems/dailyReset'
import type { StatKey } from '@/engine/gameState'
import type { StatDelta } from '@/engine/statEngine'
import { ALL_CHARACTERS } from '@/data/characters'

// Scene JSON imports
import dreamAmyScene from '@/data/scenes/rest/dream_amy.json'
import amyVisitScene from '@/data/scenes/visits/amy_visit_01.json'

// ─── Scene maps ───────────────────────────────────────────────────────────────

const DREAM_SCENES: Record<string, object> = {
  'amy-crawford': dreamAmyScene,
}

const VISIT_SCENES: Record<string, object> = {
  'amy-crawford': amyVisitScene,
}

const VALID_STAT_KEYS = new Set<string>([
  'confidence', 'looks', 'wisdom', 'reputation', 'scandal', 'money',
])

// ─── Props ────────────────────────────────────────────────────────────────────

interface HomeProps {
  onGoToGacha: () => void
  onGoToRoutes: () => void
  onGoToShop: () => void
  onGoToProfile: () => void
  onGoToGigs: () => void
  onGoToCareer: () => void
  onGoToCollection: () => void
}

// ─── Home screen ─────────────────────────────────────────────────────────────

export function Home({ onGoToGacha, onGoToRoutes, onGoToShop, onGoToProfile, onGoToGigs, onGoToCareer, onGoToCollection }: HomeProps) {
  const [showEndDayModal, setShowEndDayModal] = useState(false)
  const [toastResult, setToastResult] = useState<DailyResetResult | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [showWardrobe, setShowWardrobe] = useState(false)
  const [showKitchenPicker, setShowKitchenPicker] = useState(false)
  const [showLivingRoomPicker, setShowLivingRoomPicker] = useState(false)
  const [activeVisitScene, setActiveVisitScene] = useState<object | null>(null)
  const [activeDreamScene, setActiveDreamScene] = useState<object | null>(null)

  // Player
  const stats = usePlayerStore((s) => s.stats)
  const playerName = usePlayerStore((s) => s.playerName)
  const energy = usePlayerStore((s) => s.energy)
  const mood = usePlayerStore((s) => s.mood)
  const currentDay = usePlayerStore((s) => s.currentDay)
  const currentChapter = usePlayerStore((s) => s.currentChapter)
  const loginStreak = usePlayerStore((s) => s.loginStreak)
  const pendingScandalEvents = usePlayerStore((s) => s.pendingScandalEvents)
  const dismissScandalEvent = usePlayerStore((s) => s.dismissScandalEvent)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const setEnergy = usePlayerStore((s) => s.setEnergy)

  // Currency
  const balance = useCurrencyStore((s) => s.balance)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)
  const spendCurrency = useCurrencyStore((s) => s.spendCurrency)

  // Progress
  const apartmentLevel = useProgressStore((s) => s.apartmentLevel)
  const pendingCharacterEvents = useProgressStore((s) => s.pendingCharacterEvents)
  const dismissPendingEvent = useProgressStore((s) => s.dismissPendingEvent)
  const pressHistory = useProgressStore((s) => s.pressHistory)
  const firedTwists = useProgressStore((s) => s.firedTwists)
  const addFiredTwist = useProgressStore((s) => s.addFiredTwist)
  const upgradeApartment = useProgressStore((s) => s.upgradeApartment)
  const vanityUsedToday = useProgressStore((s) => s.vanityUsedToday)
  const restedToday = useProgressStore((s) => s.restedToday)
  const visitedToday = useProgressStore((s) => s.visitedToday)
  const markVanityUsed = useProgressStore((s) => s.markVanityUsed)
  const markRestedToday = useProgressStore((s) => s.markRestedToday)
  const addVisitedToday = useProgressStore((s) => s.addVisitedToday)

  // Roster
  const owned = useRosterStore((s) => s.owned)
  const relationships = useRosterStore((s) => s.relationships)

  const { trigger: triggerReset, needsReset } = useDailyReset()

  // Gig store
  const careerTier = useGigStore((s) => s.careerTier)
  const activeGig = useGigStore((s) => s.activeGig)
  const idleUncollected = useGigStore((s) => s.idle.uncollected)
  const collectIdle = useGigStore((s) => s.collectIdle)
  const tickIdleAccrual = useGigStore((s) => s.tickIdleAccrual)
  const tickFascinationDecay = useGigStore((s) => s.tickFascinationDecay)

  const tierColor = getCareerTierConfig(careerTier).color

  // ── Daily reset on mount ──────────────────────────────────────────────────

  useEffect(() => {
    // Tick idle earnings on every load
    tickIdleAccrual(careerTier)

    if (!needsReset) return
    const result = triggerReset()
    if (result) {
      setToastResult(result)
      setToastVisible(true)
    }
    // Decay fascination on new day
    tickFascinationDecay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleIdleCollect() {
    const earned = collectIdle(careerTier)
    if (earned > 0) grantCurrency('spotlight', earned, 'idle_collect')
  }

  const handleEndDay = useCallback(() => {
    setShowEndDayModal(false)
    const result = triggerReset(true)
    if (result) {
      setToastResult(result)
      setToastVisible(true)
    }
  }, [triggerReset])

  // ── Scandal twist ─────────────────────────────────────────────────────────

  const currentTwist = useMemo(() => {
    const threshold = pendingScandalEvents[0] ?? null
    if (!threshold) return null
    return selectTwist(threshold, firedTwists)
  }, [pendingScandalEvents, firedTwists])

  const handleTwistResolve = useCallback(
    (twistId: string, choiceId?: string) => {
      if (!currentTwist) return

      let finalPenalty: Partial<Record<string, number>>
      if (choiceId && currentTwist.choices) {
        const choice = currentTwist.choices.find((c) => c.id === choiceId)
        finalPenalty = choice
          ? choice.statDeltas
          : applySourcePerk(currentTwist.source, currentTwist.baseStatPenalty)
      } else {
        finalPenalty = applySourcePerk(currentTwist.source, currentTwist.baseStatPenalty)
      }

      const deltas: StatDelta[] = Object.entries(finalPenalty)
        .filter(([key, delta]) => VALID_STAT_KEYS.has(key) && delta !== 0)
        .map(([stat, delta]) => ({ stat: stat as StatKey, delta: delta! }))

      if (deltas.length > 0) applyStatDeltas(deltas)
      addFiredTwist(twistId)
      dismissScandalEvent()
    },
    [currentTwist, applyStatDeltas, addFiredTwist, dismissScandalEvent]
  )

  // ── Apartment zone handlers ───────────────────────────────────────────────

  const handleZoneTap = useCallback(
    (zone: ApartmentZone) => {
      switch (zone) {
        case 'wardrobe':
          setShowWardrobe(true)
          break
        case 'bed':
          handleRest()
          break
        case 'vanity':
          handleVanity()
          break
        case 'kitchen':
          setShowKitchenPicker(true)
          break
        case 'livingRoom':
          setShowLivingRoomPicker(true)
          break
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [energy, vanityUsedToday, restedToday]
  )

  function handleRest() {
    if (restedToday) return
    setEnergy(Math.min(100, energy + 40))
    markRestedToday()

    // 25% dream trigger — pick first owned char with affection >= 40 that has a dream scene
    const dreamCandidates = owned.filter((c) => {
      const rel = relationships[c.id]
      return rel && rel.affection >= 40 && DREAM_SCENES[c.id]
    })
    if (dreamCandidates.length > 0 && Math.random() < 0.25) {
      const char = dreamCandidates[Math.floor(Math.random() * dreamCandidates.length)]
      setActiveDreamScene(DREAM_SCENES[char.id])
    }
  }

  function handleVanity() {
    if (vanityUsedToday || energy < 10) return
    setEnergy(energy - 10)
    applyStatDeltas([{ stat: 'looks', delta: 5 }])
    markVanityUsed()
  }

  function handleKitchenMeal(meal: MealOption) {
    if (meal.cost > 0) {
      const result = spendCurrency('spotlight', meal.cost, 'kitchen_meal')
      if (!result.success) return
    }
    setEnergy(Math.min(100, energy + meal.energyGain))
    if (meal.statDelta) {
      applyStatDeltas([{ stat: meal.statDelta.stat, delta: meal.statDelta.delta }])
    }
    setShowKitchenPicker(false)
  }

  function handleVisit(characterId: string) {
    const scene = VISIT_SCENES[characterId]
    if (!scene) return
    addVisitedToday(characterId)
    setShowLivingRoomPicker(false)
    setActiveVisitScene(scene)
  }

  function handleApartmentUpgrade() {
    if (!upgradeInfo?.canAfford) return
    spendCurrency('spotlight', upgradeInfo.cost, 'apartment_upgrade')
    upgradeApartment()
  }

  // ── Upgrade info ──────────────────────────────────────────────────────────

  const upgradeInfo = useMemo(() => {
    if (apartmentLevel >= 5) return null
    const cost = APARTMENT_TIERS[apartmentLevel - 1].upgradeSpotlight!
    return { cost, canAfford: balance.spotlight >= cost }
  }, [apartmentLevel, balance.spotlight])

  // ── Living room visitors ──────────────────────────────────────────────────

  const availableVisitors = useMemo(() => {
    const visitSlots = getVisitSlots(apartmentLevel)
    return owned.filter((c) => {
      const rel = relationships[c.id]
      if (!rel || rel.affection < 25) return false
      if (visitedToday.includes(c.id)) return false
      if (!VISIT_SCENES[c.id]) return false
      // Amy bypasses slot limit; others need an open slot
      if (c.id === 'amy-crawford') return true
      return visitedToday.length < visitSlots
    })
  }, [owned, relationships, visitedToday, apartmentLevel])

  // ── Decay for end-day modal ───────────────────────────────────────────────

  const hasActiveRomance = Object.values(relationships).some((r) => r.affection >= 60)
  const decayModifiers = {
    apartmentTier: apartmentLevel,
    hasActiveRomance,
    scandal: stats.scandal,
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-svh flex flex-col bg-slate-950 relative">
      {/* ── Full-screen overlays ── */}
      <AnimatePresence>
        {showWardrobe && (
          <Wardrobe onClose={() => setShowWardrobe(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeVisitScene && (
          <ScenePlayer
            sceneData={activeVisitScene}
            onComplete={() => setActiveVisitScene(null)}
            onClose={() => setActiveVisitScene(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeDreamScene && (
          <ScenePlayer
            sceneData={activeDreamScene}
            onComplete={() => setActiveDreamScene(null)}
            onClose={() => setActiveDreamScene(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Modal overlays ── */}
      <BreakingNews
        twist={currentTwist}
        scandalLevel={stats.scandal}
        stackCount={Math.max(0, pendingScandalEvents.length - 1)}
        onResolve={handleTwistResolve}
      />
      <EndDayModal
        open={showEndDayModal}
        currentDay={currentDay}
        loginStreak={loginStreak}
        currentChapter={currentChapter}
        decayModifiers={decayModifiers}
        energy={energy}
        onConfirm={handleEndDay}
        onCancel={() => setShowEndDayModal(false)}
      />
      <DailyToast
        visible={toastVisible}
        dayNumber={toastResult?.newDayNumber ?? currentDay}
        spotlightGranted={toastResult?.spotlightGranted ?? 0}
        loginStreak={toastResult?.newLoginStreak ?? loginStreak}
        onDismiss={() => setToastVisible(false)}
      />

      {/* ── Kitchen meal picker ── */}
      <AnimatePresence>
        {showKitchenPicker && (
          <KitchenPicker
            meals={MEAL_OPTIONS}
            balance={balance.spotlight}
            energy={energy}
            onSelect={handleKitchenMeal}
            onClose={() => setShowKitchenPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Living room visitor picker ── */}
      <AnimatePresence>
        {showLivingRoomPicker && (
          <LivingRoomPicker
            visitors={availableVisitors}
            onVisit={handleVisit}
            onClose={() => setShowLivingRoomPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-slate-950/92 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-white/35">
              Ch.{currentChapter}&nbsp;·&nbsp;Day {currentDay}
              {loginStreak > 1 && (
                <span className="ml-1.5 text-orange-400">{loginStreak}🔥</span>
              )}
            </p>
            <h1 className="text-sm font-semibold text-white leading-tight">{playerName}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span>✨ <span className="font-mono font-semibold text-white">{balance.spotlight}</span></span>
            <span>💎 <span className="font-mono font-semibold text-white">{balance.prestige}</span></span>
          </div>
        </div>
        <div className="h-0.5 bg-white/8">
          <motion.div
            className="h-full bg-blue-400"
            animate={{ width: `${energy}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Character event notifications */}
        <AnimatePresence>
          {pendingCharacterEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-3 space-y-2"
            >
              {pendingCharacterEvents.slice(0, 3).map((event) => (
                <CharacterEventCard
                  key={event.id}
                  event={event}
                  onDismiss={dismissPendingEvent}
                />
              ))}
              {pendingCharacterEvents.length > 3 && (
                <p className="text-xs text-white/30 text-center">
                  +{pendingCharacterEvents.length - 3} more notifications
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-4 pt-4 space-y-4">
          {/* Daily reward card */}
          <DailyReward currentDay={currentDay} loginStreak={loginStreak} />

          {/* Apartment */}
          <Apartment
            tier={apartmentLevel}
            playerName={playerName}
            energy={energy}
            mood={mood}
            onZoneTap={handleZoneTap}
            onUpgrade={handleApartmentUpgrade}
            upgradeInfo={upgradeInfo}
            vanityUsedToday={vanityUsedToday}
            restedToday={restedToday}
          />

          {/* Stats */}
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Stats
            </h2>
            <div className="bg-[hsl(var(--card))] rounded-xl p-4 border border-white/8">
              <StatsPanel stats={stats} />
            </div>
          </section>

          {/* Active gig + idle collect */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Career
              </h2>
              {idleUncollected > 0 && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleIdleCollect}
                  className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full"
                >
                  Collect ✨{idleUncollected}
                </motion.button>
              )}
            </div>
            <ActiveGigBar
              activeGig={activeGig}
              currentDay={currentDay}
              tierColor={tierColor}
              onGigsScreenTap={onGoToGigs}
              onComplete={() => onGoToGigs()}
            />
          </section>

          {/* Quick actions */}
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Today
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction emoji="🎬" label="Gigs" sub="Work your career" onClick={onGoToGigs} />
              <QuickAction emoji="📈" label="Career" sub="Progress &amp; earnings" onClick={onGoToCareer} />
              <QuickAction emoji="🎴" label="Gacha Pull" sub="Find your cast" onClick={onGoToGacha} />
              <QuickAction emoji="💬" label="Storylines" sub="Chase your route" onClick={onGoToRoutes} />
              <QuickAction emoji="🛍️" label="Shop" sub="Spend your shine" onClick={onGoToShop} />
              <QuickAction emoji="👤" label="Profile" sub="Your story so far" onClick={onGoToProfile} />
              <QuickAction emoji="⭐" label="Collection" sub="Your cast & bonds" onClick={onGoToCollection} />
            </div>
          </section>

          {/* End Day */}
          <EndDayButton
            energy={energy}
            currentDay={currentDay}
            onClick={() => setShowEndDayModal(true)}
          />
        </div>
      </div>

      {/* ── Press ticker ── */}
      <PressTicker headlines={pressHistory} />
    </div>
  )
}

// ─── Kitchen Picker ───────────────────────────────────────────────────────────

function KitchenPicker({
  meals,
  balance,
  energy,
  onSelect,
  onClose,
}: {
  meals: MealOption[]
  balance: number
  energy: number
  onSelect: (meal: MealOption) => void
  onClose: () => void
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[65] bg-slate-900 border-t border-white/10 rounded-t-2xl px-4 py-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Kitchen</h3>
          <button onClick={onClose} className="text-white/35 text-sm">✕</button>
        </div>
        <div className="space-y-2">
          {meals.map((meal) => {
            const canAfford = meal.cost === 0 || balance >= meal.cost
            const energyFull = energy >= 100
            return (
              <motion.button
                key={meal.id}
                whileTap={canAfford && !energyFull ? { scale: 0.98 } : undefined}
                onClick={() => canAfford && !energyFull && onSelect(meal)}
                disabled={!canAfford || energyFull}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 border transition-all ${
                  canAfford && !energyFull
                    ? 'bg-white/6 border-white/10 hover:bg-white/10'
                    : 'bg-white/3 border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl shrink-0">{meal.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-white">{meal.name}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    +{meal.energyGain}⚡
                    {meal.statDelta && ` · +${meal.statDelta.delta} ${meal.statDelta.stat}`}
                  </p>
                </div>
                <span className="text-[11px] text-yellow-400/70 font-mono shrink-0">
                  {meal.cost > 0 ? `✨${meal.cost}` : 'Free'}
                </span>
              </motion.button>
            )
          })}
        </div>
        <p className="text-center text-[10px] text-white/20 mt-3">Energy: {energy}/100</p>
      </motion.div>
    </>
  )
}

// ─── Living Room Picker ───────────────────────────────────────────────────────

function LivingRoomPicker({
  visitors,
  onVisit,
  onClose,
}: {
  visitors: ReturnType<typeof ALL_CHARACTERS.filter>
  onVisit: (characterId: string) => void
  onClose: () => void
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[65] bg-slate-900 border-t border-white/10 rounded-t-2xl px-4 py-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Invite Someone Over</h3>
          <button onClick={onClose} className="text-white/35 text-sm">✕</button>
        </div>

        {visitors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-2xl mb-2">🛋️</p>
            <p className="text-xs text-white/30">No one available today.</p>
            <p className="text-[10px] text-white/20 mt-1">
              Build relationships to unlock visits.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visitors.map((char) => (
              <motion.button
                key={char.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onVisit(char.id)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 bg-white/6 border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl shrink-0">{char.portraitPlaceholder}</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-white">{char.name}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{char.role}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: char.accentColor,
                    backgroundColor: `${char.accentColor}20`,
                  }}
                >
                  Visit
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </>
  )
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({
  emoji, label, sub, onClick,
}: {
  emoji: string; label: string; sub: string; onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-xl bg-[hsl(var(--card))] border border-white/8 p-4 text-left hover:border-pink-500/30 transition-colors"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-white/40">{sub}</p>
    </motion.button>
  )
}

// ─── End Day Button ───────────────────────────────────────────────────────────

function EndDayButton({
  energy, currentDay, onClick,
}: {
  energy: number; currentDay: number; onClick: () => void
}) {
  const exhausted = energy <= 20
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full rounded-2xl py-4 px-5 text-sm font-semibold text-white
        border transition-all duration-200 flex items-center justify-between
        ${exhausted
          ? 'bg-indigo-900/50 border-indigo-500/40 shadow-indigo-500/10 shadow-lg'
          : 'bg-white/5 border-white/10 hover:bg-white/8'
        }
      `}
    >
      <div className="text-left">
        <span className="block">{exhausted ? 'You need to rest.' : 'End Day'}</span>
        <span className="text-xs text-white/40 font-normal mt-0.5 block">
          Day {currentDay} → Day {currentDay + 1}
        </span>
      </div>
      <span className="text-xl">{exhausted ? '😴' : '🌙'}</span>
    </motion.button>
  )
}
