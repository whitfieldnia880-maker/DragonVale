import type { PlayerStats, StatKey } from '@/engine/gameState'
import type { StatDelta } from '@/engine/statEngine'

// ─── Core types ───────────────────────────────────────────────────────────────

export type OutcomeTier = 'flop' | 'decent' | 'hit' | 'smash' | 'iconic'
export type PrepChoiceId =
  | 'wing_it'
  | 'play_it_safe'
  | 'go_viral'
  | 'method_mode'
  | 'take_the_check'
export type RiskChipType = 'scandal_risk' | 'fascination_spike' | 'reputation_risk'
export type GigVoice =
  | 'your_publicist'
  | 'industry_weekly'
  | 'celebrity_central'
  | 'the_mirror'
  | 'rival_management'
  | 'anonymous_tip'

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface RiskChip {
  type: RiskChipType
  severity: 'low' | 'medium' | 'high'
}

export interface PrepChoiceDef {
  id: PrepChoiceId
  label: string
  description: string
  requiresWisdom?: number
}

export interface Gig {
  id: string
  title: string
  description: string
  duration: number
  baseReward: { spotlight: number; stats: Partial<PlayerStats> }
  riskChips: RiskChip[]
  romanceHook?: string
  voice: GigVoice
  tierRequired: number
}

export interface ActiveGig {
  gigId: string
  prepChoice: PrepChoiceId
  dayStarted: number
  daysRequired: number
}

export interface GigOutcome {
  tier: OutcomeTier
  spotlight: number
  statDeltas: StatDelta[]
  fascinationDelta: number
  scandalDelta: number
  narration: string
  visibilityEscalate: boolean
}

export interface CareerTierDef {
  tier: number
  name: string
  description: string
  color: string
  gigCount: number
  reputationMin: number
  scandalMax: number
  requiresSSRRoute: boolean
  requiresTrueEnding: boolean
}

// ─── Prep choices ─────────────────────────────────────────────────────────────

export const PREP_CHOICES: PrepChoiceDef[] = [
  {
    id: 'wing_it',
    label: 'Wing It',
    description: 'Full RNG. Anything can happen.',
  },
  {
    id: 'play_it_safe',
    label: 'Play It Safe',
    description: 'Scandal −50%, reward ×0.8. Safer floor.',
  },
  {
    id: 'go_viral',
    label: 'Go Viral',
    description: 'Fascination +30, reward ×1.3. Scandal +20%.',
  },
  {
    id: 'method_mode',
    label: 'Method Mode',
    description: 'Best outcomes, reward ×1.5. Requires Wisdom 50+.',
    requiresWisdom: 50,
  },
  {
    id: 'take_the_check',
    label: 'Take the Check',
    description: 'Guaranteed base reward. No variance, no stat gains.',
  },
]

// ─── Career tiers ─────────────────────────────────────────────────────────────

export const CAREER_TIERS: CareerTierDef[] = [
  {
    tier: 1, name: 'Nobody',
    description: 'The city doesn\'t know you yet.',
    color: '#f59e0b',
    gigCount: 0, reputationMin: 0, scandalMax: 100,
    requiresSSRRoute: false, requiresTrueEnding: false,
  },
  {
    tier: 2, name: 'Buzz',
    description: 'People are starting to talk.',
    color: '#9f1239',
    gigCount: 5, reputationMin: 20, scandalMax: 100,
    requiresSSRRoute: false, requiresTrueEnding: false,
  },
  {
    tier: 3, name: 'Rising',
    description: 'The industry is watching.',
    color: '#1e40af',
    gigCount: 15, reputationMin: 40, scandalMax: 60,
    requiresSSRRoute: false, requiresTrueEnding: false,
  },
  {
    tier: 4, name: 'Star',
    description: 'You\'re on the circuit now.',
    color: '#d97706',
    gigCount: 30, reputationMin: 60, scandalMax: 50,
    requiresSSRRoute: false, requiresTrueEnding: false,
  },
  {
    tier: 5, name: 'Icon',
    description: 'A name that precedes you.',
    color: '#be185d',
    gigCount: 50, reputationMin: 75, scandalMax: 100,
    requiresSSRRoute: true, requiresTrueEnding: false,
  },
  {
    tier: 6, name: 'Legend',
    description: 'The industry will never be the same.',
    color: '#e2e8f0',
    gigCount: 75, reputationMin: 90, scandalMax: 30,
    requiresSSRRoute: false, requiresTrueEnding: true,
  },
]

export function getCareerTierConfig(tier: number): CareerTierDef {
  return CAREER_TIERS[Math.min(6, Math.max(1, tier)) - 1]
}

