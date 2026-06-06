import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Gig, PrepChoiceId } from '@/systems/gigSystem'
import { PREP_CHOICES, RISK_CHIP_META, VOICE_DISPLAY } from '@/systems/gigSystem'

interface PrepSheetProps {
  gig: Gig
  tierColor: string
  wisdomStat: number
  onConfirm: (gigId: string, prep: PrepChoiceId) => void
  onClose: () => void
}

export function PrepSheet({ gig, tierColor, wisdomStat, onConfirm, onClose }: PrepSheetProps) {
  const [selected, setSelected] = useState<PrepChoiceId>('wing_it')

  function handleConfirm() {
    onConfirm(gig.id, selected)
    onClose()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 z-[75] bg-slate-900 border-t border-white/10 rounded-t-2xl px-4 py-5 space-y-4"
      >
        {/* Gig header */}
        <div className="flex items-start gap-3">
          <div
            className="w-1.5 self-stretch rounded-full shrink-0"
            style={{ backgroundColor: tierColor }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white leading-tight">{gig.title}</h3>
            <p className="text-[10px] italic text-white/35 mt-0.5">
              via {VOICE_DISPLAY[gig.voice]}
            </p>
            <p className="text-xs text-white/45 mt-1.5">{gig.description}</p>
          </div>
          <button onClick={onClose} className="shrink-0 text-white/35 text-sm">✕</button>
        </div>

        {/* Gig meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-white/40">
            Duration: <span className="text-white/60 font-semibold">{gig.duration} day{gig.duration > 1 ? 's' : ''}</span>
          </span>
          <span className="text-[10px] text-white/40">
            Base: <span className="text-yellow-400/70 font-mono">✨{gig.baseReward.spotlight}</span>
          </span>
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

        {/* Prep choices */}
        <div>
          <p className="text-[10px] text-white/35 uppercase tracking-widest mb-2">How will you approach this?</p>
          <div className="space-y-1.5">
            {PREP_CHOICES.map((choice) => {
              const locked = choice.requiresWisdom !== undefined && wisdomStat < choice.requiresWisdom
              const isSelected = selected === choice.id

              return (
                <motion.button
                  key={choice.id}
                  whileTap={!locked ? { scale: 0.99 } : undefined}
                  onClick={() => !locked && setSelected(choice.id)}
                  className={cn(
                    'w-full flex items-start gap-3 rounded-xl px-3 py-2.5 border text-left transition-all',
                    isSelected
                      ? 'border-opacity-50 bg-opacity-10'
                      : 'bg-white/3 border-white/8',
                    locked && 'opacity-40 cursor-not-allowed'
                  )}
                  style={
                    isSelected
                      ? { borderColor: `${tierColor}60`, backgroundColor: `${tierColor}12` }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      'mt-0.5 w-3.5 h-3.5 rounded-full border-2 shrink-0',
                      isSelected ? 'border-opacity-100' : 'border-white/25 bg-transparent'
                    )}
                    style={isSelected ? { borderColor: tierColor, backgroundColor: `${tierColor}40` } : undefined}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{choice.label}</span>
                      {locked && (
                        <span className="text-[9px] text-orange-400/60">
                          Wisdom {choice.requiresWisdom}+
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/40 mt-0.5">{choice.description}</p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Confirm */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white border"
          style={{ backgroundColor: `${tierColor}22`, borderColor: `${tierColor}50` }}
        >
          Start Gig — {PREP_CHOICES.find((c) => c.id === selected)?.label}
        </motion.button>
      </motion.div>
    </>
  )
}
