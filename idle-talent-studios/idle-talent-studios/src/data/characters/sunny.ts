import type { Character } from './types'

export const sunny: Character = {
  id: 'sunny-park',
  name: 'Sunny Park',
  rarity: 'R',
  role: 'Choreographer',
  tagline: 'She moves like joy made visible.',
  description:
    'A choreographer with boundless energy and a philosophy that every body tells a story worth telling. She has no interest in hierarchy and infinite interest in the work.',
  accentColor: '#facc15',
  portraitPlaceholder: '💃',
  routeId: 'sunny-park',
  availableFromChapter: 3,
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: ['sport-set-yellow', 'sneakers-platform-white', 'oversized-hoodie-pastel'],
    statAffinities: { confidence: 3, looks: 1 },
    chapters: [
      {
        number: 1,
        title: 'Reconnection',
        sceneRef: 'sunny/ch1_reconnection',
        setsFlags: { sunny_met: true },
      },
      {
        number: 2,
        title: 'The Rehearsal Room',
        sceneRef: 'sunny/ch2_rehearsal_room',
        unlockRequirements: { requiredFlags: { sunny_met: true } },
      },
      {
        number: 3,
        title: 'Remember When',
        sceneRef: 'sunny/ch3_remember_when',
        unlockRequirements: { requiredAffection: 30 },
      },
      {
        number: 4,
        title: 'The Fame Check',
        sceneRef: 'sunny/ch4_fame_check',
        unlockRequirements: { requiredAffection: 45 },
        isInterstitial: false,
      },
      {
        number: 5,
        title: 'Ending',
        sceneRef: 'sunny/ch5_ending',
        unlockRequirements: { requiredAffection: 55 },
      },
    ],
    endings: [
      {
        type: 'true',
        label: 'The Step Back',
        sceneRef: 'sunny/ending_true',
        prestigeReward: 15,
        conditions: [{ type: 'gigs_skipped', value: 3 }],
      },
      {
        type: 'good',
        label: 'In Sync',
        sceneRef: 'sunny/ending_good',
        prestigeReward: 5,
        conditions: [
          { type: 'max_fame', value: 60 },
          { type: 'min_affection', value: 70 },
        ],
      },
      {
        type: 'heartbreak',
        label: 'The Spotlight Wins',
        sceneRef: 'sunny/ending_heartbreak',
        prestigeReward: 2,
        conditions: [],
      },
    ],
  },
}
