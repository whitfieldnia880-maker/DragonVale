import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

export type QueuedChangeType =
  | 'stat_update'
  | 'affection_delta'
  | 'gig_complete'
  | 'day_reset'
  | 'pull_result'
  | 'bond_fragment'
  | 'achievement'

export interface QueuedChange {
  id: string
  type: QueuedChangeType
  payload: Record<string, unknown>
  createdAt: string
  synced: boolean
}

interface OfflineQueueStore {
  queue: QueuedChange[]
  isSyncing: boolean
  enqueue: (type: QueuedChangeType, payload: Record<string, unknown>) => void
  markSynced: (id: string) => void
  clearSynced: () => void
  startSync: () => void
  stopSync: () => void
}

export const useOfflineQueue = create<OfflineQueueStore>()(
  persist(
    (set, get) => ({
      queue: [],
      isSyncing: false,

      enqueue: (type, payload) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              id: crypto.randomUUID(),
              type,
              payload,
              createdAt: new Date().toISOString(),
              synced: false,
            },
          ].slice(-200), // cap at 200 unsynced
        })),

      markSynced: (id) =>
        set((state) => ({
          queue: state.queue.map((c) =>
            c.id === id ? { ...c, synced: true } : c
          ),
        })),

      clearSynced: () =>
        set((state) => ({
          queue: state.queue.filter((c) => !c.synced),
        })),

      startSync: () => set({ isSyncing: true }),
      stopSync: () => set({ isSyncing: false }),
    }),
    { name: 'its-offline-queue', version: 1 }
  )
)

// ─── Sync runner ──────────────────────────────────────────────────────────────

function table(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(name)
}

/** Called on reconnect to flush the offline queue. */
export async function flushOfflineQueue(playerId: string): Promise<void> {
  const { queue, markSynced, clearSynced, startSync, stopSync } = useOfflineQueue.getState()
  const pending = queue.filter((c) => !c.synced)
  if (pending.length === 0) return

  startSync()
  try {
    for (const change of pending) {
      try {
        await processQueuedChange(playerId, change)
        markSynced(change.id)
      } catch (err) {
        console.warn(`[offlineQueue] failed to sync ${change.id}:`, err)
      }
    }
    clearSynced()
  } finally {
    stopSync()
  }
}

async function processQueuedChange(
  playerId: string,
  change: QueuedChange
): Promise<void> {
  const { type, payload } = change

  if (type === 'stat_update') {
    await table('players').update({ stats: payload.stats }).eq('id', playerId)
  } else if (type === 'affection_delta') {
    await table('character_progress')
      .update({ affection: payload.affection })
      .eq('player_id', playerId)
      .eq('character_id', payload.characterId)
  } else if (type === 'pull_result') {
    await table('gacha_pulls').insert({ player_id: playerId, ...payload })
  } else if (type === 'achievement') {
    await table('achievements').insert({
      player_id: playerId,
      achievement_key: payload.key,
    })
  } else if (type === 'bond_fragment') {
    await table('bond_fragments').upsert(
      { player_id: playerId, ...payload },
      { onConflict: 'player_id,character_id' }
    )
  }
  // Other types can be added as the system grows
}
