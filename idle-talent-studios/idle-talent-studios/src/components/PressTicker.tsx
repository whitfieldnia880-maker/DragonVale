import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { PressHeadline } from '@/systems/scandal'

interface PressTickerProps {
  headlines: PressHeadline[]
}

const TIER_COLORS: Record<PressHeadline['tier'], string> = {
  clean: 'text-green-400',
  speculation: 'text-yellow-400',
  aggressive: 'text-orange-400',
  tabloid: 'text-red-400',
}

const TIER_LABELS: Record<PressHeadline['tier'], string> = {
  clean: 'TRADE WINDS',
  speculation: 'INDUSTRY BUZZ',
  aggressive: 'UNDER THE LENS',
  tabloid: 'BREAKING',
}

export function PressTicker({ headlines }: PressTickerProps) {
  const latest = headlines[0]
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetHeight // force reflow to restart animation
    el.style.animation = ''
  }, [latest?.id])

  if (!latest) return null

  const tierColor = TIER_COLORS[latest.tier]
  const tierLabel = TIER_LABELS[latest.tier]

  // Repeat text so the scroll loop looks seamless
  const text = `${latest.text}   ·   ${latest.text}   ·   ${latest.text}`

  return (
    <div className="flex items-center gap-0 overflow-hidden bg-black/60 border-t border-white/8 backdrop-blur-sm">
      {/* Label badge */}
      <div
        className={cn(
          'shrink-0 px-2.5 py-1.5 text-[9px] font-bold tracking-widest border-r border-white/10',
          tierColor
        )}
      >
        {tierLabel}
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden relative h-7 flex items-center">
        <div
          ref={trackRef}
          className="whitespace-nowrap text-[11px] text-white/60 absolute"
          style={{
            animation: 'ticker-scroll 28s linear infinite',
          }}
        >
          {text}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
