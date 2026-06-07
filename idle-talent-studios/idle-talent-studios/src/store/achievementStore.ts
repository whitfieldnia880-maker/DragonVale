import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENT_MAP, type AchievementKey } from '@/data/achievements'

export interface UnlockedAchievement {
  key: AchievementKey
  unlockedAt: string
}

interface AchievementStore {
  unlocked: UnlockedAchievement[]
  // Progress counters
  methodModeUses: number
  playItSafeUses: number
  lowScandalDays: number
  lateNightEvents: number
  gigsCompleted: number
  dexNotesFound: number

  isUnlocked: (key: AchievementKey) => boolean
  /** Returns the achievement if newly unlocked, null if already had it */
  tryUnlock: (key: AchievementKey) => (typeof ACHIEVEMENT_MAP)[AchievementKey] | null
  getProgress: (key: AchievementKey) => number

  incrementMethodMode: () => void
  incrementPlayItSafe: () => void
  incrementLowScandalDay: () => void
  resetLowScandalStreak: () => void
  incrementLateNightEvent: () => void
  incrementGigsCompleted: () => void
  incrementDexNote: () => void
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: [],
      methodModeUses: 0,
      playItSafeUses: 0,
      lowScandalDays: 0,
      lateNightEvents: 0,
      gigsCompleted: 0,
      dexNotesFound: 0,

      isUnlocked: (key) => get().unlocked.some((u) => u.key === key),

      tryUnlock: (key) => {
        if (get().isUnlocked(key)) return null
        const achievement = ACHIEVEMENT_MAP[key]
        if (!achievement) return null
        set((state) => ({
          unlocked: [
            ...state.unlocked,
            { key, unlockedAt: new Date().toISOString() },
          ],
        }))
        return achievement
      },

      getProgress: (key) => {
        const s = get()
        switch (key) {
          case 'method_actor':   return s.methodModeUses
          case 'play_it_safe':   return s.playItSafeUses
          case 'clean_slate':    return s.lowScandalDays
          case 'night_owl':      return s.lateNightEvents
          case 'the_long_game':  return s.gigsCompleted
          case 'the_note':       return s.dexNotesFound
          default:               return 0
        }
      },

      incrementMethodMode: () =>
        set((state) => ({ methodModeUses: state.methodModeUses + 1 })),

      incrementPlayItSafe: () =>
        set((state) => ({ playItSafeUses: state.playItSafeUses + 1 })),

      incrementLowScandalDay: () =>
        set((state) => ({ lowScandalDays: state.lowScandalDays + 1 })),

      resetLowScandalStreak: () => set({ lowScandalDays: 0 }),

      incrementLateNightEvent: () =>
        set((state) => ({ lateNightEvents: state.lateNightEvents + 1 })),

      incrementGigsCompleted: () =>
        set((state) => ({ gigsCompleted: state.gigsCompleted + 1 })),

      incrementDexNote: () =>
        set((state) => ({ dexNotesFound: state.dexNotesFound + 1 })),
    }),
    { name: 'its-achievements', version: 2 }
  )
)
