// ═══════════════════════════════════════════════════════════════
// SECTION 1: CONSTANTS & BREED DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const BREEDS = {
  flame_drake: {
    id: 'flame_drake', name: 'Flame Drake', elements: ['fire'], emoji: '🔥',
    rarity: 'common',
    palette: { body: '#c0392b', wing: '#e74c3c', accent: '#f39c12', glow: 'rgba(231,76,60,0.45)' },
    ability: 'Scorching Breath — burns through enemy defenses',
    breedable: true
  },
  aqua_serpent: {
    id: 'aqua_serpent', name: 'Aqua Serpent', elements: ['water'], emoji: '💧',
    rarity: 'common',
    palette: { body: '#2471a3', wing: '#2e86c1', accent: '#1abc9c', glow: 'rgba(46,134,193,0.4)' },
    ability: 'Tidal Wave — shields allied cards',
    breedable: true
  },
  stone_titan: {
    id: 'stone_titan', name: 'Stone Titan', elements: ['earth'], emoji: '🪨',
    rarity: 'common',
    palette: { body: '#717d7e', wing: '#99a3a4', accent: '#d4ac0d', glow: 'rgba(113,125,126,0.4)' },
    ability: 'Earthshake — doubles defense stat',
    breedable: true
  },
  storm_rider: {
    id: 'storm_rider', name: 'Storm Rider', elements: ['electric'], emoji: '⚡',
    rarity: 'common',
    palette: { body: '#7d3c98', wing: '#8e44ad', accent: '#f1c40f', glow: 'rgba(241,196,15,0.5)' },
    ability: 'Thunder Strike — stuns on first turn',
    breedable: true
  },
  frost_wyrm: {
    id: 'frost_wyrm', name: 'Frost Wyrm', elements: ['ice'], emoji: '❄️',
    rarity: 'common',
    palette: { body: '#5dade2', wing: '#aed6f1', accent: '#d6eaf8', glow: 'rgba(93,173,226,0.4)' },
    ability: 'Flash Freeze — slows all enemies',
    breedable: true
  },
  jungle_sprite: {
    id: 'jungle_sprite', name: 'Jungle Sprite', elements: ['nature'], emoji: '🌿',
    rarity: 'common',
    palette: { body: '#1e8449', wing: '#27ae60', accent: '#a9dfbf', glow: 'rgba(39,174,96,0.4)' },
    ability: 'Overgrowth — heals +5 HP each round',
    breedable: true
  },
  shadow_stalker: {
    id: 'shadow_stalker', name: 'Shadow Stalker', elements: ['dark'], emoji: '🌑',
    rarity: 'common',
    palette: { body: '#1c2833', wing: '#2c3e50', accent: '#8e44ad', glow: 'rgba(142,68,173,0.4)' },
    ability: 'Phase Shift — dodges one attack per battle',
    breedable: true
  },
  solar_phoenix: {
    id: 'solar_phoenix', name: 'Solar Phoenix', elements: ['light'], emoji: '☀️',
    rarity: 'uncommon',
    palette: { body: '#e67e22', wing: '#f39c12', accent: '#fdfefe', glow: 'rgba(243,156,18,0.55)' },
    ability: 'Rebirth — revives once per battle',
    breedable: true
  },
  magma_golem: {
    id: 'magma_golem', name: 'Magma Golem', elements: ['fire', 'earth'], emoji: '🌋',
    rarity: 'rare',
    palette: { body: '#922b21', wing: '#7b241c', accent: '#f0b27a', glow: 'rgba(146,43,33,0.55)' },
    ability: 'Lava Surge — melts all armor',
    breedable: false
  },
  tidal_leviathan: {
    id: 'tidal_leviathan', name: 'Tidal Leviathan', elements: ['water', 'ice'], emoji: '🌊',
    rarity: 'rare',
    palette: { body: '#1a5276', wing: '#154360', accent: '#76d7c4', glow: 'rgba(26,82,118,0.5)' },
    ability: 'Deep Freeze — locks enemies for 2 turns',
    breedable: false
  },
  thundercloud: {
    id: 'thundercloud', name: 'Thundercloud', elements: ['electric', 'air'], emoji: '⛈️',
    rarity: 'rare',
    palette: { body: '#5b2c6f', wing: '#6c3483', accent: '#f9e79f', glow: 'rgba(91,44,111,0.55)' },
    ability: 'Chain Lightning — hits all enemies',
    breedable: false
  },
  crystal_drake: {
    id: 'crystal_drake', name: 'Crystal Drake', elements: ['earth', 'light'], emoji: '💎',
    rarity: 'rare',
    palette: { body: '#aeb6bf', wing: '#d5d8dc', accent: '#85c1e9', glow: 'rgba(133,193,233,0.5)' },
    ability: 'Prismatic Shield — reflects 50% damage',
    breedable: false
  },
  void_drake: {
    id: 'void_drake', name: 'Void Drake', elements: ['dark', 'electric'], emoji: '🕳️',
    rarity: 'epic',
    palette: { body: '#0d0d0d', wing: '#1a0a2e', accent: '#7d3c98', glow: 'rgba(125,60,152,0.65)' },
    ability: 'Void Rift — removes all enemy abilities',
    breedable: false
  },
  rainbow_dragon: {
    id: 'rainbow_dragon', name: 'Rainbow Dragon', elements: ['fire', 'water', 'earth', 'light'], emoji: '🌈',
    rarity: 'legendary',
    palette: { body: '#e74c3c', wing: '#f1c40f', accent: '#3498db', glow: 'rgba(255,107,107,0.5)' },
    ability: 'Spectrum Burst — deals all elemental damage',
    breedable: false
  },
  ancient_elder: {
    id: 'ancient_elder', name: 'Ancient Elder', elements: ['fire','water','earth','electric','ice','nature','dark','light'], emoji: '🐉',
    rarity: 'legendary',
    palette: { body: '#2c1654', wing: '#4a235a', accent: '#d4ac0d', glow: 'rgba(212,172,13,0.7)' },
    ability: 'Time Warp — resets all ability cooldowns',
    breedable: false
  },

  // ── EVOLVED BREEDS ──
  inferno_sovereign: {
    id: 'inferno_sovereign', name: 'Inferno Sovereign', elements: ['fire', 'light'], emoji: '🔱',
    rarity: 'rare',
    palette: { body: '#b71c1c', wing: '#ff5722', accent: '#ffd54f', glow: 'rgba(255,87,34,0.6)' },
    ability: 'Inferno Crown — incinerates all shields and buffs',
    breedable: false, evolvesFrom: 'flame_drake'
  },
  abyssal_leviathan: {
    id: 'abyssal_leviathan', name: 'Abyssal Leviathan', elements: ['water', 'dark'], emoji: '🐙',
    rarity: 'rare',
    palette: { body: '#0d2137', wing: '#1a3a5c', accent: '#00e5ff', glow: 'rgba(0,229,255,0.5)' },
    ability: 'Abyssal Crush — drags enemies into the deep for 3 turns',
    breedable: false, evolvesFrom: 'aqua_serpent'
  },
  iron_colossus: {
    id: 'iron_colossus', name: 'Iron Colossus', elements: ['earth', 'fire'], emoji: '🗿',
    rarity: 'rare',
    palette: { body: '#4e342e', wing: '#6d4c41', accent: '#ff6f00', glow: 'rgba(255,111,0,0.5)' },
    ability: 'Tectonic Slam — stuns all enemies and halves their attack',
    breedable: false, evolvesFrom: 'stone_titan'
  },
  tempest_archon: {
    id: 'tempest_archon', name: 'Tempest Archon', elements: ['electric', 'air'], emoji: '🌪️',
    rarity: 'rare',
    palette: { body: '#4a148c', wing: '#7b1fa2', accent: '#e1f5fe', glow: 'rgba(225,245,254,0.55)' },
    ability: 'Tempest Fury — chain strikes all enemies twice',
    breedable: false, evolvesFrom: 'storm_rider'
  },
  glacial_empress: {
    id: 'glacial_empress', name: 'Glacial Empress', elements: ['ice', 'light'], emoji: '🏔️',
    rarity: 'rare',
    palette: { body: '#b3e5fc', wing: '#e1f5fe', accent: '#ce93d8', glow: 'rgba(179,229,252,0.55)' },
    ability: 'Permafrost Reign — freezes and shatters enemy armor',
    breedable: false, evolvesFrom: 'frost_wyrm'
  },
  verdant_ancient: {
    id: 'verdant_ancient', name: 'Verdant Ancient', elements: ['nature', 'earth'], emoji: '🌳',
    rarity: 'rare',
    palette: { body: '#1b5e20', wing: '#2e7d32', accent: '#c8e6c9', glow: 'rgba(46,125,50,0.5)' },
    ability: 'World Tree — heals all allies +15 HP and cleanses debuffs',
    breedable: false, evolvesFrom: 'jungle_sprite'
  },
  eclipse_wraith: {
    id: 'eclipse_wraith', name: 'Eclipse Wraith', elements: ['dark', 'light'], emoji: '🌘',
    rarity: 'epic',
    palette: { body: '#12005e', wing: '#1a0033', accent: '#b388ff', glow: 'rgba(179,136,255,0.6)' },
    ability: 'Eclipse Veil — becomes untargetable for 2 turns and drains HP',
    breedable: false, evolvesFrom: 'shadow_stalker'
  },
  supernova_phoenix: {
    id: 'supernova_phoenix', name: 'Supernova Phoenix', elements: ['light', 'fire', 'electric'], emoji: '💫',
    rarity: 'epic',
    palette: { body: '#ff6f00', wing: '#ffd600', accent: '#ffffff', glow: 'rgba(255,214,0,0.7)' },
    ability: 'Supernova — revives twice and explodes on death dealing massive damage',
    breedable: false, evolvesFrom: 'solar_phoenix'
  },

  // ── EVENT-ONLY BREEDS (gacha exclusive) ──
  aurora_serpent: {
    id: 'aurora_serpent', name: 'Aurora Serpent', elements: ['ice', 'light'], emoji: '🌌',
    rarity: 'epic', eventOnly: true,
    palette: { body: '#0d4f6e', wing: '#1a7a5e', accent: '#76ffe4', glow: 'rgba(118,255,228,0.55)' },
    ability: 'Aurora Veil — cloaks allies in shimmering light',
    breedable: false
  },
  blossom_drake: {
    id: 'blossom_drake', name: 'Blossom Drake', elements: ['nature', 'light'], emoji: '🌸',
    rarity: 'rare', eventOnly: true,
    palette: { body: '#c0567a', wing: '#e8a0b0', accent: '#ffd6e8', glow: 'rgba(232,160,176,0.5)' },
    ability: 'Petal Storm — disorients and charms enemies',
    breedable: false
  },
  harvest_titan: {
    id: 'harvest_titan', name: 'Harvest Titan', elements: ['earth', 'fire'], emoji: '🎃',
    rarity: 'epic', eventOnly: true,
    palette: { body: '#b35a00', wing: '#d4700a', accent: '#ff9f1c', glow: 'rgba(212,112,10,0.55)' },
    ability: 'Reap the Fields — shatters all defenses',
    breedable: false
  },
  frost_sovereign: {
    id: 'frost_sovereign', name: 'Frost Sovereign', elements: ['ice', 'dark'], emoji: '👑',
    rarity: 'legendary', eventOnly: true,
    palette: { body: '#0a1a3a', wing: '#122244', accent: '#a8d8f0', glow: 'rgba(168,216,240,0.65)' },
    ability: 'Eternal Winter — freezes the battlefield for 3 turns',
    breedable: false
  }
};

// ═══════════════════════════════════════════════════════════════
// SECTION 1d: EVOLUTION PATHS
// ═══════════════════════════════════════════════════════════════

const EVOLUTION_PATHS = {
  flame_drake:    { evolvesTo: 'inferno_sovereign',  requirements: { minLevel: 10, minHappiness: 70, gemCost: 50 } },
  aqua_serpent:   { evolvesTo: 'abyssal_leviathan',  requirements: { minLevel: 10, minHappiness: 70, gemCost: 50 } },
  stone_titan:    { evolvesTo: 'iron_colossus',      requirements: { minLevel: 10, minHappiness: 70, gemCost: 50 } },
  storm_rider:    { evolvesTo: 'tempest_archon',     requirements: { minLevel: 10, minHappiness: 70, gemCost: 50 } },
  frost_wyrm:     { evolvesTo: 'glacial_empress',    requirements: { minLevel: 10, minHappiness: 70, gemCost: 50 } },
  jungle_sprite:  { evolvesTo: 'verdant_ancient',    requirements: { minLevel: 10, minHappiness: 70, gemCost: 50 } },
  shadow_stalker: { evolvesTo: 'eclipse_wraith',     requirements: { minLevel: 12, minHappiness: 80, gemCost: 80 } },
  solar_phoenix:  { evolvesTo: 'supernova_phoenix',  requirements: { minLevel: 12, minHappiness: 80, gemCost: 80 } }
};

// ═══════════════════════════════════════════════════════════════
// SECTION 1e: MINIGAME CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MINIGAME_COOLDOWN_MS = 10 * 60 * 1000;  // 10 minutes between plays
const MINIGAME_DAILY_LIMIT = 5;

const ELEMENT_EMOJIS = {
  fire: '🔥', water: '💧', earth: '🪨', electric: '⚡',
  ice: '❄️', nature: '🌿', dark: '🌑', light: '☀️'
};
const ELEMENT_NAMES = Object.keys(ELEMENT_EMOJIS);

// Breeding combination table: sorted element pair → weighted outcomes
const BREED_COMBOS = {
  'fire+earth':    [['magma_golem',60],['flame_drake',25],['stone_titan',15]],
  'earth+fire':    [['magma_golem',60],['flame_drake',25],['stone_titan',15]],
  'ice+water':     [['tidal_leviathan',60],['aqua_serpent',25],['frost_wyrm',15]],
  'water+ice':     [['tidal_leviathan',60],['aqua_serpent',25],['frost_wyrm',15]],
  'air+electric':  [['thundercloud',60],['storm_rider',30],['storm_rider',10]],
  'electric+air':  [['thundercloud',60],['storm_rider',30],['storm_rider',10]],
  'earth+light':   [['crystal_drake',55],['stone_titan',25],['solar_phoenix',20]],
  'light+earth':   [['crystal_drake',55],['stone_titan',25],['solar_phoenix',20]],
  'dark+electric': [['void_drake',40],['shadow_stalker',35],['storm_rider',25]],
  'electric+dark': [['void_drake',40],['shadow_stalker',35],['storm_rider',25]],
  'fire+water':    [['flame_drake',40],['aqua_serpent',40],['rainbow_dragon',20]],
  'water+fire':    [['flame_drake',40],['aqua_serpent',40],['rainbow_dragon',20]],
  'fire+light':    [['solar_phoenix',50],['flame_drake',30],['rainbow_dragon',20]],
  'light+fire':    [['solar_phoenix',50],['flame_drake',30],['rainbow_dragon',20]],
  'dark+light':    [['ancient_elder',15],['shadow_stalker',45],['solar_phoenix',40]],
  'light+dark':    [['ancient_elder',15],['shadow_stalker',45],['solar_phoenix',40]],
  'fire+ice':      [['flame_drake',35],['frost_wyrm',35],['magma_golem',30]],
  'ice+fire':      [['flame_drake',35],['frost_wyrm',35],['magma_golem',30]],
  'fire+electric': [['storm_rider',40],['flame_drake',35],['thundercloud',25]],
  'electric+fire': [['storm_rider',40],['flame_drake',35],['thundercloud',25]],
  'nature+water':  [['jungle_sprite',40],['aqua_serpent',40],['tidal_leviathan',20]],
  'water+nature':  [['jungle_sprite',40],['aqua_serpent',40],['tidal_leviathan',20]],
  'nature+earth':  [['jungle_sprite',50],['stone_titan',30],['crystal_drake',20]],
  'earth+nature':  [['jungle_sprite',50],['stone_titan',30],['crystal_drake',20]],
  'dark+nature':   [['shadow_stalker',45],['jungle_sprite',35],['void_drake',20]],
  'nature+dark':   [['shadow_stalker',45],['jungle_sprite',35],['void_drake',20]],
  'electric+ice':  [['storm_rider',40],['frost_wyrm',40],['thundercloud',20]],
  'ice+electric':  [['storm_rider',40],['frost_wyrm',40],['thundercloud',20]],
  'fire+fire':     [['flame_drake',100]],
  'water+water':   [['aqua_serpent',100]],
  'earth+earth':   [['stone_titan',100]],
  'electric+electric': [['storm_rider',100]],
  'ice+ice':       [['frost_wyrm',100]],
  'nature+nature': [['jungle_sprite',100]],
  'dark+dark':     [['shadow_stalker',80],['void_drake',20]],
  'light+light':   [['solar_phoenix',80],['rainbow_dragon',20]],
};

