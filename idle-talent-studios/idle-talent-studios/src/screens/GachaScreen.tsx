import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Banner, GachaPullResult } from '@/engine/gachaEngine'
import { resolveMultiPull } from '@/engine/gachaEngine'
import { GachaPull } from '@/components/GachaPull'
import { ALL_CHARACTERS } from '@/data/characters'
import { getActiveBanners, getBannerTimeLeft } from '@/data/banners'
import { useRosterStore } from '@/store/rosterStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useGachaStore } from '@/store/gachaStore'
import { useToast } from '@/store/toastStore'
import { useCheckAchievements } from '@/hooks/useAchievements'
import type { Rarity } from '@/engine/gachaEngine'

interface GachaScreenProps {
  onBack: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BANNER_TYPE_CHIP: Record<string, { label: string; color: string }> = {
  standard: { label: 'Standard', color: '#64748b' },
  rate_up: { label: 'Rate Up', color: '#e879f9' },
  event: { label: 'Event', color: '#f59e0b' },
  beginner: { label: 'Beginner', color: '#10b981' },
}

const RARITY_COLOR: Record<Rarity, string> = {
  SSR: '#f59e0b',
  SR: '#a855f7',
  R: '#64748b',
}

function formatTimeLeft(ms: number): string {
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const mins = Math.floor((ms % 3_600_000) / 60_000)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

// ─── Banner card ──────────────────────────────────────────────────────────────

function BannerCard({
  banner,
  pityCount,
  selected,
  beginnerUsed,
  onSelect,
}: {
  banner: Banner
  pityCount: number
  selected: boolean
  beginnerUsed: boolean
  onSelect: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(() => getBannerTimeLeft(banner))
  const chip = BANNER_TYPE_CHIP[banner.type] ?? BANNER_TYPE_CHIP.standard
  const isLocked = banner.isOneTime && beginnerUsed

  useEffect(() => {
    if (!banner.endDate) return
    const interval = setInterval(() => {
      setTimeLeft(getBannerTimeLeft(banner))
    }, 60_000)
    return () => clearInterval(interval)
  }, [banner])

  // Portrait emoji for featured characters
  const featuredPortraits = banner.featuredCharacters
    .map((id) => ALL_CHARACTERS.find((c) => c.id === id)?.portraitPlaceholder)
    .filter(Boolean)
    .slice(0, 3)

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={!isLocked ? onSelect : undefined}
      className={cn(
        'relative flex-shrink-0 w-52 rounded-2xl overflow-hidden border-2 text-left transition-all',
        selected
          ? 'border-pink-400 shadow-pink-400/30 shadow-lg'
          : 'border-white/15',
        isLocked && 'opacity-50 cursor-not-allowed'
      )}
      style={{
        background: selected
          ? 'linear-gradient(145deg, #1e1235 0%, #0f0a1e 100%)'
          : 'linear-gradient(145deg, #0f172a 0%, #0a0f1a 100%)',
      }}
    >
      {/* Top art area */}
      <div
        className="h-28 flex items-center justify-center gap-2 relative overflow-hidden"
        style={{
          background:
            banner.type === 'rate_up'
              ? 'linear-gradient(135deg, #4a044e 0%, #1e0730 100%)'
              : banner.type === 'event'
              ? 'linear-gradient(135deg, #451a03 0%, #0a0f1a 100%)'
              : banner.type === 'beginner'
              ? 'linear-gradient(135deg, #052e16 0%, #0a0f1a 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #0a0f1a 100%)',
        }}
      >
        {featuredPortraits.length > 0 ? (
          featuredPortraits.map((p, i) => (
            <span key={i} className="text-4xl" style={{ opacity: i === 0 ? 1 : 0.6 }}>
              {p}
            </span>
          ))
        ) : (
          <span className="text-4xl opacity-40">🎴</span>
        )}

        {/* Countdown */}
        {timeLeft !== null && timeLeft > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-0.5">
            <p className="text-[10px] text-white/70">⏱ {formatTimeLeft(timeLeft)}</p>
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-xs text-white/60 font-semibold">Used</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-white leading-tight">{banner.name}</p>
          <span
            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ background: `${chip.color}33`, color: chip.color }}
          >
            {chip.label}
          </span>
        </div>

        {/* Pity bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] text-white/40">Pity</p>
            <p className="text-[10px] text-white/50 font-mono">{pityCount}/90</p>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (pityCount / 90) * 100)}%`,
                background: pityCount >= 75 ? '#f59e0b' : '#e879f9',
              }}
            />
          </div>
        </div>

        {/* Cost */}
        <p className="text-[10px] text-white/30">
          ✨{banner.pullCost.single.spotlight} · 💎{banner.pullCost.single.prestige} per pull
        </p>
      </div>

      {selected && (
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-pink-400 shadow-pink-400/60 shadow-sm" />
      )}
    </motion.button>
  )
}

// ─── Pull history ─────────────────────────────────────────────────────────────

type HistoryFilter = 'all' | 'SSR' | 'SR' | 'R'

function PullHistory({ onClose }: { onClose: () => void }) {
  const history = useGachaStore((s) => s.pullHistory)
  const [filter, setFilter] = useState<HistoryFilter>('all')

  const filtered = filter === 'all' ? history : history.filter((h) => h.rarity === filter)
  const pullsSinceSSR = history.findIndex((h) => h.rarity === 'SSR')
  const sinceSSR = pullsSinceSSR === -1 ? history.length : pullsSinceSSR

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <button onClick={onClose} className="text-white/40 hover:text-white text-xl">←</button>
        <h2 className="font-bold text-white text-base flex-1">Pull History</h2>
        <p className="text-xs text-white/40">SSR in ≤{90 - sinceSSR} pulls</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-5 py-3 border-b border-white/10">
        {(['all', 'SSR', 'SR', 'R'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold transition-colors',
              filter === f ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">No pulls yet.</div>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 border',
                entry.rarity === 'SSR'
                  ? 'bg-amber-950/30 border-amber-500/20'
                  : entry.rarity === 'SR'
                  ? 'bg-purple-950/30 border-purple-500/20'
                  : 'bg-white/5 border-white/10'
              )}
            >
              <span className="text-xl">{entry.characterPortrait}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{entry.characterName}</p>
                <p className="text-xs text-white/40">{entry.bannerId} · {entry.rarity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {entry.isNew && <p className="text-[10px] text-green-400">New!</p>}
                {entry.spotlightEarned > 0 && (
                  <p className="text-[10px] text-amber-400">+{entry.spotlightEarned} ✨</p>
                )}
                <p className="text-[10px] text-white/25">
                  {new Date(entry.pulledAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function GachaScreen({ onBack }: GachaScreenProps) {
  const activeBanners = getActiveBanners()
  const [selectedBannerId, setSelectedBannerId] = useState(
    activeBanners[0]?.id ?? 'standard'
  )
  const [pullResults, setPullResults] = useState<GachaPullResult[] | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const getOwnedIds = useRosterStore((s) => s.getOwnedIds)
  const addCharacter = useRosterStore((s) => s.addCharacter)
  const applyAffection = useRosterStore((s) => s.applyAffection)
  const updatePity = useRosterStore((s) => s.updatePity) // keep rosterStore pity in sync
  const spendCurrency = useCurrencyStore((s) => s.spendCurrency)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)
  const balance = useCurrencyStore((s) => s.balance)

  const getBannerPity = useGachaStore((s) => s.getBannerPity)
  const recordPulls = useGachaStore((s) => s.recordPulls)
  const addBondFragment = useGachaStore((s) => s.addBondFragment)
  const beginnerBannerUsed = useGachaStore((s) => s.beginnerBannerUsed)
  const markBeginnerBannerUsed = useGachaStore((s) => s.markBeginnerBannerUsed)
  const toast = useToast()
  const checkAchievement = useCheckAchievements()

  const selectedBanner = activeBanners.find((b) => b.id === selectedBannerId) ?? activeBanners[0]
  const bannerPity = getBannerPity(selectedBannerId)

  function canAffordPull(count: 1 | 10): boolean {
    if (!selectedBanner) return false
    const cost = count === 1 ? selectedBanner.pullCost.single : selectedBanner.pullCost.multi
    return (
      balance.prestige >= cost.prestige || balance.spotlight >= cost.spotlight
    )
  }

  function handlePull(count: 1 | 10) {
    if (!selectedBanner) return

    const cost = count === 1 ? selectedBanner.pullCost.single : selectedBanner.pullCost.multi
    let spendResult: { success: boolean; reason?: string }

    if (balance.prestige >= cost.prestige) {
      spendResult = spendCurrency('prestige', cost.prestige, `gacha-${count}x-${selectedBannerId}`)
    } else {
      spendResult = spendCurrency('spotlight', cost.spotlight, `gacha-${count}x-${selectedBannerId}`)
    }

    if (!spendResult.success) {
      alert(spendResult.reason ?? 'Not enough currency.')
      return
    }

    const isBeginnerMulti =
      selectedBanner.type === 'beginner' && count === 10 && !beginnerBannerUsed

    const { results, nextPity } = resolveMultiPull(
      ALL_CHARACTERS,
      getOwnedIds(),
      bannerPity,
      count,
      selectedBanner,
      isBeginnerMulti
    )

    if (isBeginnerMulti) markBeginnerBannerUsed()

    // Apply results
    let totalSpotlightGranted = 0
    for (const r of results) {
      if (r.isNew) {
        addCharacter(r.character)
        if (r.rarity === 'SSR') toast.newPull(r.character.name, 'SSR')
      }
      if (r.isDuplicate) {
        if (r.spotlightConverted > 0) {
          grantCurrency('spotlight', r.spotlightConverted, 'duplicate-conversion')
          totalSpotlightGranted += r.spotlightConverted
        }
        if (r.affectionDelta > 0)
          applyAffection(r.character.id, r.affectionDelta)
        if (r.bondFragmentGranted)
          addBondFragment(r.character.id)
      }
    }

    if (totalSpotlightGranted > 0) toast.spotlight(totalSpotlightGranted)

    // Sync stores
    recordPulls(selectedBannerId, results)
    updatePity(nextPity.totalPulls, nextPity.pullsSinceLastSSR)

    // Achievement checks
    const newTotalPulls = nextPity.totalPulls
    if (newTotalPulls >= 1) checkAchievement('first_pull')
    if (nextPity.pullsSinceLastSSR >= 89) checkAchievement('pity_survivor')
    const newOwnedIds = useRosterStore.getState().getOwnedIds()
    const allChars = ALL_CHARACTERS
    const ownedSSRCount = allChars.filter((c) => c.rarity === 'SSR' && newOwnedIds.has(c.id)).length
    if (ownedSSRCount >= 2) checkAchievement('double_feature')

    setPullResults(results)
  }

  return (
    <>
      <div className="min-h-svh bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 flex items-center gap-3 px-5 py-4">
          <button onClick={onBack} className="text-white/50 hover:text-white text-xl leading-none">←</button>
          <h1 className="text-base font-semibold text-white flex-1">Spotlight Stage</h1>
          <button
            onClick={() => setShowHistory(true)}
            className="text-xs text-white/40 hover:text-white px-2 py-1 rounded-lg border border-white/10"
          >
            History
          </button>
        </div>

        {/* Currency bar */}
        <div className="flex justify-center gap-8 py-3 border-b border-white/10 bg-slate-950/60">
          <CurrencyChip icon="✨" label="Spotlight" value={balance.spotlight} />
          <CurrencyChip icon="💎" label="Prestige" value={balance.prestige} />
        </div>

        <div className="flex-1 overflow-y-auto pb-8">
          {/* Banner cards — horizontal scroll */}
          <div className="overflow-x-auto py-5 px-4">
            <div className="flex gap-3 w-max">
              {activeBanners.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  pityCount={getBannerPity(banner.id).pullsSinceLastSSR}
                  selected={selectedBannerId === banner.id}
                  beginnerUsed={beginnerBannerUsed}
                  onSelect={() => setSelectedBannerId(banner.id)}
                />
              ))}
            </div>
          </div>

          {/* Selected banner details */}
          {selectedBanner && (
            <motion.div
              key={selectedBannerId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 space-y-4"
            >
              {/* Banner description */}
              <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{selectedBanner.name}</p>
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{
                      background: `${BANNER_TYPE_CHIP[selectedBanner.type]?.color ?? '#fff'}22`,
                      color: BANNER_TYPE_CHIP[selectedBanner.type]?.color ?? '#fff',
                    }}
                  >
                    {BANNER_TYPE_CHIP[selectedBanner.type]?.label}
                  </span>
                </div>

                {selectedBanner.type === 'rate_up' && selectedBanner.featuredCharacters.length > 0 && (
                  <p className="text-xs text-white/50">
                    Featured SSR: 50% rate · Featured SR: 75% rate
                  </p>
                )}
                {selectedBanner.type === 'beginner' && (
                  <p className="text-xs text-emerald-400">
                    {beginnerBannerUsed
                      ? 'Already used.'
                      : 'First 10× pull guarantees an SSR! One time only.'}
                  </p>
                )}
                {selectedBanner.type === 'event' && (
                  <p className="text-xs text-amber-400">
                    The Driver is only available on this banner.
                  </p>
                )}

                {/* Pity display */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">Pity counter</span>
                    <span className="text-white/60 font-mono">
                      {bannerPity.pullsSinceLastSSR} / 90
                      {bannerPity.pullsSinceLastSSR >= 75 && (
                        <span className="text-amber-400 ml-2">Soft pity!</span>
                      )}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (bannerPity.pullsSinceLastSSR / 90) * 100)}%`,
                        background:
                          bannerPity.pullsSinceLastSSR >= 75
                            ? 'linear-gradient(90deg, #f59e0b, #fb923c)'
                            : 'linear-gradient(90deg, #e879f9, #a855f7)',
                      }}
                      animate={{ width: `${Math.min(100, (bannerPity.pullsSinceLastSSR / 90) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Pull buttons */}
              <div className="space-y-3">
                <PullButton
                  label="Single Pull"
                  cost={selectedBanner.pullCost.single}
                  balance={balance}
                  onClick={() => handlePull(1)}
                  disabled={!canAffordPull(1)}
                />
                <PullButton
                  label={selectedBanner.type === 'beginner' && !beginnerBannerUsed ? '10× Pull (Guaranteed SSR!)' : '10× Pull'}
                  cost={selectedBanner.pullCost.multi}
                  balance={balance}
                  onClick={() => handlePull(10)}
                  disabled={!canAffordPull(10) || (selectedBanner.isOneTime && beginnerBannerUsed)}
                  highlight
                />
              </div>

              {/* Rates info */}
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-xs font-semibold text-white/50 mb-2">Drop Rates</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {(['SSR', 'SR', 'R'] as Rarity[]).map((r) => (
                    <div key={r}>
                      <p className="text-sm font-bold" style={{ color: RARITY_COLOR[r] }}>{r}</p>
                      <p className="text-xs text-white/40">
                        {r === 'SSR' ? '3%' : r === 'SR' ? '15%' : '82%'}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/25 mt-2 text-center">
                  SSR rate increases from pull 75+. Guaranteed SSR at 90.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pull animation overlay */}
      <AnimatePresence>
        {pullResults && (
          <GachaPull
            results={pullResults}
            onDismiss={() => setPullResults(null)}
          />
        )}
      </AnimatePresence>

      {/* History overlay */}
      <AnimatePresence>
        {showHistory && <PullHistory onClose={() => setShowHistory(false)} />}
      </AnimatePresence>
    </>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function CurrencyChip({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span>{icon}</span>
      <span className="font-mono font-bold text-white">{value.toLocaleString()}</span>
      <span className="text-white/30 text-xs">{label}</span>
    </div>
  )
}

function PullButton({
  label,
  cost,
  balance,
  onClick,
  disabled,
  highlight,
}: {
  label: string
  cost: { spotlight: number; prestige: number }
  balance: { spotlight: number; prestige: number }
  onClick: () => void
  disabled?: boolean
  highlight?: boolean
}) {
  const canUsePrestige = balance.prestige >= cost.prestige
  const canUseSpotlight = balance.spotlight >= cost.spotlight
  const currency = canUsePrestige ? `💎${cost.prestige}` : `✨${cost.spotlight}`

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full rounded-2xl py-3.5 px-5 font-semibold transition-all duration-150',
        'border flex items-center justify-between',
        highlight && !disabled
          ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-500/50 text-white shadow-lg shadow-pink-500/20'
          : !disabled
          ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
          : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
      )}
    >
      <span className="text-sm">{label}</span>
      <span className="text-xs opacity-80">{currency}</span>
    </motion.button>
  )
}
