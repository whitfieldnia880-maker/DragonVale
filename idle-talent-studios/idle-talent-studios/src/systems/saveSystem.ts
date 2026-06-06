import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface SaveStore {
  lastSavedAt: string | null
  isSaving: boolean
  pendingChanges: number
  markDirty: () => void
  markSaved: () => void
  setSaving: (v: boolean) => void
}

export const useSaveStore = create<SaveStore>()(
  persist(
    (set) => ({
      lastSavedAt: null,
      isSaving: false,
      pendingChanges: 0,

      markDirty: () => set((s) => ({ pendingChanges: s.pendingChanges + 1 })),
      markSaved: () => set({ lastSavedAt: new Date().toISOString(), pendingChanges: 0 }),
      setSaving: (v) => set({ isSaving: v }),
    }),
    { name: 'its-save-meta', partialize: (s) => ({ lastSavedAt: s.lastSavedAt }) }
  )
)

// ─── Sync helpers ─────────────────────────────────────────────────────────────

function table(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(name)
}

/** Push current player stats + story flags to Supabase. Fire-and-forget. */
export async function syncPlayerState(
  playerId: string,
  stats: Record<string, number>,
  storyFlags: Record<string, boolean>,
  currentDay: number
): Promise<void> {
  try {
    useSaveStore.getState().setSaving(true)
    await table('players').update({ stats, story_flags: storyFlags, current_day: currentDay }).eq('id', playerId)
    useSaveStore.getState().markSaved()
  } catch (err) {
    console.warn('[saveSystem] syncPlayerState failed:', err)
  } finally {
    useSaveStore.getState().setSaving(false)
  }
}

/** Push a single gacha pull result. Fire-and-forget. */
export async function syncGachaPull(
  playerId: string,
  bannerId: string,
  characterId: string,
  rarity: string,
  isDuplicate: boolean,
  isNew: boolean,
  bondFragment: boolean,
  spotlightConverted: number,
  pityAtPull: number
): Promise<void> {
  try {
    await table('gacha_pulls').insert({
      player_id: playerId,
      banner_id: bannerId,
      character_id: characterId,
      rarity,
      is_duplicate: isDuplicate,
      is_new_character: isNew,
      bond_fragment_granted: bondFragment,
      spotlight_converted: spotlightConverted,
      pity_at_pull: pityAtPull,
    })
  } catch (err) {
    console.warn('[saveSystem] syncGachaPull failed:', err)
  }
}

/** Push bond fragment update. Fire-and-forget. */
export async function syncBondFragment(
  playerId: string,
  characterId: string,
  fragmentCount: number,
  scenesUnlocked: number
): Promise<void> {
  try {
    await table('bond_fragments').upsert(
      { player_id: playerId, character_id: characterId, fragment_count: fragmentCount, scenes_unlocked: scenesUnlocked },
      { onConflict: 'player_id,character_id' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncBondFragment failed:', err)
  }
}

/** Push an unlocked achievement. Fire-and-forget. */
export async function syncAchievement(
  playerId: string,
  achievementKey: string
): Promise<void> {
  try {
    await table('achievements').insert({ player_id: playerId, achievement_key: achievementKey })
  } catch (err) {
    // Ignore duplicate key errors — achievement already recorded
    if (!(err as Error).message?.includes('duplicate')) {
      console.warn('[saveSystem] syncAchievement failed:', err)
    }
  }
}

/** Push player setting. Fire-and-forget. */
export async function syncSettings(
  playerId: string,
  soundEnabled: boolean,
  notificationsEnabled: boolean
): Promise<void> {
  try {
    await table('settings').upsert(
      { player_id: playerId, sound_enabled: soundEnabled, notifications_enabled: notificationsEnabled },
      { onConflict: 'player_id' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncSettings failed:', err)
  }
}
