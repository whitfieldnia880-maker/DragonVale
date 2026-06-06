import { motion } from 'framer-motion'
import type { Gig } from '@/systems/gigSystem'
import { RISK_CHIP_META, VOICE_DISPLAY } from '@/systems/gigSystem'

interface GigCardProps {
  gig: Gig
  tierColor: string
  onTap: () => void
}

export function GigCard({ gig, tierColor, onTap }: GigCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className="relative shrink-0 w-[200px] rounded-2xl bg-white/5 border border-white/10 p-4 text-left flex flex-col gap-3 overflow-hidden"
      style={{ '--tier': tierColor } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ backgroundColor: tierColor }}
      />

      {/* Duration badge */}
      <div className="flex items-start justify-between">
        <span
          className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: tierColor, backgroundColor: `${tierColor}20` }}
        >
          {gig.duration}d
        </span>
        {gig.romanceHook && (
          <span className="text-[10px] text-pink-400/60">♥</span>
        )}
      </div>

      {/* Title + voice */}
      <div>
        <h3 className="text-xs font-bold text-white leading-snug">{gig.title}</h3>
        <p className="text-[10px] italic text-white/35 mt-0.5">
          via {VOICE_DISPLAY[gig.voice]}
        </p>
      </div>

      {/* Description */}
      <p className="text-[10px] text-white/50 leading-relaxed flex-1">{gig.description}</p>

      {/* Risk chips */}
      {gig.riskChips.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {gig.riskChips.map((chip, i) => {
            const meta = RISK_CHIP_META[chip.type]
            return (
              <span
                key={i}
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                style={{ color: meta.color, backgroundColor: `${meta.color}18` }}
              >
                {meta.label}
              </span>
            )
          })}
        </div>
      )}

      {/* Reward preview */}
      <div className="pt-1 border-t border-white/8 flex items-center justify-between">
        <span className="text-[10px] text-yellow-400/70 font-mono">✨{gig.baseReward.spotlight}</span>
        <span className="text-[9px] text-white/30">Tap to prep →</span>
      </div>
    </motion.button>
  )
}
