-- =============================================================
-- Hot Diggity — Supabase Setup SQL
-- Run this in the Supabase SQL Editor before using the app.
-- Safe to re-run: drops everything first.
-- =============================================================

-- 0. RESET — tear down everything from a previous run
-- ----------------------------------------------------

-- Trigger & function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Views (must drop before tables they depend on)
DROP VIEW IF EXISTS public.place_stats;
DROP VIEW IF EXISTS public.user_stats;

-- Tables (order matters: ratings references places & profiles)
DROP TABLE IF EXISTS public.ratings;
DROP TABLE IF EXISTS public.places;
DROP TABLE IF EXISTS public.profiles;

-- Storage: clear objects then buckets
DELETE FROM storage.objects WHERE bucket_id IN ('place-images', 'rating-photos');
DELETE FROM storage.buckets WHERE id IN ('place-images', 'rating-photos');

-- Realtime publication (ignore errors if tables weren't in publication)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.places;
EXCEPTION WHEN undefined_table OR undefined_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.ratings;
EXCEPTION WHEN undefined_table OR undefined_object THEN NULL;
END $$;

-- 1. TABLES
-- ---------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  google_maps_url text,
  image_url text,
  description text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  score integer not null check (score >= 1 and score <= 5),
  review text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (place_id, user_id)
);

-- 2. AUTO-CREATE PROFILE ON SIGNUP (supports anonymous users)
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      case when new.email is not null then split_part(new.email, '@', 1) else 'Anonymous' end
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. VIEWS
-- --------

create or replace view public.place_stats as
select
  p.id,
  p.name,
  p.address,
  p.google_maps_url,
  p.image_url,
  p.description,
  p.position,
  round(avg(r.score)::numeric, 2)::float as avg_rating,
  count(r.id)::int as rating_count,
  count(r.id) > 0 as is_visited
from public.places p
left join public.ratings r on r.place_id = p.id
group by p.id;

create or replace view public.user_stats as
select
  pr.id,
  pr.display_name,
  pr.avatar_url,
  round(avg(r.score)::numeric, 2)::float as avg_score_given,
  count(r.id)::int as total_ratings
from public.profiles pr
left join public.ratings r on r.user_id = pr.id
group by pr.id;

-- 4. ROW LEVEL SECURITY
-- ---------------------

alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.ratings enable row level security;

-- Profiles: anyone authenticated can read; users update own; admins update any
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Places: authenticated can read; only admins can insert/update/delete
create policy "Places are viewable by authenticated users"
  on public.places for select
  to authenticated
  using (true);

create policy "Admins can insert places"
  on public.places for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update places"
  on public.places for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can delete places"
  on public.places for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Ratings: authenticated can read all; users manage own
create policy "Ratings are viewable by authenticated users"
  on public.ratings for select
  to authenticated
  using (true);

create policy "Users can insert own ratings"
  on public.ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.ratings for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own ratings"
  on public.ratings for delete
  to authenticated
  using (auth.uid() = user_id);

-- 5. STORAGE BUCKETS
-- ------------------

insert into storage.buckets (id, name, public)
values
  ('place-images', 'place-images', true),
  ('rating-photos', 'rating-photos', true);

-- Storage policies: place-images (admin upload), rating-photos (user upload)
create policy "Anyone can view place images"
  on storage.objects for select
  using (bucket_id = 'place-images');

create policy "Admins can upload place images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'place-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can update place images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'place-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can delete place images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'place-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Anyone can view rating photos"
  on storage.objects for select
  using (bucket_id = 'rating-photos');

create policy "Users can upload own rating photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'rating-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own rating photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'rating-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own rating photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'rating-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 6. ENABLE REALTIME
-- ------------------

alter publication supabase_realtime add table public.places;
alter publication supabase_realtime add table public.ratings;

-- 7. MAKE FIRST ADMIN (run manually after first signup)
-- UPDATE public.profiles SET is_admin = true WHERE display_name = 'YourName';
