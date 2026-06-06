import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { WARDROBE_CATALOG } from '@/data/wardrobe/catalog'
import type { WardrobeItem, ItemRarity, OutfitSlot } from '@/systems/wardrobeSystem'
import {
  getRarityColor,
  getRarityLabel,
  getSellValue,
  canSellItem,
} from '@/systems/wardrobeSystem'

type FilterMode = 'all' | 'equipped' | 'common' | 'rare' | 'epic' | 'legendary'

interface WardrobeProps {
  onClose: () => void
}

const SLOT_LABELS: Record<OutfitSlot, string> = {
  top: 'Top',
  bottom: 'Bottom',
  shoes: 'Shoes',
  accessory: 'Accessory',
  full_look: 'Full Look',
}

export function Wardrobe({ onClose }: WardrobeProps) {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null)
  const [confirmSell, setConfirmSell] = useState(false)

  const ownedItemIds = useWardrobeStore((s) => s.ownedItemIds)
  const equipped = useWardrobeStore((s) => s.equipped)
  const lockedItemIds = useWardrobeStore((s) => s.lockedItemIds)
  const equipItem = useWardrobeStore((s) => s.equipItem)
  const unequipSlot = useWardrobeStore((s) => s.unequipSlot)
  const lockItem = useWardrobeStore((s) => s.lockItem)
  const unlockItem = useWardrobeStore((s) => s.unlockItem)
  const sellItem = useWardrobeStore((s) => s.sellItem)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)

  const ownedItems = ownedItemIds
    .map((id) => WARDROBE_CATALOG[id])
    .filter(Boolean) as WardrobeItem[]

  const equippedSlotIds = new Set(
    Object.values(equipped).filter(Boolean) as string[]
  )

  const filteredItems = ownedItems.filter((item) => {
    if (filter === 'equipped') return equippedSlotIds.has(item.id)
    if (filter === 'all') return true
    return item.rarity === filter
  })

  const dayBonuses = useWardrobeStore((s) => s.getDayBonuses())

  function isEquipped(itemId: string) {
    return equippedSlotIds.has(itemId)
  }

  function handleEquip(item: WardrobeItem) {
    if (isEquipped(item.id)) {
      unequipSlot(item.slot)
    } else {
      equipItem(item.id)
    }
    setSelectedItem(null)
  }

  function handleSell(item: WardrobeItem) {
    if (!confirmSell) {
      setConfirmSell(true)
      return
    }
    const value = sellItem(item.id)
    if (value > 0) grantCurrency('spotlight', value, 'wardrobe_sell')
    setSelectedItem(null)
    setConfirmSell(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-slate-950 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div>
          <h2 className="text-base font-bold text-white">Wardrobe</h2>
          <p className="text-[11px] text-white/30 mt-0.5">
            {ownedItems.length} items · Today: +{dayBonuses.looksBonus} Looks
            {dayBonuses.confBonus > 0 && ` · +${dayBonuses.confBonus} Conf`}
            {dayBonuses.statTag && ` · +${dayBonuses.statBonusValue} ${dayBonuses.statTag}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/40 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      {/* Equipped slots summary */}
      <div className="px-4 py-2.5 border-b border-white/6 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(SLOT_LABELS) as OutfitSlot[]).map((slot) => {
            const itemId = slot === 'full_look' ? equipped.full_look : equipped[slot]
            const item = itemId ? WARDROBE_CATALOG[itemId] : null
            return (
              <div
                key={slot}
                className={cn(
                  'shrink-0 rounded-lg px-2.5 py-1.5 text-center min-w-[60px] border',
                  item
                    ? 'bg-white/6 border-white/10'
                    : 'bg-white/3 border-white/6 opacity-50'
                )}
              >
                <p className="text-[9px] text-white/30 uppercase tracking-wider">
                  {SLOT_LABELS[slot]}
                </p>
                <p className="text-[11px] text-white/70 mt-0.5 leading-tight truncate max-w-[60px]">
                  {item ? item.name : '—'}
                </p>
                {item && (
                  <div
                    className="w-full h-0.5 rounded-full mt-1"
                    style={{ backgroundColor: getRarityColor(item.rarity) }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 px-4 py-2 overflow-x-auto shrink-0">
        {(['all', 'equipped', 'common', 'rare', 'epic', 'legendary'] as FilterMode[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all capitalize',
              filter === f
                ? 'bg-white/15 border-white/25 text-white'
                : 'bg-transparent border-white/10 text-white/40'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-white/25">
            <p className="text-3xl mb-2">👗</p>
            <p className="text-sm">Nothing here yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isEquipped={isEquipped(item.id)}
                isLocked={lockedItemIds.includes(item.id)}
                onTap={() => {
                  setSelectedItem(item)
                  setConfirmSell(false)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item detail sheet */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[85] bg-black/60"
              onClick={() => { setSelectedItem(null); setConfirmSell(false) }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[90] bg-slate-900 border-t border-white/10 rounded-t-2xl px-5 py-5 space-y-4"
            >
              {/* Item header */}
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${getRarityColor(selectedItem.rarity)}18` }}
                >
                  👗
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedItem.name}</h3>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        color: getRarityColor(selectedItem.rarity),
                        backgroundColor: `${getRarityColor(selectedItem.rarity)}20`,
                      }}
                    >
                      {getRarityLabel(selectedItem.rarity)}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{selectedItem.description}</p>
                </div>
              </div>

              {/* Stat bonuses */}
              <div className="flex gap-2 flex-wrap">
                {selectedItem.looksBonus > 0 && (
                  <StatChip label="Looks" value={selectedItem.looksBonus} color="#c084fc" />
                )}
                {selectedItem.confBonus > 0 && (
                  <StatChip label="Confidence" value={selectedItem.confBonus} color="#f472b6" />
                )}
                {selectedItem.statTag && selectedItem.statBonusValue > 0 && (
                  <StatChip
                    label={selectedItem.statTag}
                    value={selectedItem.statBonusValue}
                    color="#60a5fa"
                  />
                )}
              </div>

              {/* Character affinity */}
              {selectedItem.characterAffinity.length > 0 && (
                <p className="text-xs text-pink-400/70 flex items-center gap-1.5">
                  <span>♥</span>
                  <span>
                    {selectedItem.characterAffinity.length >= 6
                      ? `Everyone loves this look (+${selectedItem.affinityBonus} affection)`
                      : `${selectedItem.characterAffinity
                          .slice(0, 2)
                          .map((id) => id.split('-')[0])
                          .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
                          .join(' & ')} loves this look (+${selectedItem.affinityBonus} affection)`}
                  </span>
                </p>
              )}

              {/* Slot label */}
              <p className="text-[10px] text-white/25 uppercase tracking-widest">
                Slot: {SLOT_LABELS[selectedItem.slot]}
              </p>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEquip(selectedItem)}
                  className={cn(
                    'w-full py-3 rounded-xl text-sm font-semibold text-white transition-all',
                    isEquipped(selectedItem.id)
                      ? 'bg-white/10 border border-white/15'
                      : 'border border-white/20',
                  )}
                  style={
                    !isEquipped(selectedItem.id)
                      ? { backgroundColor: `${getRarityColor(selectedItem.rarity)}20`, borderColor: `${getRarityColor(selectedItem.rarity)}40` }
                      : undefined
                  }
                >
                  {isEquipped(selectedItem.id) ? 'Unequip' : 'Equip'}
                </motion.button>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      lockedItemIds.includes(selectedItem.id)
                        ? unlockItem(selectedItem.id)
                        : lockItem(selectedItem.id)
                    }
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white/60 bg-white/6 border border-white/8 transition-colors"
                  >
                    {lockedItemIds.includes(selectedItem.id) ? '🔒 Unlock' : '🔓 Lock'}
                  </motion.button>

                  {canSellItem(selectedItem.rarity) &&
                    !lockedItemIds.includes(selectedItem.id) && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSell(selectedItem)}
                        className={cn(
                          'flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                          confirmSell
                            ? 'bg-red-800/60 border border-red-600/50 text-red-300'
                            : 'bg-white/6 border border-white/8 text-white/60'
                        )}
                      >
                        {confirmSell
                          ? `Sell for ✨${getSellValue(selectedItem.rarity)}?`
                          : `Sell · ✨${getSellValue(selectedItem.rarity)}`}
                      </motion.button>
                    )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes wardrobe-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </motion.div>
  )
}

