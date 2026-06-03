'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CoinPrice } from '@/types/crypto'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume'

export function CoinsTable() {
  const [coins, setCoins] = useState<CoinPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [])

  async function fetchCoins() {
    try {
      const res = await fetch('/api/prices?limit=20')
      const data = await res.json()
      setCoins(data)
    } catch (err) {
      console.error('Failed to fetch coins:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...coins].sort((a, b) => {
    let aVal: number, bVal: number
    if (sortKey === 'market_cap_rank') {
      aVal = (a as any).market_cap_rank || 0
      bVal = (b as any).market_cap_rank || 0
    } else {
      aVal = (a as any)[sortKey] || 0
      bVal = (b as any)[sortKey] || 0
    }
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  function formatMarketCap(cap: number) {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`
    return `$${cap.toLocaleString()}`
  }

  if (loading) {
    return (
      <Card className="p-8 text-center text-zinc-500">
        <TrendingUp className="mx-auto h-8 w-8 animate-pulse text-emerald-500 mb-2" />
        Loading prices...
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Top Cryptocurrencies</h2>
        <p className="text-sm text-zinc-500">Real-time prices from CoinGecko</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Coin</TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('current_price')}>
                Price {sortKey === 'current_price' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('price_change_percentage_24h')}>
                24h % {sortKey === 'price_change_percentage_24h' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right hidden sm:table-cell cursor-pointer" onClick={() => handleSort('market_cap')}>
                Market Cap {sortKey === 'market_cap' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right hidden md:table-cell cursor-pointer" onClick={() => handleSort('total_volume')}>
                Volume (24h) {sortKey === 'total_volume' && (sortDir === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((coin, index) => {
              const change = coin.price_change_percentage_24h ?? 0
              const isPositive = change >= 0
              return (
                <TableRow key={coin.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <TableCell className="text-zinc-500 text-sm">
                    {(coin as any).market_cap_rank || index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-zinc-500 uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatPrice(coin.current_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center gap-1 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">
                    {formatMarketCap(coin.market_cap)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-zinc-600 dark:text-zinc-400 hidden md:table-cell">
                    {formatMarketCap(coin.total_volume)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
