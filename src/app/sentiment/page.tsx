'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SentimentScore, CoinPrice } from '@/types/crypto'
import { SentimentGauge } from '@/components/sentiment-gauge'
import { SocialFeed } from '@/components/social-feed'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { RefreshCw, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function SentimentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sentimentData, setSentimentData] = useState<SentimentScore[]>([])
  const [summary, setSummary] = useState<{
    averageScore: number
    positive: number
    negative: number
    neutral: number
    total: number
  } | null>(null)
  const [coins, setCoins] = useState<CoinPrice[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSentiment()
      fetchCoins()
    }
  }, [status, selectedCoin])

  const fetchSentiment = async () => {
    setLoading(true)
    try {
      const url = selectedCoin
        ? `/api/sentiment?coin_id=${selectedCoin}`
        : '/api/sentiment'
      const res = await fetch(url)
      const data = await res.json()
      setSentimentData(data.sentiment || [])
      setSummary(data.summary)
    } catch (error) {
      console.error('Failed to fetch sentiment:', error)
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
                Sentiment Analysis
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Real-time market sentiment from social media and news
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
                onClick={fetchSentiment}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {summary && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Overall Sentiment</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {summary.averageScore >= 0.3
                        ? 'Bullish'
                        : summary.averageScore <= -0.3
                          ? 'Bearish'
                          : 'Neutral'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Positive</p>
                    <p className="text-2xl font-bold text-emerald-600">{summary.positive}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-50 p-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Negative</p>
                    <p className="text-2xl font-bold text-red-600">{summary.negative}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-50 p-2">
                    <Minus className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Neutral</p>
                    <p className="text-2xl font-bold text-amber-600">{summary.neutral}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <SentimentGauge
              score={summary?.averageScore || 0}
              label="Market Sentiment"
              size="lg"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Social Feed
              </h2>
              <SocialFeed items={sentimentData} />
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Sentiment by Source
              </h2>
              <div className="space-y-4">
                {['twitter', 'reddit', 'news'].map((source) => {
                  const sourceData = sentimentData.filter((item) => item.source === source)
                  const avgScore =
                    sourceData.reduce((acc, item) => acc + item.score, 0) / sourceData.length || 0

                  return (
                    <div key={source} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                          {source}
                        </span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {sourceData.length} posts
                        </span>
                      </div>
                      <SentimentGauge score={avgScore} size="sm" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
