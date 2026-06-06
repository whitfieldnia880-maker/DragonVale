import type { Character } from './types'

export const marcus: Character = {
  id: 'marcus-vane',
  name: 'Marcus Vane',
  rarity: 'SR',
  role: 'Music Producer',
  tagline: 'He hears what you mean, not what you say.',
  description:
    'A Grammy-nominated producer with a reputation for being brutally honest and quietly brilliant. He has no patience for performance — he wants the real thing, and he can tell the difference.',
  accentColor: '#818cf8',
  portraitPlaceholder: '🎧',
  routeId: 'marcus-vane',
  availableFromChapter: 2,
  events: [
    {
      id: 'day5-text',
      trigger: { type: 'day', value: 5 },
      eventType: 'text_message',
      content: 'Session next Tuesday. Thought you should know. No obligation.',
      affectionDelta: 3,
      scandalizeDelta: 0,
    },
    {
      id: 'day12-gift',
      trigger: { type: 'day', value: 12 },
      eventType: 'gift',
      content:
        'A USB drive appears under your door. It contains three unreleased tracks labeled with your name.',
      affectionDelta: 10,
      scandalizeDelta: 0,
    },
  ],
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: ['studio-hoodie-black', 'chain-layered-gold', 'designer-sneakers-white'],
    statAffinities: { confidence: 3, wisdom: 2 },
    chapters: [
      {
        number: 1,
        title: 'On Set',
        sceneRef: 'marcus/ch1_on_set',
        setsFlags: { marcus_met: true },
      },
      {
        number: 2,
        title: 'The Session',
        sceneRef: 'marcus/ch2_the_session',
        unlockRequirements: { requiredFlags: { marcus_met: true } },
      },
      {
        number: 3,
        title: 'Press Junket',
        sceneRef: 'marcus/ch3_press_junket',
        unlockRequirements: { requiredAffection: 25 },
      },
      {
        number: 4,
        title: 'Marissa',
        sceneRef: 'marcus/ch4_marissa',
        unlockRequirements: { requiredAffection: 35 },
        setsFlags: { marcus_triangle: true },
      },
      {
        number: 5,
        title: 'The Leak',
        sceneRef: 'marcus/ch5_the_leak',
        unlockRequirements: { requiredFlags: { marcus_triangle: true }, requiredAffection: 45 },
        passiveScandalPerDay: 3,
      },
      {
        number: 6,
        title: 'Overheard',
        sceneRef: 'marcus/ch6_overheard',
        unlockRequirements: { requiredAffection: 55 },
        setsFlags: { marcus_overheard: true },
      },
      {
        number: 7,
        title: 'The Choice',
        sceneRef: 'marcus/ch7_the_choice',
        unlockRequirements: {
          requiredFlags: { marcus_overheard: true },
          requiredAffection: 60,
          requiredStats: { confidence: 60 },
        },
      },
      {
        number: 8,
        title: 'Ending',
        sceneRef: 'marcus/ch8_ending',
        unlockRequirements: { requiredAffection: 70 },
      },
    ],
    endings: [
      {
        type: 'good',
        label: 'Real Thing',
        sceneRef: 'marcus/ending_good',
        prestigeReward: 5,
        conditions: [
          { type: 'min_affection', value: 75 },
          { type: 'min_stat', stat: 'confidence', value: 60 },
          { type: 'max_scandal', value: 80 },
        ],
      },
      {
        type: 'heartbreak',
        label: 'The Industry Wins',
        sceneRef: 'marcus/ending_heartbreak',
        prestigeReward: 2,
        conditions: [],
      },
    ],
  },
}
