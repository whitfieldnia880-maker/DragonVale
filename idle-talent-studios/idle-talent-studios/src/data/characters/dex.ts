import type { Character } from './types'

export const dex: Character = {
  id: 'dex-calloway',
  name: 'Dex Calloway',
  rarity: 'R',
  role: 'Photographer',
  tagline: 'He sees you before you see yourself.',
  description:
    'An up-and-coming editorial photographer with a warm laugh and an uncanny eye. He is easy to underestimate and impossible to forget.',
  accentColor: '#fb923c',
  portraitPlaceholder: '📷',
  routeId: 'dex-calloway',
  availableFromChapter: 2,
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: ['vintage-tee-washed', 'canvas-jacket-tan', 'worn-boots-brown'],
    statAffinities: { confidence: 2, looks: 2, wisdom: 1 },
    chapters: [
      {
        number: 1,
        title: 'Hired',
        sceneRef: 'dex/ch1_hired',
        setsFlags: { dex_met: true },
      },
      {
        number: 2,
        title: 'The Shoot',
        sceneRef: 'dex/ch2_the_shoot',
        unlockRequirements: { requiredFlags: { dex_met: true } },
      },
      {
        number: 3,
        title: 'After Hours',
        sceneRef: 'dex/ch3_after_hours',
        unlockRequirements: { requiredAffection: 30 },
        affectionOnComplete: 15,
        setsFlags: { dex_note3_unlocked: true },
      },
      {
        number: 4,
        title: 'Check In',
        sceneRef: 'dex/ch4_check_in',
        unlockRequirements: { requiredAffection: 65 },
      },
      {
        number: 5,
        title: 'Ending',
        sceneRef: 'dex/ch5_ending',
        unlockRequirements: { requiredAffection: 65 },
      },
    ],
    endings: [
      {
        type: 'true',
        label: 'All Eight Frames',
        sceneRef: 'dex/ending_true',
        prestigeReward: 15,
        conditions: [
          { type: 'min_notes', value: 8 },
          { type: 'min_affection', value: 65 },
        ],
      },
      {
        type: 'good',
        label: 'The Portrait',
        sceneRef: 'dex/ending_good',
        prestigeReward: 5,
        conditions: [{ type: 'min_affection', value: 65 }],
      },
      {
        type: 'heartbreak',
        label: 'Out of Frame',
        sceneRef: 'dex/ending_heartbreak',
        prestigeReward: 2,
        conditions: [],
      },
    ],
  },
}
