'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Bookmark, Chrome } from 'lucide-react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async () => {
        setLoading(true)
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
                <div className="p-8 sm:p-12 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                    >
                        <Bookmark className="h-8 w-8 text-white" />
                    </motion.div>

                    <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="mb-8 text-gray-500 dark:text-gray-400">
                        Sign in to access your smart library
                    </p>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-gray-800 px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:ring-gray-400 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                            // Google Logo SVG
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        <span className="text-base">Continue with Google</span>
                    </button>
                </div>
                <div className="bg-gray-50/50 dark:bg-gray-900/30 px-8 py-4 text-center border-t border-gray-100 dark:border-white/5">
                    <p className="text-xs text-gray-400">
                        Secure access powered by Supabase Auth
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
