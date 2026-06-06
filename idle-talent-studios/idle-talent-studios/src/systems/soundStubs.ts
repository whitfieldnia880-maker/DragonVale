// Sound stubs — fire console.log events, ready for audio library swap.
// When adding audio: replace each stub with the corresponding audio API call.

function stub(event: string) {
  if (import.meta.env.DEV) {
    console.debug(`[sound] ${event}`)
  }
}

export const Sounds = {
  pull: {
    ssr: () => stub('pull_reveal_ssr'),
    sr:  () => stub('pull_reveal_sr'),
    r:   () => stub('pull_reveal_r'),
  },
  affection: {
    milestone: (level: number) => stub(`affection_milestone_${level}`),
  },
  scandal: {
    increase: () => stub('scandal_increase'),
    threshold: () => stub('scandal_threshold_crossed'),
  },
  news: {
    breaking: () => stub('breaking_news_alert'),
  },
  day: {
    reset: () => stub('day_reset_ambient'),
    endDay: () => stub('end_day_confirm'),
  },
  career: {
    advance: (tier: number) => stub(`career_advance_tier_${tier}`),
    gigComplete: (outcome: string) => stub(`gig_${outcome}`),
  },
  ui: {
    tabSwitch: () => stub('tab_switch'),
    bottomSheetOpen: () => stub('bottom_sheet_open'),
    achievement: () => stub('achievement_unlock'),
  },
}
