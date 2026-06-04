'use client'

import { Signal } from '@/types/crypto'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface SignalHistoryProps {
  signals: Signal[]
}

export function SignalHistory({ signals }: SignalHistoryProps) {
  const chartData = signals.map((signal) => ({
    time: new Date(signal.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    price: signal.price,
    confidence: signal.confidence * 100,
    signal: signal.signal,
  }))

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return '#10b981'
      case 'SELL':
        return '#ef4444'
      default:
        return '#f59e0b'
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {label}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Price: ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Confidence: {data.confidence.toFixed(1)}%
          </p>
          <p
            className="text-sm font-medium"
            style={{ color: getSignalColor(data.signal) }}
          >
            Signal: {data.signal}
          </p>
        </div>
      )
    }
    return null
  }

  if (signals.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">No signal history available</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Signal History
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            yAxisId="price"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            yAxisId="confidence"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="confidence"
            type="monotone"
            dataKey="confidence"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
