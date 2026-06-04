'use client'

import { cn } from '@/lib/utils'

interface SentimentGaugeProps {
  score: number // -1 to 1
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SentimentGauge({ score, label, size = 'md' }: SentimentGaugeProps) {
  // Normalize score from -1..1 to 0..100
  const normalizedScore = ((score + 1) / 2) * 100

  const getColor = (score: number) => {
    if (score >= 0.3) return 'text-emerald-500'
    if (score <= -0.3) return 'text-red-500'
    return 'text-amber-500'
  }

  const getBarColor = (score: number) => {
    if (score >= 0.3) return 'bg-emerald-500'
    if (score <= -0.3) return 'bg-red-500'
    return 'bg-amber-500'
  }

  const getSentimentLabel = (score: number) => {
    if (score >= 0.5) return 'Very Bullish'
    if (score >= 0.3) return 'Bullish'
    if (score >= -0.3) return 'Neutral'
    if (score >= -0.5) return 'Bearish'
    return 'Very Bearish'
  }

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </span>
          <span className={cn('text-sm font-semibold', getColor(score))}>
            {getSentimentLabel(score)}
          </span>
        </div>
      )}
      <div className={cn('relative w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700', sizeClasses[size])}>
        <div
          className={cn('absolute left-0 top-0 h-full rounded-full transition-all', getBarColor(score))}
          style={{ width: `${normalizedScore}%` }}
        />
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-zinc-400 dark:bg-zinc-500" />
      </div>
      <div className="mt-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>
    </div>
  )
}
