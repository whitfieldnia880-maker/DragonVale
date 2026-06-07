import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useInventoryStore } from '@/store/inventoryStore'
import {
  getLoginItem,
  getNextMilestoneStreak,
  DAILY_LOGIN_ITEMS,
} from '@/systems/dailyReset'
import type { LoginItem } from '@/systems/dailyReset'
import { syncDailyRewardClaim } from '@/systems/saveSystem'

interface DailyRewardProps {
  currentDay: number
  loginStreak: number
}

export function DailyReward({ currentDay, loginStreak }: DailyRewardProps) {
  const lastClaimedLoginDay = useInventoryStore((s) => s.lastClaimedLoginDay)
  const setLastClaimedLoginDay = useInventoryStore((s) => s.setLastClaimedLoginDay)
  const addPullTickets = useInventoryStore((s) => s.addPullTickets)
  const addScandalReducer = useInventoryStore((s) => s.addScandalReducer)
  const addWardrobeItem = useInventoryStore((s) => s.addWardrobeItem)
  const grantCurrency = useCurrencyStore((s) => s.grantCurrency)
  const setEnergy = usePlayerStore((s) => s.setEnergy)
  const energy = usePlayerStore((s) => s.energy)

  const [animatingItem, setAnimatingItem] = useState<LoginItem | null>(null)
  const [justClaimed, setJustClaimed] = useState(false)

  const todayItem = getLoginItem(currentDay)
  const alreadyClaimed = lastClaimedLoginDay >= currentDay
  const nextMilestone = getNextMilestoneStreak(loginStreak)

  const handleClaim = useCallback(() => {
    if (alreadyClaimed) return
    const item = getLoginItem(currentDay)

    switch (item.type) {
      case 'pull_ticket':
        addPullTickets('standard', item.amount)
        break
      case 'sr_ticket':
        addPullTickets('sr', item.amount)
        break
      case 'ssr_ticket':
        addPullTickets('ssr', item.amount)
        break
      case 'spotlight':
        grantCurrency('spotlight', item.amount, 'daily_login_item')
        break
      case 'prestige':
        grantCurrency('prestige', item.amount, 'daily_login_item')
        break
      case 'energy':
        setEnergy(Math.min(100, energy + item.amount))
        break
      case 'wardrobe_common':
        addWardrobeItem(`daily_reward_common_d${currentDay}`)
        break
      case 'wardrobe_rare':
        addWardrobeItem(`daily_reward_rare_d${currentDay}`)
        break
      case 'wardrobe_epic':
        addWardrobeItem(`daily_reward_epic_d${currentDay}`)
        break
      case 'wardrobe_legendary':
        addWardrobeItem(`daily_reward_legendary_d${currentDay}`)
        break
      case 'scandal_reducer':
        addScandalReducer(item.amount)
        break
      case 'bond_fragment':
        break
    }

    setLastClaimedLoginDay(currentDay)
    setAnimatingItem(item)
    setJustClaimed(true)
    setTimeout(() => setAnimatingItem(null), 1800)

    const playerId = usePlayerStore.getState().playerId
    if (playerId) {
      void syncDailyRewardClaim(playerId, currentDay, item.type, item.amount)
    }
  }, [
    alreadyClaimed,
    currentDay,
    energy,
    addPullTickets,
    addScandalReducer,
    addWardrobeItem,
    grantCurrency,
    setEnergy,
    setLastClaimedLoginDay,
  ])

  const cycleStartDay = currentDay - ((currentDay - 1) % 7)

  return (
    <div className="relative rounded-xl bg-[hsl(var(--card))] border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-base">🎁</span>
          <span className="text-xs font-semibold text-white">Daily Reward</span>
        </div>
        <div className="flex items-center gap-1.5">
          {loginStreak > 1 && (
            <span className="text-xs font-bold text-orange-400">{loginStreak}🔥</span>
          )}
          {nextMilestone && (
            <span className="text-[10px] text-white/30">→ Day {nextMilestone}</span>
          )}
        </div>
      </div>

      {/* 7-day strip */}
      <div className="flex gap-1.5 px-3 py-3 overflow-x-auto scrollbar-none">
        {DAILY_LOGIN_ITEMS.map((item, i) => {
          const dayNum = cycleStartDay + i
          const isPast = dayNum < currentDay || (dayNum === currentDay && alreadyClaimed)
          const isToday = dayNum === currentDay && !alreadyClaimed
          const isFuture = dayNum > currentDay

          return (
            <motion.div
              key={item.daySlot}
              className={[
                'flex-shrink-0 flex flex-col items-center gap-1 rounded-lg px-2 py-2 w-[52px] border',
                isToday
                  ? 'bg-pink-500/15 border-pink-400/40'
                  : isPast
                  ? 'bg-white/4 border-white/5'
                  : 'bg-white/3 border-white/5',
              ].join(' ')}
              animate={isToday ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className={[
                  'text-xl leading-none',
                  isFuture ? 'opacity-30' : isPast ? 'opacity-50 grayscale' : '',
                ].join(' ')}
              >
                {isPast && dayNum < currentDay ? '✓' : item.emoji}
              </span>
              <span
                className={[
                  'text-[9px] font-semibold text-center leading-tight',
                  isToday ? 'text-pink-300' : 'text-white/30',
                ].join(' ')}
              >
                Day {item.daySlot}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Claim row */}
      <div className="px-4 pb-3.5 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[11px] text-white/50 truncate">
            {alreadyClaimed
              ? `Claimed: ${todayItem.label}`
              : `Today: ${todayItem.label}`}
          </p>
          {nextMilestone && (
            <p className="text-[10px] text-white/25 mt-0.5">
              Milestone in {nextMilestone - loginStreak} day{nextMilestone - loginStreak !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <motion.button
          whileTap={alreadyClaimed ? {} : { scale: 0.94 }}
          onClick={handleClaim}
          disabled={alreadyClaimed}
          className={[
            'ml-3 shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
            alreadyClaimed
              ? 'bg-white/8 text-white/25 cursor-default'
              : 'bg-teal-500/20 border border-teal-400/40 text-teal-300 hover:bg-teal-500/30',
          ].join(' ')}
        >
          {alreadyClaimed ? 'Claimed ✓' : 'Claim 🎁'}
        </motion.button>
      </div>

      {/* Unboxing animation overlay */}
      <AnimatePresence>
        {animatingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 8 }}
              animate={{ scale: 1.2, opacity: 1, y: -8 }}
              exit={{ scale: 0.8, opacity: 0, y: -24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                {animatingItem.emoji}
              </span>
              <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full">
                {animatingItem.label}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
