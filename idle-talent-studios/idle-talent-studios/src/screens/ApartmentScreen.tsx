import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProgressStore } from '@/store/progressStore'
import { useRosterStore } from '@/store/rosterStore'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { useDailyReset } from '@/hooks/useDailyReset'
import { Wardrobe } from '@/components/Wardrobe'
import { ScenePlayer } from '@/components/ScenePlayer'
import { cn } from '@/lib/utils'
import {
  APARTMENT_TIERS,
  ROOM_DEFINITIONS,
  ZONE_CONFIGS,
  MEAL_OPTIONS,
  getApartmentTierConfig,
  getActiveRoomZones,
  getVisitSlots,
} from '@/systems/wardrobeSystem'
import type { ApartmentZone, MealOption, RoomDefinition } from '@/systems/wardrobeSystem'
import { ALL_CHARACTERS } from '@/data/characters'

// ─── Visit scene imports ──────────────────────────────────────────────────────

import amyVisitScene from '@/data/scenes/visits/amy_visit_01.json'
import marcusVisitScene from '@/data/scenes/visits/marcus_visit_01.json'
import olivierVisitScene from '@/data/scenes/visits/olivier_visit_01.json'
import remyVisitScene from '@/data/scenes/visits/remy_visit_01.json'
import dexVisitScene from '@/data/scenes/visits/dex_visit_01.json'
import sunnyVisitScene from '@/data/scenes/visits/sunny_visit_01.json'
import celesteVisitScene from '@/data/scenes/visits/celeste_visit_01.json'
import driverVisitScene from '@/data/scenes/visits/driver_visit_01.json'
import dreamAmyScene from '@/data/scenes/rest/dream_amy.json'

const VISIT_SCENES: Record<string, object> = {
  'amy-crawford': amyVisitScene,
  'marcus-vane': marcusVisitScene,
  'olivier-sainte-claire': olivierVisitScene,
  'remy-ashford': remyVisitScene,
  'dex-calloway': dexVisitScene,
  'sunny-park': sunnyVisitScene,
  'celeste-voss': celesteVisitScene,
  'the-driver': driverVisitScene,
}

