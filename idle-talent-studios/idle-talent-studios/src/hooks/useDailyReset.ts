import { useCallback } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useRosterStore } from '@/store/rosterStore'
import { useProgressStore } from '@/store/progressStore'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { useInventoryStore } from '@/store/inventoryStore'
import { computeDailyReset, WEEKLY_BONUS } from '@/systems/dailyReset'
import type { DailyResetResult } from '@/systems/dailyReset'
import { syncDailyReset } from '@/lib/supabaseSync'
import { syncStreakMilestoneClaim } from '@/systems/saveSystem'

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
  const inventoryStore = useInventoryStore()

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

    // Weekly bonus (every 7-day streak multiple)
    if (result.weeklyBonusGranted) {
      for (const item of WEEKLY_BONUS) {
        if (item.type === 'prestige') {
          grantCurrency('prestige', item.amount, 'weekly_streak_bonus')
        } else if (item.type === 'sr_ticket') {
          inventoryStore.addPullTickets('sr', item.amount)
        }
      }
    }

    // Streak milestone reward (specific thresholds only, claimed once)
    if (result.milestoneReward) {
      const { streakDay, prestigeGrant, srTicketGrant, bondFragmentGrant, wardrobeRarity } = result.milestoneReward
      if (!inventoryStore.claimedStreakMilestones.includes(streakDay)) {
        if (prestigeGrant) grantCurrency('prestige', prestigeGrant, `streak_milestone_${streakDay}`)
        if (srTicketGrant) inventoryStore.addPullTickets('sr', 1)
        if (bondFragmentGrant) inventoryStore.addBondFragment('any', 1)
        if (wardrobeRarity) inventoryStore.addWardrobeItem(`milestone_wardrobe_${wardrobeRarity}_s${streakDay}`)
        inventoryStore.markStreakMilestoneClaimed(streakDay)
        if (playerStore.playerId) {
          void syncStreakMilestoneClaim(playerStore.playerId, streakDay)
        }
      }
    }

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
    inventoryStore,
  ])

  return { trigger, needsReset: playerStore.needsDailyReset() }
}

