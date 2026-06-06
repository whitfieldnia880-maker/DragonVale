import { useCallback } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useRosterStore } from '@/store/rosterStore'
import { useProgressStore } from '@/store/progressStore'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { computeDailyReset } from '@/systems/dailyReset'
import type { DailyResetResult } from '@/systems/dailyReset'
import { syncDailyReset } from '@/lib/supabaseSync'

export function useDailyReset() {
  const playerStore = usePlayerStore()
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)
  const ownedCharacters = useRosterStore((s) => s.owned)
  const affectionMap = useRosterStore((s) =>
    Object.fromEntries(
      Object.entries(s.relationships).map(([id, rel]) => [id, rel.affection])
    )
  )
  const apartmentLevel = useProgressStore((s) => s.apartmentLevel)
  const firedEventIds = useProgressStore((s) => s.firedEventIds)
  const markEventFired = useProgressStore((s) => s.markEventFired)
  const addPendingEvent = useProgressStore((s) => s.addPendingEvent)
  const addPressHeadline = useProgressStore((s) => s.addPressHeadline)
  const clearDayActions = useProgressStore((s) => s.clearDayActions)
  const getDayBonuses = useWardrobeStore((s) => s.getDayBonuses)
  const setPendingAffinityBonuses = useWardrobeStore((s) => s.setPendingAffinityBonuses)

  const trigger = useCallback((force = false): DailyResetResult | null => {
    if (!force && !playerStore.needsDailyReset()) return null

    const result = computeDailyReset({
      stats: playerStore.stats,
      energy: playerStore.energy,
      currentDay: playerStore.currentDay,
      lastDailyReset: playerStore.lastDailyReset,
      storyFlags: playerStore.storyFlags,
      ownedCharacters,
      affectionMap,
      apartmentTier: apartmentLevel,
      currentChapter: playerStore.currentChapter,
      loginStreak: playerStore.loginStreak,
      firedEventIds,
      wardrobeBonuses: getDayBonuses(),
    })

    // Apply stat decay
    playerStore.applyStatDeltas(result.statDeltas)

    // Apply wardrobe day bonuses (positive)
    if (result.wardrobeDeltas.length) {
      playerStore.applyStatDeltas(result.wardrobeDeltas)
    }

    // Store outfit affinity bonuses for next scene
    if (Object.keys(result.pendingAffinityBonuses).length) {
      setPendingAffinityBonuses(result.pendingAffinityBonuses)
    }

    // Apply energy decay
    playerStore.setEnergy(result.energyAfter)

    // Advance day + streak
    playerStore.setDayAndStreak(result.newDayNumber, result.newLoginStreak)

    // Mark reset time
    playerStore.markDailyReset()

    // Push any scandal threshold events
    if (result.newScandalThresholds.length) {
      playerStore.pushScandalThresholds(result.newScandalThresholds)
    }

    // Grant spotlight
    grantCurrency('spotlight', result.spotlightGranted, 'daily_login')

    // Process character events
    for (const event of result.triggeredEvents) {
      markEventFired(event.id)
      addPendingEvent(event)
    }

    // Update press history
    if (result.pressHeadline) {
      addPressHeadline(result.pressHeadline)
    }

    // Reset per-day apartment actions
    clearDayActions()

    // Async Supabase sync (fire-and-forget)
    if (playerStore.playerId) {
      void syncDailyReset(
        playerStore.playerId,
        playerStore.stats,
        result.energyAfter,
        result.newDayNumber,
        result.newLoginStreak,
        result
      )
    }

    return result
  }, [
    playerStore,
    grantCurrency,
    ownedCharacters,
    affectionMap,
    apartmentLevel,
    firedEventIds,
    markEventFired,
    addPendingEvent,
    addPressHeadline,
    clearDayActions,
    getDayBonuses,
    setPendingAffinityBonuses,
  ])

  return { trigger, needsReset: playerStore.needsDailyReset() }
}
