import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Gig, ActiveGig, GigOutcome, PrepChoiceId } from '@/systems/gigSystem'
import {
  computeOutcome,
  computeCareerTier,
  computeFascinationDecay,
  computeIdleAccrual,
  getCareerTierConfig,
} from '@/systems/gigSystem'
import { GIG_CATALOG, GIG_INDEX } from '@/data/gigs/catalog'

// ─── Idle snapshot stored in state ───────────────────────────────────────────

interface IdleState {
  lastCollectedAt: string   // ISO timestamp
  uncollected: number       // spotlight earned but not yet collected
  extendedCap: boolean      // prestige-unlocked 16hr cap
}

// ─── Completed gig record ─────────────────────────────────────────────────────

export interface CompletedGigRecord {
  gigId: string
  prepChoice: PrepChoiceId
  outcomeTier: GigOutcome['tier']
  spotlight: number
  dayCompleted: number
}

interface GigStore {
  careerTier: number
  completedGigCount: number
  completedGigHistory: CompletedGigRecord[]

  currentOffers: string[]        // gig IDs currently on offer
  offersGeneratedOnDay: number
  activeGig: ActiveGig | null
  pendingOutcome: GigOutcome | null  // waiting to be shown to player
  pendingTierAdvance: { fromTier: number; toTier: number } | null

  fascination: number
  idle: IdleState

  // Actions
  refreshOffers: (currentDay: number, careerTierOverride?: number) => void
  startGig: (gigId: string, prep: PrepChoiceId, currentDay: number) => void
  resolveGig: (
    stats: import('@/engine/gameState').PlayerStats,
    romanceAffection: (charId: string) => number,
    currentDay: number
  ) => GigOutcome | null
  clearOutcome: () => void
  recalcCareerTier: (
    reputation: number,
    scandal: number,
    hasSSRRoute: boolean,
    hasTrueEnding: boolean
  ) => void
  addFascination: (delta: number) => void
  tickFascinationDecay: () => void

  collectIdle: (currentTier: number) => number
  tickIdleAccrual: (currentTier: number) => void
  unlockExtendedCap: () => void
  dismissTierAdvance: () => void
}

// ─── Offer generation ─────────────────────────────────────────────────────────