export function getNextTierRequirements(currentTier: number): CareerTierDef | null {
  return CAREER_TIERS.find((t) => t.tier === currentTier + 1) ?? null
}

export function computeCareerTier(
  completedGigs: number,
  reputation: number,
  scandal: number,
  hasSSRRoute: boolean,
  hasTrueEnding: boolean
): number {
  for (let i = CAREER_TIERS.length - 1; i >= 0; i--) {
    const def = CAREER_TIERS[i]
    if (
      completedGigs >= def.gigCount &&
      reputation >= def.reputationMin &&
      scandal <= def.scandalMax &&
      (!def.requiresSSRRoute || hasSSRRoute) &&
      (!def.requiresTrueEnding || hasTrueEnding)
    ) {
      return def.tier
    }
  }
  return 1
}

// ─── Idle earnings ────────────────────────────────────────────────────────────

export const IDLE_RATES: Record<number, number> = {
  1: 10, 2: 25, 3: 60, 4: 150, 5: 400, 6: 1000,
}

export const IDLE_CAP_HOURS = 8
export const IDLE_CAP_HOURS_EXTENDED = 16

export function computeIdleAccrual(
  tier: number,
  hoursSince: number,
  extendedCap: boolean
): number {
  const cap = extendedCap ? IDLE_CAP_HOURS_EXTENDED : IDLE_CAP_HOURS
  const rate = IDLE_RATES[Math.min(6, Math.max(1, tier))]
  return Math.floor(Math.min(hoursSince, cap) * rate)
}

// ─── Fascination ──────────────────────────────────────────────────────────────

export function computeFascinationDecay(current: number): number {
  if (current <= 0) return 0
  if (current > 70) return Math.max(0, current - 1)
  return Math.max(0, current - 3)
}

// ─── Narration ────────────────────────────────────────────────────────────────

const NARRATION: Record<GigVoice, Record<OutcomeTier, string>> = {
  your_publicist: {
    flop:   'We are spinning this as a "growth moment." Give me 48 hours.',
    decent: 'Solid. Not what we hoped for, but the room respected you.',
    hit:    'Good work. Three callbacks already in my inbox.',
    smash:  'This is exactly what we needed. Phones are blowing up.',
    iconic: 'You just changed the conversation. I\'m taking the week off.',
  },
  industry_weekly: {
    flop:   'A forgettable turn. The industry noticed — and moved on.',
    decent: 'Competent. Not a headline, but a résumé line.',
    hit:    'A credible showing. The right doors are opening.',
    smash:  'Undeniable. Every casting director is making notes.',
    iconic: 'Once-in-a-decade. We\'ll be writing about this for years.',
  },
  celebrity_central: {
    flop:   'Yikes. This is going on the year-end list.',
    decent: 'Low-key successful. Fans seemed... fine with it.',
    hit:    'The audience is reacting. Trending in twelve markets.',
    smash:  'OBSESSED. Everyone is talking about this.',
    iconic: 'Literally historic. We might be witnessing something.',
  },
  the_mirror: {
    flop:   'We didn\'t make it to press. That says enough.',
    decent: 'A paragraph on page seven. Adequate.',
    hit:    'Cover consideration. Don\'t blow it.',
    smash:  'We\'re clearing the front page.',
    iconic: 'First in decades to earn this column\'s full spread.',
  },
  rival_management: {
    flop:   'Our client sends their condolences.',
    decent: 'We were watching. Our concern is growing.',
    hit:    'Noted. Counter-programming in three... two...',
    smash:  'A threat. We\'ll be responding accordingly.',
    iconic: 'We concede this round. Don\'t get comfortable.',
  },
  anonymous_tip: {
    flop:   'Someone\'s already leaking this to the tabloids.',
    decent: 'Nothing worth reporting. Move along.',
    hit:    'Interesting. I have a source on the inside now.',
    smash:  'I can\'t say how I know, but you\'ve arrived.',
    iconic: 'History was in that room. I was there.',
  },
}

export function getOutcomeNarration(voice: GigVoice, tier: OutcomeTier): string {
  return NARRATION[voice]?.[tier] ?? '…'
}

export const VOICE_DISPLAY: Record<GigVoice, string> = {
  your_publicist:   'Your Publicist',
  industry_weekly:  'Industry Weekly',
  celebrity_central:'Celebrity Central',
  the_mirror:       'The Mirror',
  rival_management: 'Rival Management',
  anonymous_tip:    'Anonymous',
}

// ─── Risk chip meta ───────────────────────────────────────────────────────────