// ═══════════════════════════════════════════════════════════════
// SECTION 1b: LANDS (EXPLORABLE ISLANDS)
// ═══════════════════════════════════════════════════════════════

const LANDS = [
  {
    id: 'ember_peaks',
    name: 'Ember Peaks',
    subtitle: 'Volcanic highlands',
    emoji: '🌋',
    cost: 8,
    cooldownMs: 3 * 60 * 1000,
    theme: 'fire',
    eggPool: [['flame_drake',50],['stone_titan',25],['magma_golem',20],['ancient_elder',5]],
    description: 'Scorching peaks hide ancient fire eggs in the lava flows.',
    unlockAt: 0
  },
  {
    id: 'tidal_abyss',
    name: 'Tidal Abyss',
    subtitle: 'Ocean depths',
    emoji: '🌊',
    cost: 8,
    cooldownMs: 3 * 60 * 1000,
    theme: 'water',
    eggPool: [['aqua_serpent',50],['frost_wyrm',25],['tidal_leviathan',20],['rainbow_dragon',5]],
    description: 'Ancient eggs rest in cold silence beneath the waves.',
    unlockAt: 0
  },
  {
    id: 'storm_spire',
    name: 'Storm Spire',
    subtitle: 'Sky island',
    emoji: '⛈️',
    cost: 10,
    cooldownMs: 4 * 60 * 1000,
    theme: 'electric',
    eggPool: [['storm_rider',50],['thundercloud',25],['void_drake',20],['ancient_elder',5]],
    description: 'Storm-forged eggs crackle with raw electrical energy.',
    unlockAt: 1
  },
  {
    id: 'frosted_highlands',
    name: 'Frosted Highlands',
    subtitle: 'Arctic tundra',
    emoji: '❄️',
    cost: 10,
    cooldownMs: 4 * 60 * 1000,
    theme: 'ice',
    eggPool: [['frost_wyrm',50],['stone_titan',20],['tidal_leviathan',20],['crystal_drake',10]],
    description: 'Frozen eggs glimmer beneath the northern aurora.',
    unlockAt: 1
  },
  {
    id: 'shadow_hollow',
    name: 'Shadow Hollow',
    subtitle: 'Cursed forest',
    emoji: '🌑',
    cost: 12,
    cooldownMs: 5 * 60 * 1000,
    theme: 'dark',
    eggPool: [['shadow_stalker',45],['jungle_sprite',20],['void_drake',25],['ancient_elder',10]],
    description: 'Darkness itself seems alive in this cursed grove.',
    unlockAt: 2
  },
  {
    id: 'solar_sanctum',
    name: 'Solar Sanctum',
    subtitle: 'Temple of light',
    emoji: '☀️',
    cost: 12,
    cooldownMs: 5 * 60 * 1000,
    theme: 'light',
    eggPool: [['solar_phoenix',45],['flame_drake',20],['crystal_drake',25],['rainbow_dragon',10]],
    description: 'Radiant eggs bask in eternal sunlight atop golden spires.',
    unlockAt: 2
  },
  {
    id: 'primal_jungle',
    name: 'Primal Jungle',
    subtitle: 'Ancient rainforest',
    emoji: '🌿',
    cost: 15,
    cooldownMs: 6 * 60 * 1000,
    theme: 'nature',
    eggPool: [['jungle_sprite',40],['aqua_serpent',20],['stone_titan',15],['magma_golem',15],['rainbow_dragon',10]],
    description: 'Wild eggs nest among roots older than memory.',
    unlockAt: 3
  },
  {
    id: 'crystal_caverns',
    name: 'Crystal Caverns',
    subtitle: 'Gemstone depths',
    emoji: '💎',
    cost: 18,
    cooldownMs: 8 * 60 * 1000,
    theme: 'crystal',
    eggPool: [['crystal_drake',40],['stone_titan',20],['frost_wyrm',20],['rainbow_dragon',20]],
    description: 'Crystal-encrusted eggs pulse with prismatic light.',
    unlockAt: 3
  },
  {
    id: 'void_rift',
    name: 'The Void Rift',
    subtitle: 'Dimensional tear',
    emoji: '🕳️',
    cost: 25,
    cooldownMs: 10 * 60 * 1000,
    theme: 'void',
    eggPool: [['void_drake',35],['shadow_stalker',25],['storm_rider',10],['ancient_elder',30]],
    description: 'Reality tears open. Forbidden eggs drift between worlds.',
    unlockAt: 4
  },
  {
    id: 'celestial_isle',
    name: 'Celestial Isle',
    subtitle: 'Above the clouds',
    emoji: '🌈',
    cost: 30,
    cooldownMs: 15 * 60 * 1000,
    theme: 'celestial',
    eggPool: [['rainbow_dragon',40],['solar_phoenix',20],['ancient_elder',30],['crystal_drake',10]],
    description: 'The rarest eggs drift in rainbow mist at the top of the world.',
    unlockAt: 5
  }
];

// ═══════════════════════════════════════════════════════════════
// SECTION 1c: SHOP ITEMS
// ═══════════════════════════════════════════════════════════════

const SHOP_ITEMS = [
  // ── FOOD ──────────────────────────────────────────────────
  {
    id: 'food_sm', section: 'food',
    name: 'Berry Bunch', icon: '🫐',
    desc: 'A small snack. Restores 12 food.',
    cost: 18, effect: { food: 12 }
  },
  {
    id: 'food_md', section: 'food',
    name: 'Dragon Feast', icon: '🍗',
    desc: 'A hearty meal. Restores 35 food.',
    cost: 45, effect: { food: 35 }
  },
  {
    id: 'food_lg', section: 'food',
    name: 'Grand Banquet', icon: '🍖',
    desc: 'A lavish spread. Restores 90 food.',
    cost: 100, effect: { food: 90 }
  },
  {
    id: 'food_xl', section: 'food',
    name: 'Royal Haul', icon: '🎁',
    desc: 'An enormous stockpile. Restores 220 food.',
    cost: 220, effect: { food: 220 }, badge: 'Best Value'
  },

  // ── TOYS ──────────────────────────────────────────────────
  {
    id: 'toy_chew', section: 'toys',
    name: 'Chew Toy', icon: '🦴',
    desc: '+20 happiness to one dragon.',
    cost: 15, target: 'one', effect: { happiness: 20 }
  },
  {
    id: 'toy_ball', section: 'toys',
    name: 'Magic Ball', icon: '🔮',
    desc: '+30 happiness and −15 hunger.',
    cost: 28, target: 'one', effect: { happiness: 30, hunger: -15 }
  },
  {
    id: 'toy_pillow', section: 'toys',
    name: 'Dream Pillow', icon: '💤',
    desc: '+50 energy to one dragon.',
    cost: 30, target: 'one', effect: { energy: 50 }
  },
  {
    id: 'toy_orb', section: 'toys',
    name: 'Elemental Orb', icon: '🌀',
    desc: '+40 happiness and +35 energy.',
    cost: 45, target: 'one', effect: { happiness: 40, energy: 35 }
  },
  {
    id: 'toy_wand', section: 'toys',
    name: 'Dragon Wand', icon: '🪄',
    desc: '+20 happiness to ALL your dragons.',
    cost: 55, target: 'all', effect: { happiness: 20 }
  },
  {
    id: 'toy_bone', section: 'toys',
    name: 'Enchanted Bone', icon: '🍀',
    desc: '+30 happiness, +20 energy, +10 XP.',
    cost: 65, target: 'one', effect: { happiness: 30, energy: 20, xp: 10 }
  },

  // ── SPECIAL ───────────────────────────────────────────────
  {
    id: 'sp_xp', section: 'special',
    name: 'XP Potion', icon: '🧪',
    desc: '+60 XP to one dragon.',
    cost: 80, target: 'one', effect: { xp: 60 }
  },
  {
    id: 'sp_feed_all', section: 'special',
    name: 'Feast Bell', icon: '🔔',
    desc: 'Fully feeds ALL dragons (hunger → 0).',
    cost: 90, target: 'all', effect: { hunger: -100 }
  },
  {
    id: 'sp_hatch', section: 'special',
    name: 'Hatch Crystal', icon: '💠',
    desc: 'Instantly hatches one egg.',
    cost: 120, target: 'egg', effect: { hatch: true }
  }
];

// ═══════════════════════════════════════════════════════════════
// SECTION 1c: WEEKLY REWARDS & MONTHLY EVENTS
// ═══════════════════════════════════════════════════════════════

// Day 1-7 of a login streak week (index 0-6)
const WEEKLY_REWARDS = [
  { day: 1, gems: 15,  food: 10,  label: 'Day 1' },
  { day: 2, gems: 20,  food: 15,  label: 'Day 2' },
  { day: 3, gems: 30,  food: 20,  label: 'Day 3' },
  { day: 4, gems: 40,  food: 20,  label: 'Day 4' },
  { day: 5, gems: 55,  food: 30,  label: 'Day 5' },
  { day: 6, gems: 70,  food: 40,  label: 'Day 6' },
  { day: 7, gems: 120, food: 80,  label: 'Day 7 🌟', milestone: true }
];

// Indexed by month 0-11; featuredBreedId is the banner pull guarantee
const MONTHLY_EVENTS = [
  { month: 0,  name: 'New Year Skies',      featuredBreedId: 'aurora_serpent',  emoji: '🌌', flavor: 'The sky tears open with celestial color.' },
  { month: 1,  name: 'Hearts of Flame',     featuredBreedId: 'rainbow_dragon',  emoji: '💖', flavor: 'Love and legend intertwine.' },
  { month: 2,  name: 'Season of Blossoms',  featuredBreedId: 'blossom_drake',   emoji: '🌸', flavor: 'The world blooms with rare beauty.' },
  { month: 3,  name: 'Storm Awakening',     featuredBreedId: 'thundercloud',    emoji: '⛈️', flavor: 'Ancient storms stir again.' },
  { month: 4,  name: 'The Green Rising',    featuredBreedId: 'jungle_sprite',   emoji: '🌿', flavor: 'The jungle reclaims its power.' },
  { month: 5,  name: 'Tidal Convergence',   featuredBreedId: 'tidal_leviathan', emoji: '🌊', flavor: 'Deep waters surge toward the surface.' },
  { month: 6,  name: 'Solar Solstice',      featuredBreedId: 'solar_phoenix',   emoji: '☀️', flavor: 'The phoenix rises at peak sun.' },
  { month: 7,  name: 'Crystal Resonance',   featuredBreedId: 'crystal_drake',   emoji: '💎', flavor: 'Gems vibrate with ancient power.' },
  { month: 8,  name: 'Harvest Moon',        featuredBreedId: 'harvest_titan',   emoji: '🎃', flavor: 'The dark harvest begins.' },
  { month: 9,  name: 'Void Incursion',      featuredBreedId: 'void_drake',      emoji: '🕳️', flavor: 'The rift widens. What steps through?' },
  { month: 10, name: 'Elder Awakening',     featuredBreedId: 'ancient_elder',   emoji: '🐉', flavor: 'The ancients stir from their slumber.' },
  { month: 11, name: 'Frost Sovereign',     featuredBreedId: 'frost_sovereign', emoji: '👑', flavor: 'A frozen tyrant reclaims the world.' }
];

function getCurrentEvent() {
  const month = new Date().getMonth(); // 0-11
  return MONTHLY_EVENTS[month];
}

// Gacha pull rates (out of 1000)
const GACHA_RATES = {
  featured:  30,   // 3%   — featured event dragon
  legendary: 20,   // 2%   — any other legendary
  epic:      100,  // 10%
  rare:      350,  // 35%
  common:    500   // 50%
};
const GACHA_PITY_RARE      = 10;   // guaranteed rare+ every N pulls
const GACHA_PITY_LEGENDARY = 50;   // guaranteed legendary+ every N pulls
const GACHA_SINGLE_COST    = 150;
const GACHA_TEN_COST       = 1350;

// ═══════════════════════════════════════════════════════════════
// SECTION 2: DATA MODELS & FACTORIES
// ═══════════════════════════════════════════════════════════════

function makeDragonId() {
  return 'dragon_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
}

function makeCardId() {
  return 'card_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
}

function makeTradeId() {
  return 'trade_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
}

function createDragon(breedId, opts = {}) {
  const now = Date.now();
  return {
    id: opts.id || makeDragonId(),
    breedId,
    name: opts.name || BREEDS[breedId].name,
    stage: opts.stage || 'baby',
    level: opts.level || 1,
    xp: 0,
    hunger: 30,
    happiness: 80,
    energy: 100,
    lastFed: now,
    lastPlayed: now,
    lastTrained: now,
    hatchedAt: opts.hatchedAt || now,
    eggTimer: opts.eggTimer || null,
    parent1Id: opts.parent1Id || null,
    parent2Id: opts.parent2Id || null,
    isCardMinted: false,
    createdAt: now,
    evolvedFrom: opts.evolvedFrom || null,
    evolvedAt: opts.evolvedAt || null
  };
}

