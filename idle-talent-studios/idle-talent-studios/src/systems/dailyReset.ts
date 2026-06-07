import type { PlayerStats } from '@/engine/gameState'
import type { StatDelta } from '@/engine/statEngine'
import {
  computeStatDecay,
  computeEnergyDecay,
  computeWardrobeDayDeltas,
  applyDeltas,
} from '@/engine/statEngine'
import type { DayBonuses } from '@/systems/wardrobeSystem'
import {
  generatePressHeadline,
  isPressCycleDay,
  getScandalThresholdCrossed,
} from '@/systems/scandal'
import type { PressHeadline, ScandalThreshold } from '@/systems/scandal'
import type { Character, CharacterEvent } from '@/data/characters/types'

// ─── Login item types ─────────────────────────────────────────────────────────

export type LoginItemType =
  | 'pull_ticket' | 'sr_ticket' | 'ssr_ticket'
  | 'spotlight' | 'prestige' | 'energy'
  | 'wardrobe_common' | 'wardrobe_rare' | 'wardrobe_epic' | 'wardrobe_legendary'
  | 'scandal_reducer' | 'bond_fragment'

export interface LoginItem {
  type: LoginItemType
  amount: number
  label: string
  emoji: string
  daySlot: number
}

export interface StreakMilestoneReward {
  streakDay: number
  label: string
  prestigeGrant?: number
  srTicketGrant?: boolean
  bondFragmentGrant?: boolean
  wardrobeRarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

// ─── Daily login item rotation (7-day cycle) ──────────────────────────────────

export const DAILY_LOGIN_ITEMS: LoginItem[] = [
  { type: 'pull_ticket',     amount: 1,  label: 'Pull Ticket',     emoji: '🎫', daySlot: 1 },
  { type: 'spotlight',       amount: 80, label: '80 Spotlight',    emoji: '✨', daySlot: 2 },
  { type: 'energy',          amount: 30, label: '+30 Energy',      emoji: '⚡', daySlot: 3 },
  { type: 'wardrobe_common', amount: 1,  label: 'Common Wardrobe', emoji: '👗', daySlot: 4 },
  { type: 'spotlight',       amount: 80, label: '80 Spotlight',    emoji: '✨', daySlot: 5 },
  { type: 'scandal_reducer', amount: 1,  label: 'Scandal -5',      emoji: '🎭', daySlot: 6 },
  { type: 'prestige',        amount: 1,  label: '1 Prestige',      emoji: '💎', daySlot: 7 },
]

export const WEEKLY_BONUS: Array<{ type: LoginItemType; amount: number; label: string; emoji: string }> = [
  { type: 'prestige',   amount: 3, label: '3 Prestige',     emoji: '💎' },
  { type: 'sr_ticket',  amount: 1, label: 'SR Pull Ticket', emoji: '🎫' },
]

export const STREAK_MILESTONE_REWARDS: Record<number, StreakMilestoneReward> = {
  7:   { streakDay: 7,   label: 'Week One!',         prestigeGrant: 5 },
  14:  { streakDay: 14,  label: 'Two Weeks Strong',  wardrobeRarity: 'common' },
  30:  { streakDay: 30,  label: 'One Month',         prestigeGrant: 15, wardrobeRarity: 'rare' },
  60:  { streakDay: 60,  label: 'Two Months',        prestigeGrant: 25, wardrobeRarity: 'epic' },
  100: { streakDay: 100, label: 'Century Milestone', prestigeGrant: 50, srTicketGrant: true, bondFragmentGrant: true, wardrobeRarity: 'legendary' },
}

export function getLoginItem(day: number): LoginItem {
  const index = (day - 1) % 7
  return DAILY_LOGIN_ITEMS[index]
}

export function getStreakMilestone(streak: number): StreakMilestoneReward | null {
  return STREAK_MILESTONE_REWARDS[streak] ?? null
}

export function getNextMilestoneStreak(currentStreak: number): number | null {
  const milestones = [7, 14, 30, 60, 100]
  return milestones.find((m) => m > currentStreak) ?? null
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProcessedCharacterEvent {
  /** Unique ID to deduplicate and track as fired. */
  id: string
  characterId: string
  characterName: string
  portrait: string
  eventType: CharacterEvent['eventType']
  content: string
  affectionDelta: number
  scandalizeDelta: number
  sceneRef?: string
  triggeredOnDay: number
}

export interface DailyResetContext {
  stats: PlayerStats
  energy: number
  currentDay: number
  lastDailyReset: string | null
  storyFlags: Record<string, boolean>
  ownedCharacters: Character[]
  /** affection value per characterId */
  affectionMap: Record<string, number>
  apartmentTier: number
  /** currentChapter used to derive career tier */
  currentChapter: number
  loginStreak: number
  firedEventIds: string[]
  /** Wardrobe bonuses to apply as positive deltas on day start. */
  wardrobeBonuses?: DayBonuses
  /** Passive scandal points per day from active chapters (e.g. Marcus ch.5). */
  passiveScandalActive?: number
}

export interface DailyResetResult {
  newDayNumber: number
  newLoginStreak: number
  statDeltas: StatDelta[]
  wardrobeDeltas: StatDelta[]
  pendingAffinityBonuses: Record<string, number>
  energyAfter: number
  spotlightGranted: number
  triggeredEvents: ProcessedCharacterEvent[]
  pressHeadline: PressHeadline | null
  newScandalThresholds: ScandalThreshold[]
  milestoneReward: StreakMilestoneReward | null
  weeklyBonusGranted: boolean
}

// ─── Streak helpers ───────────────────────────────────────────────────────────

export function shouldRunDailyReset(lastReset: string | null): boolean {
  if (!lastReset) return true
  const last = new Date(lastReset)
  const now = new Date()
  return (
    last.getUTCFullYear() !== now.getUTCFullYear() ||
    last.getUTCMonth() !== now.getUTCMonth() ||
    last.getUTCDate() !== now.getUTCDate()
  )
}

export function computeLoginStreak(
  lastReset: string | null,
  currentStreak: number
): number {
  if (!lastReset) return 1

  const last = new Date(lastReset)
  const now = new Date()
  const diffMs = now.getTime() - last.getTime()
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffDays === 1) return currentStreak + 1
  if (diffDays === 0) return currentStreak // same day, no change
  return 1 // missed a day — reset streak
}

// ─── Spotlight grant ──────────────────────────────────────────────────────────

export function computeSpotlightGrant(
  currentChapter: number,
  loginStreak: number
): number {
  const base = 50
  const careerTier = Math.min(5, Math.floor(currentChapter / 2) + 1)
  const careerBonus = (careerTier - 1) * 10
  const streakBonus = Math.min(50, (loginStreak - 1) * 5)
  return base + careerBonus + streakBonus
}

// ─── Character event processing ───────────────────────────────────────────────

export function processCharacterEvents(
  ownedCharacters: Character[],
  currentDay: number,
  storyFlags: Record<string, boolean>,
  firedEventIds: string[]
): ProcessedCharacterEvent[] {
  const results: ProcessedCharacterEvent[] = []

  for (const character of ownedCharacters) {
    if (!character.events) continue
    for (const event of character.events) {
      const eventId = `${character.id}::${event.id}`
      if (firedEventIds.includes(eventId)) continue

      const shouldFire =
        (event.trigger.type === 'day' && currentDay >= event.trigger.value) ||
        (event.trigger.type === 'flag' && storyFlags[event.trigger.value] === true)

      if (!shouldFire) continue

      results.push({
        id: eventId,
        characterId: character.id,
        characterName: character.name,
        portrait: character.portraitPlaceholder,
        eventType: event.eventType,
        content: event.content,
        affectionDelta: event.affectionDelta,
        scandalizeDelta: event.scandalizeDelta,
        sceneRef: event.sceneRef,
        triggeredOnDay: currentDay,
      })
    }
  }

  return results
}

// ─── Full reset computation ───────────────────────────────────────────────────

export function computeDailyReset(ctx: DailyResetContext): DailyResetResult {
  const newDayNumber = ctx.currentDay + 1
  const newLoginStreak = computeLoginStreak(ctx.lastDailyReset, ctx.loginStreak)

  // Stat decay
  const hasActiveRomance = Object.values(ctx.affectionMap).some((a) => a >= 60)
  const decayModifiers = {
    apartmentTier: ctx.apartmentTier,
    hasActiveRomance,
    scandal: ctx.stats.scandal,
  }
  const statDeltas = computeStatDecay(decayModifiers)

  // Passive scandal from active chapters (e.g. Marcus ch.5 leak)
  if (ctx.passiveScandalActive && ctx.passiveScandalActive > 0) {
    const existing = statDeltas.find((d) => d.stat === 'scandal')
    if (existing) {
      existing.delta += ctx.passiveScandalActive
    } else {
      statDeltas.push({ stat: 'scandal', delta: ctx.passiveScandalActive })
    }
  }

  // Energy decay (separate from stats)
  const rawEnergyDecay = computeEnergyDecay(ctx.apartmentTier)
  const energyAfter = Math.max(0, ctx.energy - rawEnergyDecay)

  // Spotlight grant
  const spotlightGranted = computeSpotlightGrant(ctx.currentChapter, newLoginStreak)

  // Check if stat decay crosses any scandal thresholds
  const projectedStats = applyDeltas(ctx.stats, statDeltas)
  const newScandalThresholds: ScandalThreshold[] = []
  const scandalThreshold = getScandalThresholdCrossed(
    ctx.stats.scandal,
    projectedStats.scandal
  )
  if (scandalThreshold) newScandalThresholds.push(scandalThreshold)

  // Press cycle (every 3 days)
  const pressHeadline = isPressCycleDay(newDayNumber)
    ? generatePressHeadline(ctx.stats.scandal, newDayNumber)
    : null

  // Character events
  const triggeredEvents = processCharacterEvents(
    ctx.ownedCharacters,
    newDayNumber,
    ctx.storyFlags,
    ctx.firedEventIds
  )

  // Wardrobe day bonuses (positive deltas applied after decay)
  const wardrobeDeltas = ctx.wardrobeBonuses
    ? computeWardrobeDayDeltas(ctx.wardrobeBonuses)
    : []
  const pendingAffinityBonuses = ctx.wardrobeBonuses?.pendingAffinityBonuses ?? {}

  const milestoneReward = getStreakMilestone(newLoginStreak)
  const weeklyBonusGranted = newLoginStreak > 0 && newLoginStreak % 7 === 0

  return {
    newDayNumber,
    newLoginStreak,
    statDeltas,
    wardrobeDeltas,
    pendingAffinityBonuses,
    energyAfter,
    spotlightGranted,
    triggeredEvents,
    pressHeadline,
    newScandalThresholds,
    milestoneReward,
    weeklyBonusGranted,
  }
}