const DREAM_SCENES: Record<string, object> = {
  'amy-crawford': dreamAmyScene,
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApartmentScreenProps {
  onBack: () => void
}

// ─── ApartmentScreen ─────────────────────────────────────────────────────────

export function ApartmentScreen({ onBack }: ApartmentScreenProps) {
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0)
  const [showUpgradeSheet, setShowUpgradeSheet] = useState(false)
  const [activeZone, setActiveZone] = useState<ApartmentZone | null>(null)
  const [showWardrobe, setShowWardrobe] = useState(false)
  const [activeScene, setActiveScene] = useState<object | null>(null)
  const [showKitchenPicker, setShowKitchenPicker] = useState(false)
  const [showVisitorPicker, setShowVisitorPicker] = useState(false)
  const [upgradeConfetti, setUpgradeConfetti] = useState(false)

  // Stores
  const playerName = usePlayerStore((s) => s.playerName)
  const energy = usePlayerStore((s) => s.energy)
  const setEnergy = usePlayerStore((s) => s.setEnergy)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)

  const balance = useCurrencyStore((s) => s.balance)
  const spendCurrency = useCurrencyStore((s) => s.spendCurrency)

  const tier = useProgressStore((s) => s.apartmentLevel)
  const upgradeApartment = useProgressStore((s) => s.upgradeApartment)
  const vanityUsedToday = useProgressStore((s) => s.vanityUsedToday)
  const restedToday = useProgressStore((s) => s.restedToday)
  const kitchenUsedToday = useProgressStore((s) => s.kitchenUsedToday)
  const dayProgress = useProgressStore((s) => s.dayProgress)
  const visitedToday = useProgressStore((s) => s.visitedToday)
  const markVanityUsed = useProgressStore((s) => s.markVanityUsed)
  const markRestedToday = useProgressStore((s) => s.markRestedToday)
  const markKitchenUsed = useProgressStore((s) => s.markKitchenUsed)
  const setDayProgress = useProgressStore((s) => s.setDayProgress)
  const addVisitedToday = useProgressStore((s) => s.addVisitedToday)

  const owned = useRosterStore((s) => s.owned)
  const relationships = useRosterStore((s) => s.relationships)

  const getDayBonuses = useWardrobeStore((s) => s.getDayBonuses)

  const { trigger: triggerReset } = useDailyReset()

  // ── Computed ────────────────────────────────────────────────────────────────

  const tierConfig = getApartmentTierConfig(tier)
  const activeRooms = useMemo(
    () => ROOM_DEFINITIONS.filter((r) => r.unlocksAtTier <= tier),
    [tier]
  )
  const safeRoomIdx = Math.min(currentRoomIdx, activeRooms.length - 1)
  const currentRoom = activeRooms[safeRoomIdx]

  const upgradeInfo = useMemo(() => {
    if (tier >= 5) return null
    const nextConfig = APARTMENT_TIERS[tier] // 0-indexed, tier is 1-indexed
    const cost = nextConfig.upgradeSpotlight!
    return { cost, canAfford: balance.spotlight >= cost, nextName: nextConfig.name }
  }, [tier, balance.spotlight])

  const availableVisitors = useMemo(() => {
    const slots = getVisitSlots(tier)
    return owned.filter((c) => {
      const rel = relationships[c.id]
      if (!rel || rel.affection < 25) return false
      if (visitedToday.includes(c.id)) return false
      if (!VISIT_SCENES[c.id]) return false
      if (c.id === 'amy-crawford') return true
      return visitedToday.filter((id) => id !== 'amy-crawford').length < slots
    })
  }, [owned, relationships, visitedToday, tier])

  // ── Room swipe ──────────────────────────────────────────────────────────────

  const ROOM_W = typeof window !== 'undefined' ? window.innerWidth : 390
  const x = useMotionValue(0)

  function snapTo(idx: number) {
    const target = Math.min(Math.max(0, idx), activeRooms.length - 1)
    animate(x, -target * ROOM_W, { type: 'spring', stiffness: 320, damping: 32 })
    setCurrentRoomIdx(target)
  }

  // ── Zone handlers ───────────────────────────────────────────────────────────

  const handleZoneTap = useCallback(
    (zone: ApartmentZone) => {
      switch (zone) {
        case 'wardrobe':
          setShowWardrobe(true)
          break
        case 'bed':
          setActiveZone('bed')
          break
        case 'mirror':
          setActiveZone('mirror')
          break
        case 'vanity':
          setActiveZone('vanity')
          break
        case 'livingRoom':
          setShowVisitorPicker(true)
          break
        case 'kitchen':
          setShowKitchenPicker(true)
          break
        case 'rooftop':
          setActiveZone('rooftop')
          break
        case 'private_screening_room':
          setActiveZone('private_screening_room')
          break
      }
    },
    []
  )

  function handleRest() {
    if (restedToday) return
    setEnergy(Math.min(100, energy + 40))
    markRestedToday()
    setActiveZone(null)

    // Half-day advance
    const newProgress = dayProgress + 0.5
    if (newProgress >= 1.0) {
      triggerReset(true)
      setDayProgress(0)
    } else {
      setDayProgress(newProgress)
    }

    // Dream scene: 15% chance if any char affection >= 50
    const candidates = owned.filter((c) => {
      const rel = relationships[c.id]
      return rel && rel.affection >= 50 && DREAM_SCENES[c.id]
    })
    if (candidates.length > 0 && Math.random() < 0.15) {
      const char = candidates[Math.floor(Math.random() * candidates.length)]
      setActiveScene(DREAM_SCENES[char.id])
    }
  }

  function handleMirror() {
    applyStatDeltas([{ stat: 'looks', delta: 4 }])
    setActiveZone(null)
    // Mirror is one-time per session; no daily flag needed — it's a minor perk
  }

  function handleVanity() {
    if (vanityUsedToday || energy < 10) return
    setEnergy(energy - 10)
    applyStatDeltas([{ stat: 'looks', delta: 8 }])
    markVanityUsed()
    setActiveZone(null)
  }

  function handleKitchenMeal(meal: MealOption) {
    if (kitchenUsedToday) return
    if (meal.cost > 0) {
      const result = spendCurrency('spotlight', meal.cost, 'kitchen_meal')
      if (!result.success) return
    }
    setEnergy(Math.min(100, energy + meal.energyGain))
    if (meal.statDelta) {
      applyStatDeltas([{ stat: meal.statDelta.stat, delta: meal.statDelta.delta }])
    }
    markKitchenUsed()
    setShowKitchenPicker(false)
  }

  function handleVisit(characterId: string) {
    const scene = VISIT_SCENES[characterId]
    if (!scene) return
    addVisitedToday(characterId)
    setShowVisitorPicker(false)
    setActiveScene(scene)
  }

  function handleRooftop() {
    applyStatDeltas([
      { stat: 'scandal', delta: -3 },
      { stat: 'confidence', delta: 5 },
    ])
    setActiveZone(null)
  }

  function handleScreeningRoom() {
    if (energy < 15) return
    setEnergy(energy - 15)
    applyStatDeltas([{ stat: 'wisdom', delta: 5 }])
    setActiveZone(null)
  }

  function handleUpgradeConfirm() {
    if (!upgradeInfo?.canAfford) return
    spendCurrency('spotlight', upgradeInfo.cost, 'apartment_upgrade')
    upgradeApartment()
    setShowUpgradeSheet(false)
    setCurrentRoomIdx(0)
    setUpgradeConfetti(true)
    setTimeout(() => setUpgradeConfetti(false), 2000)
  }

  // ── Active wardrobe day bonuses ──────────────────────────────────────────────
  const dayBonuses = getDayBonuses()

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">

      {/* ── Full-screen overlays ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showWardrobe && (
          <Wardrobe onClose={() => setShowWardrobe(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeScene && (
          <ScenePlayer
            sceneData={activeScene}
            onComplete={() => setActiveScene(null)}
            onClose={() => setActiveScene(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Upgrade confetti ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {upgradeConfetti && <ConfettiBurst />}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors"
        >
          ← Home
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs font-bold text-white">{currentRoom?.name ?? ''}</p>
          <p className="text-[10px] text-white/30 mt-0.5">{playerName}'s Place</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpgradeSheet(true)}
          className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border"
          style={{
            color: tierConfig.ambientColor,
            borderColor: `${tierConfig.ambientColor}50`,
            backgroundColor: `${tierConfig.ambientColor}15`,
          }}
        >
          {tierConfig.emoji} T{tier}
        </motion.button>
      </div>

      {/* ── Room swiper ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          style={{ x, width: `${activeRooms.length * 100}vw` }}
          drag="x"
          dragConstraints={{
            left: -(activeRooms.length - 1) * ROOM_W,
            right: 0,
          }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            const threshold = ROOM_W * 0.28
            if (info.offset.x < -threshold && safeRoomIdx < activeRooms.length - 1) {
              snapTo(safeRoomIdx + 1)
            } else if (info.offset.x > threshold && safeRoomIdx > 0) {
              snapTo(safeRoomIdx - 1)
            } else {
              snapTo(safeRoomIdx)
            }
          }}
          className="flex h-full"
        >
          {activeRooms.map((room, i) => (
            <RoomView
              key={room.id}
              room={room}
              tier={tier}
              tierConfig={tierConfig}
              vanityUsedToday={vanityUsedToday}
              restedToday={restedToday}
              kitchenUsedToday={kitchenUsedToday}
              energy={energy}
              onZoneTap={handleZoneTap}
              roomWidth={ROOM_W}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Room nav dots ────────────────────────────────────────────────────── */}
      {activeRooms.length > 1 && (
        <div className="flex justify-center gap-1.5 py-3 shrink-0">
          {activeRooms.map((room, i) => (
            <motion.button
              key={room.id}
              onClick={() => snapTo(i)}
              animate={{ scale: i === safeRoomIdx ? 1 : 0.75, opacity: i === safeRoomIdx ? 1 : 0.35 }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          ))}
        </div>
      )}

      {/* ── Zone action sheet ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeZone && (
          <ZoneActionSheet
            zone={activeZone}
            energy={energy}
            vanityUsedToday={vanityUsedToday}
            restedToday={restedToday}
            dayProgress={dayProgress}
            onRest={handleRest}
            onMirror={handleMirror}
            onVanity={handleVanity}
            onRooftop={handleRooftop}
            onScreeningRoom={handleScreeningRoom}
            onClose={() => setActiveZone(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Kitchen picker ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showKitchenPicker && (
          <KitchenPicker
            meals={MEAL_OPTIONS.filter(
              (m) => !m.unlocksAtTier || m.unlocksAtTier <= tier
            )}
            balance={balance.spotlight}
            energy={energy}
            usedToday={kitchenUsedToday}
            onSelect={handleKitchenMeal}
            onClose={() => setShowKitchenPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Visitor picker ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showVisitorPicker && (
          <VisitorPicker
            visitors={availableVisitors}
            onVisit={handleVisit}
            onClose={() => setShowVisitorPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Upgrade sheet ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUpgradeSheet && (
          <UpgradeSheet
            currentTier={tier}
            tierConfig={tierConfig}
            upgradeInfo={upgradeInfo}
            onClose={() => setShowUpgradeSheet(false)}
            onConfirm={handleUpgradeConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Wardrobe day bonus badge ──────────────────────────────────────────── */}
      {(dayBonuses.looksBonus > 0 || dayBonuses.confBonus > 0) && (
        <div className="absolute bottom-14 right-4 z-10 bg-slate-900/90 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-white/50">
          {dayBonuses.looksBonus > 0 && <span>+{dayBonuses.looksBonus} 👁 </span>}
          {dayBonuses.confBonus > 0 && <span>+{dayBonuses.confBonus} ✨</span>}
        </div>
      )}
    </div>
  )
}