function getStageForLevel(level) {
  if (level <= 5)  return 'baby';
  if (level <= 15) return 'adult';
  return 'elder';
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3: STORAGE
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'dragonvale_state';

let gameState = null;

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function currentMonthString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

function createDefaultState() {
  return {
    version: 1,
    lastSaved: Date.now(),
    player: {
      name: 'Trainer',
      gems: 150,
      food: 80,
      cardEditionCounters: {},
      lastLoginDate: null,
      loginStreak: 0,
      weekDayIndex: 0,       // 0-6 position in current weekly cycle
      lastShopBonus: null    // "YYYY-MM-DD" — daily free gem claim
    },
    monthlyEvent: {
      month: currentMonthString(),
      pulls: 0,
      pityCount: 0           // pulls since last rare+
    },
    dragons: [],
    cards: [],
    tradeInbox: [],
    explorations: {},
    settings: { decayEnabled: true },
    minigames: {
      memoryMatch:    { lastPlayed: 0, dailyPlaysToday: 0, dailyPlaysDate: null, bestMoves: Infinity, bestTimeMs: Infinity },
      dragonQuiz:     { lastPlayed: 0, dailyPlaysToday: 0, dailyPlaysDate: null, bestScore: 0 },
      elementalPuzzle:{ lastPlayed: 0, dailyPlaysToday: 0, dailyPlaysDate: null, highScore: 0 }
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const s = JSON.parse(raw);
    if (!s || s.version !== 1) return createDefaultState();
    // Backfill new fields for existing saves
    if (!s.explorations) s.explorations = {};
    if (!s.player.lastLoginDate)  s.player.lastLoginDate  = null;
    if (!s.player.lastShopBonus)  s.player.lastShopBonus  = null;
    if (!s.player.loginStreak)   s.player.loginStreak   = 0;
    if (s.player.weekDayIndex === undefined) s.player.weekDayIndex = 0;
    if (!s.monthlyEvent) s.monthlyEvent = { month: currentMonthString(), pulls: 0, pityCount: 0 };
    // Reset event if month changed
    if (s.monthlyEvent.month !== currentMonthString()) {
      s.monthlyEvent = { month: currentMonthString(), pulls: 0, pityCount: 0 };
    }
    // Backfill evolution fields for existing dragons
    if (s.dragons) {
      s.dragons.forEach(d => {
        if (d.evolvedFrom === undefined) d.evolvedFrom = null;
        if (d.evolvedAt === undefined)   d.evolvedAt = null;
      });
    }
    // Backfill minigames
    if (!s.minigames) {
      s.minigames = {
        memoryMatch:    { lastPlayed: 0, dailyPlaysToday: 0, dailyPlaysDate: null, bestMoves: Infinity, bestTimeMs: Infinity },
        dragonQuiz:     { lastPlayed: 0, dailyPlaysToday: 0, dailyPlaysDate: null, bestScore: 0 },
        elementalPuzzle:{ lastPlayed: 0, dailyPlaysToday: 0, dailyPlaysDate: null, highScore: 0 }
      };
    }
    return s;
  } catch (e) {
    console.warn('Save corrupted, resetting:', e);
    return createDefaultState();
  }
}

function saveState() {
  gameState.lastSaved = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.warn('Could not save:', e);
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4: GAME STATE ENGINE (decay, care actions, level up)
// ═══════════════════════════════════════════════════════════════

// Decay rates per millisecond
const HUNGER_RATE   = 0.00095;  // ~+82/day
const HAPPY_RATE    = 0.00065;  // ~-56/day
const ENERGY_REGEN  = 0.00120;  // ~+104/day recovery

function applyDecay(dragon, now) {
  if (!gameState.settings.decayEnabled) return;
  if (dragon.stage === 'egg' || dragon.eggTimer !== null) return;

  const hungerMs   = now - dragon.lastFed;
  const happyMs    = now - dragon.lastPlayed;
  const energyMs   = now - dragon.lastTrained;

  dragon.hunger    = Math.min(100, Math.round(dragon.hunger   + hungerMs * HUNGER_RATE));
  dragon.happiness = Math.max(0,   Math.round(dragon.happiness - happyMs * HAPPY_RATE));
  dragon.energy    = Math.min(100, Math.round(dragon.energy   + energyMs * ENERGY_REGEN));
}

function applyDecayAll() {
  const now = Date.now();
  gameState.dragons.forEach(d => applyDecay(d, now));
  // update timestamps so next decay is relative to NOW
  gameState.dragons.forEach(d => {
    if (d.eggTimer === null && d.stage !== 'egg') {
      d.lastFed     = now;
      d.lastPlayed  = now;
      d.lastTrained = now;
    }
  });
}

function feedDragon(dragon) {
  const cost = 5;
  if (gameState.player.food < cost) return { ok: false, msg: 'Not enough food! 🍖' };
  gameState.player.food -= cost;
  dragon.hunger    = Math.max(0, dragon.hunger - 40);
  dragon.happiness = Math.min(100, dragon.happiness + 5);
  dragon.lastFed   = Date.now();
  addXP(dragon, 3);
  saveState();
  return { ok: true, msg: `${dragon.name} is fed! 🍖` };
}

function playWithDragon(dragon) {
  if (dragon.energy < 20) return { ok: false, msg: `${dragon.name} is too tired to play!` };
  dragon.energy    -= 20;
  dragon.happiness  = Math.min(100, dragon.happiness + 22);
  dragon.hunger     = Math.min(100, dragon.hunger + 6);
  dragon.lastPlayed = Date.now();
  addXP(dragon, 6);
  saveState();
  return { ok: true, msg: `${dragon.name} had fun! 🎉` };
}

function trainDragon(dragon) {
  if (dragon.energy < 25) return { ok: false, msg: `${dragon.name} needs rest before training!` };
  dragon.energy     -= 25;
  dragon.hunger      = Math.min(100, dragon.hunger + 8);
  dragon.lastTrained = Date.now();
  addXP(dragon, 18);
  saveState();
  return { ok: true, msg: `${dragon.name} trained hard! 💪` };
}

function addXP(dragon, amount) {
  dragon.xp += amount;
  let leveled = false;
  while (dragon.xp >= xpForLevel(dragon.level)) {
    dragon.xp -= xpForLevel(dragon.level);
    dragon.level++;
    dragon.stage = getStageForLevel(dragon.level);
    leveled = true;
  }
  if (leveled) {
    setTimeout(() => showToast(`${dragon.name} reached Level ${dragon.level}! 🌟`, 'info'), 300);
    const evoCheck = checkEvolutionEligibility(dragon);
    if (evoCheck.eligible) {
      setTimeout(() => showToast(`✦ ${dragon.name} can now evolve!`, 'success'), 1200);
    }
  }
}

function xpForLevel(level) {
  return level * 18 + 12; // 30 for lvl1→2, 48 for lvl2→3 …
}

function xpPercent(dragon) {
  const needed = xpForLevel(dragon.level);
  return Math.min(100, Math.round((dragon.xp / needed) * 100));
}

// ─── EVOLUTION SYSTEM ──────────────────────────────────────────

function checkEvolutionEligibility(dragon) {
  if (dragon.eggTimer !== null || dragon.stage === 'egg') {
    return { eligible: false, reason: 'Eggs cannot evolve.', path: null };
  }
  const path = EVOLUTION_PATHS[dragon.breedId];
  if (!path) {
    return { eligible: false, reason: 'This breed cannot evolve.', path: null };
  }
  if (!BREEDS[path.evolvesTo]) {
    return { eligible: false, reason: 'Evolution target not found.', path: null };
  }
  const req = path.requirements;
  if (dragon.level < req.minLevel) {
    return { eligible: false, reason: `Requires level ${req.minLevel} (currently ${dragon.level}).`, path };
  }
  if (req.minHappiness && dragon.happiness < req.minHappiness) {
    return { eligible: false, reason: `Requires ${req.minHappiness} happiness (currently ${dragon.happiness}).`, path };
  }
  if (req.gemCost && gameState.player.gems < req.gemCost) {
    return { eligible: false, reason: `Requires ${req.gemCost} gems (you have ${gameState.player.gems}).`, path };
  }
  return { eligible: true, reason: 'Ready to evolve!', path };
}

function evolveDragon(dragon) {
  const check = checkEvolutionEligibility(dragon);
  if (!check.eligible) return { ok: false, msg: check.reason };

  const path = check.path;
  const req = path.requirements;

  if (req.gemCost) gameState.player.gems -= req.gemCost;

  dragon.evolvedFrom = dragon.breedId;
  dragon.evolvedAt = Date.now();
  dragon.breedId = path.evolvesTo;

  // Update name if player hasn't customized it
  const oldBreedName = BREEDS[dragon.evolvedFrom] ? BREEDS[dragon.evolvedFrom].name : null;
  if (dragon.name === oldBreedName) {
    dragon.name = BREEDS[dragon.breedId].name;
  }

  // Allow minting a new card for the evolved form
  dragon.isCardMinted = false;

  saveState();
  updateHUD();
  return { ok: true, msg: `${dragon.name} evolved into ${BREEDS[dragon.breedId].name}!` };
}

function getEvolutionDisplayInfo(dragon) {
  const path = EVOLUTION_PATHS[dragon.breedId];
  if (!path) return null;

  const check = checkEvolutionEligibility(dragon);
  const targetBreed = BREEDS[path.evolvesTo];
  const req = path.requirements;

  return {
    targetBreedId: path.evolvesTo,
    targetBreed,
    eligible: check.eligible,
    reason: check.reason,
    requirements: {
      level: { required: req.minLevel, current: dragon.level, met: dragon.level >= req.minLevel },
      happiness: { required: req.minHappiness, current: dragon.happiness, met: dragon.happiness >= req.minHappiness },
      gems: { required: req.gemCost, current: gameState.player.gems, met: gameState.player.gems >= req.gemCost }
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5: BREEDING SYSTEM
// ═══════════════════════════════════════════════════════════════

const EGG_HATCH_MS = 2 * 60 * 1000; // 2 minutes for demo; change to 8h for real play

function getBreedingOutcome(breedId1, breedId2) {
  const el1 = BREEDS[breedId1].elements[0];
  const el2 = BREEDS[breedId2].elements[0];
  const key = el1 + '+' + el2;
  const outcomes = BREED_COMBOS[key];
  if (!outcomes) {
    return Math.random() < 0.03 ? 'ancient_elder' : breedId1;
  }
  return weightedRandom(outcomes);
}

function getBreedingPreview(breedId1, breedId2) {
  const el1 = BREEDS[breedId1].elements[0];
  const el2 = BREEDS[breedId2].elements[0];
  const key = el1 + '+' + el2;
  const outcomes = BREED_COMBOS[key] || [[breedId1, 50], [breedId2, 50]];
  const total = outcomes.reduce((s, [, w]) => s + w, 0);
  // deduplicate
  const seen = {};
  outcomes.forEach(([id, w]) => { seen[id] = (seen[id] || 0) + w; });
  return Object.entries(seen).map(([id, w]) => ({
    breedId: id,
    pct: Math.round((w / total) * 100)
  })).sort((a, b) => b.pct - a.pct);
}

function weightedRandom(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let roll = Math.random() * total;
  for (const [id, w] of pairs) {
    roll -= w;
    if (roll <= 0) return id;
  }
  return pairs[0][0];
}

function startBreeding(parent1Id, parent2Id) {
  const p1 = gameState.dragons.find(d => d.id === parent1Id);
  const p2 = gameState.dragons.find(d => d.id === parent2Id);
  if (!p1 || !p2) return { ok: false, msg: 'Dragon not found' };
  if (gameState.player.gems < 20) return { ok: false, msg: 'Not enough gems! 💎' };

  gameState.player.gems -= 20;
  const resultBreedId = getBreedingOutcome(p1.breedId, p2.breedId);
  const hatchTime = Date.now() + EGG_HATCH_MS;

  const egg = createDragon(resultBreedId, {
    stage: 'egg',
    eggTimer: hatchTime,
    parent1Id: parent1Id,
    parent2Id: parent2Id,
    level: 0
  });
  egg.name = BREEDS[resultBreedId].name + ' Egg';

  gameState.dragons.push(egg);
  saveState();
  return { ok: true, egg, msg: `Breeding started! Egg hatches in 2 minutes. 🥚` };
}

function checkEggHatches() {
  const now = Date.now();
  let hatched = false;
  gameState.dragons.forEach(d => {
    if (d.eggTimer !== null && now >= d.eggTimer) {
      d.eggTimer = null;
      d.stage = 'baby';
      d.level = 1;
      d.name = BREEDS[d.breedId].name;
      d.hatchedAt = now;
      d.lastFed = d.lastPlayed = d.lastTrained = now;
      hatched = true;
      showToast(`${d.name} has hatched! 🐣`, 'success');
    }
  });
  if (hatched) saveState();
  return hatched;
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6: CARD SYSTEM
// ═══════════════════════════════════════════════════════════════

const RARITY_WEIGHTS = {
  common:    { common: 65, rare: 25, epic: 8,  legendary: 2  },
  uncommon:  { common: 40, rare: 40, epic: 15, legendary: 5  },
  rare:      { common: 20, rare: 50, epic: 25, legendary: 5  },
  epic:      { common: 5,  rare: 30, epic: 50, legendary: 15 },
  legendary: { common: 0,  rare: 10, epic: 35, legendary: 55 }
};

const FOIL_CHANCE = { common: 0.01, rare: 0.08, epic: 0.22, legendary: 0.48 };

function determineCardRarity(dragon) {
  const base = BREEDS[dragon.breedId].rarity;
  const w = { ...RARITY_WEIGHTS[base] || RARITY_WEIGHTS.common };

  // Level bonus: shift toward higher rarities
  const bonus = Math.floor(dragon.level / 10) * 3;
  w.common    = Math.max(0, w.common - bonus);
  w.epic      += Math.floor(bonus * 0.8);
  w.legendary += Math.floor(bonus * 0.5);

  const pairs = Object.entries(w).map(([id, wt]) => [id, wt]);
  return weightedRandom(pairs);
}

function mintCard(dragon) {
  if (dragon.stage === 'egg') return { ok: false, msg: 'Cannot mint an egg!' };
  if (dragon.isCardMinted) return { ok: false, msg: 'A card has already been minted from this dragon.' };

  const rarity = determineCardRarity(dragon);
  const foil   = Math.random() < (FOIL_CHANCE[rarity] || 0);

  const counters = gameState.player.cardEditionCounters;
  counters[dragon.breedId] = (counters[dragon.breedId] || 0) + 1;

  const card = {
    id: makeCardId(),
    dragonId: dragon.id,
    breedId: dragon.breedId,
    dragonName: dragon.name,
    rarity,
    foil,
    editionNumber: counters[dragon.breedId],
    level: dragon.level,
    stage: dragon.stage,
    mintedAt: Date.now(),
    tradeCode: null
  };

  dragon.isCardMinted = true;
  gameState.cards.push(card);
  saveState();

  const suffix = foil ? ' ✨ FOIL!' : '!';
  return { ok: true, card, msg: `${rarity.toUpperCase()} card minted${suffix}` };
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7: TRADE SYSTEM
// ═══════════════════════════════════════════════════════════════

function exportCard(cardId) {
  const card = gameState.cards.find(c => c.id === cardId);
  if (!card) return null;

  const payload = {
    v: 1,
    c: card,
    from: gameState.player.name,
    ts: Date.now()
  };

  const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  card.tradeCode = code;
  saveState();
  return code;
}

function importTradeOffer(code) {
  try {
    const decoded = decodeURIComponent(escape(atob(code.trim())));
    const payload = JSON.parse(decoded);
    if (!payload || payload.v !== 1 || !payload.c) {
      return { ok: false, msg: 'Invalid trade code.' };
    }

    // Prevent duplicates
    const duplicate = gameState.tradeInbox.some(t => t.offeredCard.id === payload.c.id);
    if (duplicate) return { ok: false, msg: 'This offer is already in your inbox.' };

    const offer = {
      id: makeTradeId(),
      offeredCard: payload.c,
      senderName: payload.from || 'Unknown',
      exportedAt: payload.ts,
      importedAt: Date.now()
    };

    gameState.tradeInbox.push(offer);
    saveState();
    return { ok: true, offer, msg: `Trade offer from ${offer.senderName} received!` };
  } catch (e) {
    return { ok: false, msg: 'Could not parse trade code.' };
  }
}

function acceptTrade(tradeId) {
  const offer = gameState.tradeInbox.find(t => t.id === tradeId);
  if (!offer) return false;

  // Add received card with new local id
  const received = {
    ...offer.offeredCard,
    id: 'card_imported_' + Date.now()
  };
  gameState.cards.push(received);
  gameState.tradeInbox = gameState.tradeInbox.filter(t => t.id !== tradeId);
  saveState();
  return true;
}

function declineTrade(tradeId) {
  gameState.tradeInbox = gameState.tradeInbox.filter(t => t.id !== tradeId);
  saveState();
}

// ═══════════════════════════════════════════════════════════════
// SECTION 8: RENDERER
// ═══════════════════════════════════════════════════════════════

function renderDragonArt(breedId, stage, size = 100) {
  const breed = BREEDS[breedId];
  if (!breed) return '<div class="dragon-art"></div>';
  const p = breed.palette;
  const scale = size / 100;
  const stageClass = 'stage-' + (stage || 'baby');
  return `
    <div class="dragon-art ${stageClass}"
         style="--body:${p.body};--wing:${p.wing};--accent:${p.accent};--glow:${p.glow};transform:scale(${scale});transform-origin:bottom center;">
      <div class="dragon-glow"></div>
      <div class="dragon-shadow"></div>
      <div class="dragon-wing dragon-wing--left"></div>
      <div class="dragon-wing dragon-wing--right"></div>
      <div class="dragon-body"></div>
      <div class="dragon-neck"></div>
      <div class="dragon-head">
        <div class="dragon-horn"></div>
        <div class="dragon-eye dragon-eye--left"></div>
        <div class="dragon-eye dragon-eye--right"></div>
      </div>
      <div class="dragon-tail"></div>
      <div class="dragon-emoji">${breed.emoji}</div>
    </div>`;
}

function renderDragonCard(dragon) {
  const breed = BREEDS[dragon.breedId];
  const p = breed ? breed.palette : { body:'#888', wing:'#aaa', accent:'#ccc', glow:'rgba(0,0,0,0.2)' };
  const stageBadge = `<span class="dragon-card__stage-badge badge-${dragon.stage}">${dragon.stage}</span>`;

  if (dragon.stage === 'egg' || dragon.eggTimer !== null) {
    const ms = dragon.eggTimer ? Math.max(0, dragon.eggTimer - Date.now()) : 0;
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const timerStr = ms > 0 ? `Hatches in ${min}:${String(sec).padStart(2,'0')}` : 'Ready to hatch!';
    return `
      <div class="dragon-card" data-id="${dragon.id}" style="--glow:${p.glow}">
        ${stageBadge}
        <div style="height:100px;display:flex;align-items:center;justify-content:center;">
          ${renderDragonArt(dragon.breedId, 'egg', 80)}
        </div>
        <div class="dragon-card__name">${dragon.name}</div>
        <div class="dragon-card__breed" style="color:var(--color-accent-2);">${timerStr}</div>
      </div>`;
  }

  const hungerPct  = Math.min(100, dragon.hunger);
  const happyPct   = Math.max(0, dragon.happiness);
  const energyPct  = Math.max(0, dragon.energy);

  return `
    <div class="dragon-card" data-id="${dragon.id}" style="--glow:${p.glow}">
      ${stageBadge}
      <div style="height:110px;display:flex;align-items:center;justify-content:center;">
        ${renderDragonArt(dragon.breedId, dragon.stage, 85)}
      </div>
      <div class="dragon-card__name">${dragon.name}</div>
      <div class="dragon-card__breed">${breed ? breed.name : dragon.breedId}</div>
      <div class="dragon-card__level">Lv.${dragon.level}</div>
      <div class="dragon-card__bars">
        <div class="stat-bar stat-bar--hunger" title="Hunger">
          <span class="stat-bar__icon">🍖</span>
          <div class="stat-bar__track"><div class="stat-bar__fill" style="width:${hungerPct}%"></div></div>
        </div>
        <div class="stat-bar stat-bar--happy" title="Happiness">
          <span class="stat-bar__icon">😊</span>
          <div class="stat-bar__track"><div class="stat-bar__fill" style="width:${happyPct}%"></div></div>
        </div>
        <div class="stat-bar stat-bar--energy" title="Energy">
          <span class="stat-bar__icon">⚡</span>
          <div class="stat-bar__track"><div class="stat-bar__fill" style="width:${energyPct}%"></div></div>
        </div>
      </div>
    </div>`;
}

function renderCollectibleCard(card, mini = false) {
  const breed = BREEDS[card.breedId];
  const foilClass = card.foil ? ' foil' : '';
  const frameClass = `card-frame rarity-${card.rarity}${foilClass}`;
  const artSize = mini ? 60 : 80;

  return `
    <div class="${frameClass}" data-card-id="${card.id}">
      ${card.foil ? '<span class="card-frame__foil-badge">✨</span>' : ''}
      <div class="card-frame__art">
        ${renderDragonArt(card.breedId, card.stage || 'adult', artSize)}
      </div>
      <div class="card-frame__name">${card.dragonName}</div>
      <div class="card-frame__breed">${breed ? breed.name : card.breedId}</div>
      <div class="card-frame__footer">
        <span class="card-frame__rarity-tag">${card.rarity}</span>
        <span class="card-frame__level">Lv.${card.level}</span>
        <span class="card-frame__edition">#${card.editionNumber}</span>
      </div>
    </div>`;
}

function renderEvolutionSection(dragon) {
  // Show lineage badge for already-evolved dragons
  if (dragon.evolvedFrom && !EVOLUTION_PATHS[dragon.breedId]) {
    const fromBreed = BREEDS[dragon.evolvedFrom];
    return `<div class="evo-lineage">
      <span class="evo-lineage__badge">✦ Evolved from ${fromBreed ? fromBreed.name : dragon.evolvedFrom}</span>
    </div>`;
  }

  const evoInfo = getEvolutionDisplayInfo(dragon);
  if (!evoInfo) {
    if (dragon.evolvedFrom) {
      const fromBreed = BREEDS[dragon.evolvedFrom];
      return `<div class="evo-lineage">
        <span class="evo-lineage__badge">✦ Evolved from ${fromBreed ? fromBreed.name : dragon.evolvedFrom}</span>
      </div>`;
    }
    return '';
  }

  const tb = evoInfo.targetBreed;
  const req = evoInfo.requirements;
  const check = (met) => met ? '✅' : '❌';

  const reqHtml = `
    <div class="evo-requirements">
      <div class="evo-req ${req.level.met ? 'met' : ''}">
        ${check(req.level.met)} Level ${req.level.required}
        <span class="evo-req__current">(${req.level.current}/${req.level.required})</span>
      </div>
      <div class="evo-req ${req.happiness.met ? 'met' : ''}">
        ${check(req.happiness.met)} Happiness ${req.happiness.required}
        <span class="evo-req__current">(${req.happiness.current}/${req.happiness.required})</span>
      </div>
      <div class="evo-req ${req.gems.met ? 'met' : ''}">
        ${check(req.gems.met)} ${req.gems.required} gems
        <span class="evo-req__current">(${req.gems.current} available)</span>
      </div>
    </div>`;

  const btnHtml = evoInfo.eligible
    ? `<button class="btn btn--evolution btn--full" data-action="evolve" data-id="${dragon.id}">
        ✦ Evolve to ${tb.name} ${tb.emoji}
      </button>`
    : `<button class="btn btn--ghost btn--full" disabled style="opacity:0.5">
        ✦ Evolution Locked
      </button>`;

  return `
    <div class="evo-section">
      <div class="evo-header">
        <span class="evo-header__label">✦ Evolution Available</span>
      </div>
      <div class="evo-preview">
        <div class="evo-preview__art">
          ${renderDragonArt(evoInfo.targetBreedId, 'adult', 60)}
        </div>
        <div class="evo-preview__info">
          <div class="evo-preview__name">${tb.name} ${tb.emoji}</div>
          <div class="rarity-badge rarity-${tb.rarity}">${tb.rarity}</div>
          <div class="evo-preview__ability">${tb.ability}</div>
        </div>
      </div>
      ${reqHtml}
      ${btnHtml}
    </div>`;
}

function showEvolutionAnimation(dragon, oldBreedId, newBreedId) {
  const oldBreed = BREEDS[oldBreedId];
  const newBreed = BREEDS[newBreedId];

  const html = `
    <div class="evo-animation" id="evo-animation">
      <div class="evo-animation__stage">
        <div class="evo-animation__old" id="evo-old-art">
          ${renderDragonArt(oldBreedId, dragon.stage, 120)}
        </div>
        <div class="evo-animation__new evo-hidden" id="evo-new-art">
          ${renderDragonArt(newBreedId, dragon.stage, 140)}
        </div>
        <div class="evo-animation__flash" id="evo-flash"></div>
      </div>
      <div class="evo-animation__text" id="evo-text">
        ${oldBreed ? oldBreed.name : 'Your dragon'} is evolving...
      </div>
    </div>`;

  openModal(html);

  const animEl = document.getElementById('evo-animation');
  if (animEl) animEl.classList.add('phase-glow');

  setTimeout(() => {
    const flash = document.getElementById('evo-flash');
    const oldArt = document.getElementById('evo-old-art');
    if (flash) flash.classList.add('active');
    if (oldArt) oldArt.classList.add('evo-hidden');
  }, 1500);

  setTimeout(() => {
    const flash = document.getElementById('evo-flash');
    const newArt = document.getElementById('evo-new-art');
    const textEl = document.getElementById('evo-text');
    const animEl2 = document.getElementById('evo-animation');
    if (flash) flash.classList.remove('active');
    if (newArt) newArt.classList.remove('evo-hidden');
    if (animEl2) animEl2.classList.add('phase-reveal');
    if (textEl) {
      textEl.innerHTML = `
        <div class="evo-animation__result-name">${newBreed ? newBreed.name : newBreedId} ${newBreed ? newBreed.emoji : ''}</div>
        <div class="rarity-badge rarity-${newBreed ? newBreed.rarity : 'rare'}">${newBreed ? newBreed.rarity : 'rare'}</div>
        <div class="evo-animation__ability">${newBreed ? newBreed.ability : ''}</div>
        <button class="btn btn--primary btn--full" id="modal-close-btn" style="margin-top:12px;">Amazing!</button>
      `;
    }
  }, 2200);
}

function renderDragonDetailModal(dragon) {
  const breed = BREEDS[dragon.breedId];
  const xpPct = xpPercent(dragon);
  const isEgg = dragon.eggTimer !== null;
  const p = breed ? breed.palette : {};

  let actionsHtml = '';
  if (!isEgg) {
    actionsHtml = `
      <div class="dragon-detail__actions">
        <button class="btn btn--primary btn--sm" data-action="feed" data-id="${dragon.id}">🍖 Feed<br><small style="opacity:0.7">5🍖</small></button>
        <button class="btn btn--secondary btn--sm" data-action="play" data-id="${dragon.id}">🎮 Play</button>
        <button class="btn btn--secondary btn--sm" data-action="train" data-id="${dragon.id}">💪 Train</button>
      </div>
      <div class="dragon-detail__actions-2">
        <button class="btn btn--ghost btn--sm" data-action="rename" data-id="${dragon.id}">✏️ Rename</button>
        ${!dragon.isCardMinted ? `<button class="btn btn--primary btn--sm" data-action="mint" data-id="${dragon.id}">🃏 Mint Card</button>` : '<span class="btn btn--ghost btn--sm" style="opacity:0.4;cursor:default;">🃏 Minted</span>'}
      </div>`;
  } else {
    const ms = Math.max(0, dragon.eggTimer - Date.now());
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    actionsHtml = `
      <div style="text-align:center;padding:8px;color:var(--color-accent-2);">
        ${ms > 0 ? `Hatches in ${min}:${String(sec).padStart(2,'0')} ⏳` : ''}
      </div>
      ${ms <= 0 ? `<button class="btn btn--primary btn--full" data-action="hatch" data-id="${dragon.id}">🐣 Hatch Now!</button>` : ''}`;
  }

  return `
    <div class="dragon-detail">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="dragon-detail__art-wrap">
        ${renderDragonArt(dragon.breedId, dragon.stage, 130)}
      </div>
      <div class="dragon-detail__name">${dragon.name}</div>
      <div class="dragon-detail__breed-line">${breed ? breed.name : dragon.breedId} · Lv.${dragon.level} ${dragon.stage}</div>
      <div style="width:100%">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-dim);margin-bottom:4px;">
          <span>XP ${dragon.xp}/${xpForLevel(dragon.level)}</span>
          <span>${xpPct}%</span>
        </div>
        <div class="dragon-detail__xp-bar">
          <div class="dragon-detail__xp-fill" style="width:${xpPct}%"></div>
        </div>
      </div>
      ${!isEgg ? `
      <div class="dragon-detail__stats">
        <div class="detail-stat detail-stat--hunger">
          <span class="detail-stat__label">🍖 Hunger</span>
          <div class="detail-stat__track"><div class="detail-stat__fill" style="width:${dragon.hunger}%"></div></div>
          <span class="detail-stat__value">${dragon.hunger}</span>
        </div>
        <div class="detail-stat detail-stat--happy">
          <span class="detail-stat__label">😊 Happiness</span>
          <div class="detail-stat__track"><div class="detail-stat__fill" style="width:${dragon.happiness}%"></div></div>
          <span class="detail-stat__value">${dragon.happiness}</span>
        </div>
        <div class="detail-stat detail-stat--energy">
          <span class="detail-stat__label">⚡ Energy</span>
          <div class="detail-stat__track"><div class="detail-stat__fill" style="width:${dragon.energy}%"></div></div>
          <span class="detail-stat__value">${dragon.energy}</span>
        </div>
      </div>
      <div class="dragon-detail__ability">⚔️ ${breed ? breed.ability : ''}</div>
      ${renderEvolutionSection(dragon)}
      ` : ''}
      ${actionsHtml}
    </div>`;
}

function renderCardDetailModal(card) {
  const breed = BREEDS[card.breedId];
  const date = new Date(card.mintedAt).toLocaleDateString();

  return `
    <div class="card-detail">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="card-detail__large">
        ${renderCollectibleCard(card)}
      </div>
      <div class="card-detail__info">
        <div class="card-detail__row"><span class="card-detail__row-label">Breed</span><span class="card-detail__row-value">${breed ? breed.name : card.breedId}</span></div>
        <div class="card-detail__row"><span class="card-detail__row-label">Rarity</span><span class="card-detail__row-value rarity-badge rarity-${card.rarity}">${card.rarity}</span></div>
        <div class="card-detail__row"><span class="card-detail__row-label">Foil</span><span class="card-detail__row-value">${card.foil ? '✨ Yes' : 'No'}</span></div>
        <div class="card-detail__row"><span class="card-detail__row-label">Edition</span><span class="card-detail__row-value">#${card.editionNumber}</span></div>
        <div class="card-detail__row"><span class="card-detail__row-label">Level</span><span class="card-detail__row-value">${card.level}</span></div>
        <div class="card-detail__row"><span class="card-detail__row-label">Minted</span><span class="card-detail__row-value">${date}</span></div>
      </div>
      ${breed ? `<div class="dragon-detail__ability">⚔️ ${breed.ability}</div>` : ''}
      <button class="btn btn--secondary btn--full" data-action="export-card" data-card-id="${card.id}">📤 Export for Trade</button>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════
// SECTION 9: SCREEN CONTROLLERS
// ═══════════════════════════════════════════════════════════════

// ─── LAIR ───────────────────────────────────────────────────

let lairTimer = null;

function renderLair() {
  checkEggHatches();
  applyDecayAll();

  // Inject/refresh event banner
  const bannerSlot = document.getElementById('event-banner-slot');
  if (bannerSlot) bannerSlot.innerHTML = renderEventBanner();

  const grid = document.getElementById('dragon-grid');
  const empty = document.getElementById('empty-lair');
  const count = document.getElementById('lair-count');

  count.textContent = `${gameState.dragons.length} dragon${gameState.dragons.length !== 1 ? 's' : ''}`;

  if (gameState.dragons.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = gameState.dragons.map(d => renderDragonCard(d)).join('');
  updateHUD();

  // Refresh eggs every second
  clearInterval(lairTimer);
  const hasEggs = gameState.dragons.some(d => d.eggTimer !== null);
  if (hasEggs) {
    lairTimer = setInterval(() => {
      if (currentScreen === 'lair') renderLair();
    }, 1000);
  }
}

// ─── BREED ──────────────────────────────────────────────────

let breedParent1 = null;
let breedParent2 = null;
let selectingSlot = null;

function renderBreed() {
  checkEggHatches();
  renderEggsList();
  updateBreedSlots();
  updateBreedPreview();
}

function updateBreedSlots() {
  const slot1 = document.getElementById('breed-slot-1');
  const slot2 = document.getElementById('breed-slot-2');

  if (breedParent1) {
    const b = BREEDS[breedParent1.breedId];
    slot1.classList.add('selected');
    slot1.querySelector('.breed-slot__art').textContent = b ? b.emoji : '🐉';
    slot1.querySelector('.breed-slot__name').textContent = breedParent1.name;
  } else {
    slot1.classList.remove('selected');
    slot1.querySelector('.breed-slot__art').textContent = '🐉';
    slot1.querySelector('.breed-slot__name').textContent = 'Select a dragon';
  }

  if (breedParent2) {
    const b = BREEDS[breedParent2.breedId];
    slot2.classList.add('selected');
    slot2.querySelector('.breed-slot__art').textContent = b ? b.emoji : '🐉';
    slot2.querySelector('.breed-slot__name').textContent = breedParent2.name;
  } else {
    slot2.classList.remove('selected');
    slot2.querySelector('.breed-slot__art').textContent = '🐉';
    slot2.querySelector('.breed-slot__name').textContent = 'Select a dragon';
  }
}

function updateBreedPreview() {
  const preview = document.getElementById('breed-preview');
  if (!breedParent1 || !breedParent2) {
    preview.hidden = true;
    return;
  }
  preview.hidden = false;
  const outcomes = getBreedingPreview(breedParent1.breedId, breedParent2.breedId);
  const list = document.getElementById('breed-outcome-list');
  list.innerHTML = outcomes.map(({ breedId, pct }) => {
    const b = BREEDS[breedId];
    if (!b) return '';
    return `<div class="outcome-row">
      <span class="outcome-row__emoji">${b.emoji}</span>
      <span class="outcome-row__name">${b.name}</span>
      <span class="rarity-badge rarity-${b.rarity} outcome-row__rarity">${b.rarity}</span>
      <span class="outcome-row__pct">${pct}%</span>
    </div>`;
  }).join('');
}

function showDragonSelector(slotNum) {
  selectingSlot = slotNum;
  const adults = gameState.dragons.filter(d => {
    if (d.eggTimer !== null) return false;
    if (d.id === (slotNum === 1 ? breedParent2?.id : breedParent1?.id)) return false;
    return true;
  });

  const title = document.getElementById('breed-select-title');
  title.textContent = `Select Parent ${slotNum}`;

  const list = document.getElementById('breed-dragon-list');
  if (adults.length === 0) {
    list.innerHTML = '<p class="empty-hint">No dragons available. Hatch some eggs first!</p>';
  } else {
    list.innerHTML = adults.map(d => {
      const b = BREEDS[d.breedId];
      return `<div class="breed-dragon-item" data-select-id="${d.id}">
        <span class="breed-dragon-item__emoji">${b ? b.emoji : '🐉'}</span>
        <span class="breed-dragon-item__name">${d.name}</span>
        <span class="breed-dragon-item__level">Lv.${d.level}</span>
      </div>`;
    }).join('');
  }

  document.getElementById('breed-parents').hidden = true;
  document.getElementById('breed-preview').hidden  = true;
  document.getElementById('breed-selecting').hidden = false;
}

function hideDragonSelector() {
  selectingSlot = null;
  document.getElementById('breed-parents').hidden   = false;
  document.getElementById('breed-selecting').hidden = true;
  updateBreedSlots();
  updateBreedPreview();
}

function renderEggsList() {
  const list = document.getElementById('active-eggs-list');
  const eggs = gameState.dragons.filter(d => d.eggTimer !== null);
  if (eggs.length === 0) {
    list.innerHTML = '<p class="empty-hint">No eggs incubating.</p>';
    return;
  }
  const now = Date.now();
  list.innerHTML = eggs.map(d => {
    const ms = Math.max(0, d.eggTimer - now);
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const b = BREEDS[d.breedId];
    const ready = ms <= 0;
    return `<div class="egg-item">
      <div class="egg-item__art" style="--body:${b?.palette.body||'#888'};--accent:${b?.palette.accent||'#ccc'}">${b ? b.emoji : '🥚'}</div>
      <div class="egg-item__info">
        <div class="egg-item__breed">${b ? b.name : d.breedId}</div>
        <div class="egg-item__timer">${ready ? '🐣 Ready to hatch!' : `⏳ ${min}:${String(sec).padStart(2,'0')}`}</div>
      </div>
      ${ready ? `<button class="btn btn--primary btn--sm" data-hatch-id="${d.id}">Hatch!</button>` : ''}
    </div>`;
  }).join('');
}

// ─── CARDS ──────────────────────────────────────────────────

let cardFilter = 'all';

function renderCards() {
  const gallery = document.getElementById('card-gallery');
  const empty   = document.getElementById('empty-cards');
  const count   = document.getElementById('cards-count');

  let filtered = gameState.cards;
  if (cardFilter === 'foil') {
    filtered = filtered.filter(c => c.foil);
  } else if (cardFilter !== 'all') {
    filtered = filtered.filter(c => c.rarity === cardFilter);
  }

  count.textContent = `${gameState.cards.length} card${gameState.cards.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    gallery.innerHTML = '';
    empty.hidden = false;
    if (gameState.cards.length > 0) {
      empty.querySelector('.empty-state__text').textContent = 'No cards match this filter.';
    } else {
      empty.querySelector('.empty-state__text').textContent = 'No cards yet!\nMint a card from a dragon in your Lair.';
    }
    return;
  }

  empty.hidden = true;
  gallery.innerHTML = filtered.map(c => renderCollectibleCard(c)).join('');
}

// ─── TRADE ──────────────────────────────────────────────────

let selectedTradeCardId = null;

function renderTrade() {
  renderTradeCardSelector();
  renderTradeInbox();
}

function renderTradeCardSelector() {
  const grid = document.getElementById('trade-card-select');
  if (gameState.cards.length === 0) {
    grid.innerHTML = '<p class="empty-hint">No cards to trade yet.</p>';
    return;
  }
  grid.innerHTML = gameState.cards.map(c => {
    const b = BREEDS[c.breedId];
    return `<div class="trade-card-thumb ${selectedTradeCardId === c.id ? 'selected' : ''}" data-trade-card="${c.id}">
      <div class="trade-card-thumb__emoji">${b ? b.emoji : '🃏'}</div>
      <div class="trade-card-thumb__name">${c.rarity}</div>
      <div class="trade-card-thumb__name" style="font-size:8px;">${b ? b.name : c.breedId}</div>
    </div>`;
  }).join('');
}

function renderTradeInbox() {
  const list = document.getElementById('trade-inbox-list');
  if (gameState.tradeInbox.length === 0) {
    list.innerHTML = '<p class="empty-hint">No pending trade offers.</p>';
    return;
  }
  list.innerHTML = gameState.tradeInbox.map(offer => {
    const b = BREEDS[offer.offeredCard.breedId];
    const date = new Date(offer.importedAt).toLocaleDateString();
    return `<div class="trade-offer">
      <div class="trade-offer__header">
        <span class="trade-offer__from">From: ${offer.senderName}</span>
        <span class="trade-offer__time">${date}</span>
      </div>
      <div class="trade-offer__card">
        <span class="trade-offer__card-emoji">${b ? b.emoji : '🃏'}</span>
        <div class="trade-offer__card-info">
          <div class="trade-offer__card-name">${offer.offeredCard.dragonName}</div>
          <div class="trade-offer__card-rarity">
            <span class="rarity-badge rarity-${offer.offeredCard.rarity}">${offer.offeredCard.rarity}</span>
            ${offer.offeredCard.foil ? '✨ Foil' : ''} · Lv.${offer.offeredCard.level}
          </div>
        </div>
      </div>
      <div class="trade-offer__actions">
        <button class="btn btn--primary btn--sm btn--full" data-accept-trade="${offer.id}">✅ Accept</button>
        <button class="btn btn--danger btn--sm btn--full" data-decline-trade="${offer.id}">❌ Decline</button>
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// SECTION 10: NAVIGATION, EVENTS & INIT
// ═══════════════════════════════════════════════════════════════

let currentScreen = 'lair';

function showScreen(name) {
  clearInterval(lairTimer);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  const screen = document.getElementById('screen-' + name);
  const tab    = document.querySelector(`.tab[data-screen="${name}"]`);
  if (screen) screen.classList.add('active');
  if (tab)    tab.classList.add('active');

  currentScreen = name;

  if (name === 'lair')    renderLair();
  if (name === 'breed')   renderBreed();
  if (name === 'cards')   renderCards();
  if (name === 'trade')   renderTrade();
  if (name === 'explore') renderExplore();
  if (name === 'shop')    renderShop();
  if (name === 'games')   renderGamesHub();
}

function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  // Clean up any active minigame state
  if (typeof memoryMatchState !== 'undefined' && memoryMatchState) {
    clearInterval(memoryMatchState.timerInterval);
    memoryMatchState = null;
  }
  if (typeof elementalPuzzleState !== 'undefined' && elementalPuzzleState) {
    clearInterval(elementalPuzzleState.spawnInterval);
    clearInterval(elementalPuzzleState.gameLoopInterval);
    elementalPuzzleState = null;
  }
  if (typeof quizState !== 'undefined' && quizState) {
    quizState = null;
  }
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-content').innerHTML = '';
  // Refresh current screen in case state changed
  showScreen(currentScreen);
}

function updateHUD() {
  document.getElementById('hud-gems').textContent = gameState.player.gems;
  document.getElementById('hud-food').textContent = gameState.player.food;
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2900);
}

function promptRename(dragon) {
  const newName = prompt(`Rename "${dragon.name}":`, dragon.name);
  if (newName && newName.trim()) {
    dragon.name = newName.trim().slice(0, 24);
    saveState();
    // Refresh modal
    openModal(renderDragonDetailModal(dragon));
    showToast(`Renamed to ${dragon.name}!`, 'success');
  }
}

// Generate starfield
function generateStars() {
  const container = document.getElementById('bg-stars');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px;height:${size}px;
      --dur:${(Math.random()*3+2).toFixed(1)}s;
      --delay:${(Math.random()*4).toFixed(1)}s;
    `;
    container.appendChild(star);
  }
}

// ─── EVENT DELEGATION ────────────────────────────────────────

document.addEventListener('click', e => {
  const target = e.target.closest('[data-screen]');
  if (target) { showScreen(target.dataset.screen); return; }

  // Dragon card tap → detail modal
  const dragonCard = e.target.closest('[data-id]');
  if (dragonCard && dragonCard.classList.contains('dragon-card')) {
    const dragon = gameState.dragons.find(d => d.id === dragonCard.dataset.id);
    if (dragon) openModal(renderDragonDetailModal(dragon));
    return;
  }

  // Collectible card tap → detail modal
  const cardFrame = e.target.closest('[data-card-id]');
  if (cardFrame) {
    const card = gameState.cards.find(c => c.id === cardFrame.dataset.cardId);
    if (card) openModal(renderCardDetailModal(card));
    return;
  }

  // Modal close
  if (e.target.id === 'modal-close-btn' || e.target.id === 'modal-backdrop') {
    closeModal(); return;
  }

  // Dragon care actions
  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id || actionBtn.dataset.cardId;

    if (action === 'feed') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) { const r = feedDragon(d); showToast(r.msg, r.ok ? 'success' : 'error'); updateHUD(); if (r.ok) openModal(renderDragonDetailModal(d)); }
      return;
    }
    if (action === 'play') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) { const r = playWithDragon(d); showToast(r.msg, r.ok ? 'success' : 'error'); if (r.ok) openModal(renderDragonDetailModal(d)); }
      return;
    }
    if (action === 'train') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) { const r = trainDragon(d); showToast(r.msg, r.ok ? 'success' : 'error'); if (r.ok) openModal(renderDragonDetailModal(d)); }
      return;
    }
    if (action === 'rename') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) promptRename(d);
      return;
    }
    if (action === 'mint') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) {
        const r = mintCard(d);
        showToast(r.msg, r.ok ? 'success' : 'error');
        if (r.ok) { closeModal(); showScreen('cards'); }
      }
      return;
    }
    if (action === 'hatch') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) {
        d.eggTimer = 0; // Force hatch
        checkEggHatches();
        closeModal();
      }
      return;
    }
    if (action === 'evolve') {
      const d = gameState.dragons.find(x => x.id === id);
      if (d) {
        const oldBreedId = d.breedId;
        const r = evolveDragon(d);
        if (r.ok) {
          showEvolutionAnimation(d, oldBreedId, d.breedId);
          showToast(r.msg, 'success');
        } else {
          showToast(r.msg, 'error');
        }
      }
      return;
    }
    if (action === 'open-gacha') {
      openModal(renderGachaModal());
      return;
    }
    if (action === 'export-card') {
      const code = exportCard(id);
      if (code) {
        closeModal();
        showScreen('trade');
        selectedTradeCardId = id;
        renderTrade();
        document.getElementById('trade-code-output').value = code;
        document.getElementById('trade-export-box').hidden = false;
        showToast('Trade code generated! Copy and share it.', 'info');
      }
      return;
    }
    return;
  }

  // ─── MINIGAMES ─────────────────────────────────────
  const playGameBtn = e.target.closest('[data-play-game]');
  if (playGameBtn) {
    const gameKey = playGameBtn.dataset.playGame;
    if (gameKey === 'memoryMatch')     startMemoryMatch();
    if (gameKey === 'dragonQuiz')      startDragonQuiz();
    if (gameKey === 'elementalPuzzle') startElementalPuzzle();
    return;
  }

  const mmCard = e.target.closest('[data-mm-card]');
  if (mmCard) {
    flipMemoryCard(parseInt(mmCard.dataset.mmCard));
    return;
  }

  const quizOption = e.target.closest('[data-quiz-option]');
  if (quizOption) {
    answerQuiz(quizOption.dataset.quizOption);
    return;
  }

  const epTarget = e.target.closest('[data-ep-target]');
  if (epTarget) {
    tapElementTarget(epTarget.dataset.epTarget, epTarget.dataset.epElement);
    return;
  }

  // Breed slots
  const slot = e.target.closest('[data-slot]');
  if (slot) {
    showDragonSelector(parseInt(slot.dataset.slot));
    return;
  }

  // Dragon selector items
  const selectItem = e.target.closest('[data-select-id]');
  if (selectItem) {
    const d = gameState.dragons.find(x => x.id === selectItem.dataset.selectId);
    if (d) {
      if (selectingSlot === 1) breedParent1 = d;
      else breedParent2 = d;
    }
    hideDragonSelector();
    return;
  }

  // Cancel selector
  if (e.target.id === 'btn-cancel-select') {
    hideDragonSelector(); return;
  }

  // Begin breeding
  if (e.target.id === 'btn-begin-breeding') {
    if (!breedParent1 || !breedParent2) return;
    const r = startBreeding(breedParent1.id, breedParent2.id);
    if (r.ok) {
      breedParent1 = null;
      breedParent2 = null;
      showToast(r.msg, 'success');
      updateHUD();
      renderBreed();
    } else {
      showToast(r.msg, 'error');
    }
    return;
  }

  // Hatch from eggs list
  const hatchBtn = e.target.closest('[data-hatch-id]');
  if (hatchBtn) {
    const d = gameState.dragons.find(x => x.id === hatchBtn.dataset.hatchId);
    if (d) { d.eggTimer = 0; checkEggHatches(); renderBreed(); }
    return;
  }

  // Card filter buttons
  const filterBtn = e.target.closest('[data-filter]');
  if (filterBtn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    filterBtn.classList.add('active');
    cardFilter = filterBtn.dataset.filter;
    renderCards();
    return;
  }

  // Trade card thumb selection
  const tradeTumb = e.target.closest('[data-trade-card]');
  if (tradeTumb) {
    const cid = tradeTumb.dataset.tradeCard;
    selectedTradeCardId = selectedTradeCardId === cid ? null : cid;
    renderTradeCardSelector();
    const box = document.getElementById('trade-export-box');
    if (selectedTradeCardId) {
      const code = exportCard(selectedTradeCardId);
      document.getElementById('trade-code-output').value = code || '';
      box.hidden = false;
    } else {
      box.hidden = true;
    }
    return;
  }

  // Copy trade code
  if (e.target.id === 'btn-copy-code') {
    const val = document.getElementById('trade-code-output').value;
    if (val) {
      navigator.clipboard.writeText(val).then(() => showToast('Code copied!', 'success')).catch(() => {
        document.getElementById('trade-code-output').select();
        document.execCommand('copy');
        showToast('Code copied!', 'success');
      });
    }
    return;
  }

  // Import trade
  if (e.target.id === 'btn-import-trade') {
    const code = document.getElementById('trade-code-input').value.trim();
    if (!code) { showToast('Paste a trade code first!', 'warning'); return; }
    const r = importTradeOffer(code);
    const resultEl = document.getElementById('trade-import-result');
    resultEl.textContent = r.msg;
    resultEl.style.color = r.ok ? '#2ecc71' : '#e74c3c';
    if (r.ok) {
      document.getElementById('trade-code-input').value = '';
      renderTradeInbox();
      showToast(r.msg, 'success');
    } else {
      showToast(r.msg, 'error');
    }
    return;
  }

  // Accept trade
  const acceptBtn = e.target.closest('[data-accept-trade]');
  if (acceptBtn) {
    const tid = acceptBtn.dataset.acceptTrade;
    acceptTrade(tid);
    showToast('Card added to your collection! 🎉', 'success');
    renderTrade();
    return;
  }

  // Decline trade
  const declineBtn = e.target.closest('[data-decline-trade]');
  if (declineBtn) {
    declineTrade(declineBtn.dataset.declineTrade);
    showToast('Trade declined.', 'info');
    renderTrade();
    return;
  }

  // Shop section tabs
  const shopTab = e.target.closest('[data-shop-section]');
  if (shopTab) {
    shopSection = shopTab.dataset.shopSection;
    renderShop();
    return;
  }

  // Daily bonus claim
  if (e.target.closest('#btn-shop-bonus') && gameState.player.lastShopBonus !== todayString()) {
    const r = claimShopBonus();
    showToast(r.msg, r.ok ? 'success' : 'info');
    renderShop();
    return;
  }

  // Shop buy button
  const buyBtn = e.target.closest('[data-buy]');
  if (buyBtn) {
    const itemId = buyBtn.dataset.buy;
    const item   = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (gameState.player.gems < item.cost) {
      showToast(`Need ${item.cost}💎!`, 'error'); return;
    }

    if (item.target === 'one') {
      // Pre-deduct, then show picker
      gameState.player.gems -= item.cost;
      updateHUD();
      renderDragonPickerModal(itemId, d => d.eggTimer === null, null);
      return;
    }
    if (item.target === 'egg') {
      gameState.player.gems -= item.cost;
      updateHUD();
      renderDragonPickerModal(itemId, d => d.eggTimer !== null, null);
      return;
    }

    // 'all' or food/no-target
    const r = buyItem(itemId);
    showToast(r.msg, r.ok ? 'success' : 'error');
    renderShop();
    return;
  }

  // Dragon picker selection (shop use)
  const pickDragon = e.target.closest('[data-pick-dragon]');
  if (pickDragon) {
    const dragonId = pickDragon.dataset.pickDragon;
    const list     = pickDragon.closest('[data-item-id]');
    const itemId   = list ? list.dataset.itemId : null;
    if (itemId) {
      const r = buyItem(itemId, dragonId);
      closeModal();
      showToast(r.msg, r.ok ? 'success' : 'error');
      if (currentScreen === 'shop') renderShop();
    }
    return;
  }

  // Gacha pull buttons
  const pullBtn = e.target.closest('.gacha-pull-btn');
  if (pullBtn) {
    const count = parseInt(pullBtn.dataset.pulls) || 1;
    doPull(count);
    return;
  }

  // Explore: tap a land card
  const landCard = e.target.closest('[data-land-id]');
  if (landCard) {
    const landId = landCard.dataset.landId;
    const land = LANDS.find(l => l.id === landId);
    if (!land) return;

    // Locked
    const adultCount = adultDragonCount();
    if (adultCount < land.unlockAt) {
      showToast(`Raise ${land.unlockAt} dragons to unlock ${land.name}.`, 'warning');
      return;
    }

    // On cooldown
    const cd = getLandCooldownRemaining(landId);
    if (cd > 0) {
      const m = Math.ceil(cd / 60000);
      showToast(`${land.name} is still resting — ${m} min left.`, 'warning');
      return;
    }

    // Not enough gems
    if (gameState.player.gems < land.cost) {
      showToast(`Need ${land.cost}💎 to explore ${land.name}.`, 'error');
      return;
    }

    // Animate: add .exploring class, show modal after brief delay
    landCard.classList.add('exploring');

    setTimeout(() => {
      landCard.classList.remove('exploring');
      const result = exploreLand(landId);
      updateHUD();

      if (result.ok) {
        const breed = BREEDS[result.breedId];
        openModal(`
          <div class="explore-result">
            <button class="modal-close" id="modal-close-btn">✕</button>
            <div class="explore-result__land">${land.emoji} ${land.name}</div>
            <div class="explore-result__headline">Egg Discovered!</div>
            <div class="explore-result__art">
              ${renderDragonArt(result.breedId, 'egg', 120)}
            </div>
            <div class="explore-result__name">${breed ? breed.name : result.breedId} Egg</div>
            <div class="explore-result__desc">${land.description}</div>
            <div class="explore-result__rarity rarity-badge rarity-${breed ? breed.rarity : 'common'}">
              ${breed ? breed.rarity : 'common'}
            </div>
            <button class="btn btn--primary btn--full" id="modal-close-btn" style="margin-top:8px;">Go to Lair 🐉</button>
          </div>`);
        showToast(result.msg, 'success');
        renderExplore();
      } else {
        showToast(result.msg, 'error');
        renderExplore();
      }
    }, 1600);

    return;
  }
});

