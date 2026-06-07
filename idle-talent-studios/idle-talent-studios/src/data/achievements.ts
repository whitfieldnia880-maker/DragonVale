export type AchievementKey =
  // Milestone — career
  | 'first_call'
  | 'screen_test'
  | 'somebody'
  | 'the_trades_noticed'
  | 'cover_story'
  | 'icon'
  | 'legend'
  // Gacha
  | 'the_casting_call'
  | 'pity_survivor'
  | 'double_feature'
  | 'full_roster'
  // Gameplay
  | 'method_actor'
  | 'play_it_safe'
  | 'go_viral'
  | 'clean_slate'
  | 'tabloid_darling'
  | 'iconic'
  | 'the_long_game'
  // Romance
  | 'night_owl'
  | 'devoted'
  | 'caught'
  | 'the_note'
  // Endings
  | 'heartbreaker'
  | 'happy_ending'
  | 'true_form'
  | 'completionist'
  | 'the_whole_story'

export interface Achievement {
  key: AchievementKey
  name: string
  description: string
  icon: string
  reward: { spotlight?: number; prestige?: number; legendaryWardrobe?: boolean }
  /** For progress-tracked achievements: the target count */
  progressTarget?: number
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Milestone ────────────────────────────────────────────────────────────────
  {
    key: 'first_call',
    name: 'First Call',
    description: 'Complete your first gig.',
    icon: '📞',
    reward: { spotlight: 50 },
  },
  {
    key: 'screen_test',
    name: 'Screen Test',
    description: 'Pull your first character.',
    icon: '🎴',
    reward: { spotlight: 100 },
  },
  {
    key: 'somebody',
    name: 'Somebody',
    description: 'Reach Career Tier 2.',
    icon: '📰',
    reward: { spotlight: 200 },
  },
  {
    key: 'the_trades_noticed',
    name: 'The Trades Noticed',
    description: 'Reach Career Tier 3.',
    icon: '🗞',
    reward: { spotlight: 500 },
  },
  {
    key: 'cover_story',
    name: 'Cover Story',
    description: 'Reach Career Tier 4.',
    icon: '🌟',
    reward: { spotlight: 1000, prestige: 5 },
  },
  {
    key: 'icon',
    name: 'Icon',
    description: 'Reach Career Tier 5.',
    icon: '⭐',
    reward: { spotlight: 2000, prestige: 10 },
  },
  {
    key: 'legend',
    name: 'Legend',
    description: 'Reach Career Tier 6.',
    icon: '👑',
    reward: { spotlight: 5000, prestige: 25 },
  },

  // ── Gacha ─────────────────────────────────────────────────────────────────────
  {
    key: 'the_casting_call',
    name: 'The Casting Call',
    description: 'Pull any character from the gacha.',
    icon: '🎬',
    reward: { spotlight: 50 },
  },
  {
    key: 'pity_survivor',
    name: 'Pity Survivor',
    description: 'Reach pull 89 without an SSR.',
    icon: '😬',
    reward: { prestige: 3 },
  },
  {
    key: 'double_feature',
    name: 'Double Feature',
    description: 'Unlock 2 SSR characters.',
    icon: '⭐⭐',
    reward: { prestige: 5 },
  },
  {
    key: 'full_roster',
    name: 'Full Roster',
    description: 'Unlock all characters.',
    icon: '🎭',
    reward: { prestige: 20 },
  },

  // ── Gameplay ──────────────────────────────────────────────────────────────────
  {
    key: 'method_actor',
    name: 'Method Actor',
    description: 'Use Method Mode 10 times.',
    icon: '🎭',
    reward: { spotlight: 500 },
    progressTarget: 10,
  },
  {
    key: 'play_it_safe',
    name: 'Play It Safe',
    description: 'Use Play It Safe 10 times.',
    icon: '🛡',
    reward: { spotlight: 300 },
    progressTarget: 10,
  },
  {
    key: 'go_viral',
    name: 'Go Viral',
    description: 'Reach Fascination 100.',
    icon: '📱',
    reward: { spotlight: 500, prestige: 2 },
  },
  {
    key: 'clean_slate',
    name: 'Clean Slate',
    description: 'Keep Scandal under 10 for 30 consecutive days.',
    icon: '✨',
    reward: { spotlight: 1000, prestige: 5 },
    progressTarget: 30,
  },
  {
    key: 'tabloid_darling',
    name: 'Tabloid Darling',
    description: 'Reach Scandal 100 and survive.',
    icon: '📰',
    reward: { prestige: 3 },
  },
  {
    key: 'iconic',
    name: 'Iconic',
    description: 'Achieve an Iconic outcome on any gig.',
    icon: '💥',
    reward: { spotlight: 500 },
  },
  {
    key: 'the_long_game',
    name: 'The Long Game',
    description: 'Complete 75 gigs.',
    icon: '🎞',
    reward: { spotlight: 2000 },
    progressTarget: 75,
  },

  // ── Romance ───────────────────────────────────────────────────────────────────
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Trigger 5 late night character events.',
    icon: '🦉',
    reward: { spotlight: 300 },
    progressTarget: 5,
  },
  {
    key: 'devoted',
    name: 'Devoted',
    description: 'Reach the Devoted stage with any character.',
    icon: '♥',
    reward: { spotlight: 500, prestige: 2 },
  },
  {
    key: 'caught',
    name: 'Caught',
    description: 'Trigger a press_caught event.',
    icon: '📸',
    reward: { prestige: 1 },
  },
  {
    key: 'the_note',
    name: 'The Note',
    description: 'Find all 8 Dex hidden notes.',
    icon: '📝',
    reward: { prestige: 5 },
    progressTarget: 8,
  },

  // ── Endings ───────────────────────────────────────────────────────────────────
  {
    key: 'heartbreaker',
    name: 'Heartbreaker',
    description: 'Unlock any heartbreak ending.',
    icon: '💔',
    reward: { prestige: 2 },
  },
  {
    key: 'happy_ending',
    name: 'Happy Ending',
    description: 'Unlock any good ending.',
    icon: '💛',
    reward: { prestige: 5 },
  },
  {
    key: 'true_form',
    name: 'True Form',
    description: 'Unlock any true ending.',
    icon: '💫',
    reward: { prestige: 10 },
  },
  {
    key: 'completionist',
    name: 'Completionist',
    description: 'Unlock all endings for any single character.',
    icon: '🏆',
    reward: { prestige: 15 },
  },
  {
    key: 'the_whole_story',
    name: 'The Whole Story',
    description: 'Unlock all endings for all characters.',
    icon: '📚',
    reward: { prestige: 50, legendaryWardrobe: true },
  },
]

export const ACHIEVEMENT_MAP: Record<AchievementKey, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.key, a])
) as Record<AchievementKey, Achievement>
