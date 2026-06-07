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

/** Push completed chapter progress. Fire-and-forget. */
export async function syncChapterProgress(
  playerId: string,
  characterId: string,
  chapterNumber: number,
  sceneId: string
): Promise<void> {
  try {
    await table('chapter_progress').upsert(
      {
        player_id: playerId,
        character_id: characterId,
        chapter_number: chapterNumber,
        scene_id: sceneId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'player_id,character_id,chapter_number' }
    )
    useSaveStore.getState().markSaved()
  } catch (err) {
    console.warn('[saveSystem] syncChapterProgress failed:', err)
  }
}

/** Push a single story flag. Fire-and-forget. */
export async function syncStoryFlag(
  playerId: string,
  key: string,
  value: boolean | number | string
): Promise<void> {
  try {
    await table('story_flags').upsert(
      { player_id: playerId, flag_key: key, flag_value: String(value) },
      { onConflict: 'player_id,flag_key' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncStoryFlag failed:', err)
  }
}

/** Push affection delta for a character. Fire-and-forget. */
export async function syncCharacterAffection(
  playerId: string,
  characterId: string,
  affection: number
): Promise<void> {
  try {
    await table('character_progress').upsert(
      { player_id: playerId, character_id: characterId, affection },
      { onConflict: 'player_id,character_id' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncCharacterAffection failed:', err)
  }
}

/** Push inventory snapshot. Fire-and-forget. */
export async function syncInventory(
  playerId: string,
  pullTicketsStd: number,
  pullTicketsSr: number,
  pullTicketsSsr: number,
  energyRefills: number,
  scandalReducers: number,
  wardrobeItems: string[],
  bondFragments: Record<string, number>
): Promise<void> {
  try {
    await table('player_inventory').upsert(
      {
        player_id: playerId,
        pull_tickets_std: pullTicketsStd,
        pull_tickets_sr: pullTicketsSr,
        pull_tickets_ssr: pullTicketsSsr,
        energy_refills: energyRefills,
        scandal_reducers: scandalReducers,
        wardrobe_items: wardrobeItems,
        bond_fragments: bondFragments,
      },
      { onConflict: 'player_id' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncInventory failed:', err)
  }
}

/** Record a claimed daily reward. Fire-and-forget. */
export async function syncDailyRewardClaim(
  playerId: string,
  dayNumber: number,
  itemType: string,
  itemAmount: number
): Promise<void> {
  try {
    await table('daily_rewards').upsert(
      { player_id: playerId, day_number: dayNumber, item_type: itemType, item_amount: itemAmount },
      { onConflict: 'player_id,day_number' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncDailyRewardClaim failed:', err)
  }
}

/** Record a claimed streak milestone. Fire-and-forget. */
export async function syncStreakMilestoneClaim(
  playerId: string,
  streakDay: number
): Promise<void> {
  try {
    await table('claimed_streak_milestones').upsert(
      { player_id: playerId, streak_day: streakDay },
      { onConflict: 'player_id,streak_day' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncStreakMilestoneClaim failed:', err)
  }
}

/** Push relationship stats (visibility, chemistry, stability). Fire-and-forget. */
export async function syncRelationshipStats(
  playerId: string,
  characterId: string,
  visibilityScore: number,
  chemistry: number,
  stabilityScore: number
): Promise<void> {
  try {
    await table('character_progress').upsert(
      { player_id: playerId, character_id: characterId, visibility_score: visibilityScore, chemistry, stability_score: stabilityScore },
      { onConflict: 'player_id,character_id' }
    )
  } catch (err) {
    console.warn('[saveSystem] syncRelationshipStats failed:', err)
  }
}

/** Log a fascination delta. Fire-and-forget. */
export async function syncFascinationDelta(
  playerId: string,
  delta: number,
  source: string
): Promise<void> {
  try {
    await table('fascination_log').insert({ player_id: playerId, delta, source })
  } catch (err) {
    console.warn('[saveSystem] syncFascinationDelta failed:', err)
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