// ═══════════════════════════════════════════════════════════════
// SECTION 9b: DAILY LOGIN & MONTHLY GACHA
// ═══════════════════════════════════════════════════════════════

// ─── DAILY LOGIN ─────────────────────────────────────────────

function checkDailyLogin() {
  const today = todayString();
  const p = gameState.player;

  if (p.lastLoginDate === today) return; // already logged in today

  // Determine if streak continues (yesterday) or resets
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  if (p.lastLoginDate === yStr) {
    p.loginStreak++;
  } else if (p.lastLoginDate !== today) {
    // Missed a day — reset streak
    p.loginStreak = 1;
    p.weekDayIndex = 0;
  }

  const dayIdx = p.weekDayIndex; // 0-6
  const reward = WEEKLY_REWARDS[dayIdx];

  p.gems += reward.gems;
  p.food += reward.food;
  p.lastLoginDate = today;
  p.weekDayIndex = (dayIdx + 1) % 7;

  saveState();
  updateHUD();

  // Show the login modal after a short boot delay
  setTimeout(() => openModal(renderLoginModal(dayIdx, reward)), 600);
}

function renderLoginModal(claimedIdx, reward) {
  const event = getCurrentEvent();
  const daysHtml = WEEKLY_REWARDS.map((r, i) => {
    const claimed  = i < claimedIdx;
    const isToday  = i === claimedIdx;
    const future   = i > claimedIdx;
    let cls = 'login-day';
    if (claimed) cls += ' claimed';
    if (isToday) cls += ' today';
    if (future)  cls += ' future';
    return `<div class="${cls}">
      <div class="login-day__icon">${r.milestone ? '🌟' : (isToday ? '✅' : (claimed ? '✓' : '🎁'))}</div>
      <div class="login-day__label">${r.label}</div>
      <div class="login-day__gems">${r.gems}💎</div>
    </div>`;
  }).join('');

  const streakLabel = gameState.player.loginStreak > 1
    ? `🔥 ${gameState.player.loginStreak}-day streak!`
    : 'Day 1 — keep it up!';

  return `
    <div class="login-modal">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="login-modal__title">Daily Login</div>
      <div class="login-modal__streak">${streakLabel}</div>
      <div class="login-modal__reward-banner">
        <span class="login-modal__reward-text">Today: +${reward.gems}💎  +${reward.food}🍖</span>
        ${reward.milestone ? '<span class="login-modal__milestone">WEEK COMPLETE!</span>' : ''}
      </div>
      <div class="login-days">${daysHtml}</div>
      <div class="login-modal__event-teaser" data-action="open-gacha">
        <span class="login-modal__event-icon">${event.emoji}</span>
        <div class="login-modal__event-text">
          <strong>${event.name}</strong><br>
          <span>Monthly gacha event — tap to pull!</span>
        </div>
        <span class="login-modal__event-arrow">›</span>
      </div>
    </div>`;
}

