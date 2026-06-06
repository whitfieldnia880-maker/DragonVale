import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GachaPullResult, PityState, Rarity } from '@/engine/gachaEngine'

export interface PullHistoryEntry {
  id: string
  bannerId: string
  characterId: string
  characterName: string
  characterPortrait: string
  rarity: Rarity
  isNew: boolean
  spotlightEarned: number
  bondFragment: boolean
  pulledAt: string
}

const DEFAULT_PITY: PityState = { totalPulls: 0, pullsSinceLastSSR: 0 }
const BOND_FRAGMENTS_PER_SCENE = 5
const PULL_HISTORY_MAX = 90

interface GachaStore {
  /** Per-banner pity state — keyed by banner ID */
  bannerPity: Record<string, PityState>
  /** Pull history (newest first, capped at 90) */
  pullHistory: PullHistoryEntry[]
  /** Bond fragments accumulated per character */
  bondFragments: Record<string, number>
  /** Bond scenes unlocked per character (0, 1, 2, …) */
  bondScenesUnlocked: Record<string, number>
  /** One-time beginner banner has been used */
  beginnerBannerUsed: boolean

  getBannerPity: (bannerId: string) => PityState
  recordPulls: (bannerId: string, results: GachaPullResult[]) => void
  resetBannerPity: (bannerId: string) => void
  addBondFragment: (characterId: string) => { totalFragments: number; sceneUnlocked: boolean }
  markBeginnerBannerUsed: () => void
  clearHistory: () => void
}

export const useGachaStore = create<GachaStore>()(
  persist(
    (set, get) => ({
      bannerPity: {},
      pullHistory: [],
      bondFragments: {},
      bondScenesUnlocked: {},
      beginnerBannerUsed: false,

      getBannerPity: (bannerId) =>
        get().bannerPity[bannerId] ?? { ...DEFAULT_PITY },

      recordPulls: (bannerId, results) =>
        set((state) => {
          const currentPity = state.bannerPity[bannerId] ?? { ...DEFAULT_PITY }
          let nextPity = { ...currentPity }

          const newEntries: PullHistoryEntry[] = results.map((r) => {
            nextPity = {
              totalPulls: nextPity.totalPulls + 1,
              pullsSinceLastSSR:
                r.rarity === 'SSR' ? 0 : nextPity.pullsSinceLastSSR + 1,
            }
            return {
              id: crypto.randomUUID(),
              bannerId,
              characterId: r.character.id,
              characterName: r.character.name,
              characterPortrait: r.character.portraitPlaceholder,
              rarity: r.rarity,
              isNew: r.isNew,
              spotlightEarned: r.spotlightConverted,
              bondFragment: r.bondFragmentGranted,
              pulledAt: new Date().toISOString(),
            }
          })

          return {
            bannerPity: { ...state.bannerPity, [bannerId]: nextPity },
            pullHistory: [
              ...newEntries,
              ...state.pullHistory,
            ].slice(0, PULL_HISTORY_MAX),
          }
        }),

      resetBannerPity: (bannerId) =>
        set((state) => ({
          bannerPity: {
            ...state.bannerPity,
            [bannerId]: { ...DEFAULT_PITY },
          },
        })),

      addBondFragment: (characterId) => {
        let result = { totalFragments: 0, sceneUnlocked: false }
        set((state) => {
          const current = state.bondFragments[characterId] ?? 0
          const next = current + 1
          const currentUnlocked = state.bondScenesUnlocked[characterId] ?? 0
          const shouldUnlock = next >= BOND_FRAGMENTS_PER_SCENE * (currentUnlocked + 1)
          result = { totalFragments: next, sceneUnlocked: shouldUnlock }
          return {
            bondFragments: { ...state.bondFragments, [characterId]: next },
            bondScenesUnlocked: shouldUnlock
              ? {
                  ...state.bondScenesUnlocked,
                  [characterId]: currentUnlocked + 1,
                }
              : state.bondScenesUnlocked,
          }
        })
        return result
      },

      markBeginnerBannerUsed: () => set({ beginnerBannerUsed: true }),

      clearHistory: () => set({ pullHistory: [] }),
    }),
    { name: 'its-gacha', version: 1 }
  )
)
