import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PULL_COSTS } from '@/systems/currencyEngine'
import { useCurrencyStore } from '@/store/currencyStore'

interface ShopItem {
  id: string
  name: string
  description: string
  spotlightCost?: number
  prestigeCost?: number
  emoji: string
  onPurchase: () => void
}

interface ShopProps {
  items?: ShopItem[]
  onSinglePull: () => void
  onMultiPull: () => void
}

export function Shop({ onSinglePull, onMultiPull }: ShopProps) {
  const balance = useCurrencyStore((s) => s.balance)

  const canAffordSingleSpotlight = balance.spotlight >= PULL_COSTS.single.spotlight
  const canAffordMultiSpotlight = balance.spotlight >= PULL_COSTS.multi.spotlight
  const canAffordSinglePrestige = balance.prestige >= PULL_COSTS.single.prestige
  const canAffordMultiPrestige = balance.prestige >= PULL_COSTS.multi.prestige

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Gacha</h3>
      <div className="grid grid-cols-2 gap-3">
        <ShopCard
          title="Single Pull"
          emoji="🎴"
          costA={`✨ ${PULL_COSTS.single.spotlight}`}
          costB={`💎 ${PULL_COSTS.single.prestige}`}
          canAfford={canAffordSingleSpotlight || canAffordSinglePrestige}
          onClick={onSinglePull}
        />
        <ShopCard
          title="10× Bundle"
          emoji="🎴🎴"
          costA={`✨ ${PULL_COSTS.multi.spotlight}`}
          costB={`💎 ${PULL_COSTS.multi.prestige}`}
          canAfford={canAffordMultiSpotlight || canAffordMultiPrestige}
          onClick={onMultiPull}
          badge="Best Value"
        />
      </div>
    </div>
  )
}

function ShopCard({
  title,
  emoji,
  costA,
  costB,
  canAfford,
  onClick,
  badge,
}: {
  title: string
  emoji: string
  costA: string
  costB: string
  canAfford: boolean
  onClick: () => void
  badge?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'relative rounded-xl border p-3 text-left transition-all',
        canAfford
          ? 'border-pink-500/40 bg-pink-950/40 hover:bg-pink-900/40'
          : 'border-white/10 bg-white/5 opacity-50'
      )}
    >
      {badge && (
        <span className="absolute -top-2 right-2 text-[10px] bg-yellow-400 text-yellow-900 font-bold px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="text-xs font-semibold text-white">{title}</p>
      <p className="text-[10px] text-white/50 mt-0.5">{costA}</p>
      <p className="text-[10px] text-white/30">{costB}</p>
    </motion.button>
  )
}
