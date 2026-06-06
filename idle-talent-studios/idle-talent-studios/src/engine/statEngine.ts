import type { PlayerStats, StatKey } from './gameState'
import { clampStat } from './gameState'
import type { DayBonuses } from '@/systems/wardrobeSystem'

export interface StatDelta {
  stat: StatKey
  delta: number
  source?: string
}

export interface StatCheckResult {
  passed: boolean
  stat: StatKey
  required: number
  current: number
}

export interface DecayModifiers {
  /** Apartment tier 1-5 — reduces energy decay by 2 per tier. */
  apartmentTier: number
  /** True if any owned character has affection >= 60 — adds +3 to confidence decay. */
  hasActiveRomance: boolean
  /** Current scandal level — >75 pauses reputation decay. */
  scandal: number
}

// ─── Decay computation ────────────────────────────────────────────────────────

/** Returns the stat deltas to apply for a daily decay tick.
 *  Energy is handled separately (it lives outside PlayerStats). */
export function computeStatDecay(modifiers: DecayModifiers): StatDelta[] {
  const { hasActiveRomance, scandal } = modifiers

  const deltas: StatDelta[] = [
    {
      stat: 'confidence',
      delta: -(5 + (hasActiveRomance ? 3 : 0)),
      source: 'daily_decay',
    },
    {
      stat: 'looks',
      delta: -3,
      source: 'daily_decay',
    },
    // wisdom: no decay
    {
      stat: 'reputation',
      // Paused when press is watching (scandal > 75 — damaging coverage freezes decay)
      delta: scandal > 75 ? 0 : -2,
      source: 'daily_decay',
    },
    {
      stat: 'scandal',
      delta: -8,
      source: 'daily_decay',
    },
  ]

  return deltas.filter((d) => d.delta !== 0)
}

/** Returns how much energy to subtract for this day's decay. */
export function computeEnergyDecay(apartmentTier: number): number {
  return Math.max(0, 20 - 2 * (apartmentTier - 1))
}

/** Returns positive stat deltas to apply from the equipped wardrobe on day start. */
export function computeWardrobeDayDeltas(bonuses: DayBonuses): StatDelta[] {
  const deltas: StatDelta[] = []
  if (bonuses.looksBonus > 0) {
    deltas.push({ stat: 'looks', delta: bonuses.looksBonus, source: 'wardrobe' })
  }
  if (bonuses.confBonus > 0) {
    deltas.push({ stat: 'confidence', delta: bonuses.confBonus, source: 'wardrobe' })
  }
  if (bonuses.statTag && bonuses.statBonusValue > 0) {
    deltas.push({
      stat: bonuses.statTag as StatKey,
      delta: bonuses.statBonusValue,
      source: 'wardrobe',
    })
  }
  return deltas
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

export function applyDeltas(
  stats: PlayerStats,
  deltas: StatDelta[]
): PlayerStats {
  const next = { ...stats }
  for (const { stat, delta } of deltas) {
    next[stat] = clampStat(next[stat] + delta)
  }
  return next
}

export function checkStat(
  stats: PlayerStats,
  stat: StatKey,
  required: number
): StatCheckResult {
  return {
    passed: stats[stat] >= required,
    stat,
    required,
    current: stats[stat],
  }
}

export function getStatLabel(stat: StatKey): string {
  const labels: Record<StatKey, string> = {
    confidence: 'Confidence',
    looks: 'Looks',
    wisdom: 'Wisdom',
    reputation: 'Reputation',
    scandal: 'Scandal',
    money: 'Money',
  }
  return labels[stat]
}

export function getStatColor(stat: StatKey): string {
  const colors: Record<StatKey, string> = {
    confidence: '#f472b6',
    looks: '#c084fc',
    wisdom: '#60a5fa',
    reputation: '#34d399',
    scandal: '#f87171',
    money: '#fbbf24',
  }
  return colors[stat]
}
