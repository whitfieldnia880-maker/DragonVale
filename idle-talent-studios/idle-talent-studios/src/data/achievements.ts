export type AchievementKey =
  | 'first_pull'
  | 'pity_survivor'
  | 'double_feature'
  | 'tabloid_darling'
  | 'method_actor'
  | 'clean_slate'
  | 'night_owl'
  | 'true_fan'
  | 'completionist'
  | 'the_long_game'

export interface Achievement {
  key: AchievementKey
  name: string
  description: string
  icon: string
  reward: { spotlight?: number; prestige?: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    key: 'first_pull',
    name: 'First Pull',
    description: 'Pull any character from the gacha.',
    icon: '🎴',
    reward: { spotlight: 100 },
  },
  {
    key: 'pity_survivor',
    name: 'Pity Survivor',
    description: 'Reach 89 pulls without an SSR.',
    icon: '😬',
    reward: { spotlight: 300 },
  },
  {
    key: 'double_feature',
    name: 'Double Feature',
    description: 'Unlock 2 SSR characters.',
    icon: '⭐⭐',
    reward: { prestige: 2 },
  },
  {
    key: 'tabloid_darling',
    name: 'Tabloid Darling',
    description: 'Reach Scandal 100 and survive.',
    icon: '📰',
    reward: { spotlight: 500 },
  },
  {
    key: 'method_actor',
    name: 'Method Actor',
    description: 'Use Method Mode 10 times.',
    icon: '🎭',
    reward: { prestige: 1 },
  },
  {
    key: 'clean_slate',
    name: 'Clean Slate',
    description: 'Keep Scandal under 10 for 30 consecutive days.',
    icon: '✨',
    reward: { prestige: 3 },
  },
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Trigger 5 late night character events.',
    icon: '🦉',
    reward: { spotlight: 200 },
  },
  {
    key: 'true_fan',
    name: 'True Fan',
    description: 'Unlock any true ending.',
    icon: '💫',
    reward: { prestige: 5 },
  },
  {
    key: 'completionist',
    name: 'Completionist',
    description: 'Unlock all endings for every character.',
    icon: '🏆',
    reward: { prestige: 20 },
  },
  {
    key: 'the_long_game',
    name: 'The Long Game',
    description: 'Reach Career Tier 6.',
    icon: '👑',
    reward: { prestige: 10 },
  },
]

export const ACHIEVEMENT_MAP: Record<AchievementKey, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.key, a])
) as Record<AchievementKey, Achievement>