// ─── RoomView ────────────────────────────────────────────────────────────────

function RoomView({
  room,
  tier,
  tierConfig,
  vanityUsedToday,
  restedToday,
  kitchenUsedToday,
  energy,
  onZoneTap,
  roomWidth,
}: {
  room: RoomDefinition
  tier: number
  tierConfig: ReturnType<typeof getApartmentTierConfig>
  vanityUsedToday: boolean
  restedToday: boolean
  kitchenUsedToday: boolean
  energy: number
  onZoneTap: (zone: ApartmentZone) => void
  roomWidth: number
}) {
  const zones = getActiveRoomZones(room, tier)
  const isTier5 = tier >= 5

  return (
    <div
      className="relative h-full flex-shrink-0 flex flex-col"
      style={{ width: roomWidth }}
    >
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 70% at 50% 0%, ${tierConfig.ambientColor}30 0%, transparent 65%)`,
        }}
      />

      {/* Room emoji watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[120px] opacity-[0.04]"
          style={{ filter: 'grayscale(0.3)' }}
        >
          {room.emoji}
        </span>
      </div>

      {/* Tier 5 shimmer */}
      {isTier5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(190,24,93,0.06) 50%, transparent 70%)',
            backgroundSize: '300% 100%',
            animation: 'apt-shimmer 5s linear infinite',
          }}
        />
      )}

      {/* Zones */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-6 px-5">
        <div
          className={cn(
            'grid gap-3',
            zones.length === 1 ? 'grid-cols-1' :
            zones.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 sm:grid-cols-3'
          )}
        >
          {zones.map((zoneId) => {
            const config = ZONE_CONFIGS.find((z) => z.id === zoneId)!
            const cooledDown =
              (zoneId === 'vanity' && vanityUsedToday) ||
              (zoneId === 'bed' && restedToday) ||
              (zoneId === 'kitchen' && kitchenUsedToday)
            const disabled =
              (zoneId === 'vanity' && energy < 10) ||
              (zoneId === 'private_screening_room' && energy < 15)

            return (
              <ZoneTile
                key={zoneId}
                config={config}
                accentColor={tierConfig.ambientColor}
                cooledDown={cooledDown}
                disabled={disabled && !cooledDown}
                onTap={() => !cooledDown && !disabled && onZoneTap(zoneId)}
              />
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes apt-shimmer {
          0% { background-position: 300% center; }
          100% { background-position: -300% center; }
        }
      `}</style>
    </div>
  )
}