// ─── MONTHLY GACHA ───────────────────────────────────────────

function buildGachaPool(event) {
  // All breeds eligible for gacha (common/rare/epic/legendary non-event-only, plus featured)
  const featured  = [event.featuredBreedId];
  const legendary = Object.values(BREEDS).filter(b => b.rarity === 'legendary' && !featured.includes(b.id) && !b.eventOnly).map(b => b.id);
  const epic      = Object.values(BREEDS).filter(b => b.rarity === 'epic'      && !featured.includes(b.id) && !b.eventOnly).map(b => b.id);
  const rare      = Object.values(BREEDS).filter(b => (b.rarity === 'rare' || b.rarity === 'uncommon') && !b.eventOnly).map(b => b.id);
  const common    = Object.values(BREEDS).filter(b => b.rarity === 'common'    && !b.eventOnly).map(b => b.id);
  return { featured, legendary, epic, rare, common };
}

function gachaSinglePull(event) {
  const me = gameState.monthlyEvent;
  me.pulls++;
  me.pityCount++;

  // Pity overrides
  let tier;
  if (me.pityCount >= GACHA_PITY_LEGENDARY) {
    tier = Math.random() < 0.5 ? 'featured' : 'legendary';
    me.pityCount = 0;
  } else if (me.pityCount >= GACHA_PITY_RARE) {
    const roll = Math.random() * (GACHA_RATES.rare + GACHA_RATES.epic + GACHA_RATES.legendary + GACHA_RATES.featured);
    tier = roll < GACHA_RATES.featured ? 'featured'
         : roll < GACHA_RATES.featured + GACHA_RATES.legendary ? 'legendary'
         : roll < GACHA_RATES.featured + GACHA_RATES.legendary + GACHA_RATES.epic ? 'epic'
         : 'rare';
    if (tier === 'rare' || tier === 'epic' || tier === 'featured' || tier === 'legendary') me.pityCount = 0;
  } else {
    const total = Object.values(GACHA_RATES).reduce((s, v) => s + v, 0);
    const roll  = Math.random() * total;
    if      (roll < GACHA_RATES.featured)  { tier = 'featured'; me.pityCount = 0; }
    else if (roll < GACHA_RATES.featured + GACHA_RATES.legendary) { tier = 'legendary'; me.pityCount = 0; }
    else if (roll < GACHA_RATES.featured + GACHA_RATES.legendary + GACHA_RATES.epic)  { tier = 'epic'; me.pityCount = 0; }
    else if (roll < GACHA_RATES.featured + GACHA_RATES.legendary + GACHA_RATES.epic + GACHA_RATES.rare) { tier = 'rare'; me.pityCount = 0; }
    else    { tier = 'common'; }
  }

  const pool = buildGachaPool(event);
  const bucket = pool[tier === 'featured' ? 'featured' : tier] || pool.common;
  const breedId = bucket[Math.floor(Math.random() * bucket.length)];

  // Grant egg
  const egg = createDragon(breedId, { stage: 'egg', eggTimer: Date.now() + EGG_HATCH_MS, level: 0 });
  egg.name  = (BREEDS[breedId]?.name || breedId) + ' Egg';
  egg.fromGacha = true;
  gameState.dragons.push(egg);
  saveState();

  return { breedId, tier, breed: BREEDS[breedId] };
}

