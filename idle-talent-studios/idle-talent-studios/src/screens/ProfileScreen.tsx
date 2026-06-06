import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import { useRosterStore } from '@/store/rosterStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProgressStore } from '@/store/progressStore'
import { useAchievementStore } from '@/store/achievementStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useSaveStore } from '@/systems/saveSystem'
import { StatsPanel } from '@/components/StatsPanel'
import { getScandalLevel } from '@/systems/scandal'
import { ALL_CHARACTERS } from '@/data/characters'
import { ACHIEVEMENTS } from '@/data/achievements'
import type { AuthContext } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface ProfileScreenProps {
  onBack: () => void
  auth: AuthContext
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ENDING_ICONS: Record<string, string> = {
  true: '⭐', good: '💛', heartbreak: '💔', secret: '🔮',
}
const ENDING_COLORS: Record<string, string> = {
  true: '#f59e0b', good: '#10b981', heartbreak: '#f43f5e', secret: '#a855f7',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</h2>
      <div className="bg-[hsl(var(--card))] rounded-2xl p-4 border border-white/10">
        {children}
      </div>
    </div>
  )
}

function Chip({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-mono font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className="flex items-center justify-between w-full group"
    >
      <span className="text-sm text-white/70">{label}</span>
      <div
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          enabled ? 'bg-pink-600' : 'bg-white/15'
        )}
      >
        <motion.div
          layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
          animate={{ left: enabled ? '1.4rem' : '0.25rem' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </div>
    </button>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'stats' | 'endings' | 'achievements' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'stats',        label: 'Stats' },
  { id: 'endings',      label: 'Endings' },
  { id: 'achievements', label: 'Awards' },
  { id: 'settings',     label: 'Settings' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ProfileScreen({ onBack, auth }: ProfileScreenProps) {
  const [tab, setTab] = useState<Tab>('stats')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const stats = usePlayerStore((s) => s.stats)
  const playerName = usePlayerStore((s) => s.playerName)
  const currentDay = usePlayerStore((s) => s.currentDay)
  const currentChapter = usePlayerStore((s) => s.currentChapter)
  const owned = useRosterStore((s) => s.owned)
  const pity = useRosterStore((s) => s.pity)
  const balance = useCurrencyStore((s) => s.balance)
  const endingsUnlocked = useProgressStore((s) => s.endingsUnlocked)
  const unlockedAchievements = useAchievementStore((s) => s.unlocked)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled)
  const toggleSound = useSettingsStore((s) => s.toggleSound)
  const toggleNotifications = useSettingsStore((s) => s.toggleNotifications)
  const lastSavedAt = useSaveStore((s) => s.lastSavedAt)
  const isSaving = useSaveStore((s) => s.isSaving)

  const ownedById = Object.fromEntries(owned.map((c) => [c.id, c]))
  const ssrCount = owned.filter((c) => c.rarity === 'SSR').length

  const unlockedKeys = new Set(unlockedAchievements.map((u) => u.key))

  return (
    <div className="min-h-svh bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 flex items-center gap-3 px-5 py-4">
        <button onClick={onBack} aria-label="Go back" className="text-white/50 hover:text-white text-xl leading-none">←</button>
        <h1 className="text-base font-semibold text-white flex-1">Profile</h1>
        {isSaving && (
          <span className="text-[10px] text-white/30 animate-pulse">Saving…</span>
        )}
        {!isSaving && lastSavedAt && (
          <span className="text-[10px] text-white/20">
            Saved {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Identity card */}
        <div className="px-5 pt-5 pb-3">
          <div className="bg-[hsl(var(--card))] rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/10"
                style={{ background: 'linear-gradient(135deg, #4c0519 0%, #1e0730 100%)' }}
              >
                🎬
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-base">{playerName}</p>
                <p className="text-xs text-white/40">
                  Day {currentDay} · Ch.{currentChapter} · {getScandalLevel(stats.scandal)}
                </p>
                {auth.user && (
                  <p className="text-[10px] text-white/25 mt-0.5 truncate">{auth.user.email}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black" style={{ color: 'var(--tier-primary, #f59e0b)' }}>
                  Tier {Math.min(6, Math.ceil(currentChapter / 10))}
                </p>
                <p className="text-[10px] text-white/30">{unlockedAchievements.length}/{ACHIEVEMENTS.length} awards</p>
              </div>
            </div>

            {/* Currency row */}
            <div className="flex gap-6 mt-4 pt-4 border-t border-white/8">
              <Chip icon="✨" label="Spotlight" value={balance.spotlight} />
              <Chip icon="💎" label="Prestige"  value={balance.prestige} />
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-5 pb-3 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-selected={tab === t.id}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors',
                tab === t.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-5 pb-8 space-y-4"
          >
            {/* ── STATS ── */}
            {tab === 'stats' && (
              <>
                <Section title="Stats">
                  <StatsPanel stats={stats} />
                </Section>
                <Section title="Gacha">
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="Total Pulls"    value={pity.totalPulls} />
                    <InfoRow label="Pity Counter"   value={`${pity.pullsSinceLastSSR}/90`} />
                    <InfoRow label="Characters"     value={`${owned.length}/${ALL_CHARACTERS.length}`} />
                    <InfoRow label="SSRs Owned"     value={ssrCount} />
                  </div>
                </Section>
              </>
            )}

            {/* ── ENDINGS ── */}
            {tab === 'endings' && (
              <div className="space-y-2">
                {endingsUnlocked.length === 0 ? (
                  <div className="bg-[hsl(var(--card))] rounded-2xl p-8 border border-white/10 text-center">
                    <p className="text-4xl mb-3">🎭</p>
                    <p className="text-sm text-white/30">Complete a character route to unlock your first ending.</p>
                  </div>
                ) : (
                  endingsUnlocked.map((ending) => {
                    const character = ownedById[ending.characterId]
                    return (
                      <div
                        key={`${ending.characterId}-${ending.endingType}`}
                        className="bg-[hsl(var(--card))] rounded-2xl px-4 py-3 border border-white/10 flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: `${ENDING_COLORS[ending.endingType] ?? '#ffffff'}22` }}
                          aria-hidden="true"
                        >
                          {character?.portraitPlaceholder ?? '🎴'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-white truncate">
                              {character?.name ?? ending.characterId}
                            </span>
                            <span
                              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                              style={{
                                background: `${ENDING_COLORS[ending.endingType] ?? '#ffffff'}22`,
                                color: ENDING_COLORS[ending.endingType] ?? '#ffffff',
                              }}
                            >
                              {ENDING_ICONS[ending.endingType]} {ending.endingType}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 truncate">{ending.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-mono font-bold text-amber-400">+{ending.prestigeEarned} 💎</p>
                          <p className="text-[10px] text-white/25">
                            {new Date(ending.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* ── ACHIEVEMENTS ── */}
            {tab === 'achievements' && (
              <div className="space-y-2">
                {ACHIEVEMENTS.map((a) => {
                  const done = unlockedKeys.has(a.key)
                  const unlocked = unlockedAchievements.find((u) => u.key === a.key)
                  return (
                    <div
                      key={a.key}
                      className={cn(
                        'rounded-2xl px-4 py-3 border flex items-start gap-3 transition-opacity',
                        done
                          ? 'bg-[hsl(var(--card))] border-white/15'
                          : 'bg-white/3 border-white/5 opacity-50'
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          background: done ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)',
                        }}
                        aria-hidden="true"
                      >
                        {done ? a.icon : '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-semibold', done ? 'text-white' : 'text-white/40')}>
                          {a.name}
                        </p>
                        <p className="text-xs text-white/30 leading-snug">{a.description}</p>
                        {done && unlocked && (
                          <p className="text-[10px] text-purple-400 mt-0.5">
                            {new Date(unlocked.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {a.reward.prestige && (
                          <p className="text-xs text-amber-400 font-bold">💎{a.reward.prestige}</p>
                        )}
                        {a.reward.spotlight && (
                          <p className="text-xs text-yellow-400 font-bold">✨{a.reward.spotlight}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── SETTINGS ── */}
            {tab === 'settings' && (
              <div className="space-y-3">
                <div className="bg-[hsl(var(--card))] rounded-2xl p-4 border border-white/10 space-y-4">
                  <Toggle
                    label="Sound effects"
                    enabled={soundEnabled}
                    onToggle={toggleSound}
                  />
                  <div className="h-px bg-white/8" />
                  <Toggle
                    label="Notifications"
                    enabled={notificationsEnabled}
                    onToggle={toggleNotifications}
                  />
                </div>

                {/* Save status */}
                <div className="bg-[hsl(var(--card))] rounded-2xl p-4 border border-white/10 space-y-2">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Save Status</p>
                  <p className="text-sm text-white/60">
                    {isSaving
                      ? 'Saving…'
                      : lastSavedAt
                      ? `Last saved: ${new Date(lastSavedAt).toLocaleString()}`
                      : 'Not yet saved to cloud'}
                  </p>
                  {auth.state !== 'authenticated' && (
                    <p className="text-xs text-amber-400">Sign in to enable cloud saves.</p>
                  )}
                </div>

                {/* Account */}
                {auth.state === 'authenticated' ? (
                  <div className="bg-[hsl(var(--card))] rounded-2xl p-4 border border-white/10 space-y-3">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Account</p>
                    <p className="text-sm text-white/60 truncate">{auth.user?.email}</p>
                    {showLogoutConfirm ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { auth.signOut(); setShowLogoutConfirm(false) }}
                          className="flex-1 py-2.5 rounded-xl bg-rose-900/50 border border-rose-500/40 text-rose-300 text-sm font-semibold"
                          aria-label="Confirm sign out"
                        >
                          Confirm Sign Out
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white/50 text-sm"
                          aria-label="Cancel sign out"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-semibold"
                        aria-label="Sign out"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-[hsl(var(--card))] rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-white/40 mb-2">Playing locally. Sign in to sync progress.</p>
                    <p className="text-sm text-pink-400">Sign in via the main menu.</p>
                  </div>
                )}

                <p className="text-center text-[10px] text-white/15 pt-2">
                  Idle Talent Studios · v0.9 · {new Date().getFullYear()}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
