import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProcessedCharacterEvent } from '@/systems/dailyReset'
import type { PressHeadline } from '@/systems/scandal'

interface StorePurchase {
  itemId: string
  quantity: number
  currency: string
  cost: number
  purchasedAt: string
}

export interface UnlockedEnding {
  characterId: string
  endingType: string
  label: string
  completedAt: string
  prestigeEarned: number
}

interface ProgressStore {
  completedScenes: string[]
  choiceHistory: Record<string, string[]>
  activeRouteId: string | null
  purchaseHistory: StorePurchase[]
  apartmentLevel: number
  wardrobeUnlocks: string[]
  /** Character event IDs that have already fired — prevents re-triggering. */
  firedEventIds: string[]
  /** Events queued for display on the Home screen. */
  pendingCharacterEvents: ProcessedCharacterEvent[]
  /** Press cycle headline history (latest first). */
  pressHistory: PressHeadline[]
  /** Twist IDs that have already been shown — prevents repeats within a threshold pool. */
  firedTwists: string[]
  /** Actions already taken this game-day — reset on daily reset. */
  vanityUsedToday: boolean
  restedToday: boolean
  visitedToday: string[]
  /** Completed character endings with prestige earned. */
  endingsUnlocked: UnlockedEnding[]
  /** Hidden notes collected per character (characterId → array of note indices). */
  hiddenNotes: Record<string, number[]>
  /** Named counters for tracking repeated player choices (e.g. 'marcus_ignored_advice'). */
  choiceCounters: Record<string, number>
  /** Total passive scandal points applied per day from active chapters. */
  passiveScandalActive: number

  markSceneComplete: (sceneId: string) => void
  recordChoice: (sceneId: string, choiceId: string) => void
  setActiveRoute: (routeId: string | null) => void
  recordPurchase: (purchase: StorePurchase) => void
  upgradeApartment: () => void
  unlockWardrobe: (itemId: string) => void
  isSceneComplete: (sceneId: string) => boolean
  getSceneChoices: (sceneId: string) => string[]
  markEventFired: (eventId: string) => void
  addPendingEvent: (event: ProcessedCharacterEvent) => void
  dismissPendingEvent: (eventId: string) => void
  addPressHeadline: (headline: PressHeadline) => void
  addFiredTwist: (twistId: string) => void
  clearDayActions: () => void
  markVanityUsed: () => void
  markRestedToday: () => void
  addVisitedToday: (characterId: string) => void
  unlockEnding: (ending: UnlockedEnding) => void
  addHiddenNote: (characterId: string, noteIndex: number) => void
  incrementChoiceCounter: (counterKey: string) => void
  setPassiveScandalActive: (perDay: number) => void
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedScenes: [],
      choiceHistory: {},
      activeRouteId: null,
      purchaseHistory: [],
      apartmentLevel: 1,
      wardrobeUnlocks: [],
      firedEventIds: [],
      pendingCharacterEvents: [],
      pressHistory: [],
      firedTwists: [],
      vanityUsedToday: false,
      restedToday: false,
      visitedToday: [],
      endingsUnlocked: [],
      hiddenNotes: {},
      choiceCounters: {},
      passiveScandalActive: 0,

      markSceneComplete: (sceneId) =>
        set((state) => ({
          completedScenes: state.completedScenes.includes(sceneId)
            ? state.completedScenes
            : [...state.completedScenes, sceneId],
        })),

      recordChoice: (sceneId, choiceId) =>
        set((state) => {
          const prev = state.choiceHistory[sceneId] ?? []
          return {
            choiceHistory: {
              ...state.choiceHistory,
              [sceneId]: [...prev, choiceId],
            },
          }
        }),

      setActiveRoute: (routeId) => set({ activeRouteId: routeId }),

      recordPurchase: (purchase) =>
        set((state) => ({
          purchaseHistory: [purchase, ...state.purchaseHistory].slice(0, 500),
        })),

      upgradeApartment: () =>
        set((state) => ({ apartmentLevel: Math.min(5, state.apartmentLevel + 1) })),

      unlockWardrobe: (itemId) =>
        set((state) => ({
          wardrobeUnlocks: state.wardrobeUnlocks.includes(itemId)
            ? state.wardrobeUnlocks
            : [...state.wardrobeUnlocks, itemId],
        })),

      isSceneComplete: (sceneId) => get().completedScenes.includes(sceneId),

      getSceneChoices: (sceneId) => get().choiceHistory[sceneId] ?? [],

      markEventFired: (eventId) =>
        set((state) => ({
          firedEventIds: state.firedEventIds.includes(eventId)
            ? state.firedEventIds
            : [...state.firedEventIds, eventId],
        })),

      addPendingEvent: (event) =>
        set((state) => ({
          pendingCharacterEvents: [
            ...state.pendingCharacterEvents.filter((e) => e.id !== event.id),
            event,
          ],
        })),

      dismissPendingEvent: (eventId) =>
        set((state) => ({
          pendingCharacterEvents: state.pendingCharacterEvents.filter(
            (e) => e.id !== eventId
          ),
        })),

      addPressHeadline: (headline) =>
        set((state) => ({
          pressHistory: [headline, ...state.pressHistory].slice(0, 30),
        })),

      addFiredTwist: (twistId) =>
        set((state) => ({
          firedTwists: state.firedTwists.includes(twistId)
            ? state.firedTwists
            : [...state.firedTwists, twistId],
        })),

      clearDayActions: () =>
        set({ vanityUsedToday: false, restedToday: false, visitedToday: [] }),

      markVanityUsed: () => set({ vanityUsedToday: true }),
      markRestedToday: () => set({ restedToday: true }),
      addVisitedToday: (characterId) =>
        set((state) => ({
          visitedToday: state.visitedToday.includes(characterId)
            ? state.visitedToday
            : [...state.visitedToday, characterId],
        })),

      unlockEnding: (ending) =>
        set((state) => {
          const alreadyUnlocked = state.endingsUnlocked.some(
            (e) => e.characterId === ending.characterId && e.endingType === ending.endingType
          )
          if (alreadyUnlocked) return state
          return { endingsUnlocked: [...state.endingsUnlocked, ending] }
        }),

      addHiddenNote: (characterId, noteIndex) =>
        set((state) => {
          const existing = state.hiddenNotes[characterId] ?? []
          if (existing.includes(noteIndex)) return state
          return {
            hiddenNotes: {
              ...state.hiddenNotes,
              [characterId]: [...existing, noteIndex],
            },
          }
        }),

      incrementChoiceCounter: (counterKey) =>
        set((state) => ({
          choiceCounters: {
            ...state.choiceCounters,
            [counterKey]: (state.choiceCounters[counterKey] ?? 0) + 1,
          },
        })),

      setPassiveScandalActive: (perDay) => set({ passiveScandalActive: perDay }),
    }),
    { name: 'its-progress', version: 4 }
  )
)
