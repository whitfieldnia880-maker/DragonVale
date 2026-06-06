import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ActiveGig } from '@/systems/gigSystem'
import { selectActiveGigProgress, selectGigById } from '@/store/gigStore'

interface ActiveGigBarProps {
  activeGig: ActiveGig | null
  currentDay: number
  tierColor: string
  onComplete: () => void
  onGigsScreenTap: () => void
}

export function ActiveGigBar({
  activeGig,
  currentDay,
  tierColor,
  onComplete,
  onGigsScreenTap,
}: ActiveGigBarProps) {
  if (!activeGig) {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onGigsScreenTap}
        className="w-full flex items-center gap-3 rounded-xl bg-white/4 border border-white/8 px-4 py-3 text-left transition-all hover:bg-white/6"
      >
        <span className="text-base">🎬</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white/60">No active gig</p>
          <p className="text-[10px] text-white/30">Tap to browse offers →</p>
        </div>
      </motion.button>
    )
  }

  const gig = selectGigById(activeGig.gigId)
  const { progress, isComplete, daysLeft } = selectActiveGigProgress(activeGig, currentDay)

  return (
    <div
      className="rounded-xl border px-4 py-3 space-y-2"
      style={{ borderColor: `${tierColor}30`, backgroundColor: `${tierColor}08` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white leading-tight truncate">
            {gig?.title ?? 'Active Gig'}
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">
            {isComplete ? 'Ready to complete' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </p>
        </div>
        {isComplete && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
            className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: `${tierColor}40`, borderColor: `${tierColor}60` }}
          >
            Collect →
          </motion.button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: isComplete ? tierColor : `${tierColor}80` }}
        />
      </div>
    </div>
  )
}