function doPull(count) {
  const event = getCurrentEvent();
  const cost  = count === 1 ? GACHA_SINGLE_COST : GACHA_TEN_COST;

  if (gameState.player.gems < cost) {
    showToast(`Need ${cost}💎 for ${count === 1 ? 'a pull' : '10 pulls'}!`, 'error');
    return;
  }

  gameState.player.gems -= cost;
  updateHUD();

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(gachaSinglePull(event));
  }

  openModal(renderGachaResultModal(event, results));
}

function renderGachaModal() {
  const event = getCurrentEvent();
  const me    = gameState.monthlyEvent;
  const featured = BREEDS[event.featuredBreedId];
  const pityNext = GACHA_PITY_RARE - (me.pityCount % GACHA_PITY_RARE);
  const legendaryPityNext = GACHA_PITY_LEGENDARY - me.pityCount;

  return `
    <div class="gacha-modal">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="gacha-modal__header">
        <div class="gacha-modal__event-name">${event.emoji} ${event.name}</div>
        <div class="gacha-modal__flavor">${event.flavor}</div>
      </div>
      <div class="gacha-modal__featured">
        <div class="gacha-modal__featured-art">
          ${renderDragonArt(event.featuredBreedId, 'adult', 110)}
        </div>
        <div class="gacha-modal__featured-info">
          <div class="gacha-modal__featured-name">${featured ? featured.name : event.featuredBreedId}</div>
          <div class="rarity-badge rarity-${featured ? featured.rarity : 'legendary'}">${featured ? featured.rarity : 'legendary'}</div>
          ${featured ? `<div class="gacha-modal__ability">${featured.ability}</div>` : ''}
        </div>
      </div>
      <div class="gacha-modal__rates">
        <span>Featured: 3%</span>
        <span>Legendary: 2%</span>
        <span>Epic: 10%</span>
        <span>Rare: 35%</span>
      </div>
      <div class="gacha-modal__pity">
        <span>Rare+ in ≤${pityNext} pull${pityNext !== 1 ? 's' : ''}</span>
        <span>Legendary in ≤${Math.max(1, legendaryPityNext)} pull${legendaryPityNext !== 1 ? 's' : ''}</span>
      </div>
      <div class="gacha-modal__pulls-info">Total pulls this month: ${me.pulls}</div>
      <div class="gacha-modal__btns">
        <button class="btn btn--secondary gacha-pull-btn" data-pulls="1">
          1 Pull<br><small>${GACHA_SINGLE_COST}💎</small>
        </button>
        <button class="btn btn--primary gacha-pull-btn" data-pulls="10">
          10 Pull<br><small>${GACHA_TEN_COST}💎 <span class="gacha-discount">-10%</span></small>
        </button>
      </div>
    </div>`;
}

