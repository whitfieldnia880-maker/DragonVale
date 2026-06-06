import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrencyBalance, CurrencyTransaction, CurrencyType } from '@/systems/currencyEngine'
import { grant, spend } from '@/systems/currencyEngine'

interface CurrencyStore {
  balance: CurrencyBalance
  history: CurrencyTransaction[]

  grantCurrency: (currency: CurrencyType, amount: number, source: string) => void
  spendCurrency: (
    currency: CurrencyType,
    amount: number,
    source: string
  ) => { success: boolean; reason?: string }
  canAfford: (currency: CurrencyType, amount: number) => boolean
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      balance: { spotlight: 300, prestige: 5 },
      history: [],

      grantCurrency: (currency, amount, source) =>
        set((state) => {
          const { balance, transaction } = grant(
            state.balance,
            currency,
            amount,
            source
          )
          return {
            balance,
            history: [transaction, ...state.history].slice(0, 200),
          }
        }),

      spendCurrency: (currency, amount, source) => {
        const state = get()
        const result = spend(state.balance, currency, amount, source)
        if (!result.success) return { success: false, reason: result.reason }
        set({
          balance: result.balance,
          history: [result.transaction, ...state.history].slice(0, 200),
        })
        return { success: true }
      },

      canAfford: (currency, amount) => get().balance[currency] >= amount,
    }),
    { name: 'its-currency' }
  )
)
