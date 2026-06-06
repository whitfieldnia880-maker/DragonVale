export type CurrencyType = 'spotlight' | 'prestige'

export interface CurrencyBalance {
  spotlight: number
  prestige: number
}

export interface CurrencyTransaction {
  id: string
  type: CurrencyType
  amount: number
  direction: 'credit' | 'debit'
  source: string
  timestamp: string
}

export type PurchaseResult =
  | { success: true; balance: CurrencyBalance; transaction: CurrencyTransaction }
  | { success: false; reason: string }

export function canAfford(
  balance: CurrencyBalance,
  currency: CurrencyType,
  amount: number
): boolean {
  return balance[currency] >= amount
}

export function grant(
  balance: CurrencyBalance,
  currency: CurrencyType,
  amount: number,
  source: string
): { balance: CurrencyBalance; transaction: CurrencyTransaction } {
  const next = { ...balance, [currency]: balance[currency] + amount }
  const transaction: CurrencyTransaction = {
    id: crypto.randomUUID(),
    type: currency,
    amount,
    direction: 'credit',
    source,
    timestamp: new Date().toISOString(),
  }
  return { balance: next, transaction }
}

export function spend(
  balance: CurrencyBalance,
  currency: CurrencyType,
  amount: number,
  source: string
): PurchaseResult {
  if (!canAfford(balance, currency, amount)) {
    return {
      success: false,
      reason: `Insufficient ${currency}. Need ${amount}, have ${balance[currency]}.`,
    }
  }
  const next = { ...balance, [currency]: balance[currency] - amount }
  const transaction: CurrencyTransaction = {
    id: crypto.randomUUID(),
    type: currency,
    amount,
    direction: 'debit',
    source,
    timestamp: new Date().toISOString(),
  }
  return { success: true, balance: next, transaction }
}

export const PULL_COSTS = {
  single: { spotlight: 160, prestige: 1 },
  multi: { spotlight: 1500, prestige: 10 },
} as const
