import type { Character } from './types'

export const celeste: Character = {
  id: 'celeste-voss',
  name: 'Celeste Voss',
  rarity: 'SR',
  role: 'Publicist',
  tagline: 'She shapes reality, one narrative at a time.',
  description:
    'A crisis communications specialist who has saved more careers than she can count. Celeste is precise, territorial, and absolutely committed to the story she is selling.',
  accentColor: '#c084fc',
  portraitPlaceholder: '📱',
  routeId: 'celeste-voss',
  availableFromChapter: 5,
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: ['power-blazer-plum', 'silk-shell-ivory', 'pointed-heel-black'],
    statAffinities: { wisdom: 3, confidence: 2, looks: 1 },
    hardLockRequirements: {
      requiredStats: { looks: 70 },
      requiredFlags: { wardrobe_maxed: true },
    },
    chapters: [
      {
        number: 1,
        title: 'The Fitting',
        sceneRef: 'celeste/ch1_fitting',
        setsFlags: { celeste_met: true },
      },
      {
        number: 2,
        title: 'First Press Day',
        sceneRef: 'celeste/ch2_press_day',
        unlockRequirements: { requiredFlags: { celeste_met: true } },
      },
      {
        number: 3,
        title: 'Damage Control',
        sceneRef: 'celeste/ch3_damage_control',
        unlockRequirements: { requiredAffection: 20 },
      },
      {
        number: 4,
        title: 'The Strategy Session',
        sceneRef: 'celeste/ch4_strategy',
        unlockRequirements: { requiredAffection: 30 },
      },
      {
        number: 5,
        title: 'Off the Clock',
        sceneRef: 'celeste/ch5_off_clock',
        unlockRequirements: { requiredAffection: 45 },
        affectionOnComplete: 8,
      },
      {
        number: 6,
        title: 'The Leak',
        sceneRef: 'celeste/ch6_the_leak',
        unlockRequirements: { requiredAffection: 55 },
      },
      {
        number: 7,
        title: 'Off the Record',
        sceneRef: 'celeste/ch7_off_the_record',
        unlockRequirements: { requiredAffection: 65 },
        setsFlags: { celeste_private_chosen: true },
      },
      {
        number: 8,
        title: 'Ending',
        sceneRef: 'celeste/ch8_ending',
        unlockRequirements: { requiredAffection: 70 },
      },
    ],
    endings: [
      {
        type: 'secret',
        label: 'Off Narrative',
        sceneRef: 'celeste/ending_secret',
        prestigeReward: 15,
        conditions: [
          { type: 'flag_true', flag: 'celeste_private_chosen' },
          { type: 'min_affection', value: 80 },
          { type: 'min_stat', stat: 'looks', value: 80 },
        ],
      },
      {
        type: 'good',
        label: 'The Narrative',
        sceneRef: 'celeste/ending_good',
        prestigeReward: 5,
        conditions: [{ type: 'min_affection', value: 70 }],
      },
      {
        type: 'heartbreak',
        label: 'Managed Out',
        sceneRef: 'celeste/ending_heartbreak',
        prestigeReward: 2,
        conditions: [],
      },
    ],
  },
}
