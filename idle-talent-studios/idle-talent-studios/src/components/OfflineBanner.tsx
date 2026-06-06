import { motion, AnimatePresence } from 'framer-motion'

export function OfflineBanner({ online }: { online: boolean }) {
  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="fixed top-0 inset-x-0 z-[190] flex items-center justify-center gap-2 px-4 py-2 bg-amber-950/95 border-b border-amber-500/40 backdrop-blur-sm"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 8px)' }}
          role="alert"
          aria-live="assertive"
        >
          <span className="text-sm">📡</span>
          <p className="text-xs font-semibold text-amber-300">You're offline. Progress saves locally.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