export const RISK_CHIP_META: Record<RiskChipType, { label: string; color: string }> = {
  scandal_risk:      { label: 'Scandal Risk',  color: '#ef4444' },
  fascination_spike: { label: 'Fascination ↑', color: '#a855f7' },
  reputation_risk:   { label: 'Rep Risk',      color: '#f97316' },
}

// ─── Outcome display ──────────────────────────────────────────────────────────

export const OUTCOME_REWARD_MULT: Record<OutcomeTier, number> = {
  flop: 0.1, decent: 0.6, hit: 1.0, smash: 1.5, iconic: 2.5,
}

export const OUTCOME_LABELS: Record<OutcomeTier, string> = {
  flop: 'Flop', decent: 'Decent', hit: 'Hit', smash: 'Smash', iconic: 'Iconic',
}

export const OUTCOME_COLORS: Record<OutcomeTier, string> = {
  flop:   '#ef4444',
  decent: '#94a3b8',
  hit:    '#60a5fa',
  smash:  '#c084fc',
  iconic: '#fbbf24',
}

// ─── Outcome computation ──────────────────────────────────────────────────────

const OUTCOME_THRESHOLDS: [number, OutcomeTier][] = [
  [86, 'iconic'],
  [66, 'smash'],
  [41, 'hit'],
  [21, 'decent'],
  [0,  'flop'],
]

function rollToOutcome(roll: number): OutcomeTier {
  for (const [threshold, tier] of OUTCOME_THRESHOLDS) {
    if (roll >= threshold) return tier
  }
  return 'flop'
}

export function computeOutcome(
  gig: Gig,
  prep: PrepChoiceId,
  stats: PlayerStats,
  fascination: number,
  romanceAffection: number
): GigOutcome {
  if (prep === 'take_the_check') {
    return {
      tier: 'decent',
      spotlight: gig.baseReward.spotlight,
      statDeltas: [],
      fascinationDelta: 0,
      scandalDelta: 0,
      narration: getOutcomeNarration(gig.voice, 'decent'),
      visibilityEscalate: false,
    }
  }

  let roll = Math.random() * 100

  // Confidence → decent/hit threshold
  if (stats.confidence >= 40) roll += 10
  if (stats.confidence >= 60) roll += 5

  // Looks → hit/smash threshold
  if (stats.looks >= 50) roll += 10
  if (stats.looks >= 70) roll += 5

  // Wisdom → smash/iconic threshold
  if (stats.wisdom >= 50) roll += 10
  if (stats.wisdom >= 70) roll += 5

  // Scandal penalty — adds flop weight
  if (stats.scandal >= 50) roll -= 15
  if (stats.scandal >= 75) roll -= 25

  // Romance hook
  if (gig.romanceHook && romanceAffection >= 40) roll += 15

  let rewardMult = 1.0
  let fascinationDelta = 0
  let scandalMult = 1.0

  switch (prep) {
    case 'play_it_safe':
      roll = roll * 0.8
      rewardMult = 0.8
      scandalMult = 0.5
      break
    case 'go_viral':
      roll += 20
      rewardMult = 1.3
      fascinationDelta += 30
      scandalMult = 1.2
      break
    case 'method_mode':
      roll += 30
      rewardMult = 1.5
      break
  }

  const tier = rollToOutcome(Math.max(0, Math.min(100, roll)))

  if (tier === 'smash')  fascinationDelta += 15
  if (tier === 'iconic') fascinationDelta += 20

  let scandalDelta = 0
  if (gig.riskChips.some((c) => c.type === 'scandal_risk')) {
    const base = { flop: 15, decent: 5, hit: 3, smash: 0, iconic: 0 }[tier]
    scandalDelta = Math.round(base * scandalMult)
  }

  const spotlight = Math.round(
    gig.baseReward.spotlight * OUTCOME_REWARD_MULT[tier] * rewardMult
  )

  const statDeltas: StatDelta[] =
    tier !== 'flop'
      ? Object.entries(gig.baseReward.stats)
          .filter(([, v]) => v !== 0)
          .map(([stat, delta]) => ({
            stat: stat as StatKey,
            delta: Math.round((delta ?? 0) * OUTCOME_REWARD_MULT[tier] * rewardMult),
            source: 'gig',
          }))
      : []

  const visibilityEscalate =
    !!gig.romanceHook &&
    fascination >= 70 &&
    romanceAffection >= 50 &&
    Math.random() < 0.3

  return {
    tier,
    spotlight,
    statDeltas,
    fascinationDelta: Math.round(fascinationDelta),
    scandalDelta,
    narration: getOutcomeNarration(gig.voice, tier),
    visibilityEscalate,
  }
}
