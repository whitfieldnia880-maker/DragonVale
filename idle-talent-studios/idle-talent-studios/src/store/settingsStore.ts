import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  soundEnabled: boolean
  notificationsEnabled: boolean
  toggleSound: () => void
  toggleNotifications: () => void
  setSoundEnabled: (v: boolean) => void
  setNotificationsEnabled: (v: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      notificationsEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
    }),
    { name: 'its-settings' }
  )
)
