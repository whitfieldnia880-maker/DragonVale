/**
 * achievementEngine — call after every meaningful game event.
 * Each function reads current store state, checks conditions, and grants
 * rewards exactly once via achievementStore.tryUnlock.
 */

import { useAchievementStore } from '@/store/achievementStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useToastStore } from '@/store/toastStore'
import { useRosterStore } from '@/store/rosterStore'
import { useProgressStore } from '@/store/progressStore'
import { ALL_CHARACTERS } from '@/data/characters'
import { ACHIEVEMENT_MAP, type AchievementKey } from '@/data/achievements'
import { playSound } from '@/systems/soundSystem'

// ─── Core grant ───────────────────────────────────────────────────────────────

function grantAchievement(key: AchievementKey): boolean {
  const achievement = useAchievementStore.getState().tryUnlock(key)
  if (!achievement) return false

  const { grantCurrency } = useCurrencyStore.getState()
  if (achievement.reward.spotlight) {
    grantCurrency('spotlight', achievement.reward.spotlight, `achievement_${key}`)
  }
  if (achievement.reward.prestige) {
    grantCurrency('prestige', achievement.reward.prestige, `achievement_${key}`)
  }

  playSound({ event: 'achievement_unlock', category: 'achievement' })

  useToastStore.getState().addToast({
    variant: 'achievement',
    icon: achievement.icon,
    message: `Achievement: ${achievement.name}`,
    durationMs: 5000,
  })

  return true
}

// ─── Check functions — call these after specific game events ─────────────────

/** After completing a gig. Pass outcome tier and prep choice id. */
export function checkAfterGig(
  outcomeTier: string,
  prepChoice: string
): void {
  const store = useAchievementStore.getState()

  store.incrementGigsCompleted()

  if (store.gigsCompleted + 1 >= 1) grantAchievement('first_call')
  if (outcomeTier === 'iconic')     grantAchievement('iconic')
  if (store.gigsCompleted + 1 >= 75) grantAchievement('the_long_game')

  if (prepChoice === 'method') {
    store.incrementMethodMode()
    if (store.methodModeUses + 1 >= 10) grantAchievement('method_actor')
  }
  if (prepChoice === 'safe') {
    store.incrementPlayItSafe()
    if (store.playItSafeUses + 1 >= 10) grantAchievement('play_it_safe')
  }
}

/** After any gacha pull completes. */
export function checkAfterPull(rarity: string, pityCount: number): void {
  const store = useRosterStore.getState()
  const owned = store.owned

  grantAchievement('the_casting_call')
  grantAchievement('screen_test')

  if (pityCount >= 89) grantAchievement('pity_survivor')

  const ssrCount = owned.filter((c) => c.rarity === 'SSR').length
  if (ssrCount >= 2) grantAchievement('double_feature')
  if (owned.length >= ALL_CHARACTERS.length) grantAchievement('full_roster')

  void rarity
}

/** After career tier changes. */
export function checkAfterCareerTier(newTier: number): void {
  const tierMap: Record<number, AchievementKey> = {
    2: 'somebody',
    3: 'the_trades_noticed',
    4: 'cover_story',
    5: 'icon',
    6: 'legend',
  }
  const key = tierMap[newTier]
  if (key) grantAchievement(key)
}

/** After a relationship stage changes. */
export function checkAfterStageUnlock(newStage: string): void {
  if (newStage === 'devoted') grantAchievement('devoted')
}

/** After an ending is completed. characterId = the character this ending belongs to. */
export function checkAfterEnding(
  endingType: string,
  characterId: string,
  allEndingsForCharacter: string[]
): void {
  if (endingType === 'heartbreak') grantAchievement('heartbreaker')
  if (endingType === 'good')       grantAchievement('happy_ending')
  if (endingType === 'true')       grantAchievement('true_form')

  const POSSIBLE_ENDING_TYPES = ['true', 'good', 'heartbreak', 'secret']
  if (POSSIBLE_ENDING_TYPES.every((t) => allEndingsForCharacter.includes(t))) {
    grantAchievement('completionist')
  }

  const endingsUnlocked = useProgressStore.getState().endingsUnlocked
  const allCharacterIds = ALL_CHARACTERS.map((c) => c.id)
  const allDone = allCharacterIds.every((cid) => {
    const charEndings = endingsUnlocked
      .filter((e) => e.characterId === cid)
      .map((e) => e.endingType)
    return POSSIBLE_ENDING_TYPES.every((t) => charEndings.includes(t))
  })
  if (allDone) grantAchievement('the_whole_story')

  void characterId
}

/** After scandal reaches 100 and the lockscreen resolves. */
export function checkAfterScandalResolved(): void {
  grantAchievement('tabloid_darling')
}

/** After fascination value changes. Pass new value. */
export function checkAfterFascination(value: number): void {
  if (value >= 100) grantAchievement('go_viral')
}

/** After a late night character event fires. */
export function checkAfterLateNightEvent(): void {
  const store = useAchievementStore.getState()
  store.incrementLateNightEvent()
  if (store.lateNightEvents + 1 >= 5) grantAchievement('night_owl')
}

/** After a press_caught event fires. */
export function checkAfterCaughtEvent(): void {
  grantAchievement('caught')
}

/** After player finds a Dex hidden note. */
export function checkAfterDexNote(): void {
  const store = useAchievementStore.getState()
  store.incrementDexNote()
  if (store.dexNotesFound + 1 >= 8) grantAchievement('the_note')
}

/** After a day resets with low scandal. */
export function checkAfterCleanDay(scandalLevel: number): void {
  const store = useAchievementStore.getState()
  if (scandalLevel < 10) {
    store.incrementLowScandalDay()
    if (store.lowScandalDays + 1 >= 30) grantAchievement('clean_slate')
  } else {
    store.resetLowScandalStreak()
  }
}

/** Progress value for display in ProfileScreen. */
export function getAchievementProgress(key: AchievementKey): number {
  return useAchievementStore.getState().getProgress(key)
}

/** Convenience re-export for ProfileScreen to show progress bars. */
export { ACHIEVEMENT_MAP }
