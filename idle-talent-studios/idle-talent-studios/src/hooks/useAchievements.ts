import { useCallback } from 'react'
import { useAchievementStore } from '@/store/achievementStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useToast } from '@/store/toastStore'
import type { AchievementKey } from '@/data/achievements'

/** Call after any game action that might satisfy an achievement. */
export function useCheckAchievements() {
  const tryUnlock = useAchievementStore((s) => s.tryUnlock)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)
  const toast = useToast()

  return useCallback(
    (key: AchievementKey) => {
      const achievement = tryUnlock(key)
      if (!achievement) return

      if (achievement.reward.spotlight) {
        grantCurrency('spotlight', achievement.reward.spotlight, 'achievement')
      }
      if (achievement.reward.prestige) {
        grantCurrency('prestige', achievement.reward.prestige, 'achievement')
      }

      toast.achievement(`${achievement.icon} ${achievement.name}`)
    },
    [tryUnlock, grantCurrency, toast]
  )
}
