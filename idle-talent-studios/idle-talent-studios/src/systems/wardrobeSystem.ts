import type { StatKey } from '@/engine/gameState'

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type WardrobeStatTag = Extract<StatKey, 'confidence' | 'wisdom' | 'reputation'>
export type OutfitSlot = 'top' | 'bottom' | 'shoes' | 'accessory' | 'full_look'
export type ItemSource = 'store' | 'gacha' | 'gift' | 'career'
export type ApartmentZone =
  | 'bed'
  | 'kitchen'
  | 'wardrobe'
  | 'vanity'
  | 'livingRoom'
  | 'mirror'
  | 'rooftop'
  | 'private_screening_room'

// ─── Item types ───────────────────────────────────────────────────────────────

export interface WardrobeItem {
  id: string
  name: string
  description: string
  rarity: ItemRarity
  slot: OutfitSlot
  looksBonus: number
  confBonus: number
  statTag: WardrobeStatTag | null
  statBonusValue: number
  characterAffinity: string[]
  affinityBonus: number
  source: ItemSource
  cost: number
}

export interface EquippedOutfit {
  top: string | null
  bottom: string | null
  shoes: string | null
  accessory: string | null
  full_look: string | null
}

export const EMPTY_OUTFIT: EquippedOutfit = {
  top: null, bottom: null, shoes: null, accessory: null, full_look: null,
}

export interface DayBonuses {
  looksBonus: number
  confBonus: number
  statTag: WardrobeStatTag | null
  statBonusValue: number
  pendingAffinityBonuses: Record<string, number>
}

// ─── Bonus computation ────────────────────────────────────────────────────────

export function computeDayBonuses(
  equipped: EquippedOutfit,
  catalog: Record<string, WardrobeItem>
): DayBonuses {
  let looksBonus = 0
  let confBonus = 0
  let statTag: WardrobeStatTag | null = null
  let statBonusValue = 0
  const pendingAffinityBonuses: Record<string, number> = {}

  // full_look overrides all individual slots
  const activeIds = equipped.full_look
    ? [equipped.full_look]
    : ([equipped.top, equipped.bottom, equipped.shoes, equipped.accessory]
        .filter(Boolean) as string[])

  for (const itemId of activeIds) {
    const item = catalog[itemId]
    if (!item) continue

    looksBonus += item.looksBonus
    confBonus += item.confBonus

    if (item.statTag && item.statBonusValue > statBonusValue) {
      statTag = item.statTag
      statBonusValue = item.statBonusValue
    }

    if (item.characterAffinity.length > 0 && item.affinityBonus > 0) {
      for (const charId of item.characterAffinity) {
        pendingAffinityBonuses[charId] =
          (pendingAffinityBonuses[charId] ?? 0) + item.affinityBonus
      }
    }
  }

  return { looksBonus, confBonus, statTag, statBonusValue, pendingAffinityBonuses }
}

// ─── Rarity helpers ───────────────────────────────────────────────────────────

const SELL_VALUES: Record<ItemRarity, number> = {
  common:    20,
  rare:      80,
  epic:      200,
  legendary:  0,
}

export function getSellValue(rarity: ItemRarity): number {
  return SELL_VALUES[rarity]
}

export function canSellItem(rarity: ItemRarity): boolean {
  return rarity !== 'legendary'
}

export function getRarityColor(rarity: ItemRarity): string {
  return {
    common:    '#9ca3af',
    rare:      '#60a5fa',
    epic:      '#c084fc',
    legendary: '#fbbf24',
  }[rarity]
}

export function getRarityLabel(rarity: ItemRarity): string {
  return {
    common:    'Common',
    rare:      'Rare',
    epic:      'Epic',
    legendary: 'Legendary',
  }[rarity]
}

// ─── Apartment tiers ──────────────────────────────────────────────────────────

export interface ApartmentTierConfig {
  tier: number
  name: string
  description: string
  upgradeSpotlight: number | null
  ambientColor: string
  emoji: string
}

export const APARTMENT_TIERS: ApartmentTierConfig[] = [
  {
    tier: 1,
    name: 'Starter Studio',
    description: 'A modest studio. The city hums outside your window.',
    upgradeSpotlight: 1000,
    ambientColor: '#3730a3',
    emoji: '🏠',
  },
  {
    tier: 2,
    name: 'The Walkup',
    description: 'A one-bedroom with morning light and better curtains.',
    upgradeSpotlight: 3500,
    ambientColor: '#1e40af',
    emoji: '🏡',
  },
  {
    tier: 3,
    name: 'Midtown Flat',
    description: 'Two rooms and a view that costs twice as much.',
    upgradeSpotlight: 8000,
    ambientColor: '#0f766e',
    emoji: '🏢',
  },
  {
    tier: 4,
    name: 'Penthouse Suite',
    description: 'An upscale suite. The industry is starting to notice.',
    upgradeSpotlight: 20000,
    ambientColor: '#7c3aed',
    emoji: '🏙️',
  },
  {
    tier: 5,
    name: 'Icon Residence',
    description: 'A penthouse. You built this.',
    upgradeSpotlight: null,
    ambientColor: '#be185d',
    emoji: '✨',
  },
]

