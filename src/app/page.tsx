
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import LogoutButton from '@/components/LogoutButton'
import { Bookmark, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  // Get greeting based on time of day (server-side, crude approximation or just generic)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl dark:border-gray-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm text-white">
              <Bookmark className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Smart Marks</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 border border-gray-200 dark:border-gray-700">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{user.email}</span>
            </div>

            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {greeting}, User
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Manage your personal collection of links.
          </p>
        </div>

        {/* Add Form Area */}
        <div className="mx-auto max-w-2xl mb-12">
          <AddBookmarkForm />
        </div>

        {/* Content Area */}
        <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
      </main>
    </div>
  )
}
