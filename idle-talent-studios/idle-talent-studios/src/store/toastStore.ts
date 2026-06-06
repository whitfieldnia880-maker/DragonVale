import { create } from 'zustand'

export type ToastVariant =
  | 'spotlight'   // gold
  | 'prestige'    // crimson
  | 'affection'   // pink
  | 'scandal'     // red pulse
  | 'new_pull'    // platinum shimmer
  | 'achievement' // purple
  | 'info'        // neutral

export interface Toast {
  id: string
  variant: ToastVariant
  message: string
  icon?: string
  durationMs?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts.slice(-4), // max 5 on screen
        { ...toast, id: crypto.randomUUID() },
      ],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// Convenience factory
export function useToast() {
  const addToast = useToastStore((s) => s.addToast)

  return {
    spotlight: (amount: number) =>
      addToast({ variant: 'spotlight', icon: '✨', message: `+${amount} Spotlight` }),
    prestige: (amount: number) =>
      addToast({ variant: 'prestige', icon: '💎', message: `+${amount} Prestige` }),
    affection: (name: string, delta: number) =>
      addToast({ variant: 'affection', icon: '♥', message: `${name} +${delta}` }),
    scandal: (delta: number) =>
      addToast({ variant: 'scandal', icon: '📰', message: `Scandal +${delta}` }),
    newPull: (name: string, rarity: string) =>
      addToast({ variant: 'new_pull', icon: '🎴', message: `New: ${name} (${rarity})`, durationMs: 4000 }),
    achievement: (label: string) =>
      addToast({ variant: 'achievement', icon: '🏆', message: label, durationMs: 5000 }),
    info: (message: string) =>
      addToast({ variant: 'info', message }),
  }
}
