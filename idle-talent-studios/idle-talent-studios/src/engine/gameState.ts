export type StatKey =
  | 'confidence'
  | 'looks'
  | 'wisdom'
  | 'reputation'
  | 'scandal'
  | 'money'

export interface PlayerStats {
  confidence: number
  looks: number
  wisdom: number
  reputation: number
  scandal: number
  money: number
}

export interface GameState {
  playerId: string | null
  playerName: string
  stats: PlayerStats
  energy: number
  mood: number
  currentChapter: number
  currentDay: number
  loginStreak: number
  unlockedRoutes: string[]
  storyFlags: Record<string, boolean>
  lastDailyReset: string | null
}

export const DEFAULT_STATS: PlayerStats = {
  confidence: 20,
  looks: 20,
  wisdom: 20,
  reputation: 20,
  scandal: 0,
  money: 500,
}

export const DEFAULT_GAME_STATE: GameState = {
  playerId: null,
  playerName: 'Player',
  stats: { ...DEFAULT_STATS },
  energy: 100,
  mood: 80,
  currentChapter: 1,
  currentDay: 1,
  loginStreak: 0,
  unlockedRoutes: [],
  storyFlags: {},
  lastDailyReset: null,
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value))
}
