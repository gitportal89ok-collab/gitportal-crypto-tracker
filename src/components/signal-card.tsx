'use client'

import { Signal } from '@/types/crypto'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Brain, Clock } from 'lucide-react'

interface SignalCardProps {
  signal: Signal
  coinName?: string
}

export function SignalCard({ signal, coinName }: SignalCardProps) {
  const signalConfig = {
    BUY: {
      label: 'BUY',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
    },
    SELL: {
      label: 'SELL',
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: TrendingDown,
      iconColor: 'text-red-500',
    },
    HOLD: {
      label: 'HOLD',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      icon: Minus,
      iconColor: 'text-amber-500',
    },
  }

  const config = signalConfig[signal.signal]
  const Icon = config.icon

  const confidenceColor =
    signal.confidence >= 0.7
      ? 'text-emerald-600'
      : signal.confidence >= 0.4
        ? 'text-amber-600'
        : 'text-red-600'

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2', config.color)}>
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {signal.coinSymbol.toUpperCase()}
            </h3>
            {coinName && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {coinName}
              </p>
            )}
          </div>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-sm font-semibold',
            config.color
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Confidence</p>
          <p className={cn('text-2xl font-bold', confidenceColor)}>
            {(signal.confidence * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Price</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ${signal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Brain className="h-4 w-4" />
          <span>{signal.model}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Clock className="h-4 w-4" />
          <span>{new Date(signal.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
