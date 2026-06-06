export type ScandalThreshold = 25 | 50 | 75 | 100

export interface BreakingNewsEvent {
  threshold: ScandalThreshold
  headline: string
  subtext: string
  statPenalty: Record<string, number>
}

export const BREAKING_NEWS_EVENTS: Record<ScandalThreshold, BreakingNewsEvent> = {
  25: {
    threshold: 25,
    headline: 'Rising Star Courts Controversy',
    subtext: 'Insiders whisper about questionable choices behind closed doors.',
    statPenalty: { reputation: -5 },
  },
  50: {
    threshold: 50,
    headline: 'Scandal Erupts: Sources Close to Talent Speak Out',
    subtext: 'The entertainment world is watching. Carefully.',
    statPenalty: { reputation: -15, confidence: -10 },
  },
  75: {
    threshold: 75,
    headline: 'EXCLUSIVE: Full Exposé Imminent',
    subtext: 'Major publication set to release damaging story tomorrow.',
    statPenalty: { reputation: -25, confidence: -15, looks: -5 },
  },
  100: {
    threshold: 100,
    headline: 'Career in Flames: Talent Drops to Lowest Point',
    subtext: 'Industry blacklisting rumors swirl. Is this the end?',
    statPenalty: { reputation: -40, confidence: -20 },
  },
}

export function getScandalThresholdCrossed(
  prev: number,
  next: number
): ScandalThreshold | null {
  const thresholds: ScandalThreshold[] = [25, 50, 75, 100]
  for (const t of thresholds) {
    if (prev < t && next >= t) return t
  }
  return null
}

export function getScandalLevel(scandal: number): string {
  if (scandal < 25) return 'Clean'
  if (scandal < 50) return 'Murmurs'
  if (scandal < 75) return 'Headlines'
  if (scandal < 100) return 'Crisis'
  return 'Ruined'
}

// ─── Press cycle ──────────────────────────────────────────────────────────────

export type PressTier = 'clean' | 'speculation' | 'aggressive' | 'tabloid'

export interface PressHeadline {
  id: string
  text: string
  tier: PressTier
  day: number
  generatedAt: string
}

const PRESS_POOL: Record<PressTier, string[]> = {
  clean: [
    "Industry insiders are buzzing about a fresh face worth watching",
    "The next breakout? Critics say it's only a matter of time",
    "Quiet confidence that turns heads in every room",
    "Talent speaks for itself — and this one has plenty to say",
    "New wave of authenticity sweeps the entertainment landscape",
  ],
  speculation: [
    "What's really going on behind that polished image?",
    "Sources close to the talent won't say — which means they know",
    "The industry whispers. The talent keeps working. For now.",
    "Three questions no one is asking out loud — yet",
    "A pivot no one expected. A pivot no one can explain.",
  ],
  aggressive: [
    "The story everyone's been too polite to print",
    "When image becomes identity — and identity starts to crack",
    "A closer look at the choices that made the headlines",
    "Not everyone in the room is a fan. We asked them why.",
    "The calls are going unreturned. The questions aren't.",
  ],
  tabloid: [
    "EXPOSED: The truth behind the talent",
    "Inside sources confirm what we already suspected",
    "The industry has seen enough. So have we.",
    "Career in question as scandal reaches critical mass",
    "EXCLUSIVE: The full story, told by those closest to the fire",
  ],
}

function getScandalTier(scandal: number): PressTier {
  if (scandal < 25) return 'clean'
  if (scandal < 50) return 'speculation'
  if (scandal < 75) return 'aggressive'
  return 'tabloid'
}

export function generatePressHeadline(
  scandal: number,
  day: number,
  seed?: number
): PressHeadline {
  const tier = getScandalTier(scandal)
  const pool = PRESS_POOL[tier]
  const index = (seed ?? day) % pool.length
  return {
    id: `press-day${day}`,
    text: pool[index],
    tier,
    day,
    generatedAt: new Date().toISOString(),
  }
}

export function isPressCycleDay(day: number): boolean {
  return day > 1 && day % 3 === 0
}

// ─── Twist engine ─────────────────────────────────────────────────────────────

export type ScandalSource =
  | 'the_mirror'
  | 'industry_weekly'
  | 'anonymous_tip'
  | 'celebrity_central'
  | 'rival_management'
  | 'your_publicist'
  | 'paparazzi_exclusive'
  | 'viral_social'

