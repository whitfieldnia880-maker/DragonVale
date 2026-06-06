import { supabase } from './supabase'
import type { PlayerStats } from '@/engine/gameState'
import type { DailyResetResult } from '@/systems/dailyReset'

type Row = Record<string, unknown>

// Typed helper — bypasses the generic inference deadlock on the Supabase client
// while keeping our domain objects fully typed above this layer.
function table(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(name)
}

/** Fire-and-forget Supabase sync after a daily reset.
 *  Never throws — logs errors silently so the local game is never blocked. */
export async function syncDailyReset(
  playerId: string,
  stats: PlayerStats,
  energy: number,
  currentDay: number,
  loginStreak: number,
  result: DailyResetResult
): Promise<void> {
  try {
    await table('players')
      .update({
        stats: stats as unknown as Row,
        energy,
        current_day: currentDay,
        last_daily_reset: new Date().toISOString(),
      } satisfies Row)
      .eq('id', playerId)

    await table('login_streaks').upsert(
      {
        player_id: playerId,
        last_login: new Date().toISOString(),
        streak_count: loginStreak,
      } satisfies Row,
      { onConflict: 'player_id' }
    )

    if (result.spotlightGranted > 0) {
      await table('currency_ledger').insert({
        player_id: playerId,
        currency_type: 'spotlight',
        amount: result.spotlightGranted,
        direction: 'credit',
        source: 'daily_login',
      } satisfies Row)
    }

    for (const event of result.triggeredEvents) {
      await table('daily_events').insert({
        player_id: playerId,
        day: result.newDayNumber,
        event_type: event.eventType,
        character_id: event.characterId,
        content: event.content,
        triggered_at: new Date().toISOString(),
      } satisfies Row)
    }
  } catch (err) {
    console.warn('[supabaseSync] daily reset sync failed (local state is safe):', err)
  }
}
