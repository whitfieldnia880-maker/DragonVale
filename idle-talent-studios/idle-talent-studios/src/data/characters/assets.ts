import type { CharacterId, CharacterAssets } from '@/types'

const base = (id: string) => `/assets/characters/${id}`
const expr = (id: string) => `/assets/characters/${id}/expr`

function charAssets(id: string): CharacterAssets {
  return {
    portrait:        `${base(id)}/portrait.png`,
    bust:            `${base(id)}/bust.png`,
    silhouette:      `${base(id)}/silhouette.png`,
    cardArt:         `${base(id)}/card.png`,
    apartmentSprite: `${base(id)}/apartment.png`,
    thumbnail:       `${base(id)}/thumb.png`,
    expressions: {
      neutral:   `${expr(id)}/neutral.png`,
      happy:     `${expr(id)}/happy.png`,
      surprised: `${expr(id)}/surprised.png`,
      sad:       `${expr(id)}/sad.png`,
      flustered: `${expr(id)}/flustered.png`,
    },
  }
}

export const characterAssets: Record<CharacterId, CharacterAssets> = {
  amy:     charAssets('amy'),
  marcus:  charAssets('marcus'),
  olivier: charAssets('olivier'),
  remy:    charAssets('remy'),
  dex:     charAssets('dex'),
  sunny:   charAssets('sunny'),
  driver:  charAssets('driver'),
  celeste: charAssets('celeste'),
}

// Maps from the full Character.id used in game data to the short CharacterId
const FULL_ID_MAP: Record<string, CharacterId> = {
  'amy-crawford':          'amy',
  'marcus-vane':           'marcus',
  'olivier-sainte-claire': 'olivier',
  'remy-ashford':          'remy',
  'dex-calloway':          'dex',
  'sunny-park':            'sunny',
  'the-driver':            'driver',
  'celeste-voss':          'celeste',
}

export function getCharacterAssets(characterId: string): CharacterAssets | null {
  const shortId = FULL_ID_MAP[characterId] ?? (characterId as CharacterId)
  return characterAssets[shortId] ?? null
}
