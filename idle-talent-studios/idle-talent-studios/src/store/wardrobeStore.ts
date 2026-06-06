import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EquippedOutfit, OutfitSlot, DayBonuses } from '@/systems/wardrobeSystem'
import { EMPTY_OUTFIT, computeDayBonuses, getSellValue, canSellItem } from '@/systems/wardrobeSystem'
import { WARDROBE_CATALOG } from '@/data/wardrobe/catalog'

interface WardrobeStore {
  ownedItemIds: string[]
  equipped: EquippedOutfit
  lockedItemIds: string[]
  pendingAffinityBonuses: Record<string, number>

  acquireItem: (itemId: string) => void
  equipItem: (itemId: string) => void
  unequipSlot: (slot: OutfitSlot) => void
  lockItem: (itemId: string) => void
  unlockItem: (itemId: string) => void
  /** Returns Spotlight gained on sell, or 0 if item can't be sold. */
  sellItem: (itemId: string) => number
  hasItem: (itemId: string) => boolean
  getDayBonuses: () => DayBonuses
  consumeAffinityBonus: (characterId: string) => number
  setPendingAffinityBonuses: (bonuses: Record<string, number>) => void
}

const STARTER_ITEMS = ['basic-white-tee', 'straight-leg-jeans', 'classic-white-sneakers']

export const useWardrobeStore = create<WardrobeStore>()(
  persist(
    (set, get) => ({
      ownedItemIds: STARTER_ITEMS,
      equipped: {
        top: 'basic-white-tee',
        bottom: 'straight-leg-jeans',
        shoes: 'classic-white-sneakers',
        accessory: null,
        full_look: null,
      },
      lockedItemIds: [],
      pendingAffinityBonuses: {},

      acquireItem: (itemId) =>
        set((state) => ({
          ownedItemIds: state.ownedItemIds.includes(itemId)
            ? state.ownedItemIds
            : [...state.ownedItemIds, itemId],
        })),

      equipItem: (itemId) =>
        set((state) => {
          const item = WARDROBE_CATALOG[itemId]
          if (!item) return state
          const slot = item.slot

          // Equipping a full_look clears all individual slots
          if (slot === 'full_look') {
            return {
              equipped: {
                ...EMPTY_OUTFIT,
                full_look: itemId,
              },
            }
          }

          // Equipping an individual slot clears full_look
          return {
            equipped: {
              ...state.equipped,
              full_look: null,
              [slot]: itemId,
            },
          }
        }),

      unequipSlot: (slot) =>
        set((state) => ({
          equipped: { ...state.equipped, [slot]: null },
        })),

      lockItem: (itemId) =>
        set((state) => ({
          lockedItemIds: state.lockedItemIds.includes(itemId)
            ? state.lockedItemIds
            : [...state.lockedItemIds, itemId],
        })),

      unlockItem: (itemId) =>
        set((state) => ({
          lockedItemIds: state.lockedItemIds.filter((id) => id !== itemId),
        })),

      sellItem: (itemId) => {
        const { ownedItemIds, equipped, lockedItemIds } = get()
        const item = WARDROBE_CATALOG[itemId]
        if (!item || !ownedItemIds.includes(itemId)) return 0
        if (lockedItemIds.includes(itemId)) return 0
        if (!canSellItem(item.rarity)) return 0

        const sellValue = getSellValue(item.rarity)

        set((state) => {
          const newEquipped = { ...state.equipped }
          // Unequip the item from any slot it occupies
          for (const slot of Object.keys(newEquipped) as OutfitSlot[]) {
            if (newEquipped[slot] === itemId) newEquipped[slot] = null
          }
          return {
            ownedItemIds: state.ownedItemIds.filter((id) => id !== itemId),
            equipped: newEquipped,
          }
        })

        return sellValue
      },

      hasItem: (itemId) => get().ownedItemIds.includes(itemId),

      getDayBonuses: () =>
        computeDayBonuses(get().equipped, WARDROBE_CATALOG),

      consumeAffinityBonus: (characterId) => {
        const bonus = get().pendingAffinityBonuses[characterId] ?? 0
        if (bonus > 0) {
          set((state) => {
            const next = { ...state.pendingAffinityBonuses }
            delete next[characterId]
            return { pendingAffinityBonuses: next }
          })
        }
        return bonus
      },

      setPendingAffinityBonuses: (bonuses) =>
        set((state) => ({
          pendingAffinityBonuses: {
            ...state.pendingAffinityBonuses,
            ...Object.fromEntries(
              Object.entries(bonuses).map(([k, v]) => [
                k,
                (state.pendingAffinityBonuses[k] ?? 0) + v,
              ])
            ),
          },
        })),
    }),
    { name: 'its-wardrobe' }
  )
)

// Expose equipped item IDs for external use without subscribing to full store
export function getEquippedItem(
  equipped: EquippedOutfit,
  slot: OutfitSlot
): string | null {
  if (equipped.full_look && slot !== 'full_look') return null
  return equipped[slot]
}
