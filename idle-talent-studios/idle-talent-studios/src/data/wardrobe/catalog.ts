import type { WardrobeItem } from '@/systems/wardrobeSystem'

const ALL_CHAR_IDS = [
  'amy-crawford',
  'marcus-vane',
  'olivier-sainte-claire',
  'remy-ashford',
  'celeste-voss',
  'dex-calloway',
  'the-driver',
  'sunny-park',
]

const ITEMS: WardrobeItem[] = [
  // ─── Common ─────────────────────────────────────────────────────────────────
  {
    id: 'basic-white-tee',
    name: 'Classic White Tee',
    description: 'Clean lines. Effortless.',
    rarity: 'common', slot: 'top',
    looksBonus: 2, confBonus: 0, statTag: null, statBonusValue: 0,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 50,
  },
  {
    id: 'straight-leg-jeans',
    name: 'Straight-Leg Jeans',
    description: 'Goes with everything.',
    rarity: 'common', slot: 'bottom',
    looksBonus: 2, confBonus: 0, statTag: null, statBonusValue: 0,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 50,
  },
  {
    id: 'classic-white-sneakers',
    name: 'White Sneakers',
    description: 'Industry staple.',
    rarity: 'common', slot: 'shoes',
    looksBonus: 2, confBonus: 0, statTag: null, statBonusValue: 0,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 50,
  },
  {
    id: 'simple-silver-ring',
    name: 'Silver Ring',
    description: 'Understated, always.',
    rarity: 'common', slot: 'accessory',
    looksBonus: 1, confBonus: 1, statTag: null, statBonusValue: 0,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 30,
  },
  {
    id: 'casual-button-down',
    name: 'Casual Button-Down',
    description: 'Smart without trying.',
    rarity: 'common', slot: 'top',
    looksBonus: 3, confBonus: 1, statTag: null, statBonusValue: 0,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 80,
  },

  // ─── Rare ────────────────────────────────────────────────────────────────────
  {
    id: 'velvet-blazer',
    name: 'Velvet Blazer',
    description: 'Power walks in.',
    rarity: 'rare', slot: 'top',
    looksBonus: 6, confBonus: 3, statTag: 'confidence', statBonusValue: 3,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 200,
  },
  {
    id: 'high-waist-trousers',
    name: 'High-Waist Trousers',
    description: 'Sharp silhouette. Serious energy.',
    rarity: 'rare', slot: 'bottom',
    looksBonus: 5, confBonus: 0, statTag: 'reputation', statBonusValue: 3,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 200,
  },
  {
    id: 'chelsea-boots',
    name: 'Chelsea Boots',
    description: 'The right kind of attention.',
    rarity: 'rare', slot: 'shoes',
    looksBonus: 5, confBonus: 2, statTag: 'confidence', statBonusValue: 2,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 180,
  },
  {
    id: 'gold-chain-necklace',
    name: 'Gold Chain',
    description: 'Quiet flex.',
    rarity: 'rare', slot: 'accessory',
    looksBonus: 4, confBonus: 0, statTag: 'wisdom', statBonusValue: 2,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 150,
  },
  {
    id: 'silk-blouse-crimson',
    name: 'Crimson Silk Blouse',
    description: 'Makes the room turn.',
    rarity: 'rare', slot: 'top',
    looksBonus: 6, confBonus: 0, statTag: 'reputation', statBonusValue: 3,
    characterAffinity: [], affinityBonus: 0, source: 'store', cost: 250,
  },
  {
    id: 'street-set',
    name: 'Street Set',
    description: 'Marcus picked this out. You can tell.',
    rarity: 'rare', slot: 'full_look',
    looksBonus: 8, confBonus: 3, statTag: 'confidence', statBonusValue: 3,
    characterAffinity: ['marcus-vane'], affinityBonus: 5,
    source: 'gift', cost: 0,
  },
  {
    id: 'academic-prep-look',
    name: 'Academic Prep Look',
    description: 'Career milestone unlocked this.',
    rarity: 'rare', slot: 'full_look',
    looksBonus: 7, confBonus: 0, statTag: 'wisdom', statBonusValue: 4,
    characterAffinity: [], affinityBonus: 0, source: 'career', cost: 0,
  },

  // ─── Epic ────────────────────────────────────────────────────────────────────
  {
    id: 'power-suit-charcoal',
    name: 'Charcoal Power Suit',
    description: "Olivier's first note about you was written the day you wore this.",
    rarity: 'epic', slot: 'top',
    looksBonus: 10, confBonus: 5, statTag: 'reputation', statBonusValue: 4,
    characterAffinity: ['olivier-sainte-claire'], affinityBonus: 8,
    source: 'store', cost: 500,
  },
  {
    id: 'editorial-jacket-black',
    name: 'Editorial Jacket',
    description: "Amy called it unsettlingly good. That counts as a compliment.",
    rarity: 'epic', slot: 'top',
    looksBonus: 12, confBonus: 3, statTag: 'wisdom', statBonusValue: 5,
    characterAffinity: ['amy-crawford'], affinityBonus: 8,
    source: 'store', cost: 600,
  },
  {
    id: 'couture-heels-ivory',
    name: 'Ivory Couture Heels',
    description: "Remy sourced them. Amy stared too long. Olivier took notes.",
    rarity: 'epic', slot: 'shoes',
    looksBonus: 10, confBonus: 2, statTag: 'reputation', statBonusValue: 5,
    characterAffinity: ['amy-crawford', 'olivier-sainte-claire'], affinityBonus: 5,
    source: 'store', cost: 550,
  },
  {
    id: 'vintage-chronograph-watch',
    name: 'Vintage Chronograph',
    description: "From Marcus. He said he found it. You know better.",
    rarity: 'epic', slot: 'accessory',
    looksBonus: 8, confBonus: 0, statTag: 'wisdom', statBonusValue: 6,
    characterAffinity: ['marcus-vane'], affinityBonus: 10,
    source: 'gift', cost: 0,
  },
  {
    id: 'designer-dress-blush',
    name: 'Blush Designer Dress',
    description: 'Remy spent three weeks on this. You owe him nothing. He insisted.',
    rarity: 'epic', slot: 'full_look',
    looksBonus: 15, confBonus: 5, statTag: 'reputation', statBonusValue: 8,
    characterAffinity: ['remy-ashford'], affinityBonus: 10,
    source: 'gacha', cost: 0,
  },

  // ─── Legendary ────────────────────────────────────────────────────────────────
  {
    id: 'iconic-red-gown',
    name: 'The Red Gown',
    description: "Three people tried to buy it off you mid-event. You said no.",
    rarity: 'legendary', slot: 'full_look',
    looksBonus: 20, confBonus: 10, statTag: 'reputation', statBonusValue: 10,
    characterAffinity: ALL_CHAR_IDS, affinityBonus: 5,
    source: 'store', cost: 2000,
  },
  {
    id: 'award-night-tuxedo',
    name: 'Award Night Tuxedo',
    description: 'The room goes quiet. That\'s the point.',
    rarity: 'legendary', slot: 'full_look',
    looksBonus: 18, confBonus: 12, statTag: 'reputation', statBonusValue: 15,
    characterAffinity: ALL_CHAR_IDS, affinityBonus: 5,
    source: 'store', cost: 2000,
  },
  {
    id: 'white-icon-look',
    name: 'The White Look',
    description: 'Some outfits become symbols. This one did overnight.',
    rarity: 'legendary', slot: 'full_look',
    looksBonus: 16, confBonus: 8, statTag: 'wisdom', statBonusValue: 10,
    characterAffinity: ALL_CHAR_IDS, affinityBonus: 5,
    source: 'career', cost: 0,
  },
]

export const WARDROBE_CATALOG: Record<string, WardrobeItem> = Object.fromEntries(
  ITEMS.map((item) => [item.id, item])
)

export const STORE_ITEMS = ITEMS.filter((i) => i.source === 'store' && i.cost > 0)
