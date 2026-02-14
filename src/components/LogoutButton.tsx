'use client'

import { useState } from 'react'
import { LogOut, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from '@/app/actions'

export default function LogoutButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        await signOut()
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                title="Sign Out"
                className="group flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
            >
                <LogOut className="h-5 w-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
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
                                    Sign out?
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to sign out of your account?
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={loading}
                                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                                >
                                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
