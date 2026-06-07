import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PullTicketType = 'standard' | 'sr' | 'ssr'

export interface PullTickets {
  standard: number
  sr: number
  ssr: number
}

export interface InventoryConsumables {
  energyRefills: number
  scandalReducers: number
}

interface InventoryStore {
  pullTickets: PullTickets
  wardrobeItems: string[]
  bondFragments: Record<string, number>
  consumables: InventoryConsumables
  lastClaimedLoginDay: number
  claimedStreakMilestones: number[]

  addPullTickets: (type: PullTicketType, count?: number) => void
  usePullTicket: (type: PullTicketType) => boolean
  getPullTicketTotal: () => number
  addWardrobeItem: (itemId: string) => void
  addBondFragment: (characterId: string, count?: number) => void
  addEnergyRefill: (count?: number) => void
  addScandalReducer: (count?: number) => void
  useEnergyRefill: () => boolean
  useScandalReducer: () => boolean
  setLastClaimedLoginDay: (day: number) => void
  markStreakMilestoneClaimed: (streakDay: number) => void
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      pullTickets: { standard: 0, sr: 0, ssr: 0 },
      wardrobeItems: [],
      bondFragments: {},
      consumables: { energyRefills: 0, scandalReducers: 0 },
      lastClaimedLoginDay: 0,
      claimedStreakMilestones: [],

      addPullTickets: (type, count = 1) =>
        set((state) => ({
          pullTickets: { ...state.pullTickets, [type]: state.pullTickets[type] + count },
        })),

      usePullTicket: (type) => {
        if (get().pullTickets[type] < 1) return false
        set((s) => ({ pullTickets: { ...s.pullTickets, [type]: s.pullTickets[type] - 1 } }))
        return true
      },

      getPullTicketTotal: () => {
        const { standard, sr, ssr } = get().pullTickets
        return standard + sr + ssr
      },

      addWardrobeItem: (itemId) =>
        set((state) => ({
          wardrobeItems: state.wardrobeItems.includes(itemId)
            ? state.wardrobeItems
            : [...state.wardrobeItems, itemId],
        })),

      addBondFragment: (characterId, count = 1) =>
        set((state) => ({
          bondFragments: {
            ...state.bondFragments,
            [characterId]: (state.bondFragments[characterId] ?? 0) + count,
          },
        })),

      addEnergyRefill: (count = 1) =>
        set((state) => ({
          consumables: {
            ...state.consumables,
            energyRefills: state.consumables.energyRefills + count,
          },
        })),

      addScandalReducer: (count = 1) =>
        set((state) => ({
          consumables: {
            ...state.consumables,
            scandalReducers: state.consumables.scandalReducers + count,
          },
        })),

      useEnergyRefill: () => {
        if (get().consumables.energyRefills < 1) return false
        set((s) => ({
          consumables: { ...s.consumables, energyRefills: s.consumables.energyRefills - 1 },
        }))
        return true
      },

      useScandalReducer: () => {
        if (get().consumables.scandalReducers < 1) return false
        set((s) => ({
          consumables: { ...s.consumables, scandalReducers: s.consumables.scandalReducers - 1 },
        }))
        return true
      },

      setLastClaimedLoginDay: (day) => set({ lastClaimedLoginDay: day }),

      markStreakMilestoneClaimed: (streakDay) =>
        set((state) => ({
          claimedStreakMilestones: state.claimedStreakMilestones.includes(streakDay)
            ? state.claimedStreakMilestones
            : [...state.claimedStreakMilestones, streakDay],
        })),
    }),
    { name: 'its-inventory', version: 1 }
  )
)
