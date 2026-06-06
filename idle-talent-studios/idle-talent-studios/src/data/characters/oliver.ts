import type { Character } from './types'

export const olivier: Character = {
  id: 'olivier-sainte-claire',
  name: 'Olivier Sainte-Claire',
  rarity: 'SSR',
  role: 'Director',
  tagline: 'Art is the only language he speaks fluently.',
  description:
    'A Cannes-darling auteur director known for visually devastating films and impossible demands. He is either the best thing that ever happened to your career — or the worst.',
  accentColor: '#f59e0b',
  portraitPlaceholder: '🎬',
  routeId: 'olivier-sainte-claire',
  availableFromChapter: 4,
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: ['silk-blouse-cream', 'tailored-trousers-black', 'structured-bag-brown'],
    statAffinities: { wisdom: 4, looks: 2 },
    hardLockRequirements: {
      requiredCareerTier: 4,
      requiredStats: { reputation: 60 },
    },
    chapters: [
      {
        number: 1,
        title: 'The Audition',
        sceneRef: 'olivier/ch1_audition',
        setsFlags: { olivier_met: true },
      },
      {
        number: 2,
        title: 'The Call Back',
        sceneRef: 'olivier/ch2_callback',
        unlockRequirements: { requiredFlags: { olivier_met: true } },
      },
      {
        number: 3,
        title: 'First Week',
        sceneRef: 'olivier/ch3_first_week',
        unlockRequirements: { requiredAffection: 20 },
      },
      {
        number: 4,
        title: 'The Rehearsal',
        sceneRef: 'olivier/ch4_rehearsal',
        unlockRequirements: { requiredAffection: 30 },
      },
      {
        number: 5,
        title: 'After Wrap',
        sceneRef: 'olivier/ch5_after_wrap',
        unlockRequirements: { requiredAffection: 40 },
      },
      {
        number: 6,
        title: 'Park Bench',
        sceneRef: 'olivier/ch6_park_bench',
        unlockRequirements: { requiredAffection: 50 },
        setsFlags: { olivier_park_approached: true },
      },
      {
        number: 7,
        title: 'The Gig Offer',
        sceneRef: 'olivier/ch7_gig_offer',
        unlockRequirements: { requiredFlags: { olivier_park_approached: true }, requiredAffection: 55 },
        setsFlags: { olivier_gig_refused: false },
      },
      {
        number: 8,
        title: 'The Distance',
        sceneRef: 'olivier/ch8_the_distance',
        unlockRequirements: { requiredAffection: 60 },
      },
      {
        number: 9,
        title: 'Cannes Prep',
        sceneRef: 'olivier/ch9_cannes_prep',
        unlockRequirements: { requiredAffection: 65, requiredStats: { reputation: 70 } },
      },
      {
        number: 10,
        title: 'The Premiere',
        sceneRef: 'olivier/ch10_premiere',
        unlockRequirements: { requiredAffection: 70 },
      },
      {
        number: 11,
        title: 'Exposure',
        sceneRef: 'olivier/ch11_exposure',
        unlockRequirements: { requiredAffection: 80 },
      },
      {
        number: 12,
        title: 'Ending',
        sceneRef: 'olivier/ch12_ending',
        unlockRequirements: { requiredAffection: 85 },
      },
    ],
    endings: [
      {
        type: 'true',
        label: 'The Frame Holds',
        sceneRef: 'olivier/ending_true',
        prestigeReward: 15,
        conditions: [
          { type: 'flag_true', flag: 'olivier_gig_refused' },
          { type: 'min_stat', stat: 'reputation', value: 70 },
          { type: 'max_scandal', value: 20 },
        ],
      },
      {
        type: 'good',
        label: 'The Collaboration',
        sceneRef: 'olivier/ending_good',
        prestigeReward: 5,
        conditions: [
          { type: 'min_stat', stat: 'reputation', value: 70 },
          { type: 'max_scandal', value: 30 },
        ],
      },
      {
        type: 'heartbreak',
        label: 'Cut',
        sceneRef: 'olivier/ending_heartbreak',
        prestigeReward: 2,
        conditions: [],
      },
    ],
  },
}
