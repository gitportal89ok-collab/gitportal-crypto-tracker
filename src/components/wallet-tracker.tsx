'use client'

import { useState } from 'react'
import { WalletBalance, Transaction } from '@/types/crypto'
import { Search, Wallet, ExternalLink, Copy, Check } from 'lucide-react'

interface WalletTrackerProps {
  onAddressSubmit: (address: string) => void
  loading: boolean
}

export function WalletTracker({ onAddressSubmit, loading }: WalletTrackerProps) {
  const [address, setAddress] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onAddressSubmit(address.trim())
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-2">
          <Wallet className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Wallet Tracker
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter an Ethereum address to view on-chain data
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {address && (
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!address.trim() || loading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Track'}
        </button>
      </form>
    </div>
  )
}
