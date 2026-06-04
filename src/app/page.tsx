'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  TrendingUp,
  Briefcase,
  Brain,
  Newspaper,
  Link2,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: "Real-time Prices",
    description: "Live cryptocurrency prices powered by CoinGecko with WebSocket updates",
    href: "/",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Briefcase,
    title: "Portfolio Tracking",
    description: "Track your crypto holdings, profit/loss, and portfolio allocation",
    href: "/portfolio",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Brain,
    title: "AI Trading Signals",
    description: "AI-powered buy/sell/hold predictions with confidence scores",
    href: "/signals",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: Newspaper,
    title: "News & Sentiment",
    description: "Latest crypto news with sentiment analysis from social media",
    href: "/news",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: Globe,
    title: "Sentiment Analysis",
    description: "Real-time market sentiment from Twitter, Reddit, and news sources",
    href: "/sentiment",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    icon: Link2,
    title: "On-chain Analytics",
    description: "Explore blockchain data, wallet tracking, and transaction history",
    href: "/onchain",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <span>GitPortal</span>
            <span className="text-xs font-normal text-zinc-500">Crypto Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20 text-center lg:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            <Zap className="h-4 w-4" />
            AI-Powered Crypto Intelligence
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-6xl">
            GitPortal
            <span className="block text-emerald-500">Crypto Tracker</span>
          </h1>
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 lg:text-xl">
            Real-time prices, portfolio tracking, AI trading signals, sentiment analysis,
            and on-chain analytics — all in one powerful dashboard.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40"
            >
              Open Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Start Tracking
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-200 bg-white/50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 lg:grid-cols-4 lg:px-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500">10+</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Crypto Coins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">6</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Analytics Pages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">AI</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Trading Signals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500">24/7</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Real-time Data</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Everything You Need
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Comprehensive crypto analytics powered by AI
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.bg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-12 text-center text-white shadow-2xl">
          <Shield className="mx-auto mb-6 h-12 w-12 opacity-90" />
          <h2 className="mb-4 text-3xl font-bold">Ready to Start?</h2>
          <p className="mb-8 text-lg text-emerald-100">
            No registration required. Start tracking your crypto portfolio now.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-emerald-600 shadow-lg transition-all hover:bg-emerald-50"
          >
            Open Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-6">
          <div className="mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <span className="font-bold">GitPortal Crypto Tracker</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            AI-powered crypto intelligence dashboard. Built with Next.js, React, and Tailwind CSS.
          </p>
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            © 2024 GitPortal. Data provided by CoinGecko, Etherscan, and CryptoPanic.
          </p>
        </div>
      </footer>
    </div>
  )
}
