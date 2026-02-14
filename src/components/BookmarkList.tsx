'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Bookmark } from '@/types'
import { Trash2, ExternalLink, Calendar, Link2, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setBookmarks(initialBookmarks)

        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookmarks' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) => prev.map((b) => b.id === payload.new.id ? payload.new as Bookmark : b))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, initialBookmarks])

    const confirmDelete = async () => {
        if (!deletingId) return
        setIsDeleting(true)

        // Optimistic update could go here, but for now we rely on realtime
        const { error } = await supabase.from('bookmarks').delete().eq('id', deletingId)

        setIsDeleting(false)
        setDeletingId(null)

        if (error) {
            console.error('Error deleting:', error)
            alert('Failed to delete bookmark')
        }
    }

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        } catch {
            return ''
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {bookmarks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-20 text-center"
                        >
                            <div className="mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 p-4">
                                <Link2 className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No bookmarks yet</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add your first bookmark to get started</p>
                        </motion.div>
                    )}
                    {bookmarks.map((bookmark) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            key={bookmark.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/70 dark:bg-gray-800/70 p-5 shadow-sm backdrop-blur-md ring-1 ring-gray-200/50 dark:ring-gray-700/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/10"
                        >
                            <div>
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700 p-2 shadow-inner">
                                        {/* Fallback icon if image fails to load (browser handles missing src gracefully usually, but we can just use img) */}
                                        <img
                                            src={getFaviconUrl(bookmark.url)}
                                            alt=""
                                            className="h-full w-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                        {/* Backup Icon logic would be complex in one line, relying on CSS hiding if img fails or empty */}
                                    </div>
                                    <button
                                        onClick={() => setDeletingId(bookmark.id)}
                                        className="rounded-lg p-2 text-gray-400 transition-opacity hover:bg-red-50 hover:text-red-500 focus:opacity-100 dark:hover:bg-red-900/20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                        aria-label="Delete bookmark"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="mb-1 font-bold text-gray-900 dark:text-white line-clamp-2" title={bookmark.title}>
                                    {bookmark.title}
                                </h3>

                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(bookmark.created_at)}
                                </p>
                            </div>

                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <span className="truncate">{new URL(bookmark.url).hostname}</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 mt-32"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Delete Bookmark?
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setDeletingId(null)}
                                    disabled={isDeleting}
                                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
