import type { Rarity } from '@/engine/gachaEngine'

export type CharacterEventType =
  | 'text_message'
  | 'surprise_visit'
  | 'press_sighting'
  | 'gift'

export interface CharacterEvent {
  id: string
  trigger:
    | { type: 'day'; value: number }
    | { type: 'flag'; value: string }
  eventType: CharacterEventType
  content: string
  affectionDelta: number
  scandalizeDelta: number
  sceneRef?: string
}

// ─── Route types ──────────────────────────────────────────────────────────────

export interface UnlockRequirements {
  requiredFlags?: Record<string, boolean>
  requiredStats?: Record<string, number>
  requiredAffection?: number
  requiredCareerTier?: number
  requiredChapterGlobal?: number
  /** e.g. all 8 hidden notes collected */
  requiredNotes?: number
}

export interface CharacterChapter {
  number: number
  title: string
  /** Key into SCENE_REGISTRY — 'character/scene_name' format */
  sceneRef: string
  /** Flags to set when chapter is triggered (before scene loads) */
  setsFlags?: Record<string, boolean>
  /** Flags consumed on completion */
  affectionOnComplete?: number
  /** Passive scandal per day while this chapter is "active" (started, not complete) */
  passiveScandalPerDay?: number
  /** Interstitial — no choices, pure memory/auto */
  isInterstitial?: boolean
  /** Driver event triggers (1-4) */
  driverTrigger?: number
  unlockRequirements?: UnlockRequirements
}

export type EndingType = 'true' | 'good' | 'heartbreak' | 'secret'

export interface EndingCondition {
  type:
    | 'min_affection'
    | 'max_scandal'
    | 'min_scandal'
    | 'min_stat'
    | 'max_stat'
    | 'flag_true'
    | 'flag_false'
    | 'max_fame'
    | 'min_notes'
    | 'gigs_skipped'
  value?: number
  stat?: string
  flag?: string
}

export interface CharacterEnding {
  type: EndingType
  label: string
  sceneRef: string
  prestigeReward: number
  /** All conditions must pass */
  conditions: EndingCondition[]
}

export interface CharacterRouteData {
  chapters: CharacterChapter[]
  endings: CharacterEnding[]
  wardrobeAffinities: string[]
  /** Stat bonuses this character gives when affection is high */
  statAffinities: Record<string, number>
  affectionMeter: { hidden: boolean; revealFlag?: string }
  hardLockRequirements?: UnlockRequirements
}

// ─── Character ────────────────────────────────────────────────────────────────

export interface Character {
  id: string
  name: string
  rarity: Rarity
  role: string
  tagline: string
  description: string
  accentColor: string
  portraitPlaceholder: string
  routeId: string
  availableFromChapter: number
  events?: CharacterEvent[]
  route?: CharacterRouteData
}
