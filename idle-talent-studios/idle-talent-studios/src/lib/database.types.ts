export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          email: string
          player_name: string
          stats: Record<string, number>
          energy: number
          mood: number
          current_chapter: number
          current_day: number
          story_flags: Record<string, boolean>
          last_daily_reset: string | null
          fired_twists: string[]
          apartment_tier: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['players']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['players']['Insert']>
      }
      character_progress: {
        Row: {
          id: string
          player_id: string
          character_id: string
          affection: number
          is_owned: boolean
          unlocked_memories: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['character_progress']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['character_progress']['Insert']>
      }
      gacha_pulls: {
        Row: {
          id: string
          player_id: string
          character_id: string
          banner_id: string
          rarity: string
          is_duplicate: boolean
          is_new_character: boolean
          bond_fragment_granted: boolean
          spotlight_converted: number
          pity_at_pull: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gacha_pulls']['Row'], 'id' | 'created_at'>
        Update: never
      }
      story_flags: {
        Row: {
          id: string
          player_id: string
          flag_key: string
          flag_value: boolean
          set_at: string
        }
        Insert: Omit<Database['public']['Tables']['story_flags']['Row'], 'id'>
        Update: Partial<Pick<Database['public']['Tables']['story_flags']['Row'], 'flag_value'>>
      }
      currency_ledger: {
        Row: {
          id: string
          player_id: string
          currency_type: 'spotlight' | 'prestige'
          amount: number
          direction: 'credit' | 'debit'
          source: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['currency_ledger']['Row'], 'id' | 'created_at'>
        Update: never
      }
      store_items: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          spotlight_cost: number | null
          prestige_cost: number | null
          is_limited: boolean
          available_until: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['store_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['store_items']['Insert']>
      }
      store_purchases: {
        Row: {
          id: string
          player_id: string
          item_id: string
          quantity: number
          currency_used: 'spotlight' | 'prestige'
          cost: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['store_purchases']['Row'], 'id' | 'created_at'>
        Update: never
      }
      daily_events: {
        Row: {
          id: string
          player_id: string
          day: number
          event_type: string
          character_id: string
          content: string
          triggered_at: string
        }
        Insert: Omit<Database['public']['Tables']['daily_events']['Row'], 'id'>
        Update: never
      }
      login_streaks: {
        Row: {
          id: string
          player_id: string
          last_login: string
          streak_count: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['login_streaks']['Row'], 'id' | 'updated_at'>
        Update: Partial<Pick<Database['public']['Tables']['login_streaks']['Row'], 'last_login' | 'streak_count'>>
      }
      relationship_events: {
        Row: {
          id: string
          player_id: string
          character_id: string
          event_type: string
          stage_from: string | null
          stage_to: string | null
          visibility: string | null
          chemistry: number | null
          affection: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['relationship_events']['Row'], 'id' | 'created_at'>
        Update: never
      }
      breaking_news_log: {
        Row: {
          id: string
          player_id: string
          twist_id: string
          threshold: number
          source: string
          choice_made: string | null
          day: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['breaking_news_log']['Row'], 'id' | 'created_at'>
        Update: never
      }
      wardrobe_items: {
        Row: {
          id: string
          name: string
          description: string
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          slot: 'top' | 'bottom' | 'shoes' | 'accessory' | 'full_look'
          looks_bonus: number
          conf_bonus: number
          stat_tag: string | null
          stat_bonus_value: number
          character_affinity: string[]
          affinity_bonus: number
          source: 'store' | 'gacha' | 'gift' | 'career'
          cost: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wardrobe_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wardrobe_items']['Insert']>
      }
      player_wardrobe: {
        Row: {
          id: string
          player_id: string
          item_id: string
          equipped_slot: string | null
          is_locked: boolean
          acquired_at: string
        }
        Insert: Omit<Database['public']['Tables']['player_wardrobe']['Row'], 'id' | 'acquired_at'>
        Update: Partial<Pick<Database['public']['Tables']['player_wardrobe']['Row'], 'equipped_slot' | 'is_locked'>>
      }
      visit_log: {
        Row: {
          id: string
          player_id: string
          character_id: string
          scene_ref: string
          affection_delta: number
          visited_at: string
        }
        Insert: Omit<Database['public']['Tables']['visit_log']['Row'], 'id' | 'visited_at'>
        Update: never
      }
      gigs: {
        Row: {
          id: string
          title: string
          description: string
          duration: number
          base_reward: Record<string, unknown>
          risk_chips: Record<string, unknown>[]
          romance_hook: string | null
          voice: string
          tier_required: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gigs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gigs']['Insert']>
      }
      player_gigs: {
        Row: {
          id: string
          player_id: string
          gig_id: string
          prep_choice: string
          outcome_tier: string
          rewards: Record<string, unknown>
          started_at: string
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['player_gigs']['Row'], 'id'>
        Update: Partial<Pick<Database['public']['Tables']['player_gigs']['Row'], 'outcome_tier' | 'rewards' | 'completed_at'>>
      }
      career_milestones: {
        Row: {
          id: string
          player_id: string
          tier: number
          achieved_at: string
        }
        Insert: Omit<Database['public']['Tables']['career_milestones']['Row'], 'id' | 'achieved_at'>
        Update: never
      }
      fascination_log: {
        Row: {
          id: string
          player_id: string
          delta: number
          source: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['fascination_log']['Row'], 'id' | 'created_at'>
        Update: never
      }
      idle_earnings: {
        Row: {
          id: string
          player_id: string
          last_collected: string
          uncollected_amount: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['idle_earnings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Pick<Database['public']['Tables']['idle_earnings']['Row'], 'last_collected' | 'uncollected_amount'>>
      }
      chapters: {
        Row: {
          id: string
          character_id: string
          chapter_number: number
          title: string
          scene_ref: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chapters']['Row'], 'id' | 'created_at'>
        Update: never
      }
      endings: {
        Row: {
          id: string
          character_id: string
          ending_type: 'true' | 'good' | 'heartbreak' | 'secret'
          label: string
          scene_ref: string
          prestige_reward: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['endings']['Row'], 'id' | 'created_at'>
        Update: never
      }
      player_endings: {
        Row: {
          id: string
          player_id: string
          character_id: string
          ending_type: string
          label: string
          prestige_earned: number
          completed_at: string
        }
        Insert: Omit<Database['public']['Tables']['player_endings']['Row'], 'id' | 'completed_at'>
        Update: never
      }
      hidden_notes: {
        Row: {
          id: string
          player_id: string
          character_id: string
          note_index: number
          found_at: string
        }
        Insert: Omit<Database['public']['Tables']['hidden_notes']['Row'], 'id' | 'found_at'>
        Update: never
      }
      banners: {
        Row: {
          id: string
          name: string
          type: 'standard' | 'rate_up' | 'event' | 'beginner'
          featured_characters: string[]
          start_date: string | null
          end_date: string | null
          is_active: boolean
          is_one_time: boolean
          rate_up_ssr: number | null
          rate_up_sr: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['banners']['Row'], 'id' | 'created_at'>
        Update: Partial<Pick<Database['public']['Tables']['banners']['Row'], 'is_active' | 'end_date'>>
      }
      achievements: {
        Row: {
          id: string
          player_id: string
          achievement_key: string
          unlocked_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'unlocked_at'>
        Update: never
      }
      save_queue: {
        Row: {
          id: string
          player_id: string
          change_type: string
          payload: Record<string, unknown>
          synced: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['save_queue']['Row'], 'id' | 'created_at'>
        Update: Partial<Pick<Database['public']['Tables']['save_queue']['Row'], 'synced'>>
      }
      settings: {
        Row: {
          id: string
          player_id: string
          sound_enabled: boolean
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Pick<Database['public']['Tables']['settings']['Row'], 'sound_enabled' | 'notifications_enabled'>>
      }
      bond_fragments: {
        Row: {
          id: string
          player_id: string
          character_id: string
          fragment_count: number
          scenes_unlocked: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bond_fragments']['Row'], 'id' | 'updated_at'>
        Update: Partial<Pick<Database['public']['Tables']['bond_fragments']['Row'], 'fragment_count' | 'scenes_unlocked'>>
      }
    }
    Views: {
      pull_history: {
        Row: {
          player_id: string
          character_id: string
          character_name: string
          banner_id: string
          rarity: string
          is_new_character: boolean
          bond_fragment_granted: boolean
          spotlight_converted: number
          pulled_at: string
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
