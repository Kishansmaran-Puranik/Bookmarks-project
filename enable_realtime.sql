-- Enable replication for the bookmarks table
-- This is REQUIRED for Realtime updates to work
alter publication supabase_realtime add table bookmarks;
