import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore, type Toast, type ToastVariant } from '@/store/toastStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const DEFAULT_DURATION = 3000

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; text: string; glow?: string }
> = {
  spotlight:   { bg: '#1c1400',   border: '#f59e0b55', text: '#fbbf24', glow: '#f59e0b30' },
  prestige:    { bg: '#1a0008',   border: '#be123c55', text: '#fb7185', glow: '#be123c30' },
  affection:   { bg: '#1a0014',   border: '#e879f955', text: '#f0abfc', glow: '#e879f930' },
  scandal:     { bg: '#1a0000',   border: '#ef444455', text: '#fca5a5', glow: '#ef444430' },
  new_pull:    { bg: '#0d1117',   border: '#cbd5e155', text: '#e2e8f0', glow: '#cbd5e130' },
  achievement: { bg: '#0d0018',   border: '#a855f755', text: '#c084fc', glow: '#a855f730' },
  info:        { bg: '#0f172a',   border: '#ffffff22', text: '#cbd5e1' },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const reduced = useReducedMotion()
  const style = VARIANT_STYLES[toast.variant]
  const duration = toast.durationMs ?? DEFAULT_DURATION

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <motion.div
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      onClick={onDismiss}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl cursor-pointer select-none border shadow-lg"
      style={{
        background: style.bg,
        borderColor: style.border,
        boxShadow: style.glow ? `0 4px 24px ${style.glow}` : undefined,
      }}
      // Scandal toast pulses the border
      {...(toast.variant === 'scandal' && !reduced ? {
        animate: {
          opacity: 1, y: 0, scale: 1,
          borderColor: ['#ef444455', '#ef4444aa', '#ef444455'],
        },
        transition: { borderColor: { duration: 0.8, repeat: Infinity } },
      } : {})}
    >
      {toast.icon && (
        <span className="text-base leading-none flex-shrink-0">{toast.icon}</span>
      )}
      <p className="text-sm font-semibold leading-tight" style={{ color: style.text }}>
        {toast.message}
      </p>
    </motion.div>
  )
}

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts)
  const dismissToast = useToastStore((s) => s.dismissToast)

  return (
    <div
      className="fixed top-0 inset-x-0 z-[200] flex flex-col items-center gap-2 px-4 pointer-events-none"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
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
