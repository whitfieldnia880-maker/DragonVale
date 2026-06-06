import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, StatKey } from '@/engine/gameState'
import { DEFAULT_GAME_STATE, clampStat } from '@/engine/gameState'
import type { StatDelta } from '@/engine/statEngine'
import { applyDeltas } from '@/engine/statEngine'
import { shouldRunDailyReset } from '@/systems/dailyReset'
import { getScandalThresholdCrossed } from '@/systems/scandal'
import type { ScandalThreshold } from '@/systems/scandal'

interface PlayerStore extends GameState {
  pendingScandalEvents: ScandalThreshold[]

  setPlayerId: (id: string) => void
  setPlayerName: (name: string) => void
  applyStat: (stat: StatKey, delta: number) => void
  applyStatDeltas: (deltas: StatDelta[]) => void
  setFlag: (key: string, value: boolean) => void
  advanceChapter: () => void
  unlockRoute: (routeId: string) => void
  setEnergy: (value: number) => void
  setMood: (value: number) => void
  setDayAndStreak: (day: number, streak: number) => void
  markDailyReset: () => void
  pushScandalThresholds: (thresholds: ScandalThreshold[]) => void
  dismissScandalEvent: () => void
  needsDailyReset: () => boolean
  resetGame: () => void
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_GAME_STATE,
      pendingScandalEvents: [],

      setPlayerId: (id) => set({ playerId: id }),
      setPlayerName: (name) => set({ playerName: name }),

      applyStat: (stat, delta) =>
        set((state) => {
          const prevScandal = state.stats.scandal
          const nextStats = {
            ...state.stats,
            [stat]: clampStat(state.stats[stat] + delta),
          }
          const threshold = getScandalThresholdCrossed(
            prevScandal,
            nextStats.scandal
          )
          return {
            stats: nextStats,
            pendingScandalEvents: threshold
              ? [...state.pendingScandalEvents, threshold]
              : state.pendingScandalEvents,
          }
        }),

      applyStatDeltas: (deltas) =>
        set((state) => {
          const prevScandal = state.stats.scandal
          const nextStats = applyDeltas(state.stats, deltas)
          const threshold = getScandalThresholdCrossed(
            prevScandal,
            nextStats.scandal
          )
          return {
            stats: nextStats,
            pendingScandalEvents: threshold
              ? [...state.pendingScandalEvents, threshold]
              : state.pendingScandalEvents,
          }
        }),

      setFlag: (key, value) =>
        set((state) => ({
          storyFlags: { ...state.storyFlags, [key]: value },
        })),

      advanceChapter: () =>
        set((state) => ({ currentChapter: state.currentChapter + 1 })),

      unlockRoute: (routeId) =>
        set((state) => ({
          unlockedRoutes: state.unlockedRoutes.includes(routeId)
            ? state.unlockedRoutes
            : [...state.unlockedRoutes, routeId],
        })),

      setEnergy: (value) => set({ energy: clampStat(value) }),
      setMood: (value) => set({ mood: clampStat(value) }),

      setDayAndStreak: (day, streak) =>
        set({ currentDay: day, loginStreak: streak }),

      markDailyReset: () =>
        set({ lastDailyReset: new Date().toISOString() }),

      pushScandalThresholds: (thresholds) =>
        set((state) => ({
          pendingScandalEvents: [...state.pendingScandalEvents, ...thresholds],
        })),

      dismissScandalEvent: () =>
        set((state) => ({
          pendingScandalEvents: state.pendingScandalEvents.slice(1),
        })),

      needsDailyReset: () => shouldRunDailyReset(get().lastDailyReset),

      resetGame: () => set({ ...DEFAULT_GAME_STATE, pendingScandalEvents: [] }),
    }),
    { name: 'its-player' }
  )
)