function generateOffers(careerTier: number, excludeActive?: string): string[] {
  const pool = GIG_CATALOG.filter(
    (g) => g.tierRequired <= careerTier && g.id !== excludeActive
  )
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map((g) => g.id)
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGigStore = create<GigStore>()(
  persist(
    (set, get) => ({
      careerTier: 1,
      completedGigCount: 0,
      completedGigHistory: [],

      currentOffers: [],
      offersGeneratedOnDay: -1,
      activeGig: null,
      pendingOutcome: null,
      pendingTierAdvance: null,

      fascination: 0,
      idle: {
        lastCollectedAt: new Date().toISOString(),
        uncollected: 0,
        extendedCap: false,
      },

      // ── Refresh offers ─────────────────────────────────────────────────────

      refreshOffers: (currentDay, careerTierOverride) => {
        const tier = careerTierOverride ?? get().careerTier
        const offers = generateOffers(tier, get().activeGig?.gigId)
        set({ currentOffers: offers, offersGeneratedOnDay: currentDay })
      },

      // ── Start a gig ────────────────────────────────────────────────────────

      startGig: (gigId, prep, currentDay) => {
        const gig = GIG_INDEX[gigId]
        if (!gig) return
        set({
          activeGig: {
            gigId,
            prepChoice: prep,
            dayStarted: currentDay,
            daysRequired: gig.duration,
          },
          // Remove from offers
          currentOffers: get().currentOffers.filter((id) => id !== gigId),
        })
      },

      // ── Resolve gig (called when duration is met) ──────────────────────────

      resolveGig: (stats, romanceAffection, currentDay) => {
        const { activeGig } = get()
        if (!activeGig) return null

        const gig = GIG_INDEX[activeGig.gigId]
        if (!gig) return null

        const isComplete = currentDay >= activeGig.dayStarted + activeGig.daysRequired
        if (!isComplete) return null

        const fascination = get().fascination
        const hooked = gig.romanceHook ? romanceAffection(gig.romanceHook) : 0
        const outcome = computeOutcome(gig, activeGig.prepChoice, stats, fascination, hooked)

        const newCount = get().completedGigCount + 1
        const record: CompletedGigRecord = {
          gigId: gig.id,
          prepChoice: activeGig.prepChoice,
          outcomeTier: outcome.tier,
          spotlight: outcome.spotlight,
          dayCompleted: currentDay,
        }

        set((state) => ({
          activeGig: null,
          pendingOutcome: outcome,
          completedGigCount: newCount,
          completedGigHistory: [record, ...state.completedGigHistory].slice(0, 100),
          fascination: Math.min(100, state.fascination + outcome.fascinationDelta),
        }))

        return outcome
      },

      clearOutcome: () => set({ pendingOutcome: null }),

      // ── Career tier recalc ─────────────────────────────────────────────────

      recalcCareerTier: (reputation, scandal, hasSSRRoute, hasTrueEnding) => {
        const currentTier = get().careerTier
        const newTier = computeCareerTier(
          get().completedGigCount,
          reputation,
          scandal,
          hasSSRRoute,
          hasTrueEnding
        )
        if (newTier !== currentTier) {
          set({
            careerTier: newTier,
            pendingTierAdvance: newTier > currentTier
              ? { fromTier: currentTier, toTier: newTier }
              : null,
          })
        }
      },

      // ── Fascination ────────────────────────────────────────────────────────

      addFascination: (delta) =>
        set((state) => ({
          fascination: Math.min(100, Math.max(0, state.fascination + delta)),
        })),

      tickFascinationDecay: () =>
        set((state) => ({
          fascination: computeFascinationDecay(state.fascination),
        })),

      // ── Idle earnings ──────────────────────────────────────────────────────

      collectIdle: (currentTier) => {
        const { idle } = get()
        const now = new Date()
        const hoursSince =
          (now.getTime() - new Date(idle.lastCollectedAt).getTime()) / 3_600_000
        const accrued = computeIdleAccrual(currentTier, hoursSince, idle.extendedCap)
        const total = idle.uncollected + accrued
        set({
          idle: {
            ...idle,
            lastCollectedAt: now.toISOString(),
            uncollected: 0,
          },
        })
        return total
      },

      tickIdleAccrual: (currentTier) => {
        const { idle } = get()
        const now = new Date()
        const hoursSince =
          (now.getTime() - new Date(idle.lastCollectedAt).getTime()) / 3_600_000
        const accrued = computeIdleAccrual(currentTier, hoursSince, idle.extendedCap)
        set({
          idle: {
            ...idle,
            uncollected: accrued,
          },
        })
      },

      unlockExtendedCap: () =>
        set((state) => ({ idle: { ...state.idle, extendedCap: true } })),

      dismissTierAdvance: () => set({ pendingTierAdvance: null }),
    }),
    { name: 'its-gigs', version: 2 }
  )
)

// ─── Selector helpers ─────────────────────────────────────────────────────────

export function selectActiveGigProgress(
  activeGig: ActiveGig | null,
  currentDay: number
): { progress: number; isComplete: boolean; daysLeft: number } {
  if (!activeGig) return { progress: 0, isComplete: false, daysLeft: 0 }
  const elapsed = currentDay - activeGig.dayStarted
  const isComplete = elapsed >= activeGig.daysRequired
  const progress = Math.min(1, elapsed / activeGig.daysRequired)
  const daysLeft = Math.max(0, activeGig.daysRequired - elapsed)
  return { progress, isComplete, daysLeft }
}

export function selectGigById(id: string): Gig | undefined {
  return GIG_INDEX[id]
}

export function selectCareerColor(tier: number): string {
  return getCareerTierConfig(tier).color
}
