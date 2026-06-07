import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DialogueLine, DialogueChoice, NodeType } from '@/engine/dialogueEngine'
import type { PlayerStats } from '@/engine/gameState'
import { getStatColor, getStatLabel } from '@/engine/statEngine'

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    if (!text) {
      setDone(true)
      return
    }

    timerRef.current = setInterval(() => {
      indexRef.current += 1
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current!)
        setDone(true)
      }
    }, speed)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text, speed])

  const skip = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setDisplayed(text)
    setDone(true)
  }, [text])

  return { displayed, done, skip }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DialogueBoxProps {
  line: DialogueLine | undefined
  nodeType?: NodeType
  accentColor?: string
  speakerBust?: string
  choices?: Array<DialogueChoice & { available: boolean }>
  showChoices: boolean
  onAdvance: () => void
  onChoice: (choiceId: string) => void
  stats?: PlayerStats
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DialogueBox({
  line,
  nodeType = 'dialogue',
  accentColor = '#e879f9',
  speakerBust,
  choices,
  showChoices,
  onAdvance,
  onChoice,
  stats,
}: DialogueBoxProps) {
  const text = line?.text ?? ''
  const { displayed, done, skip } = useTypewriter(text, 22)

  const isInnerMonologue = nodeType === 'inner_monologue'

  function handleTap() {
    if (!done) {
      skip()
      return
    }
    if (!showChoices) {
      onAdvance()
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 select-none">
      <AnimatePresence mode="wait">
        {showChoices ? (
          // ── Choice list ────────────────────────────────────────────────────
          <motion.div
            key="choices"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-8 space-y-2.5"
          >
            <p className="text-center text-xs text-white/40 mb-3 tracking-wider uppercase">
              What do you say?
            </p>
            {choices?.map((choice, i) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                index={i}
                stats={stats}
                onSelect={onChoice}
              />
            ))}
          </motion.div>
        ) : (
          // ── Dialogue panel ─────────────────────────────────────────────────
          <motion.div
            key={line?.id ?? 'empty'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleTap}
            className="cursor-pointer"
          >
            {/* Gradient fade from transparent to panel */}
            <div className="h-10 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

            <div
              className={cn(
                'mx-3 mb-4 rounded-2xl overflow-hidden',
                'border border-white/10 backdrop-blur-xl',
                isInnerMonologue
                  ? 'bg-indigo-950/80'
                  : 'bg-black/75'
              )}
            >
              {/* Nameplate */}
              {line && (
                <div
                  className={cn(
                    'px-4 py-2 flex items-center gap-2',
                    isInnerMonologue
                      ? 'bg-indigo-800/60 border-b border-indigo-700/40'
                      : 'border-b border-white/8'
                  )}
                  style={
                    !isInnerMonologue
                      ? { borderBottomColor: `${accentColor}30`, backgroundColor: `${accentColor}18` }
                      : undefined
                  }
                >
                  {!isInnerMonologue && speakerBust && (
                    <img
                      src={speakerBust}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0"
                      style={{ boxShadow: `0 0 0 1.5px ${accentColor}50` }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  <span
                    className={cn(
                      'text-xs font-bold tracking-wide',
                      isInnerMonologue ? 'text-indigo-300 italic' : 'text-white'
                    )}
                    style={!isInnerMonologue ? { color: accentColor } : undefined}
                  >
                    {isInnerMonologue ? '— inner voice —' : line.speaker}
                  </span>
                  {!isInnerMonologue && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </div>
              )}

              {/* Text body */}
              <div className="px-4 py-3 min-h-[72px]">
                <p
                  className={cn(
                    'text-sm leading-relaxed',
                    isInnerMonologue
                      ? 'text-indigo-200 italic'
                      : 'text-white/95'
                  )}
                >
                  {displayed}
                  {/* blinking cursor while typing */}
                  {!done && (
                    <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-current align-middle animate-pulse opacity-70" />
                  )}
                </p>
              </div>

              {/* Continue prompt */}
              <div className="px-4 pb-3 flex justify-end">
                {done ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-white/30 flex items-center gap-1"
                  >
                    tap to continue
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ▶
                    </motion.span>
                  </motion.span>
                ) : (
                  <span className="text-[11px] text-white/15">tap to skip</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Choice button ────────────────────────────────────────────────────────────

function ChoiceButton({
  choice,
  index,
  stats,
  onSelect,
}: {
  choice: DialogueChoice & { available: boolean }
  index: number
  stats?: PlayerStats
  onSelect: (id: string) => void
}) {
  const locked = !choice.available

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => !locked && onSelect(choice.id)}
      disabled={locked}
      className={cn(
        'w-full text-left rounded-xl px-4 py-3 transition-all duration-150',
        'border backdrop-blur-sm',
        locked
          ? 'bg-white/4 border-white/8 cursor-not-allowed'
          : 'bg-white/10 border-white/15 hover:bg-white/18 active:scale-[0.98]'
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Index indicator */}
        <span
          className={cn(
            'shrink-0 mt-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
            locked ? 'bg-white/8 text-white/25' : 'bg-white/15 text-white/70'
          )}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <span className={cn('text-sm', locked ? 'text-white/30' : 'text-white/90')}>
            {choice.text}
          </span>

          {/* Stat check indicator */}
          {choice.statCheck && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div
                className="h-1 flex-1 max-w-[80px] rounded-full bg-white/10 overflow-hidden"
              >
                {stats && (
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (stats[choice.statCheck.stat] / choice.statCheck.required) * 100)}%`,
                      backgroundColor: locked
                        ? 'rgba(255,255,255,0.2)'
                        : getStatColor(choice.statCheck.stat),
                    }}
                  />
                )}
              </div>
              <span
                className={cn('text-[10px] font-medium', locked ? 'text-white/30' : '')}
                style={!locked ? { color: getStatColor(choice.statCheck.stat) } : undefined}
              >
                {getStatLabel(choice.statCheck.stat)} {choice.statCheck.required}+
                {locked && stats ? ` (${stats[choice.statCheck.stat]})` : ''}
              </span>
              {locked && <span className="text-[10px] text-white/25">🔒</span>}
            </div>
          )}

          {/* Affection hint */}
          {choice.affectionDelta && !locked && (
            <span className="text-[10px] text-pink-400/50 mt-1 block">
              +{choice.affectionDelta.delta} ♥
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