// ─── ZoneTile ─────────────────────────────────────────────────────────────────

function ZoneTile({
  config,
  accentColor,
  cooledDown,
  disabled,
  onTap,
}: {
  config: (typeof ZONE_CONFIGS)[number]
  accentColor: string
  cooledDown: boolean
  disabled: boolean
  onTap: () => void
}) {
  return (
    <motion.button
      whileTap={!cooledDown && !disabled ? { scale: 0.96 } : undefined}
      onClick={onTap}
      className={cn(
        'relative rounded-2xl py-4 px-4 flex flex-col items-center gap-2 border transition-all',
        cooledDown || disabled
          ? 'bg-white/3 border-white/6 opacity-40 cursor-not-allowed'
          : 'bg-white/6 border-white/12 hover:bg-white/10 active:bg-white/15'
      )}
    >
      {!cooledDown && !disabled && (
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ backgroundColor: `${accentColor}60` }}
        />
      )}
      <span className={cn('text-3xl', (cooledDown || disabled) && 'grayscale')}>
        {config.emoji}
      </span>
      <div className="text-center">
        <p className={cn('text-xs font-semibold', cooledDown || disabled ? 'text-white/30' : 'text-white/85')}>
          {config.label}
        </p>
        <p className="text-[10px] text-white/30 mt-0.5 leading-snug">
          {cooledDown ? 'Done for today' : config.description}
        </p>
        {!cooledDown && config.energyCost > 0 && (
          <p className="text-[9px] text-blue-400/60 font-mono mt-1">−{config.energyCost}⚡</p>
        )}
      </div>
      {cooledDown && (
        <span className="absolute top-2 right-2 text-[10px] text-white/20">✓</span>
      )}
    </motion.button>
  )
}

