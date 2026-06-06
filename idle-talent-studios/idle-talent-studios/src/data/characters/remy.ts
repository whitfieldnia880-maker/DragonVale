import type { Character } from './types'

export const remy: Character = {
  id: 'remy-ashford',
  name: 'Remy Ashford',
  rarity: 'SR',
  role: 'Stylist',
  tagline: 'He builds armor out of fabric.',
  description:
    "The industry's most sought-after stylist and a man who has dressed everyone worth dressing. Behind the flawless aesthetic is someone who knows every secret worth keeping.",
  accentColor: '#2dd4bf',
  portraitPlaceholder: '✂️',
  routeId: 'remy-ashford',
  availableFromChapter: 3,
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: ['bespoke-blazer-teal', 'linen-shirt-white', 'loafer-suede-tan'],
    statAffinities: { looks: 3, confidence: 2 },
    chapters: [
      {
        number: 1,
        title: 'Introduction',
        sceneRef: 'remy/ch1_introduction',
        setsFlags: { remy_met: true },
      },
      {
        number: 2,
        title: 'The Fitting',
        sceneRef: 'remy/ch2_the_fitting',
        unlockRequirements: { requiredFlags: { remy_met: true } },
      },
      {
        number: 3,
        title: 'Gala Night',
        sceneRef: 'remy/ch3_gala_night',
        unlockRequirements: { requiredAffection: 20 },
        affectionOnComplete: 8,
      },
      {
        number: 4,
        title: 'Soap Opera',
        sceneRef: 'remy/ch4_soap_opera',
        unlockRequirements: { requiredAffection: 35, requiredStats: { confidence: 40 } },
        setsFlags: { remy_chemistry_tested: true },
      },
      {
        number: 5,
        title: 'Front Page',
        sceneRef: 'remy/ch5_front_page',
        unlockRequirements: { requiredFlags: { remy_chemistry_tested: true }, requiredAffection: 45 },
        affectionOnComplete: 5,
      },
      {
        number: 6,
        title: 'Off the Record',
        sceneRef: 'remy/ch6_off_the_record',
        unlockRequirements: { requiredAffection: 55 },
      },
      {
        number: 7,
        title: 'The Show',
        sceneRef: 'remy/ch7_the_show',
        unlockRequirements: { requiredAffection: 65 },
      },
      {
        number: 8,
        title: 'Ending',
        sceneRef: 'remy/ch8_ending',
        unlockRequirements: { requiredAffection: 70 },
      },
    ],
    endings: [
      {
        type: 'good',
        label: 'The Look',
        sceneRef: 'remy/ending_good',
        prestigeReward: 5,
        conditions: [
          { type: 'min_stat', stat: 'confidence', value: 80 },
          { type: 'min_stat', stat: 'reputation', value: 50 },
          { type: 'max_scandal', value: 70 },
        ],
      },
      {
        type: 'heartbreak',
        label: 'Managed',
        sceneRef: 'remy/ending_heartbreak',
        prestigeReward: 2,
        conditions: [],
      },
    ],
  },
}
