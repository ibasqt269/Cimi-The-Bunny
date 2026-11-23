-- ============================================================================
-- SUPABASE SETUP — AKTA KELAHIRAN CIMI & CIMI'S MEMORIES
-- Salin seluruh script ini lalu jalankan di:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. TABEL DATA AKTA KELAHIRAN (1 baris utama dengan id = 'main')
create table if not exists public.cimi_certificate (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. TABEL GALERI FOTO CIMI'S MEMORIES
create table if not exists public.cimi_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null,
  album text not null default 'baby-cimi',
  caption text not null default 'Momen Cimi',
  taken_date text not null default '',
  format text not null default 'JPG',
  created_at timestamptz not null default now()
);

create index if not exists cimi_photos_created_at_idx
  on public.cimi_photos (created_at desc);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) — PUBLIK READ-ONLY, PAWRENT AUTHENTICATED WRITE
-- ============================================================================

alter table public.cimi_certificate enable row level security;
alter table public.cimi_photos enable row level security;

-- Policies untuk tabel `cimi_certificate`
drop policy if exists "cimi_certificate_public_select" on public.cimi_certificate;
create policy "cimi_certificate_public_select"
  on public.cimi_certificate
  for select
  to anon, authenticated
  using (true);

drop policy if exists "cimi_certificate_auth_insert" on public.cimi_certificate;
create policy "cimi_certificate_auth_insert"
  on public.cimi_certificate
  for insert
  to authenticated
  with check (true);

drop policy if exists "cimi_certificate_auth_update" on public.cimi_certificate;
create policy "cimi_certificate_auth_update"
  on public.cimi_certificate
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "cimi_certificate_auth_delete" on public.cimi_certificate;
create policy "cimi_certificate_auth_delete"
  on public.cimi_certificate
  for delete
  to authenticated
  using (true);

-- Policies untuk tabel `cimi_photos`
drop policy if exists "cimi_photos_public_select" on public.cimi_photos;
create policy "cimi_photos_public_select"
  on public.cimi_photos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "cimi_photos_auth_insert" on public.cimi_photos;
create policy "cimi_photos_auth_insert"
  on public.cimi_photos
  for insert
  to authenticated
  with check (true);

drop policy if exists "cimi_photos_auth_update" on public.cimi_photos;
create policy "cimi_photos_auth_update"
  on public.cimi_photos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "cimi_photos_auth_delete" on public.cimi_photos;
create policy "cimi_photos_auth_delete"
  on public.cimi_photos
  for delete
  to authenticated
  using (true);

-- ============================================================================
-- 4. STORAGE BUCKET PUBLIK `cimi-photos` + RLS POLICY STORAGE
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cimi-photos',
  'cimi-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cimi_photos_bucket_public_select" on storage.objects;
create policy "cimi_photos_bucket_public_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'cimi-photos');

drop policy if exists "cimi_photos_bucket_auth_insert" on storage.objects;
create policy "cimi_photos_bucket_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'cimi-photos');

drop policy if exists "cimi_photos_bucket_auth_update" on storage.objects;
create policy "cimi_photos_bucket_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'cimi-photos')
  with check (bucket_id = 'cimi-photos');

drop policy if exists "cimi_photos_bucket_auth_delete" on storage.objects;
create policy "cimi_photos_bucket_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'cimi-photos');

-- ============================================================================
-- 5. REALTIME (OPSIONAL AGAR UPDATE LANGSUNG MUNCUL DI SEMUA PENGUNJUNG)
-- ============================================================================

do $$
begin
  alter publication supabase_realtime add table public.cimi_photos;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.cimi_certificate;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- ============================================================================
-- LANGKAH PENTING SETELAH MENJALANKAN SQL INI:
-- 1. Buka Supabase Dashboard -> Authentication -> Users -> Add user -> Create new user
--    (buat 1 akun Email & Password khusus untuk Mode Pawrent).
-- 2. (Disarankan) Di Authentication -> Providers -> Email (atau Sign In / Providers),
--    matikan opsi "Allow new users to sign up" agar tidak ada orang asing bisa daftar.
-- 3. Salin Project URL & anon public key dari Project Settings -> API
--    ke file `.env` (lokal) dan Environment Variables di Vercel.
-- ============================================================================
