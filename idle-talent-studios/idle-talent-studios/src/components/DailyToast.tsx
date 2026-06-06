import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DailyToastProps {
  visible: boolean
  dayNumber: number
  spotlightGranted: number
  loginStreak: number
  onDismiss: () => void
}

export function DailyToast({
  visible,
  dayNumber,
  spotlightGranted,
  loginStreak,
  onDismiss,
}: DailyToastProps) {
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [visible, onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          onClick={onDismiss}
          className="fixed top-4 left-4 right-4 z-[90] max-w-sm mx-auto cursor-pointer"
        >
          <div className="bg-slate-900 border border-white/15 rounded-2xl px-4 py-3.5 shadow-xl shadow-black/40 flex items-center gap-3">
            <div className="text-2xl">🌅</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Day {dayNumber} begins</p>
              <p className="text-xs text-white/50 mt-0.5">
                +{spotlightGranted} ✨
                {loginStreak > 1 && (
                  <span className="ml-2 text-orange-400">
                    {loginStreak}🔥 streak
                  </span>
                )}
              </p>
            </div>
            <div className="text-white/25 text-xs">tap</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
