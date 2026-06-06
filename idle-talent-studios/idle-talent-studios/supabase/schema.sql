-- Idle Talent Studios — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────
-- players
-- ──────────────────────────────────────────────
create table if not exists public.players (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text not null,
  player_name    text not null default 'Player',
  stats          jsonb not null default '{"confidence":20,"looks":20,"wisdom":20,"reputation":20,"scandal":0,"money":500}',
  energy         integer not null default 100 check (energy between 0 and 100),
  mood           integer not null default 80  check (mood    between 0 and 100),
  current_chapter integer not null default 1,
  current_day    integer not null default 1,
  story_flags    jsonb not null default '{}',
  last_daily_reset timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.players enable row level security;
create policy "players: own row only"
  on public.players for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ──────────────────────────────────────────────
-- character_progress
-- ──────────────────────────────────────────────
create table if not exists public.character_progress (
  id               uuid primary key default uuid_generate_v4(),
  player_id        uuid not null references public.players(id) on delete cascade,
  character_id     text not null,
  affection        integer not null default 0 check (affection between 0 and 100),
  is_owned         boolean not null default false,
  unlocked_memories text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (player_id, character_id)
);

alter table public.character_progress enable row level security;
create policy "character_progress: own rows only"
  on public.character_progress for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- gacha_pulls
-- ──────────────────────────────────────────────
create table if not exists public.gacha_pulls (
  id                  uuid primary key default uuid_generate_v4(),
  player_id           uuid not null references public.players(id) on delete cascade,
  character_id        text not null,
  rarity              text not null check (rarity in ('SSR','SR','R')),
  is_duplicate        boolean not null default false,
  spotlight_converted integer not null default 0,
  pity_at_pull        integer not null default 0,
  created_at          timestamptz not null default now()
);

alter table public.gacha_pulls enable row level security;
create policy "gacha_pulls: own rows only"
  on public.gacha_pulls for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- story_flags
-- ──────────────────────────────────────────────
create table if not exists public.story_flags (
  id         uuid primary key default uuid_generate_v4(),
  player_id  uuid not null references public.players(id) on delete cascade,
  flag_key   text not null,
  flag_value boolean not null default true,
  set_at     timestamptz not null default now(),
  unique (player_id, flag_key)
);

alter table public.story_flags enable row level security;
create policy "story_flags: own rows only"
  on public.story_flags for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- currency_ledger
-- ──────────────────────────────────────────────
create table if not exists public.currency_ledger (
  id            uuid primary key default uuid_generate_v4(),
  player_id     uuid not null references public.players(id) on delete cascade,
  currency_type text not null check (currency_type in ('spotlight','prestige')),
  amount        integer not null check (amount > 0),
  direction     text not null check (direction in ('credit','debit')),
  source        text not null,
  created_at    timestamptz not null default now()
);

alter table public.currency_ledger enable row level security;
create policy "currency_ledger: own rows only"
  on public.currency_ledger for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- store_items
-- ──────────────────────────────────────────────
create table if not exists public.store_items (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  description      text not null default '',
  category         text not null check (category in ('gacha','apartment','wardrobe','stamina','bundle')),
  spotlight_cost   integer check (spotlight_cost >= 0),
  prestige_cost    integer check (prestige_cost >= 0),
  is_limited       boolean not null default false,
  available_until  timestamptz,
  created_at       timestamptz not null default now()
);

-- store_items is readable by all authenticated users
alter table public.store_items enable row level security;
create policy "store_items: authenticated read"
  on public.store_items for select
  using (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- store_purchases
-- ──────────────────────────────────────────────
create table if not exists public.store_purchases (
  id            uuid primary key default uuid_generate_v4(),
  player_id     uuid not null references public.players(id) on delete cascade,
  item_id       uuid not null references public.store_items(id),
  quantity      integer not null default 1 check (quantity > 0),
  currency_used text not null check (currency_used in ('spotlight','prestige')),
  cost          integer not null check (cost >= 0),
  created_at    timestamptz not null default now()
);

alter table public.store_purchases enable row level security;
create policy "store_purchases: own rows only"
  on public.store_purchases for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- daily_events
-- ──────────────────────────────────────────────
create table if not exists public.daily_events (
  id            uuid primary key default uuid_generate_v4(),
  player_id     uuid not null references public.players(id) on delete cascade,
  day           integer not null,
  event_type    text not null,
  character_id  text not null,
  content       text not null,
  triggered_at  timestamptz not null default now()
);

alter table public.daily_events enable row level security;
create policy "daily_events: own rows only"
  on public.daily_events for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- login_streaks
-- ──────────────────────────────────────────────
create table if not exists public.login_streaks (
  id            uuid primary key default uuid_generate_v4(),
  player_id     uuid not null references public.players(id) on delete cascade unique,
  last_login    timestamptz not null default now(),
  streak_count  integer not null default 1,
  updated_at    timestamptz not null default now()
);

alter table public.login_streaks enable row level security;
create policy "login_streaks: own rows only"
  on public.login_streaks for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

create trigger login_streaks_updated_at
  before update on public.login_streaks
  for each row execute procedure public.set_updated_at();

-- ──────────────────────────────────────────────
-- updated_at trigger helper
-- ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger players_updated_at
  before update on public.players
  for each row execute procedure public.set_updated_at();

create trigger character_progress_updated_at
  before update on public.character_progress
  for each row execute procedure public.set_updated_at();

-- ──────────────────────────────────────────────
-- seed default store items
-- ──────────────────────────────────────────────
insert into public.store_items (name, description, category, spotlight_cost, prestige_cost) values
  ('Single Pull',     'One chance at the spotlight.',           'gacha',    160,  1),
  ('10x Bundle',      'Ten pulls. Fortune favors the bold.',    'gacha',    1500, 10),
  ('Stamina Refill',  'Restore 50 energy.',                     'stamina',  80,   null),
  ('Apartment Lvl 2', 'Unlock a second room for your space.',   'apartment',500,  null),
  ('Apartment Lvl 3', 'A full suite. You\'ve arrived.',         'apartment',1200, null),
  ('Wardrobe Pack A', 'Casual chic. First impressions matter.', 'wardrobe', 200,  null),
  ('Wardrobe Pack B', 'Red carpet ready.',                      'wardrobe', 400,  2)
on conflict do nothing;

-- ──────────────────────────────────────────────
-- fired_twists column on players
-- (run after initial setup if table already exists)
-- ──────────────────────────────────────────────
alter table public.players
  add column if not exists fired_twists jsonb not null default '[]';

-- ──────────────────────────────────────────────
-- relationship_events
-- ──────────────────────────────────────────────
create table if not exists public.relationship_events (
  id             uuid primary key default uuid_generate_v4(),
  player_id      uuid not null references public.players(id) on delete cascade,
  character_id   text not null,
  event_type     text not null, -- 'stage_change' | 'visibility_change' | 'chemistry_milestone'
  stage_from     text,
  stage_to       text,
  visibility     text,
  chemistry      integer,
  affection      integer,
  created_at     timestamptz not null default now()
);

alter table public.relationship_events enable row level security;
create policy "relationship_events: own rows only"
  on public.relationship_events for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- breaking_news_log
-- ──────────────────────────────────────────────
create table if not exists public.breaking_news_log (
  id           uuid primary key default uuid_generate_v4(),
  player_id    uuid not null references public.players(id) on delete cascade,
  twist_id     text not null,
  threshold    integer not null,
  source       text not null,
  choice_made  text,
  day          integer not null,
  created_at   timestamptz not null default now()
);

alter table public.breaking_news_log enable row level security;
create policy "breaking_news_log: own rows only"
  on public.breaking_news_log for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- Prompt 5: apartment_tier + wardrobe tables
-- ──────────────────────────────────────────────
alter table public.players
  add column if not exists apartment_tier integer not null default 1
    check (apartment_tier between 1 and 5);

-- ──────────────────────────────────────────────
-- wardrobe_items (catalog — seeded server-side)
-- ──────────────────────────────────────────────
create table if not exists public.wardrobe_items (
  id                  text primary key,
  name                text not null,
  description         text not null default '',
  rarity              text not null check (rarity in ('common','rare','epic','legendary')),
  slot                text not null check (slot in ('top','bottom','shoes','accessory','full_look')),
  looks_bonus         integer not null default 0,
  conf_bonus          integer not null default 0,
  stat_tag            text,
  stat_bonus_value    integer not null default 0,
  character_affinity  jsonb not null default '[]',
  affinity_bonus      integer not null default 0,
  source              text not null check (source in ('store','gacha','gift','career')),
  cost                integer not null default 0,
  created_at          timestamptz not null default now()
);

alter table public.wardrobe_items enable row level security;
create policy "wardrobe_items: read only"
  on public.wardrobe_items for select
  using (true);

-- ──────────────────────────────────────────────
-- player_wardrobe (per-player inventory)
-- ──────────────────────────────────────────────
create table if not exists public.player_wardrobe (
  id           uuid primary key default uuid_generate_v4(),
  player_id    uuid not null references public.players(id) on delete cascade,
  item_id      text not null references public.wardrobe_items(id),
  equipped_slot text,
  is_locked    boolean not null default false,
  acquired_at  timestamptz not null default now(),
  unique (player_id, item_id)
);

alter table public.player_wardrobe enable row level security;
create policy "player_wardrobe: own rows only"
  on public.player_wardrobe for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- visit_log
-- ──────────────────────────────────────────────
create table if not exists public.visit_log (
  id             uuid primary key default uuid_generate_v4(),
  player_id      uuid not null references public.players(id) on delete cascade,
  character_id   text not null,
  scene_ref      text not null,
  affection_delta integer not null default 0,
  visited_at     timestamptz not null default now()
);

alter table public.visit_log enable row level security;
create policy "visit_log: own rows only"
  on public.visit_log for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- Prompt 6: gig system tables
-- ──────────────────────────────────────────────

-- gigs (catalog — seeded server-side)
create table if not exists public.gigs (
  id              text primary key,
  title           text not null,
  description     text not null default '',
  duration        integer not null default 1,
  base_reward     jsonb not null default '{}',
  risk_chips      jsonb not null default '[]',
  romance_hook    text,
  voice           text not null,
  tier_required   integer not null default 1 check (tier_required between 1 and 6),
  created_at      timestamptz not null default now()
);

alter table public.gigs enable row level security;
create policy "gigs: read only"
  on public.gigs for select using (true);

-- player_gigs (completed gig history)
create table if not exists public.player_gigs (
  id              uuid primary key default uuid_generate_v4(),
  player_id       uuid not null references public.players(id) on delete cascade,
  gig_id          text not null,
  prep_choice     text not null,
  outcome_tier    text not null,
  rewards         jsonb not null default '{}',
  started_at      timestamptz not null,
  completed_at    timestamptz
);

alter table public.player_gigs enable row level security;
create policy "player_gigs: own rows only"
  on public.player_gigs for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- career_milestones
create table if not exists public.career_milestones (
  id              uuid primary key default uuid_generate_v4(),
  player_id       uuid not null references public.players(id) on delete cascade,
  tier            integer not null check (tier between 1 and 6),
  achieved_at     timestamptz not null default now(),
  unique (player_id, tier)
);

alter table public.career_milestones enable row level security;
create policy "career_milestones: own rows only"
  on public.career_milestones for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- fascination_log
create table if not exists public.fascination_log (
  id              uuid primary key default uuid_generate_v4(),
  player_id       uuid not null references public.players(id) on delete cascade,
  delta           integer not null,
  source          text not null,
  created_at      timestamptz not null default now()
);

alter table public.fascination_log enable row level security;
create policy "fascination_log: own rows only"
  on public.fascination_log for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- idle_earnings
create table if not exists public.idle_earnings (
  id                  uuid primary key default uuid_generate_v4(),
  player_id           uuid not null references public.players(id) on delete cascade unique,
  last_collected      timestamptz not null default now(),
  uncollected_amount  integer not null default 0,
  updated_at          timestamptz not null default now()
);

alter table public.idle_earnings enable row level security;
create policy "idle_earnings: own rows only"
  on public.idle_earnings for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- Prompt 7 — character routes, endings, notes
-- ──────────────────────────────────────────────

create table if not exists public.chapters (
  id              uuid primary key default uuid_generate_v4(),
  character_id    text not null,
  chapter_number  int not null,
  title           text not null,
  scene_ref       text not null,
  created_at      timestamptz default now()
);

create table if not exists public.endings (
  id              uuid primary key default uuid_generate_v4(),
  character_id    text not null,
  ending_type     text not null check (ending_type in ('true','good','heartbreak','secret')),
  label           text not null,
  scene_ref       text not null,
  prestige_reward int not null default 2,
  created_at      timestamptz default now()
);

create table if not exists public.player_endings (
  id              uuid primary key default uuid_generate_v4(),
  player_id       uuid not null references public.players(id) on delete cascade,
  character_id    text not null,
  ending_type     text not null,
  label           text not null,
  prestige_earned int not null default 0,
  completed_at    timestamptz default now(),
  unique (player_id, character_id, ending_type)
);

alter table public.player_endings enable row level security;
create policy "player_endings: own rows only"
  on public.player_endings for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

create table if not exists public.hidden_notes (
  id              uuid primary key default uuid_generate_v4(),
  player_id       uuid not null references public.players(id) on delete cascade,
  character_id    text not null,
  note_index      int not null,
  found_at        timestamptz default now(),
  unique (player_id, character_id, note_index)
);

alter table public.hidden_notes enable row level security;
create policy "hidden_notes: own rows only"
  on public.hidden_notes for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ──────────────────────────────────────────────
-- Prompt 8: Gacha banner system
-- ──────────────────────────────────────────────

alter table public.gacha_pulls
  add column if not exists banner_id          text not null default 'standard',
  add column if not exists is_new_character    boolean not null default false,
  add column if not exists bond_fragment_granted boolean not null default false;

create table if not exists public.banners (
  id                 text primary key,
  name               text not null,
  type               text not null check (type in ('standard','rate_up','event','beginner')),
  featured_characters text[] not null default '{}',
  start_date         timestamptz,
  end_date           timestamptz,
  is_active          boolean not null default true,
  is_one_time        boolean not null default false,
  rate_up_ssr        numeric,
  rate_up_sr         numeric,
  created_at         timestamptz not null default now()
);

-- Seed default banners
insert into public.banners (id, name, type, is_active, is_one_time)
values
  ('standard',   'Spotlight Stage', 'standard', true, false),
  ('beginner',   'First Act',       'beginner',  true, true)
on conflict (id) do nothing;

create table if not exists public.bond_fragments (
  id               uuid primary key default uuid_generate_v4(),
  player_id        uuid not null references public.players(id) on delete cascade,
  character_id     text not null,
  fragment_count   int not null default 0,
  scenes_unlocked  int not null default 0,
  updated_at       timestamptz not null default now(),
  unique (player_id, character_id)
);

alter table public.bond_fragments enable row level security;
create policy "bond_fragments: own rows only"
  on public.bond_fragments for all
  using  (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- View: pull history with character name join placeholder
create or replace view public.pull_history as
select
  gp.player_id,
  gp.character_id,
  gp.banner_id,
  gp.rarity,
  gp.is_new_character,
  gp.bond_fragment_granted,
  gp.spotlight_converted,
  gp.created_at as pulled_at
from public.gacha_pulls gp
order by gp.created_at desc;

-- ──────────────────────────────────────────────
-- Prompt 9: Polish pass tables
-- ──────────────────────────────────────────────

create table if not exists public.achievements (
  id             uuid primary key default uuid_generate_v4(),
  player_id      uuid not null references public.players(id) on delete cascade,
  achievement_key text not null,
  unlocked_at    timestamptz not null default now(),
  unique (player_id, achievement_key)
);

alter table public.achievements enable row level security;
create policy "achievements: own rows only"
  on public.achievements for all
  using  (auth.uid() = player_id)
  with check (auth.uid() = player_id);

create index if not exists achievements_player_id_idx on public.achievements(player_id);

create table if not exists public.save_queue (
  id          uuid primary key default uuid_generate_v4(),
  player_id   uuid not null references public.players(id) on delete cascade,
  change_type text not null,
  payload     jsonb not null default '{}',
  synced      boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.save_queue enable row level security;
create policy "save_queue: own rows only"
  on public.save_queue for all
  using  (auth.uid() = player_id)
  with check (auth.uid() = player_id);

create index if not exists save_queue_player_id_idx    on public.save_queue(player_id);
create index if not exists save_queue_synced_idx       on public.save_queue(synced) where not synced;

create table if not exists public.settings (
  id                    uuid primary key default uuid_generate_v4(),
  player_id             uuid not null unique references public.players(id) on delete cascade,
  sound_enabled         boolean not null default true,
  notifications_enabled boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.settings enable row level security;
create policy "settings: own rows only"
  on public.settings for all
  using  (auth.uid() = player_id)
  with check (auth.uid() = player_id);

-- ── Indexes on player_id for all major tables ──────────────────────────────

create index if not exists gacha_pulls_player_id_idx        on public.gacha_pulls(player_id);
create index if not exists character_progress_player_id_idx on public.character_progress(player_id);
create index if not exists currency_ledger_player_id_idx    on public.currency_ledger(player_id);
create index if not exists store_purchases_player_id_idx    on public.store_purchases(player_id);
create index if not exists daily_events_player_id_idx       on public.daily_events(player_id);
create index if not exists player_gigs_player_id_idx        on public.player_gigs(player_id);
create index if not exists player_endings_player_id_idx     on public.player_endings(player_id);
create index if not exists hidden_notes_player_id_idx       on public.hidden_notes(player_id);
create index if not exists bond_fragments_player_id_idx     on public.bond_fragments(player_id);

-- ── updated_at trigger function ────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

create trigger bond_fragments_updated_at
  before update on public.bond_fragments
  for each row execute function public.set_updated_at();
