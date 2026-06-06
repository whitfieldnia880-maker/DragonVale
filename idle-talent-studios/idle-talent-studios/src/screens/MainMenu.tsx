import { motion } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'

interface MainMenuProps {
  onStart: () => void
}

export function MainMenu({ onStart }: MainMenuProps) {
  const playerName = usePlayerStore((s) => s.playerName)
  const hasProgress = usePlayerStore((s) => s.currentChapter > 1 || s.storyFlags['ch1_complete'])

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-slate-950 via-indigo-950 to-pink-950">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-8 w-full max-w-xs"
      >
        <div className="space-y-2">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl"
          >
            🎬
          </motion.div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Idle Talent Studios
          </h1>
          <p className="text-sm text-white/50">
            The spotlight is waiting. So is everyone else.
          </p>
        </div>

        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-base shadow-lg shadow-pink-600/30"
          >
            {hasProgress ? `Continue as ${playerName}` : 'Begin Your Story'}
          </motion.button>

          {hasProgress && (
            <button
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
              onClick={() => {
                if (confirm('Start over? All progress will be lost.')) {
                  usePlayerStore.getState().resetGame()
                }
              }}
            >
              New Game
            </button>
          )}
        </div>

        <p className="text-[10px] text-white/20">v0.1.0 · Early Access</p>
      </motion.div>
    </div>
  )
}
