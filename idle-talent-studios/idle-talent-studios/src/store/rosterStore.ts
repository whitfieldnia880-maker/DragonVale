import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character } from '@/data/characters/types'
import type { RelationshipData, RelationshipVisibility } from '@/systems/relationship'
import {
  createRelationship,
  applyAffectionDelta,
  incrementSharedScenes,
  setRelationshipVisibility,
  setStabilityScore,
} from '@/systems/relationship'

const HIDDEN_UNTIL_FLAG: Record<string, string> = {
  'amy-crawford': 'amy_ch6_reveal',
}

interface RosterStore {
  owned: Character[]
  relationships: Record<string, RelationshipData>
  pity: { totalPulls: number; pullsSinceLastSSR: number }

  addCharacter: (character: Character) => void
  applyAffection: (characterId: string, delta: number) => void
  updateAffection: (characterId: string, delta: number) => void
  recordSharedScene: (characterId: string) => void
  setVisibility: (characterId: string, visibility: RelationshipVisibility) => void
  updateStabilityScore: (characterId: string, score: number) => void
  updatePity: (totalPulls: number, pullsSinceLastSSR: number) => void
  isOwned: (characterId: string) => boolean
  getOwnedIds: () => Set<string>
  getAffection: (characterId: string) => number
  isHidden: (characterId: string, flags: Record<string, boolean>) => boolean
}

export const useRosterStore = create<RosterStore>()(
  persist(
    (set, get) => ({
      owned: [],
      relationships: {},
      pity: { totalPulls: 0, pullsSinceLastSSR: 0 },

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
          const rel =
            state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: {
              ...state.relationships,
              [characterId]: applyAffectionDelta(rel, delta),
            },
          }
        }),

      updateAffection: (characterId, delta) =>
        set((state) => {
          const rel =
            state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: {
              ...state.relationships,
              [characterId]: applyAffectionDelta(rel, delta),
            },
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
          const rel =
            state.relationships[characterId] ?? createRelationship(characterId)
          return {
            relationships: {
              ...state.relationships,
              [characterId]: setStabilityScore(rel, score),
            },
          }
        }),

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
    }),
    { name: 'its-roster', version: 2 }
  )
)
