-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- STAGES
-- ============================================================
create table if not exists stages (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  position    integer not null default 0,
  color       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- PLATFORMS  (global lookup — not per-user)
-- ============================================================
create table if not exists platforms (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique,
  icon  text,
  color text
);

insert into platforms (name, icon, color) values
  ('Instagram', '📸', '#E1306C'),
  ('YouTube',   '▶️',  '#FF0000'),
  ('TikTok',    '🎵', '#000000')
on conflict (name) do nothing;

-- ============================================================
-- CARDS
-- ============================================================
create table if not exists cards (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  stage_id     uuid references stages(id) on delete set null,
  title        text not null,
  description  text,
  script       text,
  position     integer not null default 1000,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ============================================================
-- CARD_PLATFORMS  (many-to-many)
-- ============================================================
create table if not exists card_platforms (
  card_id     uuid not null references cards(id) on delete cascade,
  platform_id uuid not null references platforms(id) on delete cascade,
  primary key (card_id, platform_id)
);

-- ============================================================
-- AI_MESSAGES
-- ============================================================
create table if not exists ai_messages (
  id         uuid primary key default uuid_generate_v4(),
  card_id    uuid not null references cards(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at ON cards
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cards_updated_at on cards;
create trigger cards_updated_at
  before update on cards
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table stages         enable row level security;
alter table cards          enable row level security;
alter table card_platforms enable row level security;
alter table ai_messages    enable row level security;

-- platforms is global read-only — allow anyone authenticated to read
create policy "platforms: authenticated read"
  on platforms for select
  using (auth.role() = 'authenticated');

-- stages
create policy "stages: owner select"  on stages for select  using ((select auth.uid()) = user_id);
create policy "stages: owner insert"  on stages for insert  with check ((select auth.uid()) = user_id);
create policy "stages: owner update"  on stages for update  using ((select auth.uid()) = user_id);
create policy "stages: owner delete"  on stages for delete  using ((select auth.uid()) = user_id);

-- cards
create policy "cards: owner select"   on cards for select   using ((select auth.uid()) = user_id);
create policy "cards: owner insert"   on cards for insert   with check ((select auth.uid()) = user_id);
create policy "cards: owner update"   on cards for update   using ((select auth.uid()) = user_id);
create policy "cards: owner delete"   on cards for delete   using ((select auth.uid()) = user_id);

-- card_platforms (access through card ownership)
create policy "card_platforms: owner select" on card_platforms for select
  using (exists (select 1 from cards where cards.id = card_id and (select auth.uid()) = cards.user_id));
create policy "card_platforms: owner insert" on card_platforms for insert
  with check (exists (select 1 from cards where cards.id = card_id and (select auth.uid()) = cards.user_id));
create policy "card_platforms: owner delete" on card_platforms for delete
  using (exists (select 1 from cards where cards.id = card_id and (select auth.uid()) = cards.user_id));

-- ai_messages
create policy "ai_messages: owner select" on ai_messages for select
  using (exists (select 1 from cards where cards.id = card_id and (select auth.uid()) = cards.user_id));
create policy "ai_messages: owner insert" on ai_messages for insert
  with check (exists (select 1 from cards where cards.id = card_id and (select auth.uid()) = cards.user_id));
create policy "ai_messages: owner delete" on ai_messages for delete
  using (exists (select 1 from cards where cards.id = card_id and (select auth.uid()) = cards.user_id));
