import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/store/progressStore'
import { useGigStore } from '@/store/gigStore'
import { Sounds } from '@/systems/soundStubs'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type NavTab = 'home' | 'gigs' | 'gacha' | 'collection' | 'profile'

interface BottomNavProps {
  active: NavTab
  onNavigate: (tab: NavTab) => void
}

const TABS: { id: NavTab; icon: string; label: string }[] = [
  { id: 'home',       icon: '🏠', label: 'Home' },
  { id: 'gigs',       icon: '🎬', label: 'Gigs' },
  { id: 'gacha',      icon: '🎴', label: 'Gacha' },
  { id: 'collection', icon: '⭐', label: 'Cast' },
  { id: 'profile',    icon: '👤', label: 'Profile' },
]

function haptic() {
  if ('vibrate' in navigator) navigator.vibrate(8)
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-rose-500 flex items-center justify-center"
    >
      <span className="text-[9px] font-bold text-white leading-none px-1">
        {count > 9 ? '9+' : count}
      </span>
    </motion.div>
  )
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const pendingEvents = useProgressStore((s) => s.pendingCharacterEvents)
  const reduced = useReducedMotion()

  const gigBadge = useGigStore((s) => (s.pendingOutcome ? 1 : 0))

  const badges: Partial<Record<NavTab, number>> = {
    home: pendingEvents.length,
    gigs: gigBadge,
  }

  function handleTab(tab: NavTab) {
    if (tab === active) return
    haptic()
    Sounds.ui.tabSwitch()
    onNavigate(tab)
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-14">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          const badge = badges[tab.id] ?? 0

          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-opacity',
                isActive ? 'opacity-100' : 'opacity-45 hover:opacity-65'
              )}
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 inset-x-3 h-0.5 rounded-full"
                  style={{ background: 'var(--tier-accent, #e879f9)' }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 380 }}
                />
              )}

              {/* Icon with badge */}
              <div className="relative">
                <span
                  className="text-lg leading-none"
                  style={isActive ? { filter: 'drop-shadow(0 0 6px var(--tier-accent, #e879f9))' } : undefined}
                >
                  {tab.icon}
                </span>
                <Badge count={badge} />
              </div>

              {/* Label */}
              <span
                className="text-[9px] font-semibold tracking-wide"
                style={isActive ? { color: 'var(--tier-accent, #e879f9)' } : undefined}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