// ─── ZoneActionSheet ──────────────────────────────────────────────────────────

function ZoneActionSheet({
  zone,
  energy,
  vanityUsedToday,
  restedToday,
  dayProgress,
  onRest,
  onMirror,
  onVanity,
  onRooftop,
  onScreeningRoom,
  onClose,
}: {
  zone: ApartmentZone
  energy: number
  vanityUsedToday: boolean
  restedToday: boolean
  dayProgress: number
  onRest: () => void
  onMirror: () => void
  onVanity: () => void
  onRooftop: () => void
  onScreeningRoom: () => void
  onClose: () => void
}) {
  const info = ZONE_CONFIGS.find((z) => z.id === zone)!

  const actions: Record<ApartmentZone, { label: string; sub: string; disabled?: boolean; onClick: () => void }> = {
    bed: {
      label: 'Rest Up',
      sub: restedToday
        ? 'Already rested today'
        : `+40 Energy · +${(0.5 * 100).toFixed(0)}% day progress (${Math.round(dayProgress * 100)}% → ${Math.min(100, Math.round((dayProgress + 0.5) * 100))}%)`,
      disabled: restedToday,
      onClick: onRest,
    },
    mirror: {
      label: 'Quick Look',
      sub: '+4 Looks for the day · Free',
      onClick: onMirror,
    },
    vanity: {
      label: 'Get Ready',
      sub: vanityUsedToday
        ? 'Already used today'
        : energy < 10
        ? 'Not enough energy'
        : '+8 Looks for the day · −10⚡',
      disabled: vanityUsedToday || energy < 10,
      onClick: onVanity,
    },
    rooftop: {
      label: 'Take a Moment',
      sub: 'Scandal −3 · Confidence +5',
      onClick: onRooftop,
    },
    private_screening_room: {
      label: 'Screen Something',
      sub: energy < 15 ? 'Not enough energy' : 'Wisdom +5 · −15⚡',
      disabled: energy < 15,
      onClick: onScreeningRoom,
    },
    // remaining zones open other sheets — won't reach here
    wardrobe: { label: '', sub: '', onClick: () => {} },
    kitchen: { label: '', sub: '', onClick: () => {} },
    livingRoom: { label: '', sub: '', onClick: () => {} },
  }

  const action = actions[zone]

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
        className="fixed bottom-0 left-0 right-0 z-[65] bg-slate-900 border-t border-white/10 rounded-t-2xl px-5 py-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{info.emoji}</span>
          <div>
            <h3 className="text-sm font-bold text-white">{info.label}</h3>
            <p className="text-[11px] text-white/35 mt-0.5">{action.sub}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-white/30 text-sm">✕</button>
        </div>

        <motion.button
          whileTap={!action.disabled ? { scale: 0.98 } : undefined}
          onClick={() => { if (!action.disabled) { action.onClick(); onClose() } }}
          disabled={action.disabled}
          className={cn(
            'w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all',
            action.disabled
              ? 'bg-white/6 opacity-40 cursor-not-allowed'
              : 'bg-white/12 border border-white/15 hover:bg-white/18'
          )}
        >
          {action.label}
        </motion.button>
      </motion.div>
    </>
  )
}

// ─── KitchenPicker ────────────────────────────────────────────────────────────

