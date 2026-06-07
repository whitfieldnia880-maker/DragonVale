// ─── Stats ────────────────────────────────────────────────────────────────────

export type StatKey =
  | 'confidence'
  | 'looks'
  | 'wisdom'
  | 'reputation'
  | 'scandal'
  | 'money'
  | 'energy'

export interface PlayerStats {
  confidence: number
  looks: number
  wisdom: number
  reputation: number
  scandal: number
  money: number
  energy: number
}

export interface Player {
  id: string
  name: string
  stats: PlayerStats
  currentDay: number
  careerTier: number
  storyFlags: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export type CurrencyType = 'spotlight' | 'prestige'

export interface CurrencyBalance {
  spotlight: number
  prestige: number
}

export interface CurrencyTransaction {
  id: string
  playerId: string
  currencyType: CurrencyType
  delta: number
  reason: string
  balanceAfter: number
  createdAt: string
}

// ─── Characters ───────────────────────────────────────────────────────────────

export type CharacterId =
  | 'amy'
  | 'marcus'
  | 'olivier'
  | 'remy'
  | 'dex'
  | 'sunny'
  | 'driver'
  | 'celeste'

export type Rarity = 'R' | 'SR' | 'SSR'

export type RelationshipStage =
  | 'stranger'
  | 'acquaintance'
  | 'friend'
  | 'close'
  | 'intimate'
  | 'bonded'

export interface CharacterAssets {
  portrait: string        // 400×600px
  bust: string            // 200×300px
  silhouette: string      // 400×600px, solid black fill
  cardArt: string         // 300×400px
  apartmentSprite: string // 200×400px
  thumbnail: string       // 120×120px
  expressions: {
    neutral: string       // 200×200px
    happy: string
    surprised: string
    sad: string
    flustered: string
  }
}

export interface CharacterDefinition {
  id: string
  shortId: CharacterId
  name: string
  role: string
  rarity: Rarity
  accentColor: string
  tagline: string
  portraitPlaceholder: string
  assets: CharacterAssets
  unlockRequirements?: UnlockRequirements
}

export interface UnlockRequirements {
  bannerId?: string
  minCareerTier?: number
  storyFlagRequired?: string
}

export interface CharacterState {
  characterId: string
  owned: boolean
  affection: number
  currentChapter: number
  completedChapters: string[]
  endingsUnlocked: string[]
  bondFragments: number
  bondScenesUnlocked: number
  flags: Record<string, boolean>
}

// ─── Dialogue ─────────────────────────────────────────────────────────────────

export type NodeType =
  | 'dialogue'
  | 'choice'
  | 'inner_monologue'
  | 'narration'
  | 'reward'
  | 'end'

export interface StatCheck {
  stat: StatKey
  required: number
}

export interface FlagSet {
  key: string
  value: boolean
}

export interface MeterEffect {
  stat: StatKey
  delta: number
}

export interface ChoiceOption {
  id: string
  text: string
  statCheck?: StatCheck
  affectionDelta?: { target: string; delta: number }
  meterEffects?: MeterEffect[]
  flagSets?: FlagSet[]
  next: string | null
}

export interface DialogueNode {
  id: string
  type: Extract<NodeType, 'dialogue' | 'inner_monologue' | 'narration'>
  speaker?: string
  text: string
  next: string | null
  meterEffects?: MeterEffect[]
  flagSets?: FlagSet[]
  emotion?: string
}

export interface ChoiceNode {
  id: string
  type: 'choice'
  prompt?: string
  choices: ChoiceOption[]
}

// ─── Chapters & Endings ───────────────────────────────────────────────────────

export interface ChapterDefinition {
  id: string
  characterId: string
  chapterNumber: number
  title: string
  unlocksAt: {
    affection?: number
    careerTier?: number
    storyFlag?: string
  }
  firstNodeId: string
}

export type EndingType = 'good' | 'true' | 'heartbreak' | 'secret'

export interface EndingRequirements {
  affection: number
  chaptersCompleted: string[]
  storyFlags?: Record<string, boolean>
  careerTier?: number
}

export interface EndingDefinition {
  id: string
  characterId: string
  type: EndingType
  title: string
  requirements: EndingRequirements
  firstNodeId: string
}

// ─── Gacha ────────────────────────────────────────────────────────────────────

export type BannerType = 'standard' | 'rate_up' | 'event' | 'beginner'

export interface Banner {
  id: string
  name: string
  type: BannerType
  featuredCharacters: CharacterId[]
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

export interface PullResult {
  characterId: string
  rarity: Rarity
  isNew: boolean
  isDuplicate: boolean
  spotlightConverted: number
  bondFragmentGranted: boolean
  affectionDelta: number
}

// ─── Gigs ─────────────────────────────────────────────────────────────────────

export type OutcomeTier =
  | 'critical_success'
  | 'success'
  | 'mixed'
  | 'failure'
  | 'disaster'

export interface PrepChoice {
  id: string
  label: string
  description: string
  statBoost?: { stat: StatKey; amount: number }
  riskMod?: number
}

export type RiskChipType = 'scandal' | 'setback' | 'opportunity' | 'neutral'

export interface RiskChip {
  id: string
  type: RiskChipType
  label: string
  effectDescription: string
}

export interface GigCard {
  id: string
  title: string
  type: string
  description: string
  requiredStat: StatKey
  difficulty: number
  duration: number
  baseReward: { spotlight: number; reputation: number }
  prepChoices: PrepChoice[]
  riskChips: RiskChip[]
  unlockRequirements?: {
    careerTier?: number
    minReputation?: number
  }
}

export interface GigOutcome {
  tier: OutcomeTier
  statDeltas: Partial<PlayerStats>
  currencyReward: { spotlight: number; prestige?: number }
  narrativeText: string
  scandalDelta?: number
}

// ─── Breaking News ────────────────────────────────────────────────────────────

export type SourceVoice = 'tabloid' | 'fansite' | 'industry' | 'social'

export interface BreakingNewsChoice {
  id: string
  label: string
  statCheck?: StatCheck
  outcome: {
    scandalDelta: number
    reputationDelta: number
    narrativeText: string
  }
}

export interface BreakingNewsItem {
  id: string
  headline: string
  source: SourceVoice
  body: string
  choices: BreakingNewsChoice[]
  expiresAfterDays: number
}

// ─── Wardrobe ─────────────────────────────────────────────────────────────────

export type ItemRarity = 'common' | 'rare' | 'luxury' | 'icon'

export type OutfitSlot = 'top' | 'bottom' | 'shoes' | 'accessory' | 'full_look'

export interface WardrobeItem {
  id: string
  name: string
  slot: OutfitSlot
  rarity: ItemRarity
  statBonus?: Partial<PlayerStats>
  scandalMod?: number
  cost: number
  unlockCondition?: string
  thumbnail: string
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventType =
  | 'photo_request'
  | 'chance_encounter'
  | 'scandal_threat'
  | 'career_opportunity'
  | 'personal_moment'

export interface CharacterEvent {
  id: string
  characterId: string
  type: EventType
  title: string
  description: string
  choices: Array<{
    id: string
    label: string
    affectionDelta?: number
    statCheck?: StatCheck
    flagSets?: FlagSet[]
  }>
  expiresAfterDays?: number
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export interface Achievement {
  key: string
  label: string
  description: string
  icon: string
  reward: {
    spotlight?: number
    prestige?: number
  }
}

export interface ToastNotification {
  id: string
  variant:
    | 'spotlight'
    | 'prestige'
    | 'affection'
    | 'scandal'
    | 'new_pull'
    | 'achievement'
    | 'info'
  message: string
  icon?: string
  durationMs?: number
}
