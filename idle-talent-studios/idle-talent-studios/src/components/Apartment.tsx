import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ApartmentZone } from '@/systems/wardrobeSystem'
import { ZONE_CONFIGS, getApartmentTierConfig, APARTMENT_TIERS } from '@/systems/wardrobeSystem'

interface ApartmentProps {
  tier: number
  playerName: string
  energy: number
  mood: number
  onZoneTap: (zone: ApartmentZone) => void
  onUpgrade: () => void
  upgradeInfo: { cost: number; canAfford: boolean } | null
  vanityUsedToday?: boolean
  restedToday?: boolean
  visitingCharacter?: { name: string; sprite: string; accentColor?: string } | null
}

const ZONE_GRID_LAYOUT: ApartmentZone[][] = [
  ['livingRoom'],         // row 1 — full width
  ['bed', 'vanity'],      // row 2
  ['wardrobe', 'kitchen'], // row 3
]

export function Apartment({
  tier,
  playerName,
  energy,
  mood,
  onZoneTap,
  onUpgrade,
  upgradeInfo,
  vanityUsedToday = false,
  restedToday = false,
  visitingCharacter = null,
}: ApartmentProps) {
  const tierConfig = getApartmentTierConfig(tier)
  const isTier5 = tier >= 5

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10">
      {/* Ambient background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${tierConfig.ambientColor} 0%, transparent 70%)`,
        }}
      />

      {/* Visiting character sprite */}
      {visitingCharacter && (
        <motion.div
          className="absolute bottom-0 right-3 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <img
            src={visitingCharacter.sprite}
            alt={visitingCharacter.name}
            className="h-40 w-auto object-contain object-bottom drop-shadow-lg"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: visitingCharacter.accentColor
                ? `${visitingCharacter.accentColor}33`
                : 'rgba(255,255,255,0.1)',
              color: visitingCharacter.accentColor ?? 'rgba(255,255,255,0.6)',
              border: `1px solid ${visitingCharacter.accentColor ?? 'rgba(255,255,255,0.15)'}40`,
            }}
          >
            {visitingCharacter.name}
          </div>
        </motion.div>
      )}

      {/* Tier 5 shimmer */}
      {isTier5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(190,24,93,0.06) 50%, transparent 70%)',
            backgroundSize: '300% 100%',
            animation: 'apt-shimmer 4s linear infinite',
          }}
        />
      )}

      <div className="relative z-10 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{tierConfig.emoji}</span>
              <h2 className="text-sm font-bold text-white">{playerName}'s Place</h2>
            </div>
            <p className="text-xs text-white/35 mt-0.5">{tierConfig.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
              style={{
                color: tierConfig.ambientColor,
                borderColor: `${tierConfig.ambientColor}40`,
                backgroundColor: `${tierConfig.ambientColor}15`,
              }}
            >
              Tier {tier}
            </span>
          </div>
        </div>

        {/* Meters */}
        <div className="grid grid-cols-2 gap-2">
          <Meter label="Energy" value={energy} color="#60a5fa" />
          <Meter label="Mood" value={mood} color="#f472b6" />
        </div>

        {/* Zone grid */}
        <div className="space-y-2">
          {ZONE_GRID_LAYOUT.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={cn('grid gap-2', row.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}
            >
              {row.map((zoneId) => {
                const config = ZONE_CONFIGS.find((z) => z.id === zoneId)!
                const isLocked = tier < config.unlocksAtTier
                const isCooledDown =
                  (zoneId === 'vanity' && vanityUsedToday) ||
                  (zoneId === 'bed' && restedToday)

                return (
                  <ZoneButton
                    key={zoneId}
                    config={config}
                    tier={tier}
                    isLocked={isLocked}
                    isCooledDown={isCooledDown}
                    accentColor={tierConfig.ambientColor}
                    onTap={() => !isLocked && onZoneTap(zoneId)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Upgrade section */}
        {upgradeInfo && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            disabled={!upgradeInfo.canAfford}
            className={cn(
              'w-full py-2.5 rounded-xl text-xs font-semibold text-white border transition-all',
              upgradeInfo.canAfford
                ? 'border-white/20 bg-white/8 hover:bg-white/12'
                : 'border-white/8 bg-white/4 opacity-50 cursor-not-allowed'
            )}
          >
            {upgradeInfo.canAfford
              ? `Upgrade to ${APARTMENT_TIERS[tier].name} · ✨${upgradeInfo.cost.toLocaleString()}`
              : `Next: ${APARTMENT_TIERS[tier].name} · ✨${upgradeInfo.cost.toLocaleString()} needed`}
          </motion.button>
        )}
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

// ─── Zone Button ──────────────────────────────────────────────────────────────

function ZoneButton({
  config,
  tier,
  isLocked,
  isCooledDown,
  accentColor,
  onTap,
}: {
  config: (typeof ZONE_CONFIGS)[number]
  tier: number
  isLocked: boolean
  isCooledDown: boolean
  accentColor: string
  onTap: () => void
}) {
  return (
    <motion.button
      whileTap={!isLocked ? { scale: 0.96 } : undefined}
      onClick={onTap}
      className={cn(
        'relative rounded-xl py-3 px-3 text-left transition-all overflow-hidden',
        'border flex items-center gap-2.5',
        isLocked
          ? 'bg-white/3 border-white/6 opacity-50 cursor-not-allowed'
          : isCooledDown
          ? 'bg-white/4 border-white/8 cursor-default'
          : 'bg-white/6 border-white/10 hover:bg-white/10 active:bg-white/15'
      )}
    >
      <span className={cn('text-xl shrink-0', isLocked && 'grayscale')}>{config.emoji}</span>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-xs font-semibold leading-tight',
            isLocked ? 'text-white/30' : 'text-white/80'
          )}
        >
          {config.label}
        </p>
        <p className="text-[10px] text-white/30 mt-0.5 leading-tight">
          {isLocked
            ? `Unlocks at Tier ${config.unlocksAtTier}`
            : isCooledDown
            ? 'Done for today'
            : config.description}
        </p>
      </div>

      {/* Energy cost badge */}
      {!isLocked && !isCooledDown && config.energyCost > 0 && (
        <span className="shrink-0 text-[9px] text-blue-400/60 font-mono">
          −{config.energyCost}⚡
        </span>
      )}

      {/* Cooldown checkmark */}
      {isCooledDown && (
        <span className="shrink-0 text-[11px] text-white/25">✓</span>
      )}

      {/* Lock icon */}
      {isLocked && (
        <span className="shrink-0 text-[10px] text-white/20">🔒</span>
      )}

      {/* Subtle accent line */}
      {!isLocked && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
          style={{ backgroundColor: `${accentColor}50` }}
        />
      )}
    </motion.button>
  )
}

// ─── Meter ────────────────────────────────────────────────────────────────────

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/45">
        <span>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
