import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore, type Toast, type ToastVariant } from '@/store/toastStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const DEFAULT_DURATION = 3000

// ─── Variant styles (spec colors) ────────────────────────────────────────────

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; text: string; glow?: string }
> = {
  // gold — ✨ Spotlight
  spotlight: {
    bg: '#1c1400',
    border: '#C9A84C55',
    text: '#C9A84C',
    glow: '#C9A84C22',
  },
  // crimson — 💎 Prestige / bond
  prestige: {
    bg: '#1a0008',
    border: '#B2222255',
    text: '#e87070',
    glow: '#B2222230',
  },
  // rose — ♥ Affection
  affection: {
    bg: '#1a0012',
    border: '#E8A0B055',
    text: '#E8A0B0',
    glow: '#E8A0B028',
  },
  // red pulse — 📸 Scandal
  scandal: {
    bg: '#1a0000',
    border: '#CC220055',
    text: '#ff9090',
    glow: '#CC220030',
  },
  // platinum shimmer — ⭐ New character
  new_character: {
    bg: '#0d0f14',
    border: '#C0C0C055',
    text: '#e8e8f0',
    glow: '#C0C0C020',
  },
  // teal — 🎁 Daily reward
  daily_reward: {
    bg: '#001a18',
    border: '#2A9D8F55',
    text: '#2A9D8F',
    glow: '#2A9D8F28',
  },
  // orange — 🔥 Streak milestone
  streak_milestone: {
    bg: '#1a0d00',
    border: '#E76F5155',
    text: '#E76F51',
    glow: '#E76F5128',
  },
  // purple — 🏆 Achievement
  achievement: {
    bg: '#0d0018',
    border: '#a855f755',
    text: '#c084fc',
    glow: '#a855f728',
  },
  // neutral — info
  info: {
    bg: '#0f172a',
    border: '#ffffff22',
    text: '#94a3b8',
  },
}

// ─── Single toast ─────────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const reduced = useReducedMotion()
  const style = VARIANT_STYLES[toast.variant]
  const duration = toast.durationMs ?? DEFAULT_DURATION

  const dismiss = useCallback(() => onDismiss(), [onDismiss])

  useEffect(() => {
    const timer = setTimeout(dismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, dismiss])

  const isScandal = toast.variant === 'scandal'
  const isNewChar = toast.variant === 'new_character'

  return (
    <motion.button
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
      animate={
        isScandal && !reduced
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              borderColor: ['#CC220055', '#CC2200aa', '#CC220055'],
            }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.95 }}
      transition={
        isScandal
          ? {
              opacity: { duration: 0.18 },
              y: { type: 'spring', damping: 22, stiffness: 300 },
              scale: { type: 'spring', damping: 22, stiffness: 300 },
              borderColor: { duration: 0.8, repeat: Infinity },
            }
          : { type: 'spring', damping: 22, stiffness: 300 }
      }
      onClick={dismiss}
      aria-label={`Dismiss: ${toast.message}`}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl cursor-pointer select-none border shadow-lg text-left"
      style={{
        background: isNewChar
          ? 'linear-gradient(135deg, #0d0f14 0%, #1a1c24 50%, #0d0f14 100%)'
          : style.bg,
        borderColor: style.border,
        boxShadow: style.glow ? `0 4px 24px ${style.glow}` : undefined,
      }}
    >
      {toast.icon && (
        <span className="text-base leading-none flex-shrink-0" aria-hidden="true">
          {toast.icon}
        </span>
      )}
      <p
        className="text-sm font-semibold leading-tight flex-1"
        style={{ color: style.text }}
      >
        {toast.message}
      </p>
    </motion.button>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts)
  const dismissToast = useToastStore((s) => s.dismissToast)

  return (
    <div
      className="fixed top-0 inset-x-0 z-[200] flex flex-col items-center gap-2 px-4 pointer-events-none"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
            <ToastItem
              toast={toast}
              onDismiss={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
