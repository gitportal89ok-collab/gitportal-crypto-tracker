'use client'

import { SentimentScore } from '@/types/crypto'
import { cn } from '@/lib/utils'
import { AtSign, MessageSquare, Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SocialFeedProps {
  items: SentimentScore[]
}

export function SocialFeed({ items }: SocialFeedProps) {
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'twitter':
        return AtSign
      case 'reddit':
        return MessageSquare
      default:
        return Newspaper
    }
  }

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'text-emerald-600 bg-emerald-50',
          icon: TrendingUp,
          label: 'Positive',
        }
      case 'negative':
        return {
          color: 'text-red-600 bg-red-50',
          icon: TrendingDown,
          label: 'Negative',
        }
      default:
        return {
          color: 'text-amber-600 bg-amber-50',
          icon: Minus,
          label: 'Neutral',
        }
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <p className="text-zinc-500 dark:text-zinc-400">No social data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const SourceIcon = getSourceIcon(item.source)
        const sentimentConfig = getSentimentConfig(item.sentiment)
        const SentimentIcon = sentimentConfig.icon

        return (
          <div
            key={item.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SourceIcon className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {item.source}
                </span>
              </div>
              <span
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  sentimentConfig.color
                )}
              >
                <SentimentIcon className="h-3 w-3" />
                {sentimentConfig.label}
              </span>
            </div>

            <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
              {item.content}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                {item.coinIds.slice(0, 3).map((coinId) => (
                  <span
                    key={coinId}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    ${coinId.toUpperCase()}
                  </span>
                ))}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Score: {(item.score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
