export type RelationshipStage = 'Stranger' | 'Acquaintance' | 'Close' | 'Intimate' | 'Devoted'
export type RelationshipVisibility = 'private' | 'rumored' | 'public' | 'exposed'

export interface RelationshipData {
  characterId: string
  affection: number
  isHidden: boolean
  unlockedMemories: string[]
  stage: RelationshipStage
  visibility: RelationshipVisibility
  sharedSceneCount: number
  stabilityScore: number
  chemistry: number
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
    sharedSceneCount: 0,
    stabilityScore: 50,
    chemistry: 0,
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
