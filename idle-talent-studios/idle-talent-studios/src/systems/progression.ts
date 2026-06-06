export interface ChapterGate {
  chapter: number
  requiredFlags: string[]
  requiredStats?: Partial<Record<string, number>>
  unlocksRoutes?: string[]
}

export const CHAPTER_GATES: ChapterGate[] = [
  {
    chapter: 2,
    requiredFlags: ['ch1_complete'],
    requiredStats: { reputation: 25 },
    unlocksRoutes: ['marcus-vane', 'dex-calloway'],
  },
  {
    chapter: 3,
    requiredFlags: ['ch2_complete'],
    unlocksRoutes: ['remy-ashford', 'sunny-park'],
  },
  {
    chapter: 4,
    requiredFlags: ['ch3_complete'],
    requiredStats: { confidence: 40 },
    unlocksRoutes: ['olivier-sainte-claire'],
  },
  {
    chapter: 5,
    requiredFlags: ['ch4_complete'],
    requiredStats: { wisdom: 50 },
    unlocksRoutes: ['celeste-voss'],
  },
  {
    chapter: 6,
    requiredFlags: ['ch5_complete'],
    unlocksRoutes: ['amy-crawford', 'the-driver'],
  },
]

export function canAdvanceChapter(
  currentChapter: number,
  flags: Record<string, boolean>,
  stats: Record<string, number>
): boolean {
  const gate = CHAPTER_GATES.find((g) => g.chapter === currentChapter + 1)
  if (!gate) return false

  const flagsPassed = gate.requiredFlags.every((f) => flags[f])
  if (!flagsPassed) return false

  if (gate.requiredStats) {
    for (const [stat, required] of Object.entries(gate.requiredStats)) {
      if ((stats[stat] ?? 0) < (required ?? 0)) return false
    }
  }

  return true
}
