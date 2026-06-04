'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { TrendingUp } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <span>GitPortal</span>
          <span className="text-xs font-normal text-zinc-500">Crypto Tracker</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Dashboard
          </Link>
          <Link href="/portfolio" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Portfolio
          </Link>
          <Link href="/signals" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            AI Signals
          </Link>
          <Link href="/news" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            News
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
