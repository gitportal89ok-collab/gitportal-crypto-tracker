'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { NewsArticle, CoinPrice } from '@/types/crypto'
import { NewsCard } from '@/components/news-card'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { RefreshCw, Newspaper, Filter } from 'lucide-react'

export default function NewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [news, setNews] = useState<NewsArticle[]>([])
  const [coins, setCoins] = useState<CoinPrice[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNews()
      fetchCoins()
    }
  }, [status, selectedCoin])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const url = selectedCoin
        ? `/api/news?coin_id=${selectedCoin}`
        : '/api/news'
      const res = await fetch(url)
      const data = await res.json()
      setNews(data.news || [])
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCoins = async () => {
    try {
      const res = await fetch('/api/prices?limit=50')
      const data = await res.json()
      setCoins(data)
    } catch (error) {
      console.error('Failed to fetch coins:', error)
    }
  }

  const filteredNews = filter === 'all'
    ? news
    : news.filter((article) => article.sentiment === filter)

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Crypto News
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Latest cryptocurrency news and updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="">All Coins</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
              <button
                onClick={fetchNews}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="mb-6 flex gap-2">
            {(['all', 'positive', 'negative', 'neutral'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filteredNews.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-center">
                <Newspaper className="mx-auto h-12 w-12 text-zinc-400" />
                <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                  No news available
                </p>
                <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                  Check back later for the latest crypto news
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
