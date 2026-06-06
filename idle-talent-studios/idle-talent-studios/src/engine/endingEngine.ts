import type { CharacterEnding, EndingCondition, EndingType } from '@/data/characters/types'
import type { CompletedGigRecord } from '@/store/gigStore'

export interface EndingEvalContext {
  affection: number
  stats: Record<string, number>
  flags: Record<string, boolean>
  fascination: number
  hiddenNotesFound: number[]
  gigHistory: CompletedGigRecord[]
}

function evalCondition(cond: EndingCondition, ctx: EndingEvalContext): boolean {
  switch (cond.type) {
    case 'min_affection':
      return ctx.affection >= (cond.value ?? 0)
    case 'max_scandal':
      return (ctx.stats['scandal'] ?? 0) <= (cond.value ?? 100)
    case 'min_scandal':
      return (ctx.stats['scandal'] ?? 0) >= (cond.value ?? 0)
    case 'min_stat':
      return (ctx.stats[cond.stat ?? ''] ?? 0) >= (cond.value ?? 0)
    case 'max_stat':
      return (ctx.stats[cond.stat ?? ''] ?? 0) <= (cond.value ?? 9999)
    case 'flag_true':
      return ctx.flags[cond.flag ?? ''] === true
    case 'flag_false':
      return !ctx.flags[cond.flag ?? '']
    case 'max_fame': {
      const fame = Math.min(100, (ctx.stats['reputation'] ?? 0) * 0.6 + ctx.fascination * 0.4)
      return fame <= (cond.value ?? 100)
    }
    case 'min_notes':
      return ctx.hiddenNotesFound.length >= (cond.value ?? 0)
    case 'gigs_skipped': {
      const skippedHighTier = countSkippedHighTierGigs(ctx.gigHistory)
      return skippedHighTier >= (cond.value ?? 0)
    }
    default:
      return false
  }
}

/** Counts consecutive high-tier (tier≥4) gig skips in recent history. */
function countSkippedHighTierGigs(history: CompletedGigRecord[]): number {
  let maxConsecutive = 0
  let current = 0
  for (const record of history) {
    if (record.outcomeTier === 'flop') {
      current++
      maxConsecutive = Math.max(maxConsecutive, current)
    } else {
      current = 0
    }
  }
  return maxConsecutive
}

/**
 * Evaluates endings in declaration order (true → secret → good → heartbreak).
 * Returns the first ending whose every condition passes, or null if none qualify.
 * Caller should guarantee a heartbreak with no conditions as the final fallback.
 */
export function evaluateEnding(
  endings: CharacterEnding[],
  ctx: EndingEvalContext
): EndingType | null {
  for (const ending of endings) {
    if (ending.conditions.every((c) => evalCondition(c, ctx))) {
      return ending.type
    }
  }
  return null
}