export interface SourcePerk {
  source: ScandalSource
  displayName: string
  byline: string
  hiddenByline: boolean
  modifyPenalty: (penalty: Partial<Record<string, number>>) => Partial<Record<string, number>>
}

export const SOURCE_PERKS: Record<ScandalSource, SourcePerk> = {
  the_mirror: {
    source: 'the_mirror',
    displayName: 'The Mirror',
    byline: '— The Mirror',
    hiddenByline: false,
    modifyPenalty: (p) => ({ ...p, scandal: (p.scandal ?? 0) + 5 }),
  },
  industry_weekly: {
    source: 'industry_weekly',
    displayName: 'Industry Weekly',
    byline: '— Industry Weekly',
    hiddenByline: false,
    modifyPenalty: (p) => {
      const result = { ...p }
      if (result.reputation !== undefined) result.reputation = Math.floor(result.reputation * 0.7)
      return result
    },
  },
  anonymous_tip: {
    source: 'anonymous_tip',
    displayName: 'Anonymous',
    byline: '— Anonymous Tip',
    hiddenByline: true,
    modifyPenalty: (p) => p,
  },
  celebrity_central: {
    source: 'celebrity_central',
    displayName: 'Celebrity Central',
    byline: '— Celebrity Central',
    hiddenByline: false,
    modifyPenalty: (p) => ({ ...p, confidence: (p.confidence ?? 0) - 5 }),
  },
  rival_management: {
    source: 'rival_management',
    displayName: 'Industry Sources',
    byline: '— Industry Sources',
    hiddenByline: false,
    modifyPenalty: (p) => ({ ...p, scandal: (p.scandal ?? 0) + 10 }),
  },
  your_publicist: {
    source: 'your_publicist',
    displayName: 'Your Publicist',
    byline: '— Controlled Statement',
    hiddenByline: false,
    modifyPenalty: (p) =>
      Object.fromEntries(Object.entries(p).map(([k, v]) => [k, Math.round((v ?? 0) * 0.5)])),
  },
  paparazzi_exclusive: {
    source: 'paparazzi_exclusive',
    displayName: 'Paparazzi',
    byline: '— Exclusive Photos',
    hiddenByline: false,
    modifyPenalty: (p) => ({ ...p, looks: (p.looks ?? 0) - 8 }),
  },
  viral_social: {
    source: 'viral_social',
    displayName: 'Social Media',
    byline: '— Viral Thread',
    hiddenByline: false,
    modifyPenalty: (p) => ({ ...p, scandal: (p.scandal ?? 0) + 8 }),
  },
}

export function applySourcePerk(
  source: ScandalSource,
  basePenalty: Partial<Record<string, number>>
): Partial<Record<string, number>> {
  return SOURCE_PERKS[source].modifyPenalty(basePenalty)
}

export interface TwistChoice {
  id: string
  label: string
  subtext: string
  statDeltas: Partial<Record<string, number>>
}

export interface ScandalTwist {
  id: string
  threshold: ScandalThreshold
  pool: number
  headline: string
  source: ScandalSource
  subtext: string
  baseStatPenalty: Partial<Record<string, number>>
  choices?: TwistChoice[]
}

