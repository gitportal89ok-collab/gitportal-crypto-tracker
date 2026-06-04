'use client'

import { NewsArticle } from '@/types/crypto'
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({ article }: NewsCardProps) {
  const sentimentConfig = {
    positive: {
      label: 'Positive',
      color: 'text-emerald-600 bg-emerald-50',
      icon: TrendingUp,
    },
    negative: {
      label: 'Negative',
      color: 'text-red-600 bg-red-50',
      icon: TrendingDown,
    },
    neutral: {
      label: 'Neutral',
      color: 'text-amber-600 bg-amber-50',
      icon: Minus,
    },
  }

  const sentiment = article.sentiment || 'neutral'
  const config = sentimentConfig[sentiment]
  const SentimentIcon = config.icon

  const timeAgo = getTimeAgo(article.publishedAt)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-start justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {article.source}
        </span>
        <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.color)}>
          <SentimentIcon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {article.title}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Clock className="h-3 w-3" />
          <span>{timeAgo}</span>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          Read more
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {article.coinIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {article.coinIds.slice(0, 3).map((coinId) => (
            <span
              key={coinId}
              className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              ${coinId.toUpperCase()}
            </span>
          ))}
          {article.coinIds.length > 3 && (
            <span className="text-xs text-zinc-500">+{article.coinIds.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
