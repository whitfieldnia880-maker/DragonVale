import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ACHIEVEMENT_MAP, type AchievementKey } from '@/data/achievements'

export interface UnlockedAchievement {
  key: AchievementKey
  unlockedAt: string
}

interface AchievementStore {
  unlocked: UnlockedAchievement[]
  methodModeUses: number
  lowScandalDays: number
  lateNightEvents: number

  isUnlocked: (key: AchievementKey) => boolean
  /** Returns the achievement if newly unlocked, null if already had it */
  tryUnlock: (key: AchievementKey) => (typeof ACHIEVEMENT_MAP)[AchievementKey] | null
  incrementMethodMode: () => void
  incrementLowScandalDay: () => void
  resetLowScandalStreak: () => void
  incrementLateNightEvent: () => void
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: [],
      methodModeUses: 0,
      lowScandalDays: 0,
      lateNightEvents: 0,

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

      incrementMethodMode: () =>
        set((state) => ({ methodModeUses: state.methodModeUses + 1 })),

      incrementLowScandalDay: () =>
        set((state) => ({ lowScandalDays: state.lowScandalDays + 1 })),

      resetLowScandalStreak: () => set({ lowScandalDays: 0 }),

      incrementLateNightEvent: () =>
        set((state) => ({ lateNightEvents: state.lateNightEvents + 1 })),
    }),
    { name: 'its-achievements', version: 1 }
  )
)
