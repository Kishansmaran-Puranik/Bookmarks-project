-- Create bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid default auth.uid() not null, -- Automatically set to the logged-in user
  title text not null,
  url text not null,
  
  -- Foreign Key to auth.users
  constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade
);

-- Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Policy 1: Users can view their own bookmarks
create policy "Users can view own bookmarks"
on bookmarks for select
to authenticated
using (auth.uid() = user_id);

-- Policy 2: Users can insert their own bookmarks
create policy "Users can insert own bookmarks"
on bookmarks for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy 3: Users can delete their own bookmarks
create policy "Users can delete own bookmarks"
on bookmarks for delete
to authenticated
using (auth.uid() = user_id);

-- Optional: Realtime
-- To enable realtime, you need to go to Database -> Replication in the Supabase Dashboard
-- and toggle "supabase_realtime" for the "bookmarks" table.