export function getApartmentTierConfig(tier: number): ApartmentTierConfig {
  return APARTMENT_TIERS[Math.min(5, Math.max(1, tier)) - 1]
}

export function getVisitSlots(tier: number): number {
  if (tier < 2) return 0
  return tier - 1
}

// ─── Zone config ──────────────────────────────────────────────────────────────

export interface ZoneConfig {
  id: ApartmentZone
  label: string
  emoji: string
  unlocksAtTier: number
  energyCost: number
  description: string
}

export const ZONE_CONFIGS: ZoneConfig[] = [
  {
    id: 'wardrobe',
    label: 'Wardrobe',
    emoji: '🚪',
    unlocksAtTier: 1,
    energyCost: 0,
    description: 'Manage your looks',
  },
  {
    id: 'bed',
    label: 'Bed',
    emoji: '🛏️',
    unlocksAtTier: 1,
    energyCost: 0,
    description: 'Rest and dream',
  },
  {
    id: 'mirror',
    label: 'Mirror',
    emoji: '🪟',
    unlocksAtTier: 1,
    energyCost: 0,
    description: '+4 Looks for the day',
  },
  {
    id: 'vanity',
    label: 'Vanity',
    emoji: '🪞',
    unlocksAtTier: 2,
    energyCost: 10,
    description: '+8 Looks for the day',
  },
  {
    id: 'livingRoom',
    label: 'Living Room',
    emoji: '🛋️',
    unlocksAtTier: 3,
    energyCost: 0,
    description: 'Host character visits',
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    emoji: '🍳',
    unlocksAtTier: 3,
    energyCost: 0,
    description: 'Cook & restore energy',
  },
  {
    id: 'rooftop',
    label: 'Rooftop',
    emoji: '🌆',
    unlocksAtTier: 4,
    energyCost: 0,
    description: 'Scandal −3, Confidence +5',
  },
  {
    id: 'private_screening_room',
    label: 'Screening Room',
    emoji: '🎬',
    unlocksAtTier: 5,
    energyCost: 15,
    description: 'Wisdom +5',
  },
]

// ─── Meal options ─────────────────────────────────────────────────────────────

export interface MealOption {
  id: string
  name: string
  emoji: string
  energyGain: number
  statDelta?: { stat: WardrobeStatTag; delta: number }
  cost: number
  unlocksAtTier?: number
}

// ─── Room definitions ─────────────────────────────────────────────────────────

export interface RoomDefinition {
  id: string
  name: string
  emoji: string
  unlocksAtTier: number
  /** All possible zones; caller filters by tier and mirror-replacement rule. */
  zones: ApartmentZone[]
}

export const ROOM_DEFINITIONS: RoomDefinition[] = [
  {
    id: 'studio',
    name: 'Studio',
    emoji: '🏠',
    unlocksAtTier: 1,
    zones: ['wardrobe', 'bed', 'mirror'],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    emoji: '🛏️',
    unlocksAtTier: 2,
    zones: ['vanity'],
  },
  {
    id: 'living_room',
    name: 'Living Room',
    emoji: '🛋️',
    unlocksAtTier: 3,
    zones: ['livingRoom', 'kitchen'],
  },
  {
    id: 'rooftop',
    name: 'Rooftop',
    emoji: '🌆',
    unlocksAtTier: 4,
    zones: ['rooftop'],
  },
  {
    id: 'screening_room',
    name: 'Screening Room',
    emoji: '🎬',
    unlocksAtTier: 5,
    zones: ['private_screening_room'],
  },
]

/** Return the zones active in a room for the given apartment tier. */
export function getActiveRoomZones(room: RoomDefinition, tier: number): ApartmentZone[] {
  return room.zones.filter((zone) => {
    if (zone === 'mirror' && tier >= 2) return false // replaced by vanity in bedroom
    const config = ZONE_CONFIGS.find((z) => z.id === zone)
    return config ? config.unlocksAtTier <= tier : false
  })
}

export const MEAL_OPTIONS: MealOption[] = [
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    emoji: '🥑',
    energyGain: 25,
    statDelta: { stat: 'confidence', delta: 2 },
    cost: 5,
  },
  {
    id: 'instant-noodles',
    name: 'Instant Noodles',
    emoji: '🍜',
    energyGain: 20,
    cost: 2,
  },
  {
    id: 'green-smoothie',
    name: 'Green Smoothie',
    emoji: '🥤',
    energyGain: 18,
    statDelta: { stat: 'wisdom', delta: 2 },
    cost: 4,
  },
  {
    id: 'full-breakfast',
    name: 'Full Breakfast',
    emoji: '🍳',
    energyGain: 40,
    statDelta: { stat: 'reputation', delta: 1 },
    cost: 10,
  },
  {
    id: 'protein-shake',
    name: 'Protein Shake',
    emoji: '💪',
    energyGain: 22,
    statDelta: { stat: 'confidence', delta: 1 },
    cost: 3,
  },
  {
    id: 'power-breakfast',
    name: 'Power Breakfast',
    emoji: '🥞',
    energyGain: 30,
    statDelta: { stat: 'wisdom', delta: 2 },
    cost: 15,
    unlocksAtTier: 4,
  },
]
