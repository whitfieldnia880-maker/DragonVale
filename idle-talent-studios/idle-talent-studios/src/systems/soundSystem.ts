/**
 * soundSystem — event-driven sound stub.
 * Replace the console.log calls with actual audio API calls when adding audio.
 */

import { useSettingsStore } from '@/store/settingsStore'

export type SoundCategory = 'pull' | 'ui' | 'ambient' | 'dialogue' | 'achievement'

export interface SoundEvent {
  event: string
  category: SoundCategory
}

export function playSound(event: SoundEvent): void {
  if (!useSettingsStore.getState().soundEnabled) return
  if (import.meta.env.DEV) {
    console.debug(`[SOUND] ${event.category}: ${event.event}`)
  }
  // TODO: replace with audio API call: audioEngine.play(event.event)
}

// ─── Typed event helpers ──────────────────────────────────────────────────────

export const Sound = {
  pull: {
    start:        () => playSound({ event: 'pull_start',         category: 'pull' }),
    r:            () => playSound({ event: 'pull_r',             category: 'pull' }),
    sr:           () => playSound({ event: 'pull_sr',            category: 'pull' }),
    ssr:          () => playSound({ event: 'pull_ssr',           category: 'pull' }),
    newCharacter: () => playSound({ event: 'pull_new_character', category: 'pull' }),
    duplicate:    () => playSound({ event: 'pull_duplicate',     category: 'pull' }),
  },
  ui: {
    buttonTap:        () => playSound({ event: 'button_tap',          category: 'ui' }),
    bottomSheetOpen:  () => playSound({ event: 'bottom_sheet_open',   category: 'ui' }),
    bottomSheetClose: () => playSound({ event: 'bottom_sheet_close',  category: 'ui' }),
    tabSwitch:        () => playSound({ event: 'tab_switch',          category: 'ui' }),
    toastAppear:      () => playSound({ event: 'toast_appear',        category: 'ui' }),
    modalOpen:        () => playSound({ event: 'modal_open',          category: 'ui' }),
    modalClose:       () => playSound({ event: 'modal_close',         category: 'ui' }),
  },
  ambient: {
    dayReset:       () => playSound({ event: 'day_reset',        category: 'ambient' }),
    tierAdvance:    (tier: number) => playSound({ event: `career_advance_tier_${tier}`, category: 'ambient' }),
    endingComplete: () => playSound({ event: 'ending_complete',  category: 'ambient' }),
    achievementUnlock: () => playSound({ event: 'achievement_unlock', category: 'ambient' }),
    careerAdvance:  () => playSound({ event: 'career_advance',   category: 'ambient' }),
  },
  dialogue: {
    typewriterTick:   () => playSound({ event: 'typewriter_tick',     category: 'dialogue' }),
    choiceAppear:     () => playSound({ event: 'choice_appear',       category: 'dialogue' }),
    sceneStart:       () => playSound({ event: 'scene_start',         category: 'dialogue' }),
    sceneEnd:         () => playSound({ event: 'scene_end',           category: 'dialogue' }),
    affectionGain:    () => playSound({ event: 'affection_gain',      category: 'dialogue' }),
    affectionMilestone: (level: number) => playSound({ event: `affection_milestone_${level}`, category: 'dialogue' }),
  },
  achievement: {
    unlock: () => playSound({ event: 'achievement_unlock', category: 'achievement' }),
  },
}

// ─── Backward-compat re-export (matches old soundStubs.ts API shape) ──────────

export const Sounds = {
  pull: {
    ssr: Sound.pull.ssr,
    sr:  Sound.pull.sr,
    r:   Sound.pull.r,
  },
  affection: {
    milestone: Sound.dialogue.affectionMilestone,
  },
  scandal: {
    increase:  () => playSound({ event: 'scandal_increase',           category: 'ui' }),
    threshold: () => playSound({ event: 'scandal_threshold_crossed',  category: 'ui' }),
  },
  news: {
    breaking: () => playSound({ event: 'breaking_news_alert', category: 'ambient' }),
  },
  day: {
    reset:  Sound.ambient.dayReset,
    endDay: () => playSound({ event: 'end_day_confirm', category: 'ambient' }),
  },
  career: {
    advance:     Sound.ambient.tierAdvance,
    gigComplete: (outcome: string) => playSound({ event: `gig_${outcome}`, category: 'ambient' }),
  },
  ui: {
    tabSwitch:      Sound.ui.tabSwitch,
    bottomSheetOpen: Sound.ui.bottomSheetOpen,
    achievement:    Sound.achievement.unlock,
  },
}
