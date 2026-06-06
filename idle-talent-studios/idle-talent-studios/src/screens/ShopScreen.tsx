import { useProgressStore } from '@/store/progressStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { usePlayerStore } from '@/store/playerStore'
import { Shop } from '@/components/Shop'

interface ShopScreenProps {
  onBack: () => void
  onGoToGacha: () => void
}

export function ShopScreen({ onBack, onGoToGacha }: ShopScreenProps) {
  const balance = useCurrencyStore((s) => s.balance)
  const apartmentLevel = useProgressStore((s) => s.apartmentLevel)
  const upgradeApartment = useProgressStore((s) => s.upgradeApartment)
  const spendCurrency = useCurrencyStore((s) => s.spendCurrency)
  const setEnergy = usePlayerStore((s) => s.setEnergy)

  function handleStaminaRefill() {
    const result = spendCurrency('spotlight', 80, 'stamina-refill')
    if (!result.success) { alert(result.reason); return }
    setEnergy(100)
  }

  function handleApartmentUpgrade() {
    if (apartmentLevel >= 5) { alert('Max level reached.'); return }
    const costs = [0, 500, 1200, 2500, 5000]
    const cost = costs[apartmentLevel]
    const result = spendCurrency('spotlight', cost, 'apartment-upgrade')
    if (!result.success) { alert(result.reason); return }
    upgradeApartment()
  }

  return (
    <div className="min-h-svh bg-slate-950 flex flex-col">
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 flex items-center gap-3 px-4 py-4">
        <button onClick={onBack} className="text-white/50 hover:text-white text-xl">←</button>
        <h1 className="text-base font-semibold text-white">The Shop</h1>
        <div className="ml-auto flex gap-4 text-sm">
          <span>✨ {balance.spotlight}</span>
          <span>💎 {balance.prestige}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-8">
        <Shop onSinglePull={onGoToGacha} onMultiPull={onGoToGacha} />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Stamina</h3>
          <ShopRow
            emoji="⚡"
            name="Stamina Refill"
            description="Restore 50 energy"
            cost="✨ 80"
            onClick={handleStaminaRefill}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Apartment</h3>
          <ShopRow
            emoji="🏢"
            name={`Upgrade to Level ${Math.min(apartmentLevel + 1, 5)}`}
            description={apartmentLevel >= 5 ? 'Fully upgraded' : `Current level: ${apartmentLevel}`}
            cost={apartmentLevel >= 5 ? '—' : `✨ ${[0,500,1200,2500,5000][apartmentLevel]}`}
            onClick={handleApartmentUpgrade}
            disabled={apartmentLevel >= 5}
          />
        </div>
      </div>
    </div>
  )
}

function ShopRow({
  emoji,
  name,
  description,
  cost,
  onClick,
  disabled,
}: {
  emoji: string
  name: string
  description: string
  cost: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-3 bg-[hsl(var(--card))] rounded-xl p-4 border border-white/10">
      <div className="text-2xl">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="shrink-0 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:bg-white/10 disabled:text-white/30 text-white text-xs font-semibold px-3 py-2 transition-colors"
      >
        {cost}
      </button>
    </div>
  )
}
