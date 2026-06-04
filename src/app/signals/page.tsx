'use client'

import { useState, useEffect } from 'react'
import { Signal, CoinPrice } from '@/types/crypto'
import { SignalCard } from '@/components/signal-card'
import { SignalHistory } from '@/components/signal-history'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { RefreshCw, Brain } from 'lucide-react'

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [signalHistory, setSignalHistory] = useState<Signal[]>([])
  const [coins, setCoins] = useState<CoinPrice[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [training, setTraining] = useState(false)

  useEffect(() => {
    fetchSignals()
    fetchCoins()
  }, [])

  useEffect(() => {
    if (selectedCoin) {
      fetchSignalHistory(selectedCoin)
    }
  }, [selectedCoin])

  const fetchSignals = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/signals')
      const data = await res.json()
      setSignals(data.signals || [])
    } catch (error) {
      console.error('Failed to fetch signals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCoins = async () => {
    try {
      const res = await fetch('/api/prices?limit=50')
      const data = await res.json()
      setCoins(data)
      if (data.length > 0 && !selectedCoin) {
        setSelectedCoin(data[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch coins:', error)
    }
  }

  const fetchSignalHistory = async (coinId: string) => {
    try {
      const res = await fetch(`/api/signals?coin_id=${coinId}&history=true`)
      const data = await res.json()
      setSignalHistory(data.signals || [])
    } catch (error) {
      console.error('Failed to fetch signal history:', error)
    }
  }

  const handleTrainModel = async () => {
    if (!selectedCoin) return

    setTraining(true)
    try {
      await fetch('/api/signals/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin_id: selectedCoin }),
      })
      alert('Model training started! This may take a few minutes.')
    } catch (error) {
      console.error('Failed to train model:', error)
      alert('Failed to start training. Please try again.')
    } finally {
      setTraining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  const latestSignals = signals.slice(0, 10)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                AI Trading Signals
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                AI-powered buy/sell/hold predictions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
              <button
                onClick={handleTrainModel}
                disabled={training || !selectedCoin}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                <Brain className="h-4 w-4" />
                {training ? 'Training...' : 'Retrain Model'}
              </button>
              <button
                onClick={fetchSignals}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {latestSignals.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-center">
                <Brain className="mx-auto h-12 w-12 text-zinc-400" />
                <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                  No signals available yet
                </p>
                <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                  Train a model or wait for the AI service to generate signals
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {latestSignals.map((signal) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    coinName={coins.find((c) => c.id === signal.coinId)?.name}
                  />
                ))}
              </div>

              <SignalHistory signals={signalHistory} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
