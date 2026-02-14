-- ==========================================
-- Smart Bookmark App - Complete Setup Script
-- ==========================================

-- 1. Create the 'bookmarks' table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid default auth.uid() not null,
  title text not null,
  url text not null,
  
  -- Link user_id to Supabase Auth users
  constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade
);

-- 2. Enable Row Level Security (RLS)
alter table public.bookmarks enable row level security;

-- 3. Clean up existing policies (to ensure clean slate if re-running)
drop policy if exists "Users can view own bookmarks" on bookmarks;
drop policy if exists "Users can insert own bookmarks" on bookmarks;
drop policy if exists "Users can update own bookmarks" on bookmarks;
drop policy if exists "Users can delete own bookmarks" on bookmarks;

-- 4. Create RLS Policies (CRUD Permissions)

-- VIEW: Allow users to see only their own bookmarks
create policy "Users can view own bookmarks"
on public.bookmarks for select
using (auth.uid() = user_id);

-- INSERT: Allow users to create bookmarks (automatically assigned to them)
create policy "Users can insert own bookmarks"
on public.bookmarks for insert
with check (auth.uid() = user_id);

-- UPDATE: Allow users to edit their own bookmarks
create policy "Users can update own bookmarks"
on public.bookmarks for update
using (auth.uid() = user_id);

-- DELETE: Allow users to delete their own bookmarks
create policy "Users can delete own bookmarks"
on public.bookmarks for delete
using (auth.uid() = user_id);

-- 5. Enable Realtime Functionality
-- Check if the publication exists, if not create it (standard Supabase setup usually has it)
-- Then add the table to the publication
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'bookmarks') then
    alter publication supabase_realtime add table bookmarks;
  end if;
end
$$;

-- Setup Complete!
