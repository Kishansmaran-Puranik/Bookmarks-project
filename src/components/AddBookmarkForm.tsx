'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Plus, Loader2, X, Link as LinkIcon, Type } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AddBookmarkForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        const { error } = await supabase.from('bookmarks').insert({
            title,
            url,
        })
        setLoading(false)

        if (error) {
            alert('Error adding bookmark')
        } else {
            setTitle('')
            setUrl('')
            setIsOpen(false)
        }
    }

    return (
        <div className="mb-10">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        layoutId="add-button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 p-8 text-gray-500 transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/10 dark:hover:text-blue-400"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-blue-100 dark:bg-gray-700 dark:group-hover:bg-blue-900/30 transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Add New Bookmark</span>
                    </motion.button>
                ) : (
                    <motion.form
                        layoutId="add-button"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Add to Library</h3>

                        <div className="space-y-5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <Type className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 py-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-500 dark:text-white"
                                    placeholder="Bookmark Title (e.g., My Portfolio)"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <LinkIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 py-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-500 dark:text-white"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Bookmark
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
