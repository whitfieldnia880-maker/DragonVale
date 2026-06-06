import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PlayerStats, StatKey } from '@/engine/gameState'
import { getStatLabel, getStatColor } from '@/engine/statEngine'

interface StatsPanelProps {
  stats: PlayerStats
  compact?: boolean
}

// Scandal first, then everything else
const STAT_KEYS_PRIMARY: StatKey[] = ['scandal']
const STAT_KEYS_REST: StatKey[] = ['confidence', 'looks', 'wisdom', 'reputation', 'money']

export function StatsPanel({ stats, compact = false }: StatsPanelProps) {
  return (
    <div className="space-y-2">
      {/* Scandal — always full-width and prominent */}
      <ScandalRow value={stats.scandal} compact={compact} />

      {/* Rest — 2-col grid */}
      <div className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {STAT_KEYS_REST.map((key) => (
          <StatRow key={key} statKey={key} value={stats[key]} compact={compact} />
        ))}
      </div>
    </div>
  )
}

function ScandalRow({ value, compact }: { value: number; compact: boolean }) {
  const color = getStatColor('scandal')
  const label = getStatLabel('scandal')
  const isHigh = value >= 75
  const isActive = value > 0

  return (
    <div
      className={cn(
        'rounded-lg px-3 py-2 transition-all duration-300',
        isHigh
          ? 'bg-red-950/60 border border-red-800/50 shadow-sm shadow-red-900/20'
          : isActive
          ? 'bg-red-950/30 border border-red-900/30'
          : 'bg-white/4 border border-white/6'
      )}
    >
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-semibold',
              isHigh ? 'text-red-300' : isActive ? 'text-red-400/80' : 'text-white/40'
            )}
          >
            {compact ? label.slice(0, 4) : label}
          </span>
          {isHigh && (
            <span className="text-[9px] font-bold text-red-400 animate-pulse tracking-widest">
              ▲ HIGH
            </span>
          )}
        </div>
        <span
          className={cn(
            'text-xs font-mono font-bold',
            isHigh ? 'text-red-300' : isActive ? 'text-red-400' : 'text-white/40'
          )}
        >
          {value}
        </span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function StatRow({
  statKey,
  value,
  compact,
}: {
  statKey: StatKey
  value: number
  compact: boolean
}) {
  const color = getStatColor(statKey)
  const label = getStatLabel(statKey)
  const displayValue = statKey === 'money' ? `$${value}` : value

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-white/45">{compact ? label.slice(0, 4) : label}</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>
          {displayValue}
        </span>
      </div>
      {statKey !== 'money' && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  )
}
