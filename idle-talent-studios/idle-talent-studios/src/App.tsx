import { lazy, Suspense, useEffect, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGigStore } from '@/store/gigStore'
import { usePlayerStore } from '@/store/playerStore'
import { useRosterStore } from '@/store/rosterStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useAuth } from '@/hooks/useAuth'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { flushOfflineQueue } from '@/systems/offlineQueue'
import { BottomNav, type NavTab } from '@/components/BottomNav'
import { ToastProvider } from '@/components/ToastProvider'
import { OfflineBanner } from '@/components/OfflineBanner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ScreenSkeleton } from '@/components/LoadingSkeleton'
import { BreakingNews } from '@/components/BreakingNews'
import { selectTwist } from '@/systems/scandal'
import { useProgressStore } from '@/store/progressStore'
import type { StatDelta } from '@/engine/statEngine'
import type { StatKey } from '@/engine/gameState'
import { AuthScreen } from '@/screens/AuthScreen'
import { useState } from 'react'

const VALID_STAT_KEYS = new Set<string>([
  'confidence', 'looks', 'wisdom', 'reputation', 'scandal', 'money',
])

// ─── Lazy screen imports ──────────────────────────────────────────────────────

const MainMenu      = lazy(() => import('@/screens/MainMenu').then(m => ({ default: m.MainMenu })))
const Home          = lazy(() => import('@/screens/Home').then(m => ({ default: m.Home })))
const GachaScreen   = lazy(() => import('@/screens/GachaScreen').then(m => ({ default: m.GachaScreen })))
const RouteScreen   = lazy(() => import('@/screens/RouteScreen').then(m => ({ default: m.RouteScreen })))
const ShopScreen    = lazy(() => import('@/screens/ShopScreen').then(m => ({ default: m.ShopScreen })))
const ProfileScreen = lazy(() => import('@/screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })))
const CollectionScreen = lazy(() => import('@/screens/CollectionScreen').then(m => ({ default: m.CollectionScreen })))
const Gigs          = lazy(() => import('@/screens/Gigs').then(m => ({ default: m.Gigs })))
const Career        = lazy(() => import('@/screens/Career').then(m => ({ default: m.Career })))
const ApartmentScreen = lazy(() => import('@/screens/ApartmentScreen').then(m => ({ default: m.ApartmentScreen })))

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | 'menu'
  | 'home'
  | 'gacha'
  | 'routes'
  | 'shop'
  | 'profile'
  | 'gigs'
  | 'career'
  | 'collection'
  | 'apartment'

// Bottom nav tabs map to screens
const NAV_TAB_TO_SCREEN: Record<NavTab, Screen> = {
  home:       'home',
  gigs:       'gigs',
  gacha:      'gacha',
  collection: 'collection',
  profile:    'profile',
}

const SCREEN_TO_NAV_TAB: Partial<Record<Screen, NavTab>> = {
  home:       'home',
  gigs:       'gigs',
  gacha:      'gacha',
  collection: 'collection',
  profile:    'profile',
}

// Screens that get the bottom nav
const NAV_SCREENS = new Set<Screen>(['home', 'gigs', 'gacha', 'collection', 'profile', 'routes', 'shop', 'career'])

// ─── Tier palette ─────────────────────────────────────────────────────────────

const TIER_PALETTE: Record<number, { primary: string; accent: string; dim: string; muted: string }> = {
  1: { primary: '#D4A847', accent: '#F5EDD6', dim: '#7a5c1e', muted: '#9a7030' },
  2: { primary: '#8B2E4A', accent: '#C4858F', dim: '#4a1328', muted: '#6b1e3a' },
  3: { primary: '#3A5F8A', accent: '#8AAFC4', dim: '#1e3a5a', muted: '#2d5473' },
  4: { primary: '#C9A84C', accent: '#F0E6C8', dim: '#7a6220', muted: '#9a7d32' },
  5: { primary: '#B22222', accent: '#E8E0E0', dim: '#7a1010', muted: '#991515' },
  6: { primary: '#C0C0C0', accent: '#F8F8FF', dim: '#808080', muted: '#a0a0a0' },
}

function useTierTheme(careerTier: number) {
  useEffect(() => {
    const palette = TIER_PALETTE[careerTier] ?? TIER_PALETTE[1]
    const root = document.documentElement
    root.style.setProperty('--tier-primary', palette.primary)
    root.style.setProperty('--tier-accent',  palette.accent)
    root.style.setProperty('--tier-dim',     palette.dim)
    root.style.setProperty('--tier-muted',   palette.muted)
    root.setAttribute('data-tier', String(careerTier))
  }, [careerTier])
}

// ─── Reconnect handler ────────────────────────────────────────────────────────

function useReconnectSync(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return
    const handler = () => flushOfflineQueue(userId)
    window.addEventListener('online', handler)
    return () => window.removeEventListener('online', handler)
  }, [userId])
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const careerTier = useGigStore((s) => s.careerTier)
  const auth = useAuth()
  const online = useOnlineStatus()
  const reduced = useReducedMotion()

  // ─── Global scandal 100 lockscreen ────────────────────────────────────────
  const scandalLevel = usePlayerStore((s) => s.stats.scandal)
  const pendingScandalEvents = usePlayerStore((s) => s.pendingScandalEvents)
  const dismissScandalEvent = usePlayerStore((s) => s.dismissScandalEvent)
  const applyStatDeltas = usePlayerStore((s) => s.applyStatDeltas)
  const addFiredTwist = useProgressStore((s) => s.addFiredTwist)
  const firedTwists = useProgressStore((s) => s.firedTwists)

  const maxScandalTwist = useMemo(() => {
    if (scandalLevel < 100) return null
    const threshold = pendingScandalEvents[0] ?? null
    if (!threshold) return null
    return selectTwist(threshold, firedTwists)
  }, [scandalLevel, pendingScandalEvents, firedTwists])

  const handleMaxScandalResolve = useCallback(
    (twistId: string, choiceId?: string) => {
      if (!maxScandalTwist) return
      let finalPenalty: Partial<Record<string, number>>
      if (choiceId && maxScandalTwist.choices) {
        const choice = maxScandalTwist.choices.find((c) => c.id === choiceId)
        finalPenalty = choice ? choice.statDeltas : maxScandalTwist.baseStatPenalty
      } else {
        finalPenalty = maxScandalTwist.baseStatPenalty
      }
      const deltas: StatDelta[] = Object.entries(finalPenalty)
        .filter(([key, delta]) => VALID_STAT_KEYS.has(key) && delta !== 0)
        .map(([stat, delta]) => ({ stat: stat as StatKey, delta: delta! }))
      if (deltas.length > 0) applyStatDeltas(deltas)
      addFiredTwist(twistId)
      dismissScandalEvent()
    },
    [maxScandalTwist, applyStatDeltas, addFiredTwist, dismissScandalEvent]
  )

  // ─── Stage unlock reward drain ────────────────────────────────────────────
  const pendingStageUnlocks = useRosterStore((s) => s.pendingStageUnlocks)
  const dismissStageUnlock = useRosterStore((s) => s.dismissStageUnlock)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)

  useEffect(() => {
    if (pendingStageUnlocks.length === 0) return
    const unlock = pendingStageUnlocks[0]
    grantCurrency('spotlight', unlock.spotlightReward, `stage_unlock_${unlock.stage}`)
    dismissStageUnlock()
  }, [pendingStageUnlocks, grantCurrency, dismissStageUnlock])

  useTierTheme(careerTier)
  useReconnectSync(auth.user?.id)

  function go(s: Screen) {
    setScreen(s)
  }

  function handleNavTab(tab: NavTab) {
    go(NAV_TAB_TO_SCREEN[tab])
  }

  const activeNavTab = SCREEN_TO_NAV_TAB[screen]
  const showBottomNav = NAV_SCREENS.has(screen)

  // Auth loading splash
  if (auth.state === 'loading') {
    return (
      <div className="min-h-svh bg-slate-950 flex items-center justify-center">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-white/40 text-sm"
        >
          Loading…
        </motion.p>
      </div>
    )
  }

  // Auth screen (unauthenticated — but allow local play from MainMenu)
  if (auth.state === 'unauthenticated' && screen === 'menu') {
    // Show MainMenu first; user can sign in from profile or play locally
  }

  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.18 }

  return (
    <>
      <ToastProvider />
      <OfflineBanner online={online} />

      {/* Scandal 100 fullscreen lockscreen — rendered at App level, above all screens */}
      <BreakingNews
        twist={maxScandalTwist}
        scandalLevel={scandalLevel}
        stackCount={Math.max(0, pendingScandalEvents.length - 1)}
        onResolve={handleMaxScandalResolve}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="min-h-svh"
          style={showBottomNav ? { paddingBottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' } : undefined}
        >
          <ErrorBoundary>
            <Suspense fallback={<ScreenSkeleton />}>

              {screen === 'menu' && (
                <MainMenu onStart={() => go('home')} />
              )}

              {screen === 'home' && (
                <Home
                  onGoToGacha={() => go('gacha')}
                  onGoToRoutes={() => go('routes')}
                  onGoToShop={() => go('shop')}
                  onGoToProfile={() => go('profile')}
                  onGoToGigs={() => go('gigs')}
                  onGoToCareer={() => go('career')}
                  onGoToCollection={() => go('collection')}
                  onGoToApartment={() => go('apartment')}
                />
              )}

              {screen === 'gacha' && (
                <GachaScreen onBack={() => go('home')} />
              )}

              {screen === 'routes' && (
                <RouteScreen onBack={() => go('home')} />
              )}

              {screen === 'shop' && (
                <ShopScreen
                  onBack={() => go('home')}
                  onGoToGacha={() => go('gacha')}
                />
              )}

              {screen === 'profile' && (
                <ProfileScreen
                  onBack={() => go('home')}
                  auth={auth}
                />
              )}

              {screen === 'collection' && (
                <CollectionScreen
                  onBack={() => go('home')}
                  onGoToRoutes={() => go('routes')}
                />
              )}

              {screen === 'gigs' && (
                <Gigs onBack={() => go('home')} />
              )}

              {screen === 'career' && (
                <Career onBack={() => go('home')} />
              )}

              {screen === 'apartment' && (
                <ApartmentScreen onBack={() => go('home')} />
              )}

            </Suspense>
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation — shown on main screens */}
      {showBottomNav && (
        <BottomNav
          active={activeNavTab ?? 'home'}
          onNavigate={handleNavTab}
        />
      )}
    </>
  )
}
