import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character } from '@/data/characters/types'
import type { RelationshipData, RelationshipVisibility, RelationshipStage } from '@/systems/relationship'
import {
  createRelationship,
  applyAffectionDelta,
  incrementSharedScenes,
  setRelationshipVisibility,
  setStabilityScore,
  updateVisibilityScore,
  getStageUnlockReward,
} from '@/systems/relationship'

const HIDDEN_UNTIL_FLAG: Record<string, string> = {
  'amy-crawford': 'amy_ch6_reveal',
}

export interface PendingStageUnlock {
  characterId: string
  characterName: string
  stage: RelationshipStage
  spotlightReward: number
}

function affectionToStage(affection: number): RelationshipStage {
  if (affection >= 90) return 'bonded'
  if (affection >= 75) return 'intimate'
  if (affection >= 50) return 'close'
  if (affection >= 25) return 'friend'
  if (affection >= 10) return 'acquaintance'
  return 'stranger'
}

interface RosterStore {
  owned: Character[]
  relationships: Record<string, RelationshipData>
  pity: { totalPulls: number; pullsSinceLastSSR: number }
  /** Per-character story flags (separate from global storyFlags in progressStore). */
  characterFlags: Record<string, Record<string, boolean>>
  pendingStageUnlocks: PendingStageUnlock[]

  addCharacter: (character: Character) => void
  applyAffection: (characterId: string, delta: number) => void
  updateAffection: (characterId: string, delta: number) => void
  recordSharedScene: (characterId: string) => void
  setVisibility: (characterId: string, visibility: RelationshipVisibility) => void
  updateVisibility: (characterId: string, delta: number) => void
  updateStabilityScore: (characterId: string, score: number) => void
  updatePity: (totalPulls: number, pullsSinceLastSSR: number) => void
  isOwned: (characterId: string) => boolean
  getOwnedIds: () => Set<string>
  getAffection: (characterId: string) => number
  isHidden: (characterId: string, flags: Record<string, boolean>) => boolean
  getRelationshipStage: (characterId: string) => RelationshipStage
  setFlag: (characterId: string, key: string, value: boolean) => void
  getCharacterFlag: (characterId: string, key: string) => boolean
  dismissStageUnlock: () => void
}

export const useRosterStore = create<RosterStore>()(
  persist(
    (set, get) => ({
      owned: [],
      relationships: {},
      pity: { totalPulls: 0, pullsSinceLastSSR: 0 },
      characterFlags: {},
      pendingStageUnlocks: [],

      addCharacter: (character) =>
        set((state) => {
          if (state.owned.find((c) => c.id === character.id)) return state
          return {
            owned: [...state.owned, character],
            relationships: {
              ...state.relationships,
              [character.id]: createRelationship(character.id),
            },
          }
        }),

      applyAffection: (characterId, delta) =>
        set((state) => {
          const rel = state.relationships[characterId] ?? createRelationship(characterId)
          const updated = applyAffectionDelta(rel, delta)
          const stageChanged = updated.stage !== rel.stage
          const spotlightReward = stageChanged ? getStageUnlockReward(rel.stage, updated.stage) : 0
          const char = state.owned.find((c) => c.id === characterId)
          const unlock: PendingStageUnlock | null =
            stageChanged && spotlightReward > 0
              ? { characterId, characterName: char?.name ?? characterId, stage: updated.stage, spotlightReward }
              : null
          return {
            relationships: { ...state.relationships, [characterId]: updated },
            pendingStageUnlocks: unlock
              ? [...state.pendingStageUnlocks, unlock]
              : state.pendingStageUnlocks,
          }
        }),

      updateAffection: (characterId, delta) =>
        set((state) => {
          const rel = state.relationships[characterId] ?? createRelationship(characterId)
          const updated = applyAffectionDelta(rel, delta)
          const stageChanged = updated.stage !== rel.stage
          const spotlightReward = stageChanged ? getStageUnlockReward(rel.stage, updated.stage) : 0
          const char = state.owned.find((c) => c.id === characterId)
          const unlock: PendingStageUnlock | null =
            stageChanged && spotlightReward > 0
              ? { characterId, characterName: char?.name ?? characterId, stage: updated.stage, spotlightReward }
              : null
          return {
            relationships: { ...state.relationships, [characterId]: updated },
            pendingStageUnlocks: unlock
              ? [...state.pendingStageUnlocks, unlock]
              : state.pendingStageUnlocks,
          }
        }),

      recordSharedScene: (characterId) =>
        set((state) => {
          const rel =
            state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: {
              ...state.relationships,
              [characterId]: incrementSharedScenes(rel),
            },
          }
        }),

      setVisibility: (characterId, visibility) =>
        set((state) => {
          const rel =
            state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: {
              ...state.relationships,
              [characterId]: setRelationshipVisibility(rel, visibility),
            },
          }
        }),

      updateStabilityScore: (characterId, score) =>
        set((state) => {
          const rel = state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: { ...state.relationships, [characterId]: setStabilityScore(rel, score) },
          }
        }),

      updateVisibility: (characterId, delta) =>
        set((state) => {
          const rel = state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: { ...state.relationships, [characterId]: updateVisibilityScore(rel, delta) },
          }
        }),

      dismissStageUnlock: () =>
        set((state) => ({ pendingStageUnlocks: state.pendingStageUnlocks.slice(1) })),

      updatePity: (totalPulls, pullsSinceLastSSR) =>
        set({ pity: { totalPulls, pullsSinceLastSSR } }),

      isOwned: (characterId) =>
        get().owned.some((c) => c.id === characterId),

      getOwnedIds: () => new Set(get().owned.map((c) => c.id)),

      getAffection: (characterId) =>
        get().relationships[characterId]?.affection ?? 0,

      isHidden: (characterId, flags) => {
        const requiredFlag = HIDDEN_UNTIL_FLAG[characterId]
        if (!requiredFlag) return false
        return !flags[requiredFlag]
      },

      getRelationshipStage: (characterId) =>
        affectionToStage(get().relationships[characterId]?.affection ?? 0),

      setFlag: (characterId, key, value) =>
        set((state) => ({
          characterFlags: {
            ...state.characterFlags,
            [characterId]: {
              ...(state.characterFlags[characterId] ?? {}),
              [key]: value,
            },
          },
        })),

      getCharacterFlag: (characterId, key) =>
        get().characterFlags[characterId]?.[key] ?? false,
    }),
    { name: 'its-roster', version: 3 }
  )
)