function renderGachaResultModal(event, results) {
  const best = results.reduce((b, r) => {
    const tierOrder = { featured: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
    return (tierOrder[r.tier] > tierOrder[b.tier]) ? r : b;
  }, results[0]);

  const isBig = best.tier === 'featured' || best.tier === 'legendary';

  const cardsHtml = results.map((r, i) => {
    const tierCls = r.tier === 'featured' ? 'legendary' : r.tier;
    return `<div class="gacha-result-card rarity-${tierCls}" style="animation-delay:${i * 0.08}s">
      <div class="gacha-result-card__art">${r.breed ? r.breed.emoji : '🥚'}</div>
      <div class="gacha-result-card__name">${r.breed ? r.breed.name : r.breedId}</div>
      <div class="rarity-badge rarity-${tierCls}">${r.tier === 'featured' ? '★ featured' : r.tier}</div>
    </div>`;
  }).join('');

  return `
    <div class="gacha-result">
      <button class="modal-close" id="modal-close-btn">✕</button>
      ${isBig ? `<div class="gacha-result__fanfare">${best.tier === 'featured' ? '🌟 FEATURED!' : '⚡ LEGENDARY!'}</div>` : ''}
      <div class="gacha-result__headline">
        ${results.length === 1 ? '1 Egg Found!' : `${results.length} Eggs Found!`}
      </div>
      <div class="gacha-result__grid ${results.length === 1 ? 'single' : ''}">${cardsHtml}</div>
      <div class="gacha-result__hint">All eggs are now incubating in your Lair.</div>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn--ghost btn--sm btn--full" id="modal-close-btn">Close</button>
        <button class="btn btn--primary btn--sm btn--full" data-action="open-gacha">Pull Again</button>
      </div>
    </div>`;
}

function renderEventBanner() {
  const event = getCurrentEvent();
  const featured = BREEDS[event.featuredBreedId];
  const me = gameState.monthlyEvent;

  return `
    <div class="event-banner" data-action="open-gacha">
      <div class="event-banner__bg theme-${featured?.elements?.[0] || 'fire'}"></div>
      <div class="event-banner__art">
        ${renderDragonArt(event.featuredBreedId, 'adult', 75)}
      </div>
      <div class="event-banner__body">
        <div class="event-banner__tag">Monthly Event</div>
        <div class="event-banner__name">${event.name}</div>
        <div class="event-banner__sub">${featured ? featured.name : ''} · ${me.pulls} pulls</div>
      </div>
      <div class="event-banner__arrow">›</div>
    </div>`;
}

// ─── SHOP ───────────────────────────────────────────────────

let shopSection = 'food'; // active section tab

function applyItemEffect(item, dragon) {
  const e = item.effect;
  if (e.food)      gameState.player.food = Math.min(999, gameState.player.food + e.food);
  if (e.gems)      gameState.player.gems += e.gems;
  if (e.happiness !== undefined && dragon) dragon.happiness = Math.max(0, Math.min(100, dragon.happiness + e.happiness));
  if (e.energy     !== undefined && dragon) dragon.energy    = Math.max(0, Math.min(100, dragon.energy    + e.energy));
  if (e.hunger     !== undefined && dragon) dragon.hunger    = Math.max(0, Math.min(100, dragon.hunger    + e.hunger));
  if (e.xp         !== undefined && dragon) addXP(dragon, e.xp);
  if (e.hatch      && dragon) { dragon.eggTimer = 0; checkEggHatches(); }
}

function buyItem(itemId, dragonId) {
  const item   = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return { ok: false, msg: 'Unknown item.' };

  if (gameState.player.gems < item.cost) {
    return { ok: false, msg: `Need ${item.cost}💎 to buy ${item.name}.` };
  }

  gameState.player.gems -= item.cost;

  if (item.target === 'all') {
    const active = gameState.dragons.filter(d => d.eggTimer === null);
    active.forEach(d => applyItemEffect(item, d));
    saveState();
    updateHUD();
    return { ok: true, msg: `${item.icon} ${item.name} used on all ${active.length} dragons!` };
  }

  if (item.target === 'one' || item.target === 'egg') {
    const dragon = gameState.dragons.find(d => d.id === dragonId);
    if (!dragon) {
      gameState.player.gems += item.cost; // refund
      return { ok: false, msg: 'No dragon selected.' };
    }
    applyItemEffect(item, dragon);
    saveState();
    updateHUD();
    return { ok: true, msg: `${item.icon} ${item.name} used on ${dragon.name}!` };
  }

  // Food/gems — no target needed
  applyItemEffect(item, null);
  saveState();
  updateHUD();
  return { ok: true, msg: `${item.icon} ${item.name} added to your stash!` };
}

function claimShopBonus() {
  const today = todayString();
  if (gameState.player.lastShopBonus === today) return { ok: false, msg: 'Already claimed today.' };
  gameState.player.lastShopBonus = today;
  gameState.player.gems += 30;
  saveState();
  updateHUD();
  return { ok: true, msg: '🎁 +30💎 daily bonus claimed!' };
}

function renderShopItem(item) {
  const affordable = gameState.player.gems >= item.cost;
  const badgeHtml  = item.badge ? `<span class="shop-item__badge">${item.badge}</span>` : '';

  // Effect summary line
  const effects = [];
  if (item.effect.food)      effects.push(`+${item.effect.food}🍖`);
  if (item.effect.gems)      effects.push(`+${item.effect.gems}💎`);
  if (item.effect.happiness !== undefined) effects.push(`${item.effect.happiness > 0 ? '+' : ''}${item.effect.happiness}😊`);
  if (item.effect.energy    !== undefined) effects.push(`${item.effect.energy    > 0 ? '+' : ''}${item.effect.energy}⚡`);
  if (item.effect.hunger    !== undefined && item.effect.hunger < 0) effects.push(`${item.effect.hunger}🍖`);
  if (item.effect.xp)        effects.push(`+${item.effect.xp}XP`);
  if (item.effect.hatch)     effects.push('⚡Instant hatch');

  const targetLabel = item.target === 'all' ? ' · All dragons' : item.target === 'egg' ? ' · Eggs only' : item.target === 'one' ? ' · Pick a dragon' : '';

  return `
    <div class="shop-item ${!affordable ? 'shop-item--unaffordable' : ''}">
      ${badgeHtml}
      <div class="shop-item__icon">${item.icon}</div>
      <div class="shop-item__body">
        <div class="shop-item__name">${item.name}</div>
        <div class="shop-item__desc">${item.desc}</div>
        <div class="shop-item__effects">${effects.join('  ')}<span class="shop-item__target">${targetLabel}</span></div>
      </div>
      <button class="btn btn--primary btn--sm shop-item__buy" data-buy="${item.id}" ${!affordable ? 'disabled' : ''}>
        ${item.cost}💎
      </button>
    </div>`;
}

function renderShop() {
  const today    = todayString();
  const bonusReady = gameState.player.lastShopBonus !== today;

  const sections = ['food', 'toys', 'special'];
  const sectionLabels = { food: '🍖 Food', toys: '🧸 Toys', special: '⚗️ Special' };

  const tabsHtml = sections.map(s =>
    `<button class="shop-tab ${shopSection === s ? 'active' : ''}" data-shop-section="${s}">${sectionLabels[s]}</button>`
  ).join('');

  const items    = SHOP_ITEMS.filter(i => i.section === shopSection);
  const itemsHtml = items.map(i => renderShopItem(i)).join('');

  const el = document.getElementById('shop-content');
  if (!el) return;

  el.innerHTML = `
    <div class="shop-bonus ${bonusReady ? 'shop-bonus--ready' : ''}" id="btn-shop-bonus">
      <span class="shop-bonus__icon">🎁</span>
      <div class="shop-bonus__body">
        <div class="shop-bonus__title">Daily Bonus</div>
        <div class="shop-bonus__sub">${bonusReady ? 'Claim your +30💎 today!' : 'Come back tomorrow!'}</div>
      </div>
      ${bonusReady ? '<button class="btn btn--primary btn--sm">Claim</button>' : '<span style="font-size:12px;color:var(--color-text-dim)">✓ Claimed</span>'}
    </div>
    <div class="shop-tabs">${tabsHtml}</div>
    <div class="shop-grid">${itemsHtml}</div>`;
}

function renderDragonPickerModal(itemId, filterFn, onPick) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  const eligible = gameState.dragons.filter(filterFn);

  if (eligible.length === 0) {
    showToast(item.target === 'egg' ? 'No eggs to hatch!' : 'No dragons available!', 'error');
    gameState.player.gems += item.cost; // refund
    saveState(); updateHUD();
    return;
  }

  const listHtml = eligible.map(d => {
    const b = BREEDS[d.breedId];
    const isEgg = d.eggTimer !== null;
    return `<div class="breed-dragon-item" data-pick-dragon="${d.id}">
      <span class="breed-dragon-item__emoji">${b ? b.emoji : '🐉'}</span>
      <span class="breed-dragon-item__name">${d.name}</span>
      <span class="breed-dragon-item__level">${isEgg ? '🥚 Egg' : `Lv.${d.level}`}</span>
    </div>`;
  }).join('');

  openModal(`
    <div>
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div style="font-size:18px;font-weight:700;margin-bottom:12px;">Choose a dragon for<br>${item.icon} ${item.name}</div>
      <div class="breed-dragon-list" data-item-id="${itemId}">${listHtml}</div>
    </div>`);
}

// ─── EXPLORE ────────────────────────────────────────────────

// How many non-egg dragons a player has (for unlock gates)
function adultDragonCount() {
  return gameState.dragons.filter(d => d.eggTimer === null).length;
}

function getLandCooldownRemaining(landId) {
  const rec = gameState.explorations[landId];
  if (!rec) return 0;
  const land = LANDS.find(l => l.id === landId);
  return Math.max(0, rec.lastExplored + land.cooldownMs - Date.now());
}

function exploreLand(landId) {
  const land = LANDS.find(l => l.id === landId);
  if (!land) return { ok: false, msg: 'Unknown land.' };

  const adultCount = adultDragonCount();
  if (adultCount < land.unlockAt) {
    return { ok: false, msg: `Unlock by raising ${land.unlockAt} dragon${land.unlockAt !== 1 ? 's' : ''} first.` };
  }

  const cd = getLandCooldownRemaining(landId);
  if (cd > 0) {
    const m = Math.ceil(cd / 60000);
    return { ok: false, msg: `Still cooling down — ${m} min remaining.` };
  }

  if (gameState.player.gems < land.cost) {
    return { ok: false, msg: `Need ${land.cost}💎 to explore.` };
  }

  gameState.player.gems -= land.cost;
  gameState.explorations[landId] = { lastExplored: Date.now() };

  const breedId = weightedRandom(land.eggPool);
  const hatchMs = EGG_HATCH_MS;
  const egg = createDragon(breedId, {
    stage: 'egg',
    eggTimer: Date.now() + hatchMs,
    level: 0
  });
  egg.name = BREEDS[breedId].name + ' Egg';
  egg.foundAt = landId; // record origin land

  gameState.dragons.push(egg);
  saveState();

  return { ok: true, breedId, egg, msg: `You found a ${BREEDS[breedId].name} egg! 🥚` };
}

function renderLandCard(land) {
  const adultCount = adultDragonCount();
  const locked = adultCount < land.unlockAt;
  const cd = getLandCooldownRemaining(land.id);
  const ready = !locked && cd === 0;

  let statusHtml;
  if (locked) {
    statusHtml = `<div class="land-status land-status--locked">🔒 Need ${land.unlockAt} dragons</div>`;
  } else if (cd > 0) {
    const m = Math.floor(cd / 60000);
    const s = Math.floor((cd % 60000) / 1000);
    statusHtml = `<div class="land-status land-status--cooldown" data-land-cd="${land.id}">⏳ ${m}:${String(s).padStart(2,'0')}</div>`;
  } else {
    statusHtml = `<div class="land-status land-status--ready">✨ Ready</div>`;
  }

  // Preview up to 3 top breeds from pool
  const total = land.eggPool.reduce((s, [, w]) => s + w, 0);
  const topBreeds = [...land.eggPool]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, w]) => {
      const b = BREEDS[id];
      return `<span class="land-preview__breed" title="${b ? b.name : id}">${b ? b.emoji : '🥚'} ${Math.round(w/total*100)}%</span>`;
    }).join('');

  return `
    <div class="land-card theme-${land.theme} ${locked ? 'locked' : ''} ${ready ? 'ready' : ''}" data-land-id="${land.id}">
      <div class="land-art">
        <div class="land-sky"></div>
        <div class="land-terrain"></div>
        <div class="land-accent"></div>
        <div class="land-fog ${locked ? 'land-fog--full' : ''}"></div>
        <div class="land-emoji-badge">${land.emoji}</div>
      </div>
      <div class="land-card__body">
        <div class="land-card__header">
          <div class="land-card__name">${land.name}</div>
          <div class="land-card__cost">${land.cost}💎</div>
        </div>
        <div class="land-card__subtitle">${land.subtitle}</div>
        ${statusHtml}
        <div class="land-preview">${topBreeds}</div>
      </div>
    </div>`;
}

function renderExplore() {
  const grid = document.getElementById('explore-grid');
  if (!grid) return;
  grid.innerHTML = LANDS.map(l => renderLandCard(l)).join('');
  updateHUD();
}

// Explore screen cooldown ticker
setInterval(() => {
  if (currentScreen === 'explore') {
    // Only re-render if any land is on cooldown (to update timers)
    const hasCooldown = LANDS.some(l => getLandCooldownRemaining(l.id) > 0);
    if (hasCooldown) renderExplore();
  }
}, 1000);

// Egg timer refresh on breed screen
let breedRefreshTimer = null;
setInterval(() => {
  if (currentScreen === 'breed') {
    const hasEggs = gameState.dragons.some(d => d.eggTimer !== null);
    if (hasEggs) renderBreed();
  }
}, 1000);

// ═══════════════════════════════════════════════════════════════
// SECTION 11: MINIGAMES
// ═══════════════════════════════════════════════════════════════

// ─── SHARED UTILITIES ───────────────────────────────────────

function getMinigameCooldownRemaining(gameKey) {
  const mg = gameState.minigames[gameKey];
  if (!mg) return 0;
  return Math.max(0, mg.lastPlayed + MINIGAME_COOLDOWN_MS - Date.now());
}

function canPlayMinigame(gameKey) {
  const mg = gameState.minigames[gameKey];
  if (!mg) return { ok: false, msg: 'Unknown game.' };
  const today = todayString();
  if (mg.dailyPlaysDate !== today) {
    mg.dailyPlaysToday = 0;
    mg.dailyPlaysDate = today;
  }
  if (mg.dailyPlaysToday >= MINIGAME_DAILY_LIMIT) {
    return { ok: false, msg: `Daily limit reached (${MINIGAME_DAILY_LIMIT}/${MINIGAME_DAILY_LIMIT}). Come back tomorrow!` };
  }
  const cd = getMinigameCooldownRemaining(gameKey);
  if (cd > 0) {
    const m = Math.ceil(cd / 60000);
    return { ok: false, msg: `Cooldown: ${m} min remaining.` };
  }
  return { ok: true };
}

