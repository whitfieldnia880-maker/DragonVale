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
  }
}
