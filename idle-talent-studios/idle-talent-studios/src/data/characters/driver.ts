import type { Character } from './types'

export const driver: Character = {
  id: 'the-driver',
  name: 'The Driver',
  rarity: 'SSR',
  role: 'Unknown',
  tagline: 'He says nothing. He sees everything.',
  description:
    'He appears on the fringe of every major event in your career — always behind the wheel, always watching in the rearview mirror. No name. No record. No explanation.',
  accentColor: '#94a3b8',
  portraitPlaceholder: '🚗',
  routeId: 'the-driver',
  availableFromChapter: 6,
  route: {
    affectionMeter: { hidden: false },
    wardrobeAffinities: [],
    statAffinities: { wisdom: 2 },
    chapters: [
      {
        number: 1,
        title: 'First Ride',
        sceneRef: 'driver/trigger1_first_ride',
        driverTrigger: 1,
        setsFlags: { driver_trigger1: true },
      },
      {
        number: 2,
        title: 'Late Night',
        sceneRef: 'driver/trigger2_late_night',
        driverTrigger: 2,
        unlockRequirements: { requiredFlags: { driver_trigger1: true } },
        setsFlags: { driver_trigger2: true },
      },
      {
        number: 3,
        title: 'The Long Way',
        sceneRef: 'driver/trigger3_long_way',
        driverTrigger: 3,
        unlockRequirements: { requiredFlags: { driver_trigger2: true } },
        setsFlags: { driver_trigger3: true },
      },
      {
        number: 4,
        title: 'Last Stop',
        sceneRef: 'driver/trigger4_last_stop',
        driverTrigger: 4,
        unlockRequirements: { requiredFlags: { driver_trigger3: true } },
        setsFlags: { driver_trigger4: true },
      },
    ],
    endings: [
      {
        type: 'true',
        label: 'The Road Ahead',
        sceneRef: 'driver/ending_true',
        prestigeReward: 15,
        conditions: [
          { type: 'flag_true', flag: 'driver_trigger4' },
        ],
      },
    ],
  },
}
