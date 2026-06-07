import { create } from 'zustand'

export type ToastVariant =
  | 'spotlight'       // gold — currency gain
  | 'prestige'        // crimson — prestige / bond
  | 'affection'       // rose — relationship milestone
  | 'scandal'         // red pulse — scandal increase
  | 'new_character'   // platinum shimmer — first pull of new char
  | 'daily_reward'    // teal — login reward claim
  | 'streak_milestone'// orange — streak bonus
  | 'achievement'     // purple — achievement unlock
  | 'info'            // neutral

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

const MAX_VISIBLE = 3

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => {
      const next = [...state.toasts, { ...toast, id: crypto.randomUUID() }]
      // Keep only the last MAX_VISIBLE toasts; oldest falls off the stack
      return { toasts: next.slice(-MAX_VISIBLE) }
    }),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// ─── Convenience factory ──────────────────────────────────────────────────────

export function useToast() {
  const addToast = useToastStore((s) => s.addToast)

  return {
    spotlight: (amount: number) =>
      addToast({ variant: 'spotlight', icon: '✨', message: `+${amount} Spotlight` }),

    prestige: (amount: number) =>
      addToast({ variant: 'prestige', icon: '💎', message: `+${amount} Prestige` }),

    affection: (name: string, stage: string) =>
      addToast({ variant: 'affection', icon: '♥', message: `${name} — ${stage}` }),

    scandal: (delta: number) =>
      addToast({ variant: 'scandal', icon: '📸', message: `Scandal +${delta}` }),

    newCharacter: (name: string, rarity: string) =>
      addToast({
        variant: 'new_character',
        icon: '⭐',
        message: `New: ${name} (${rarity})`,
        durationMs: 4000,
      }),

    dailyReward: (label: string) =>
      addToast({ variant: 'daily_reward', icon: '🎁', message: label }),

    streakMilestone: (days: number) =>
      addToast({
        variant: 'streak_milestone',
        icon: '🔥',
        message: `${days}-day streak!`,
        durationMs: 4000,
      }),

    achievement: (name: string, icon: string) =>
      addToast({
        variant: 'achievement',
        icon,
        message: `Achievement: ${name}`,
        durationMs: 5000,
      }),

    bondFragment: (characterName: string) =>
      addToast({ variant: 'prestige', icon: '💎', message: `Bond fragment — ${characterName}` }),

    endingComplete: (label: string, prestige: number) =>
      addToast({
        variant: 'prestige',
        icon: '💎',
        message: `${label} +${prestige} Prestige`,
        durationMs: 4000,
      }),

    info: (message: string) =>
      addToast({ variant: 'info', message }),
  }
}