// ─── Item Card ─────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  isEquipped,
  isLocked,
  onTap,
}: {
  item: WardrobeItem
  isEquipped: boolean
  isLocked: boolean
  onTap: () => void
}) {
  const rarityColor = getRarityColor(item.rarity)
  const isLegendary = item.rarity === 'legendary'

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className={cn(
        'relative rounded-xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center',
        'border transition-all',
        isEquipped ? 'border-opacity-70' : 'border-white/8'
      )}
      style={{
        backgroundColor: `${rarityColor}10`,
        borderColor: isEquipped ? rarityColor : undefined,
      }}
    >
      {/* Legendary shimmer overlay */}
      {isLegendary && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(251,191,36,0.18) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'wardrobe-shimmer 2.5s linear infinite',
          }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-1 px-1.5 py-2">
        <span className="text-2xl">👗</span>
        <p className="text-[10px] text-white/70 text-center leading-snug font-medium line-clamp-2">
          {item.name}
        </p>
        <div
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
          style={{ color: rarityColor, backgroundColor: `${rarityColor}20` }}
        >
          +{item.looksBonus} 👁
        </div>
      </div>

      {/* Equipped badge */}
      {isEquipped && (
        <div
          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
          style={{ backgroundColor: rarityColor }}
        >
          ✓
        </div>
      )}

      {/* Lock badge */}
      {isLocked && (
        <div className="absolute top-1.5 left-1.5 text-[10px]">🔒</div>
      )}

      {/* Rarity strip at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: rarityColor }}
      />
    </motion.button>
  )
}

function StatChip({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div
      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}18` }}
    >
      <span className="capitalize">{label}</span>
      <span>+{value}</span>
    </div>
  )
}