function recordMinigamePlay(gameKey) {
  const mg = gameState.minigames[gameKey];
  const today = todayString();
  if (mg.dailyPlaysDate !== today) {
    mg.dailyPlaysToday = 0;
    mg.dailyPlaysDate = today;
  }
  mg.lastPlayed = Date.now();
  mg.dailyPlaysToday++;
  saveState();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── GAMES HUB ──────────────────────────────────────────────

function renderGamesHub() {
  const hub = document.getElementById('games-hub');
  if (!hub) return;

  const games = [
    {
      key: 'memoryMatch', name: 'Memory Match', emoji: '🃏',
      desc: 'Flip cards to find matching dragon pairs. Fewer moves = more gems!',
      bestLabel: () => {
        const mg = gameState.minigames.memoryMatch;
        return mg.bestMoves < Infinity ? `Best: ${mg.bestMoves} moves` : 'No plays yet';
      }
    },
    {
      key: 'dragonQuiz', name: 'Dragon Quiz', emoji: '🧠',
      desc: 'Test your dragon knowledge! 5 questions from the Dragonpedia.',
      bestLabel: () => {
        const mg = gameState.minigames.dragonQuiz;
        return mg.bestScore > 0 ? `Best: ${mg.bestScore}/5` : 'No plays yet';
      }
    },
    {
      key: 'elementalPuzzle', name: 'Elemental Tap', emoji: '⚡',
      desc: 'Tap the matching elements before they vanish! Speed is everything.',
      bestLabel: () => {
        const mg = gameState.minigames.elementalPuzzle;
        return mg.highScore > 0 ? `High score: ${mg.highScore}` : 'No plays yet';
      }
    }
  ];

  hub.innerHTML = games.map(g => {
    const check = canPlayMinigame(g.key);
    const cd = getMinigameCooldownRemaining(g.key);
    const mg = gameState.minigames[g.key];
    const today = todayString();
    const playsToday = (mg.dailyPlaysDate === today) ? mg.dailyPlaysToday : 0;
    const playsLeft = MINIGAME_DAILY_LIMIT - playsToday;

    let statusHtml;
    if (!check.ok && playsLeft <= 0) {
      statusHtml = '<div class="game-hub-status game-hub-status--exhausted">Daily limit reached</div>';
    } else if (cd > 0) {
      const m = Math.floor(cd / 60000);
      const s = Math.floor((cd % 60000) / 1000);
      statusHtml = `<div class="game-hub-status game-hub-status--cooldown">⏳ ${m}:${String(s).padStart(2,'0')}</div>`;
    } else {
      statusHtml = '<div class="game-hub-status game-hub-status--ready">✨ Ready</div>';
    }

    return `
      <div class="game-hub-card ${check.ok ? 'ready' : 'on-cooldown'}" data-play-game="${g.key}">
        <div class="game-hub-card__icon">${g.emoji}</div>
        <div class="game-hub-card__body">
          <div class="game-hub-card__name">${g.name}</div>
          <div class="game-hub-card__desc">${g.desc}</div>
          <div class="game-hub-card__meta">
            <span class="game-hub-card__best">${g.bestLabel()}</span>
            <span class="game-hub-card__plays">${playsLeft}/${MINIGAME_DAILY_LIMIT} plays left</span>
          </div>
          ${statusHtml}
        </div>
      </div>`;
  }).join('');
}

// Games hub cooldown ticker
setInterval(() => {
  if (currentScreen === 'games') {
    const hasCooldown = ['memoryMatch', 'dragonQuiz', 'elementalPuzzle']
      .some(k => getMinigameCooldownRemaining(k) > 0);
    if (hasCooldown) renderGamesHub();
  }
}, 1000);

// ─── MEMORY MATCH ───────────────────────────────────────────

let memoryMatchState = null;

function startMemoryMatch() {
  const check = canPlayMinigame('memoryMatch');
  if (!check.ok) { showToast(check.msg, 'warning'); return; }

  const breedKeys = Object.keys(BREEDS);
  const picked = shuffle(breedKeys).slice(0, 6);
  const cardPool = [];
  picked.forEach((bk, idx) => {
    const b = BREEDS[bk];
    cardPool.push({ id: idx * 2,     breedId: bk, emoji: b.emoji, flipped: false, matched: false });
    cardPool.push({ id: idx * 2 + 1, breedId: bk, emoji: b.emoji, flipped: false, matched: false });
  });

  memoryMatchState = {
    cards: shuffle(cardPool),
    flippedIndices: [],
    moves: 0,
    pairs: 0,
    totalPairs: 6,
    startTime: Date.now(),
    lockBoard: false,
    timerInterval: null
  };

  openModal(renderMemoryMatchModal());

  memoryMatchState.timerInterval = setInterval(() => {
    const el = document.getElementById('mm-timer');
    if (el && memoryMatchState) {
      const elapsed = Math.floor((Date.now() - memoryMatchState.startTime) / 1000);
      el.textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
    }
  }, 1000);
}

function renderMemoryMatchModal() {
  const cards = memoryMatchState.cards;
  const gridHtml = cards.map((card, i) => `
    <div class="mm-card ${card.matched ? 'matched' : ''} ${card.flipped ? 'flipped' : ''}" data-mm-card="${i}">
      <div class="mm-card__back">🐉</div>
      <div class="mm-card__front">${card.flipped || card.matched ? card.emoji : ''}</div>
    </div>`).join('');

  return `
    <div class="minigame-modal">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="minigame-modal__header">
        <div class="minigame-modal__title">🃏 Memory Match</div>
        <div class="minigame-modal__info">
          <span>Moves: <strong id="mm-moves">0</strong></span>
          <span>Time: <strong id="mm-timer">0:00</strong></span>
        </div>
      </div>
      <div class="mm-grid">${gridHtml}</div>
    </div>`;
}

function flipMemoryCard(index) {
  if (!memoryMatchState || memoryMatchState.lockBoard) return;
  const card = memoryMatchState.cards[index];
  if (card.flipped || card.matched) return;

  card.flipped = true;
  memoryMatchState.flippedIndices.push(index);
  updateMemoryMatchCards();

  if (memoryMatchState.flippedIndices.length === 2) {
    memoryMatchState.moves++;
    memoryMatchState.lockBoard = true;
    const [i1, i2] = memoryMatchState.flippedIndices;
    const c1 = memoryMatchState.cards[i1];
    const c2 = memoryMatchState.cards[i2];

    if (c1.breedId === c2.breedId) {
      c1.matched = true;
      c2.matched = true;
      memoryMatchState.pairs++;
      memoryMatchState.flippedIndices = [];
      memoryMatchState.lockBoard = false;
      updateMemoryMatchCards();
      const movesEl = document.getElementById('mm-moves');
      if (movesEl) movesEl.textContent = memoryMatchState.moves;

      if (memoryMatchState.pairs === memoryMatchState.totalPairs) {
        clearInterval(memoryMatchState.timerInterval);
        const elapsed = Date.now() - memoryMatchState.startTime;
        setTimeout(() => finishMemoryMatch(elapsed), 400);
      }
    } else {
      setTimeout(() => {
        if (!memoryMatchState) return;
        c1.flipped = false;
        c2.flipped = false;
        memoryMatchState.flippedIndices = [];
        memoryMatchState.lockBoard = false;
        updateMemoryMatchCards();
        const movesEl = document.getElementById('mm-moves');
        if (movesEl) movesEl.textContent = memoryMatchState.moves;
      }, 800);
    }
  }
}

function updateMemoryMatchCards() {
  if (!memoryMatchState) return;
  memoryMatchState.cards.forEach((card, i) => {
    const el = document.querySelector(`[data-mm-card="${i}"]`);
    if (!el) return;
    if (card.flipped || card.matched) {
      el.classList.add('flipped');
      el.querySelector('.mm-card__front').textContent = card.emoji;
    } else {
      el.classList.remove('flipped');
      el.querySelector('.mm-card__front').textContent = '';
    }
    el.classList.toggle('matched', card.matched);
  });
}

function finishMemoryMatch(elapsedMs) {
  const moves = memoryMatchState.moves;
  const mg = gameState.minigames.memoryMatch;

  let gems = 5;
  if (moves <= 8) gems = 20;
  else if (moves <= 10) gems = 15;
  else if (moves <= 14) gems = 10;
  else if (moves <= 18) gems = 8;

  if (elapsedMs < 30000) gems += 5;
  else if (elapsedMs < 60000) gems += 3;

  if (moves < mg.bestMoves) mg.bestMoves = moves;
  if (elapsedMs < mg.bestTimeMs) mg.bestTimeMs = elapsedMs;

  gameState.player.gems += gems;
  recordMinigamePlay('memoryMatch');
  updateHUD();

  clearInterval(memoryMatchState.timerInterval);
  memoryMatchState = null;

  const secs = Math.floor(elapsedMs / 1000);
  openModal(`
    <div class="minigame-result">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="minigame-result__icon">🎉</div>
      <div class="minigame-result__title">Memory Match Complete!</div>
      <div class="minigame-result__stats">
        <div class="minigame-stat"><span class="minigame-stat__label">Moves</span><span class="minigame-stat__value">${moves}</span></div>
        <div class="minigame-stat"><span class="minigame-stat__label">Time</span><span class="minigame-stat__value">${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}</span></div>
      </div>
      <div class="minigame-result__reward">+${gems}💎</div>
      <button class="btn btn--primary btn--full" id="modal-close-btn">Collect</button>
    </div>`);
}

// ─── DRAGON QUIZ ────────────────────────────────────────────

let quizState = null;

function generateQuizQuestions(count) {
  const breedKeys = Object.keys(BREEDS);
  const pool = [];

  breedKeys.forEach(bk => {
    const b = BREEDS[bk];
    // Type 1: Elements
    pool.push({
      question: `What element(s) does ${b.name} ${b.emoji} have?`,
      correct: b.elements.join(', '),
      options: shuffle([
        b.elements.join(', '),
        ...generateWrongElements(b.elements, 3)
      ])
    });
    // Type 2: Ability
    const abilityName = b.ability.split('—')[0].trim();
    const wrongBreeds = shuffle(breedKeys.filter(k => k !== bk)).slice(0, 3);
    pool.push({
      question: `Which dragon has the ability "${abilityName}"?`,
      correct: b.name,
      options: shuffle([b.name, ...wrongBreeds.map(k => BREEDS[k].name)])
    });
    // Type 3: Rarity
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const wrongRarities = shuffle(rarities.filter(r => r !== b.rarity)).slice(0, 3);
    pool.push({
      question: `What rarity is ${b.name} ${b.emoji}?`,
      correct: b.rarity,
      options: shuffle([b.rarity, ...wrongRarities])
    });
    // Type 4: Emoji
    const wrongEmojis = shuffle(breedKeys.filter(k => k !== bk && BREEDS[k].emoji !== b.emoji))
      .slice(0, 3).map(k => BREEDS[k].emoji);
    if (wrongEmojis.length === 3) {
      pool.push({
        question: `Which emoji represents ${b.name}?`,
        correct: b.emoji,
        options: shuffle([b.emoji, ...wrongEmojis])
      });
    }
  });

  return shuffle(pool).slice(0, count);
}

function generateWrongElements(correctElements, count) {
  const wrong = [];
  const all = [...ELEMENT_NAMES];
  while (wrong.length < count) {
    const combo = shuffle([...all]).slice(0, correctElements.length).join(', ');
    if (combo !== correctElements.join(', ') && !wrong.includes(combo)) {
      wrong.push(combo);
    }
  }
  return wrong;
}

function startDragonQuiz() {
  const check = canPlayMinigame('dragonQuiz');
  if (!check.ok) { showToast(check.msg, 'warning'); return; }

  const questions = generateQuizQuestions(5);
  if (questions.length < 5) {
    showToast('Not enough data for a quiz!', 'error');
    return;
  }

  quizState = {
    questions,
    currentIndex: 0,
    score: 0,
    answered: false
  };

  openModal(renderQuizModal());
}

function renderQuizQuestion(q, index) {
  const optionsHtml = q.options.map(opt => `
    <button class="quiz-option" data-quiz-option="${opt}">${opt}</button>
  `).join('');

  return `
    <div class="quiz-progress">Question ${index + 1} of 5</div>
    <div class="quiz-question">${q.question}</div>
    <div class="quiz-options">${optionsHtml}</div>`;
}

function renderQuizModal() {
  const q = quizState.questions[0];
  return `
    <div class="minigame-modal">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="minigame-modal__header">
        <div class="minigame-modal__title">🧠 Dragon Quiz</div>
        <div class="minigame-modal__info">
          <span>Score: <strong id="quiz-score">0</strong>/5</span>
        </div>
      </div>
      <div id="quiz-question-area">
        ${renderQuizQuestion(q, 0)}
      </div>
    </div>`;
}

function answerQuiz(selectedOption) {
  if (!quizState || quizState.answered) return;
  quizState.answered = true;

  const q = quizState.questions[quizState.currentIndex];
  const isCorrect = selectedOption === q.correct;
  if (isCorrect) quizState.score++;

  document.querySelectorAll('[data-quiz-option]').forEach(btn => {
    const opt = btn.dataset.quizOption;
    if (opt === q.correct) btn.classList.add('quiz-option--correct');
    else if (opt === selectedOption && !isCorrect) btn.classList.add('quiz-option--wrong');
    btn.style.pointerEvents = 'none';
  });

  const scoreEl = document.getElementById('quiz-score');
  if (scoreEl) scoreEl.textContent = quizState.score;

  setTimeout(() => {
    if (!quizState) return;
    quizState.currentIndex++;
    quizState.answered = false;
    if (quizState.currentIndex >= quizState.questions.length) {
      finishQuiz();
    } else {
      const qArea = document.getElementById('quiz-question-area');
      if (qArea) qArea.innerHTML = renderQuizQuestion(quizState.questions[quizState.currentIndex], quizState.currentIndex);
    }
  }, 1200);
}

function finishQuiz() {
  const score = quizState.score;
  const mg = gameState.minigames.dragonQuiz;

  let gems = score * 4;
  if (score === 5) gems += 5;

  if (score > mg.bestScore) mg.bestScore = score;

  gameState.player.gems += gems;
  recordMinigamePlay('dragonQuiz');
  updateHUD();
  quizState = null;

  openModal(`
    <div class="minigame-result">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="minigame-result__icon">${score === 5 ? '🏆' : score >= 3 ? '🧠' : '📚'}</div>
      <div class="minigame-result__title">Quiz Complete!</div>
      <div class="minigame-result__stats">
        <div class="minigame-stat"><span class="minigame-stat__label">Score</span><span class="minigame-stat__value">${score}/5</span></div>
      </div>
      <div class="minigame-result__reward">+${gems}💎</div>
      <button class="btn btn--primary btn--full" id="modal-close-btn">Collect</button>
    </div>`);
}

// ─── ELEMENTAL TAP ──────────────────────────────────────────

let elementalPuzzleState = null;

function startElementalPuzzle() {
  const check = canPlayMinigame('elementalPuzzle');
  if (!check.ok) { showToast(check.msg, 'warning'); return; }

  const targetElement = ELEMENT_NAMES[Math.floor(Math.random() * ELEMENT_NAMES.length)];

  elementalPuzzleState = {
    targetElement,
    targets: [],
    score: 0,
    misses: 0,
    maxMisses: 3,
    round: 1,
    spawnInterval: null,
    gameLoopInterval: null,
    targetCounter: 0,
    active: true,
    startTime: Date.now()
  };

  openModal(renderElementalPuzzleModal());

  setTimeout(() => {
    if (!elementalPuzzleState) return;
    elementalPuzzleState.spawnInterval = setInterval(() => spawnElementTarget(), getSpawnRate());
    elementalPuzzleState.gameLoopInterval = setInterval(() => updateElementalPuzzle(), 100);
  }, 800);
}

function getSpawnRate() {
  if (!elementalPuzzleState) return 1200;
  return Math.max(400, 1200 - (elementalPuzzleState.round - 1) * 80);
}

function getTargetLifetime() {
  if (!elementalPuzzleState) return 2500;
  return Math.max(800, 2500 - (elementalPuzzleState.round - 1) * 150);
}

function renderElementalPuzzleModal() {
  const st = elementalPuzzleState;
  return `
    <div class="minigame-modal">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="minigame-modal__header">
        <div class="minigame-modal__title">⚡ Elemental Tap</div>
        <div class="minigame-modal__info">
          <span>Score: <strong id="ep-score">0</strong></span>
          <span id="ep-misses">💔💔💔</span>
        </div>
      </div>
      <div class="ep-target-prompt">
        Tap only: <span class="ep-target-element">${ELEMENT_EMOJIS[st.targetElement]} ${st.targetElement}</span>
      </div>
      <div class="ep-arena" id="ep-arena"></div>
    </div>`;
}

function spawnElementTarget() {
  if (!elementalPuzzleState || !elementalPuzzleState.active) return;
  const st = elementalPuzzleState;
  const arena = document.getElementById('ep-arena');
  if (!arena) return;

  const isTarget = Math.random() < 0.4;
  let element;
  if (isTarget) {
    element = st.targetElement;
  } else {
    const others = ELEMENT_NAMES.filter(e => e !== st.targetElement);
    element = others[Math.floor(Math.random() * others.length)];
  }

  const id = st.targetCounter++;
  const x = 10 + Math.random() * 80;
  const y = 10 + Math.random() * 70;
  const lifetime = getTargetLifetime();

  st.targets.push({ id, element, x, y, spawnedAt: Date.now(), lifetimeMs: lifetime });

  const el = document.createElement('div');
  el.className = 'ep-target';
  el.dataset.epTarget = id;
  el.dataset.epElement = element;
  el.style.left = x + '%';
  el.style.top = y + '%';
  el.textContent = ELEMENT_EMOJIS[element];
  el.style.animationDuration = (lifetime / 1000) + 's';
  arena.appendChild(el);
}

function updateElementalPuzzle() {
  if (!elementalPuzzleState || !elementalPuzzleState.active) return;
  const st = elementalPuzzleState;
  const now = Date.now();

  const expired = st.targets.filter(t => now - t.spawnedAt > t.lifetimeMs);
  expired.forEach(t => {
    if (t.element === st.targetElement) {
      st.misses++;
      const missEl = document.getElementById('ep-misses');
      if (missEl) missEl.textContent = '💔'.repeat(Math.max(0, st.maxMisses - st.misses)) + '🖤'.repeat(Math.min(st.misses, st.maxMisses));
    }
    const el = document.querySelector(`[data-ep-target="${t.id}"]`);
    if (el) el.remove();
  });
  st.targets = st.targets.filter(t => now - t.spawnedAt <= t.lifetimeMs);

  const newRound = Math.floor(st.score / 5) + 1;
  if (newRound !== st.round) {
    st.round = newRound;
    clearInterval(st.spawnInterval);
    st.spawnInterval = setInterval(() => spawnElementTarget(), getSpawnRate());
  }

  const scoreEl = document.getElementById('ep-score');
  if (scoreEl) scoreEl.textContent = st.score;

  if (st.misses >= st.maxMisses) finishElementalPuzzle();
}

function tapElementTarget(targetId, element) {
  if (!elementalPuzzleState || !elementalPuzzleState.active) return;
  const st = elementalPuzzleState;
  const el = document.querySelector(`[data-ep-target="${targetId}"]`);

  if (element === st.targetElement) {
    st.score++;
    if (el) { el.classList.add('ep-target--hit'); setTimeout(() => el.remove(), 200); }
  } else {
    st.misses++;
    if (el) { el.classList.add('ep-target--wrong'); setTimeout(() => el.remove(), 200); }
    const missEl = document.getElementById('ep-misses');
    if (missEl) missEl.textContent = '💔'.repeat(Math.max(0, st.maxMisses - st.misses)) + '🖤'.repeat(Math.min(st.misses, st.maxMisses));
    if (st.misses >= st.maxMisses) finishElementalPuzzle();
  }

  st.targets = st.targets.filter(t => t.id !== parseInt(targetId));
}

function finishElementalPuzzle() {
  const st = elementalPuzzleState;
  if (!st) return;
  st.active = false;
  clearInterval(st.spawnInterval);
  clearInterval(st.gameLoopInterval);

  const score = st.score;
  const mg = gameState.minigames.elementalPuzzle;

  let gems = Math.floor(score / 2);
  if (score >= 30) gems += 10;
  else if (score >= 20) gems += 5;
  else if (score >= 10) gems += 3;
  gems = Math.max(gems, 2);

  if (score > mg.highScore) mg.highScore = score;

  gameState.player.gems += gems;
  recordMinigamePlay('elementalPuzzle');
  updateHUD();
  elementalPuzzleState = null;

  openModal(`
    <div class="minigame-result">
      <button class="modal-close" id="modal-close-btn">✕</button>
      <div class="minigame-result__icon">${score >= 20 ? '🏆' : score >= 10 ? '⚡' : '💫'}</div>
      <div class="minigame-result__title">Elemental Tap Complete!</div>
      <div class="minigame-result__stats">
        <div class="minigame-stat"><span class="minigame-stat__label">Score</span><span class="minigame-stat__value">${score}</span></div>
        <div class="minigame-stat"><span class="minigame-stat__label">Round</span><span class="minigame-stat__value">${st.round}</span></div>
      </div>
      <div class="minigame-result__reward">+${gems}💎</div>
      <button class="btn btn--primary btn--full" id="modal-close-btn">Collect</button>
    </div>`);
}

// ─── APP INIT ────────────────────────────────────────────────

function initApp() {
  gameState = loadState();

  // Add a starter dragon for new players
  if (gameState.dragons.length === 0 && gameState.cards.length === 0) {
    const starter = createDragon('flame_drake', { name: 'Ember', stage: 'baby', level: 1 });
    gameState.dragons.push(starter);
    saveState();
    setTimeout(() => showToast('Welcome! Your starter Flame Drake is ready. 🔥', 'info'), 800);
  }

  generateStars();
  updateHUD();
  showScreen('lair');
  checkDailyLogin();
}

// Boot
initApp();
