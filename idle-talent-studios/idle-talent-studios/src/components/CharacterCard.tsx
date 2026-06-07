import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Character } from '@/data/characters/types'
import type { Rarity } from '@/engine/gachaEngine'
import { getCharacterAssets } from '@/data/characters/assets'

interface CharacterCardProps {
  character: Character
  isOwned?: boolean
  affection?: number
  onClick?: () => void
  className?: string
}

const RARITY_STYLES: Record<Rarity, string> = {
  SSR: 'ring-2 ring-yellow-400 shadow-yellow-400/30 shadow-lg',
  SR:  'ring-2 ring-purple-400 shadow-purple-400/20 shadow-md',
  R:   'ring-1 ring-white/20',
}

const RARITY_BADGE: Record<Rarity, string> = {
  SSR: 'bg-yellow-400 text-yellow-900',
  SR:  'bg-purple-500 text-white',
  R:   'bg-slate-600 text-white',
}

export function CharacterCard({
  character,
  isOwned = false,
  affection,
  onClick,
  className,
}: CharacterCardProps) {
  const assets = getCharacterAssets(character.id)

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer select-none',
        'bg-[hsl(var(--card))] transition-all duration-200',
        RARITY_STYLES[character.rarity],
        !isOwned && 'opacity-50 grayscale',
        className
      )}
    >
      <div
        className="aspect-[3/4] flex items-center justify-center text-6xl overflow-hidden"
        style={{ background: `${character.accentColor}22` }}
      >
        {assets ? (
          <img
            src={assets.thumbnail}
            alt={character.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const t = e.currentTarget
              t.style.display = 'none'
              t.parentElement!.insertAdjacentText('beforeend', character.portraitPlaceholder)
            }}
          />
        ) : (
          character.portraitPlaceholder
        )}
      </div>

      <div
        className="absolute top-2 left-2 text-xs font-bold px-1.5 py-0.5 rounded"
        style={{ backgroundColor: RARITY_BADGE[character.rarity].split(' ')[0] }}
      >
        <span className={RARITY_BADGE[character.rarity]}>{character.rarity}</span>
      </div>

      <div className="p-2">
        <p className="text-sm font-semibold text-white leading-tight">{character.name}</p>
        <p className="text-xs text-white/50 mt-0.5">{character.role}</p>
        {isOwned && affection !== undefined && (
          <div className="mt-1.5">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: character.accentColor }}
                initial={{ width: 0 }}
                animate={{ width: `${affection}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