function KitchenPicker({
  meals,
  balance,
  energy,
  usedToday,
  onSelect,
  onClose,
}: {
  meals: MealOption[]
  balance: number
  energy: number
  usedToday: boolean
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
          <div>
            <h3 className="text-sm font-bold text-white">Kitchen</h3>
            {usedToday && (
              <p className="text-[10px] text-orange-400/70 mt-0.5">Already cooked today</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/35 text-sm">✕</button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {meals.map((meal) => {
            const canAfford = meal.cost === 0 || balance >= meal.cost
            const blocked = usedToday || energy >= 100
            return (
              <motion.button
                key={meal.id}
                whileTap={canAfford && !blocked ? { scale: 0.98 } : undefined}
                onClick={() => canAfford && !blocked && onSelect(meal)}
                disabled={!canAfford || blocked}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl px-3 py-3 border transition-all',
                  canAfford && !blocked
                    ? 'bg-white/6 border-white/10 hover:bg-white/10'
                    : 'bg-white/3 border-white/5 opacity-40 cursor-not-allowed'
                )}
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

// ─── VisitorPicker ────────────────────────────────────────────────────────────

function VisitorPicker({
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
            <p className="text-xs text-white/30">No one available to visit today.</p>
            <p className="text-[10px] text-white/20 mt-1">Build relationships to unlock visits.</p>
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
                  style={{ color: char.accentColor, backgroundColor: `${char.accentColor}20` }}
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

// ─── UpgradeSheet ─────────────────────────────────────────────────────────────

function UpgradeSheet({
  currentTier,
  tierConfig,
  upgradeInfo,
  onClose,
  onConfirm,
}: {
  currentTier: number
  tierConfig: ReturnType<typeof getApartmentTierConfig>
  upgradeInfo: { cost: number; canAfford: boolean; nextName: string } | null
  onClose: () => void
  onConfirm: () => void
}) {
  const nextTierConfig = currentTier < 5 ? getApartmentTierConfig(currentTier + 1) : null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 z-[75] bg-slate-900 border-t border-white/10 rounded-t-2xl px-5 py-6"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Current</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{tierConfig.emoji}</span>
              <div>
                <p className="text-sm font-bold text-white">{tierConfig.name}</p>
                <p className="text-[10px] text-white/35">{tierConfig.description}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 text-sm">✕</button>
        </div>

        {upgradeInfo && nextTierConfig ? (
          <>
            <div className="rounded-xl bg-white/4 border border-white/8 p-4 mb-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Next upgrade</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{nextTierConfig.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-white">{nextTierConfig.name}</p>
                  <p className="text-[10px] text-white/35">{nextTierConfig.description}</p>
                </div>
              </div>
              <p className="text-[10px] text-yellow-400/70 font-mono">
                Cost: ✨{upgradeInfo.cost.toLocaleString()}
              </p>
              {!upgradeInfo.canAfford && (
                <p className="text-[10px] text-red-400/60 mt-1">Not enough Spotlight</p>
              )}
            </div>

            <motion.button
              whileTap={upgradeInfo.canAfford ? { scale: 0.98 } : undefined}
              onClick={upgradeInfo.canAfford ? onConfirm : undefined}
              disabled={!upgradeInfo.canAfford}
              className={cn(
                'w-full py-3.5 rounded-xl text-sm font-semibold text-white border transition-all',
                upgradeInfo.canAfford
                  ? 'border-white/20 bg-white/10 hover:bg-white/15'
                  : 'border-white/8 bg-white/4 opacity-40 cursor-not-allowed'
              )}
            >
              {upgradeInfo.canAfford
                ? `Upgrade · ✨${upgradeInfo.cost.toLocaleString()}`
                : `Need ✨${upgradeInfo.cost.toLocaleString()}`}
            </motion.button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">✨</p>
            <p className="text-sm text-white/50">You've reached the top.</p>
          </div>
        )}
      </motion.div>
    </>
  )
}

// ─── ConfettiBurst ────────────────────────────────────────────────────────────

const CONFETTI_EMOJIS = ['✨', '🎉', '💫', '⭐', '🌟', '💎']

function ConfettiBurst() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2, delay: 0.5 }}
    >
      {CONFETTI_EMOJIS.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i / CONFETTI_EMOJIS.length) * Math.PI * 2) * 120,
            y: Math.sin((i / CONFETTI_EMOJIS.length) * Math.PI * 2) * 120,
            scale: 1.5,
            opacity: 0,
          }}
          transition={{ duration: 0.9, delay: i * 0.04, ease: 'easeOut' }}
        >
          {emoji}
        </motion.span>
      ))}
    </motion.div>
  )
}
