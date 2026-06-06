import type { Banner } from '@/engine/gachaEngine'

export const STANDARD_BANNER: Banner = {
  id: 'standard',
  name: 'Spotlight Stage',
  type: 'standard',
  featuredCharacters: [],
  startDate: null,
  endDate: null,
  pullCost: {
    single: { spotlight: 160, prestige: 1 },
    multi: { spotlight: 1500, prestige: 10 },
  },
  isActive: true,
  isOneTime: false,
}

export const BEGINNER_BANNER: Banner = {
  id: 'beginner',
  name: 'First Act',
  type: 'beginner',
  featuredCharacters: [],
  startDate: null,
  endDate: null,
  pullCost: {
    single: { spotlight: 160, prestige: 1 },
    multi: { spotlight: 0, prestige: 3 },
  },
  isActive: true,
  isOneTime: true,
}

export const AMY_RATE_UP_BANNER: Banner = {
  id: 'rate-up-amy-s1',
  name: 'Starlit Rival',
  type: 'rate_up',
  featuredCharacters: ['amy-crawford', 'celeste-voss'],
  startDate: '2026-06-01T00:00:00Z',
  endDate: '2026-06-30T23:59:59Z',
  pullCost: {
    single: { spotlight: 160, prestige: 1 },
    multi: { spotlight: 1500, prestige: 10 },
  },
  rateUpSSR: 0.5,
  rateUpSR: 0.75,
  isActive: true,
  isOneTime: false,
}

export const DRIVER_EVENT_BANNER: Banner = {
  id: 'event-driver-s1',
  name: 'Midnight Route',
  type: 'event',
  featuredCharacters: ['the-driver'],
  startDate: '2026-06-15T00:00:00Z',
  endDate: '2026-06-22T23:59:59Z',
  pullCost: {
    single: { spotlight: 160, prestige: 1 },
    multi: { spotlight: 1500, prestige: 10 },
  },
  isActive: false,
  isOneTime: false,
}

export const ALL_BANNERS: Banner[] = [
  BEGINNER_BANNER,
  AMY_RATE_UP_BANNER,
  DRIVER_EVENT_BANNER,
  STANDARD_BANNER,
]

export function getActiveBanners(now = new Date()): Banner[] {
  return ALL_BANNERS.filter((b) => {
    if (!b.isActive) return false
    if (b.startDate && new Date(b.startDate) > now) return false
    if (b.endDate && new Date(b.endDate) < now) return false
    return true
  })
}

export function getBannerById(id: string): Banner | undefined {
  return ALL_BANNERS.find((b) => b.id === id)
}

export function getBannerTimeLeft(banner: Banner): number | null {
  if (!banner.endDate) return null
  return Math.max(0, new Date(banner.endDate).getTime() - Date.now())
}
