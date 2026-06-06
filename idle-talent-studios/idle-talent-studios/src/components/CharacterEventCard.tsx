import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProcessedCharacterEvent } from '@/systems/dailyReset'
import { ALL_CHARACTERS } from '@/data/characters'

interface CharacterEventCardProps {
  event: ProcessedCharacterEvent
  onDismiss: (id: string) => void
  onOpen?: (event: ProcessedCharacterEvent) => void
}

const EVENT_LABELS: Record<ProcessedCharacterEvent['eventType'], string> = {
  text_message: 'Message',
  surprise_visit: 'Surprise visit',
  press_sighting: 'Press sighting',
  gift: 'Gift received',
}

const EVENT_ICONS: Record<ProcessedCharacterEvent['eventType'], string> = {
  text_message: '💬',
  surprise_visit: '🚪',
  press_sighting: '📸',
  gift: '🎁',
}

export function CharacterEventCard({
  event,
  onDismiss,
  onOpen,
}: CharacterEventCardProps) {
  const character = ALL_CHARACTERS.find((c) => c.id === event.characterId)
  const accentColor = character?.accentColor ?? '#e879f9'

  const isInteractive =
    event.eventType === 'text_message' ||
    event.eventType === 'surprise_visit' ||
    event.eventType === 'gift'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900"
      style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
    >
      <div className="px-3.5 py-3 flex items-start gap-3">
        {/* Portrait */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          {event.portrait}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px]">{EVENT_ICONS[event.eventType]}</span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              {EVENT_LABELS[event.eventType]}
            </span>
          </div>
          <p className="text-xs font-semibold text-white">{event.characterName}</p>
          <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{event.content}</p>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-2">
            {event.affectionDelta > 0 && (
              <span className="text-[10px] text-pink-400">
                +{event.affectionDelta} ♥
              </span>
            )}
            {event.scandalizeDelta > 0 && (
              <span className="text-[10px] text-red-400">
                +{event.scandalizeDelta} scandal
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          {isInteractive && onOpen && (
            <button
              onClick={() => onOpen(event)}
              className={cn(
                'text-[10px] font-semibold px-2 py-1 rounded-lg',
                'text-white transition-colors'
              )}
              style={{ backgroundColor: `${accentColor}30` }}
            >
              Open
            </button>
          )}
          <button
            onClick={() => onDismiss(event.id)}
            className="text-[10px] text-white/30 px-2 py-1 rounded-lg hover:bg-white/8 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  )
}
