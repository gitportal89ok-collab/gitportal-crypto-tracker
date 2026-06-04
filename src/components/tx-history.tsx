'use client'

import { Transaction } from '@/types/crypto'
import { ExternalLink, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TxHistoryProps {
  transactions: Transaction[]
  currentAddress?: string
}

export function TxHistory({ transactions, currentAddress }: TxHistoryProps) {
  const formatValue = (value: string) => {
    const eth = parseInt(value) / 1e18
    return eth.toFixed(4)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const isOutgoing = (tx: Transaction) =>
    currentAddress && tx.from.toLowerCase() === currentAddress.toLowerCase()

  if (transactions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <p className="text-zinc-500 dark:text-zinc-400">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Transactions
        </h3>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'rounded-full p-2',
                  isOutgoing(tx)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-emerald-50 text-emerald-500'
                )}
              >
                {isOutgoing(tx) ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {isOutgoing(tx) ? 'Sent' : 'Received'}
                  </span>
                  {tx.isError === '1' && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                      Failed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{isOutgoing(tx) ? 'To' : 'From'}:</span>
                  <span className="font-mono">
                    {formatAddress(isOutgoing(tx) ? tx.to : tx.from)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={cn(
                  'text-sm font-semibold',
                  isOutgoing(tx) ? 'text-red-600' : 'text-emerald-600'
                )}
              >
                {isOutgoing(tx) ? '-' : '+'}
                {formatValue(tx.value)} ETH
              </div>
              <div className="flex items-center justify-end gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>{formatTime(tx.timestamp)}</span>
              </div>
            </div>

            <a
              href={`https://etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