export const TWIST_POOLS: Record<ScandalThreshold, ScandalTwist[]> = {
  25: [
    {
      id: 'twist-25-0',
      threshold: 25,
      pool: 0,
      headline: 'An Industry Eyebrow',
      source: 'industry_weekly',
      subtext: 'Trade circles are noting your name — not warmly.',
      baseStatPenalty: { reputation: -5 },
    },
    {
      id: 'twist-25-1',
      threshold: 25,
      pool: 1,
      headline: 'Whispers in the Green Room',
      source: 'anonymous_tip',
      subtext: 'Someone talked. No one knows who. Yet.',
      baseStatPenalty: { confidence: -4 },
    },
    {
      id: 'twist-25-2',
      threshold: 25,
      pool: 2,
      headline: 'Spotted: Questions Worth Asking',
      source: 'paparazzi_exclusive',
      subtext: 'The camera caught something. Context is optional.',
      baseStatPenalty: { reputation: -3, looks: -2 },
    },
    {
      id: 'twist-25-3',
      threshold: 25,
      pool: 3,
      headline: 'A Friendly Warning',
      source: 'your_publicist',
      subtext: "Your publicist called. You're trending. That's not always good.",
      baseStatPenalty: { reputation: -8 },
    },
  ],
  50: [
    {
      id: 'twist-50-0',
      threshold: 50,
      pool: 0,
      headline: 'Exclusive: The Cracks Appear',
      source: 'the_mirror',
      subtext: 'A major tabloid has your name above the fold.',
      baseStatPenalty: { reputation: -12, confidence: -8 },
    },
    {
      id: 'twist-50-1',
      threshold: 50,
      pool: 1,
      headline: "Sources Say: It's Not What It Looks Like",
      source: 'celebrity_central',
      subtext: "Everyone's reading the subtext. It looks like exactly what it is.",
      baseStatPenalty: { reputation: -10, confidence: -6 },
    },
    {
      id: 'twist-50-2',
      threshold: 50,
      pool: 2,
      headline: 'Career at a Crossroads',
      source: 'industry_weekly',
      subtext: 'The trades are asking the question no one wants answered.',
      baseStatPenalty: { reputation: -15, wisdom: -5 },
    },
    {
      id: 'twist-50-3',
      threshold: 50,
      pool: 3,
      headline: 'Management Has Concerns',
      source: 'rival_management',
      subtext: "Someone is making calls. Yours aren't being returned.",
      baseStatPenalty: { reputation: -12, confidence: -10 },
    },
  ],
  75: [
    {
      id: 'twist-75-0',
      threshold: 75,
      pool: 0,
      headline: 'Full Exposé Imminent: We Have the Receipts',
      source: 'the_mirror',
      subtext: 'A major publication has verified sources. Publish date: this week.',
      baseStatPenalty: { reputation: -20, confidence: -12 },
      choices: [
        {
          id: 'deny',
          label: 'Deny Everything',
          subtext: 'Issue a firm statement. Hope it sticks.',
          statDeltas: { reputation: -25, confidence: -5, scandal: 5 },
        },
        {
          id: 'get_ahead',
          label: 'Get Ahead of It',
          subtext: 'Release a statement first. Control the narrative.',
          statDeltas: { reputation: -15, confidence: 5 },
        },
        {
          id: 'no_comment',
          label: 'No Comment',
          subtext: 'Say nothing. Let it burn.',
          statDeltas: { reputation: -22, wisdom: 5, scandal: 8 },
        },
      ],
    },
    {
      id: 'twist-75-1',
      threshold: 75,
      pool: 1,
      headline: 'Someone Talked. Multiple Someones.',
      source: 'anonymous_tip',
      subtext: "The story wasn't one source. It never is.",
      baseStatPenalty: { reputation: -18, confidence: -15 },
      choices: [
        {
          id: 'find_leak',
          label: 'Find the Leak',
          subtext: 'Internal investigation. Burn some bridges.',
          statDeltas: { reputation: -20, wisdom: 8 },
        },
        {
          id: 'damage_control',
          label: 'Damage Control',
          subtext: 'Spin it. Hard.',
          statDeltas: { reputation: -15, confidence: -8 },
        },
      ],
    },
    {
      id: 'twist-75-2',
      threshold: 75,
      pool: 2,
      headline: 'Industry Insiders Break Silence',
      source: 'industry_weekly',
      subtext: 'Three sources, on record. This is no longer gossip.',
      baseStatPenalty: { reputation: -22, wisdom: -8 },
      choices: [
        {
          id: 'address_it',
          label: 'Address It Directly',
          subtext: 'Face the music. Audiences respect honesty.',
          statDeltas: { reputation: -15, confidence: 10, scandal: -5 },
        },
        {
          id: 'go_dark',
          label: 'Go Dark',
          subtext: 'Delete, disconnect, disappear for a while.',
          statDeltas: { reputation: -20, confidence: -10, scandal: 5 },
        },
      ],
    },
    {
      id: 'twist-75-3',
      threshold: 75,
      pool: 3,
      headline: 'Viral Thread Puts Career in Question',
      source: 'viral_social',
      subtext: 'A thread with 200k engagements. Not in your favor.',
      baseStatPenalty: { reputation: -18, confidence: -10 },
      choices: [
        {
          id: 'clap_back',
          label: 'Clap Back Online',
          subtext: 'Post a response. High risk, high reward.',
          statDeltas: { reputation: -10, confidence: 5, scandal: 10 },
        },
        {
          id: 'go_quiet',
          label: 'Go Quiet',
          subtext: 'Let it pass. It usually does.',
          statDeltas: { reputation: -20, wisdom: 5 },
        },
      ],
    },
  ],
  100: [
    {
      id: 'twist-100-0',
      threshold: 100,
      pool: 0,
      headline: "It's Over. Or Is It?",
      source: 'the_mirror',
      subtext: 'Career destruction has a specific sound. You just heard it.',
      baseStatPenalty: { reputation: -35, confidence: -20 },
      choices: [
        {
          id: 'full_confession',
          label: 'Full Public Confession',
          subtext: 'Everything. On camera. No edits.',
          statDeltas: { reputation: -20, confidence: 15, scandal: -20, wisdom: 10 },
        },
        {
          id: 'disappear',
          label: 'Disappear',
          subtext: 'Leave the industry. For now.',
          statDeltas: { reputation: -40, scandal: -30, confidence: -10 },
        },
        {
          id: 'fight_back',
          label: 'Fight Back Hard',
          subtext: 'Lawyers, statements, interviews. Go to war.',
          statDeltas: { reputation: -25, confidence: 20, scandal: 10 },
        },
      ],
    },
    {
      id: 'twist-100-1',
      threshold: 100,
      pool: 1,
      headline: 'The Reckoning: Industry Responds',
      source: 'celebrity_central',
      subtext: 'Everyone has an opinion. None of them are kind.',
      baseStatPenalty: { reputation: -30, confidence: -25 },
      choices: [
        {
          id: 'charity_pivot',
          label: 'Charity Announcement',
          subtext: "Pivot hard to a cause. It's cynical. It might work.",
          statDeltas: { reputation: -15, wisdom: 5, confidence: 5 },
        },
        {
          id: 'take_break',
          label: 'Step Back Gracefully',
          subtext: 'A statement about prioritizing your mental health.',
          statDeltas: { reputation: -20, scandal: -15, confidence: 8 },
        },
        {
          id: 'embrace_villain',
          label: 'Lean Into It',
          subtext: "They already hate you. Make it interesting.",
          statDeltas: { reputation: -10, confidence: 20, scandal: 15 },
        },
      ],
    },
    {
      id: 'twist-100-2',
      threshold: 100,
      pool: 2,
      headline: 'Rock Bottom Has a Mirror',
      source: 'anonymous_tip',
      subtext: 'The source is someone you trusted. Past tense.',
      baseStatPenalty: { reputation: -32, confidence: -18, wisdom: -10 },
      choices: [
        {
          id: 'confront',
          label: 'Confront the Source',
          subtext: 'Find them. Talk. Or yell.',
          statDeltas: { reputation: -28, confidence: 8, wisdom: 12 },
        },
        {
          id: 'release_statement',
          label: 'Issue a Statement',
          subtext: "Careful, measured, calculated. Your publicist's dream.",
          statDeltas: { reputation: -20, scandal: -10 },
        },
      ],
    },
    {
      id: 'twist-100-3',
      threshold: 100,
      pool: 3,
      headline: 'Last Chance Redemption Arc?',
      source: 'your_publicist',
      subtext: "Your publicist has a plan. It's expensive. It might work.",
      baseStatPenalty: { reputation: -25, confidence: -15 },
      choices: [
        {
          id: 'take_deal',
          label: 'Take the Deal',
          subtext: 'Trust the process. Signs a 3-month campaign.',
          statDeltas: { reputation: 10, scandal: -25, confidence: 5 },
        },
        {
          id: 'go_rogue',
          label: 'Go Rogue',
          subtext: 'No handlers. No filters. Just you.',
          statDeltas: { reputation: -15, confidence: 25, scandal: 10 },
        },
        {
          id: 'walk_away',
          label: 'Walk Away',
          subtext: "The industry will survive without you. Won't it?",
          statDeltas: { reputation: -35, scandal: -40, wisdom: 20 },
        },
      ],
    },
  ],
}

export function selectTwist(
  threshold: ScandalThreshold,
  firedTwistIds: string[]
): ScandalTwist {
  const pool = TWIST_POOLS[threshold]
  const unfired = pool.filter((t) => !firedTwistIds.includes(t.id))
  return unfired.length > 0 ? unfired[0] : pool[0]
}
