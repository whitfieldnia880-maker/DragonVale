import type { Character } from '@/data/characters/types'

export type Rarity = 'SSR' | 'SR' | 'R'

// ─── Banner type ──────────────────────────────────────────────────────────────

export type BannerType = 'standard' | 'rate_up' | 'event' | 'beginner'

export interface Banner {
  id: string
  name: string
  type: BannerType
  featuredCharacters: string[]
  startDate: string | null
  endDate: string | null
  pullCost: {
    single: { spotlight: number; prestige: number }
    multi: { spotlight: number; prestige: number }
  }
  rateUpSSR?: number
  rateUpSR?: number
  isActive: boolean
  isOneTime: boolean
}

// ─── Pull result ──────────────────────────────────────────────────────────────

export interface GachaPullResult {
  character: Character
  rarity: Rarity
  isNew: boolean
  isDuplicate: boolean
  spotlightConverted: number
  bondFragmentGranted: boolean
  affectionDelta: number
}

export interface PityState {
  totalPulls: number
  pullsSinceLastSSR: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PITY_THRESHOLD = 90
const SOFT_PITY_START = 75
const SOFT_PITY_BOOST_PER_PULL = 0.006

const DUPLICATE_SPOTLIGHT: Record<Rarity, number> = {
  SSR: 500,
  SR: 200,
  R: 50,
}

const AFFECTION_ON_DUPLICATE = 5

// Characters only obtainable on their specific event banner
const EVENT_ONLY_CHARACTERS: Set<string> = new Set(['the-driver'])

// ─── Rarity roll ─────────────────────────────────────────────────────────────

export function rollRarity(pity: PityState, force?: Rarity): Rarity {
  if (force) return force
  if (pity.pullsSinceLastSSR >= PITY_THRESHOLD - 1) return 'SSR'

  const pullNumber = pity.pullsSinceLastSSR + 1
  let ssrRate = 0.03
  if (pullNumber >= SOFT_PITY_START) {
    ssrRate = 0.03 + (pullNumber - (SOFT_PITY_START - 1)) * SOFT_PITY_BOOST_PER_PULL
  }

  const roll = Math.random()
  if (roll < ssrRate) return 'SSR'
  if (roll < ssrRate + 0.15) return 'SR'
  return 'R'
}

// ─── Character selection ──────────────────────────────────────────────────────

export function selectCharacterForBanner(
  rarity: Rarity,
  roster: Character[],
  banner: Banner | null
): Character {
  const isEvent = banner?.type === 'event'

  // Filter event-only characters out of non-event pools
  const availablePool = roster.filter((c) => {
    if (EVENT_ONLY_CHARACTERS.has(c.id) && !isEvent) return false
    return c.rarity === rarity
  })

  if (availablePool.length === 0) {
    const fallback = roster.find((c) => c.rarity === 'R')
    if (!fallback) throw new Error('No characters in roster')
    return fallback
  }

  // Event banner: restrict to featured characters only
  if (isEvent) {
    const eventPool = availablePool.filter(
      (c) => !banner || banner.featuredCharacters.includes(c.id)
    )
    const pool = eventPool.length > 0 ? eventPool : availablePool
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // Rate-up banner: weighted toward featured
  if (banner?.type === 'rate_up' && banner.featuredCharacters.length > 0) {
    const featuredPool = availablePool.filter((c) => banner.featuredCharacters.includes(c.id))
    const offPool = availablePool.filter((c) => !banner.featuredCharacters.includes(c.id))

    const rateUp =
      rarity === 'SSR'
        ? (banner.rateUpSSR ?? 0.5)
        : rarity === 'SR'
        ? (banner.rateUpSR ?? 0.75)
        : 0

    if (featuredPool.length > 0 && Math.random() < rateUp) {
      return featuredPool[Math.floor(Math.random() * featuredPool.length)]
    }
    const fallbackPool = offPool.length > 0 ? offPool : availablePool
    return fallbackPool[Math.floor(Math.random() * fallbackPool.length)]
  }

  return availablePool[Math.floor(Math.random() * availablePool.length)]
}

// ─── Single pull ──────────────────────────────────────────────────────────────

export function resolvePull(
  roster: Character[],
  ownedIds: Set<string>,
  pity: PityState,
  banner: Banner | null = null,
  forceRarity?: Rarity
): { result: GachaPullResult; nextPity: PityState } {
  const rarity = rollRarity(pity, forceRarity)
  const character = selectCharacterForBanner(rarity, roster, banner)
  const isDuplicate = ownedIds.has(character.id)
  const spotlightConverted = isDuplicate ? DUPLICATE_SPOTLIGHT[rarity] : 0
  const bondFragmentGranted = isDuplicate && rarity === 'SSR'
  const affectionDelta = isDuplicate ? AFFECTION_ON_DUPLICATE : 0

  const nextPity: PityState = {
    totalPulls: pity.totalPulls + 1,
    pullsSinceLastSSR: rarity === 'SSR' ? 0 : pity.pullsSinceLastSSR + 1,
  }

  return {
    result: {
      character,
      rarity,
      isNew: !isDuplicate,
      isDuplicate,
      spotlightConverted,
      bondFragmentGranted,
      affectionDelta,
    },
    nextPity,
  }
}

// ─── Multi-pull ───────────────────────────────────────────────────────────────

export function resolveMultiPull(
  roster: Character[],
  ownedIds: Set<string>,
  pity: PityState,
  count: 10 | 1,
  banner: Banner | null = null,
  guaranteeSSRForBeginner = false
): { results: GachaPullResult[]; nextPity: PityState } {
  const results: GachaPullResult[] = []
  let currentPity = pity
  let currentOwned = new Set(ownedIds)
  let hasSROrHigher = false
  let hasSSR = false

  for (let i = 0; i < count; i++) {
    const isLastPull = i === count - 1
    let forceRarity: Rarity | undefined

    if (count === 10) {
      // 10x guarantee SR+ on last pull if none seen yet
      if (isLastPull && !hasSROrHigher) {
        forceRarity = 'SR'
      }
      // Beginner banner: guarantee SSR in 10x if none seen
      if (guaranteeSSRForBeginner && isLastPull && !hasSSR) {
        forceRarity = 'SSR'
      }
    }

    const { result, nextPity } = resolvePull(
      roster,
      currentOwned,
      currentPity,
      banner,
      forceRarity
    )

    results.push(result)
    currentPity = nextPity
    if (result.isNew) currentOwned.add(result.character.id)
    if (result.rarity !== 'R') hasSROrHigher = true
    if (result.rarity === 'SSR') hasSSR = true
  }

  return { results, nextPity: currentPity }
}

// ─── Duplicate spotlight (exported for display) ───────────────────────────────

export function duplicateSpotlight(rarity: Rarity): number {
  return DUPLICATE_SPOTLIGHT[rarity]
}
