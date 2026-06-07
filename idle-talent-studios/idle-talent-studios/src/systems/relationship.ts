export type RelationshipStage = 'Stranger' | 'Acquaintance' | 'Close' | 'Intimate' | 'Devoted'
export type RelationshipVisibility = 'private' | 'rumored' | 'public' | 'exposed'

export interface RelationshipData {
  characterId: string
  affection: number
  isHidden: boolean
  unlockedMemories: string[]
  stage: RelationshipStage
  visibility: RelationshipVisibility
  /** Numeric visibility 0-100, separate from the enum above. */
  visibilityScore: number
  sharedSceneCount: number
  stabilityScore: number
  chemistry: number
  /** Tracks how many consecutive scene choices matched the player's dominant choice pattern. */
  consistentChoiceStreak: number
}

// ─── Stage spotlight rewards ──────────────────────────────────────────────────

export const STAGE_SPOTLIGHT_REWARDS: Partial<Record<RelationshipStage, number>> = {
  Acquaintance: 100,
  Close:        250,
  Intimate:     500,
  Devoted:      1000,
}

export function getStageUnlockReward(
  prevStage: RelationshipStage,
  newStage: RelationshipStage
): number {
  if (prevStage === newStage) return 0
  return STAGE_SPOTLIGHT_REWARDS[newStage] ?? 0
}

const STAGE_THRESHOLDS: Array<[number, RelationshipStage]> = [
  [90, 'Devoted'],
  [70, 'Intimate'],
  [50, 'Close'],
  [25, 'Acquaintance'],
  [0,  'Stranger'],
]

export function getRelationshipStage(affection: number): RelationshipStage {
  for (const [min, stage] of STAGE_THRESHOLDS) {
    if (affection >= min) return stage
  }
  return 'Stranger'
}

export function computeChemistry(affection: number, sharedSceneCount: number): number {
  const base = affection * 0.6
  const bonus = Math.min(40, sharedSceneCount * 5)
  return Math.min(100, Math.round(base + bonus))
}

export function computeStability(consistentChoices: number, totalChoices: number): number {
  if (totalChoices === 0) return 50
  return Math.min(100, Math.round((consistentChoices / totalChoices) * 100))
}

export function getVisibilityRisk(
  visibility: RelationshipVisibility,
  chemistry: number
): number {
  const BASE: Record<RelationshipVisibility, number> = {
    private:  10,
    rumored:  35,
    public:   60,
    exposed: 100,
  }
  return Math.min(100, BASE[visibility] + Math.floor(chemistry / 10) * 3)
}

export function escalateVisibility(
  visibility: RelationshipVisibility,
  chemistry: number
): RelationshipVisibility {
  const risk = getVisibilityRisk(visibility, chemistry)
  if (visibility === 'private' && risk >= 40) return 'rumored'
  if (visibility === 'rumored' && risk >= 65) return 'public'
  if (visibility === 'public' && risk >= 85) return 'exposed'
  return visibility
}

const HIDDEN_CHARACTERS = new Set(['amy-crawford'])

export function createRelationship(characterId: string): RelationshipData {
  return {
    characterId,
    affection: 0,
    isHidden: HIDDEN_CHARACTERS.has(characterId),
    unlockedMemories: [],
    stage: 'Stranger',
    visibility: 'private',
    visibilityScore: 0,
    sharedSceneCount: 0,
    stabilityScore: 50,
    chemistry: 0,
    consistentChoiceStreak: 0,
  }
}

export function updateVisibilityScore(rel: RelationshipData, delta: number): RelationshipData {
  const score = Math.max(0, Math.min(100, rel.visibilityScore + delta))
  return { ...rel, visibilityScore: score }
}

/**
 * Returns true if the player is "caught" based on visibility + fascination.
 * Base 30% chance, increased by high fascination.
 * Only fires when visibilityScore > 60.
 */
export function checkGettingCaught(visibilityScore: number, fascination: number): boolean {
  if (visibilityScore <= 60) return false
  const baseChance = 0.30
  const fascinationMod = Math.min(0.30, (fascination - 50) / 100)
  const chance = baseChance + Math.max(0, fascinationMod)
  return Math.random() < chance
}

/** Returns daily visibility decay delta for a character (−3 per day, −0 if recently public). */
export function computeVisibilityDecay(
  visibilityScore: number,
  daysSincePublicInteraction: number
): number {
  if (visibilityScore <= 0) return 0
  if (daysSincePublicInteraction < 3) return 0
  return -3
}

/**
 * Apply a stability update: +2 if choice type matches dominant pattern, -5 on sudden shift.
 */
export function applyStabilityDelta(
  rel: RelationshipData,
  choiceType: 'receptive' | 'bold' | 'deflect'
): RelationshipData {
  const previousStreak = rel.consistentChoiceStreak
  // For simplicity: track streak of matching the same type; reset on shift
  const delta = previousStreak > 0 ? 2 : -5
  return {
    ...rel,
    stabilityScore: Math.max(0, Math.min(100, rel.stabilityScore + delta)),
    consistentChoiceStreak: previousStreak > 0 ? previousStreak + 1 : 0,
  }
}

export function clampAffection(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export function applyAffectionDelta(
  rel: RelationshipData,
  delta: number
): RelationshipData {
  const affection = clampAffection(rel.affection + delta)
  return {
    ...rel,
    affection,
    stage: getRelationshipStage(affection),
    chemistry: computeChemistry(affection, rel.sharedSceneCount),
  }
}

export function incrementSharedScenes(rel: RelationshipData): RelationshipData {
  const sharedSceneCount = rel.sharedSceneCount + 1
  return {
    ...rel,
    sharedSceneCount,
    chemistry: computeChemistry(rel.affection, sharedSceneCount),
  }
}

export function setRelationshipVisibility(
  rel: RelationshipData,
  visibility: RelationshipVisibility
): RelationshipData {
  return { ...rel, visibility }
}

export function setStabilityScore(
  rel: RelationshipData,
  score: number
): RelationshipData {
  return { ...rel, stabilityScore: Math.max(0, Math.min(100, score)) }
}

export function shouldRevealMeter(
  rel: RelationshipData,
  currentChapter: number
): boolean {
  if (!rel.isHidden) return true
  return currentChapter >= 6
}

export function getAffectionTier(affection: number): string {
  return getRelationshipStage(affection)
}
