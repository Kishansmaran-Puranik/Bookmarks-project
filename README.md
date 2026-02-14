# Smart Bookmark App

A simple, beautiful, and secure bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Login**: Secure sign-in without passwords.
- **Private Bookmarks**: Each user has their own isolated list of bookmarks.
- **Real-time Updates**: Changes appear instantly across multiple tabs/devices using Supabase Realtime.
- **Responsive Design**: Works great on mobile and desktop.
- **Animations**: Smooth transitions with Framer Motion.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Postgres, Auth, Realtime)
- **Icons**: Lucide React

## Setup Instructions

1.  **Clone the repo**:
    ```bash
    git clone <repo-url>
    cd smart-bookmark-app
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file with:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

3.  **Supabase Setup**:
    - Create a new project on Supabase.
    - Run the SQL queries in `supabase_schema.sql` in the Supabase SQL Editor to set up the table and RLS policies.
    - Enable **Google OAuth** in Authentication -> Providers.
    - Enable **Realtime** for the `bookmarks` table in Database -> Replication.

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Challenges & Solutions

### 1. Real-time Subscription with RLS
**Problem**: Initially, I wasn't sure if `postgres_changes` would respect RLS policies for the `INSERT` events on the client side.
**Solution**: Supabase Realtime respects RLS. By enabling RLS and setting policies to `auth.uid() = user_id`, users only receive events for their own data. I configured the channel to listen to `schema: 'public', table: 'bookmarks'` and it worked seamlessly.

### 2. Middleware & Session Management
**Problem**: Keeping the session in sync between Server Components and Client Components in Next.js App Router.
**Solution**: Used the standard Supabase SSR middleware pattern. The `updateSession` function in middleware ensures the auth cookie is refreshed and valid for every request, preventing stale sessions.

### 3. Hydration Validations
**Problem**: Rendering time-dependent data or random values can cause hydration mismatches.
**Solution**: I ensured that the `BookmarkList` component initializes with the server-passed data and then strictly relies on client-side state updates for realtime changes, avoiding any initial render mismatch.
