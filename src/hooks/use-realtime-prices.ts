'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getBinanceWebSocket } from '@/lib/websocket'

interface PriceData {
  symbol: string
  price: number
  timestamp: number
}

interface UseRealtimePricesReturn {
  prices: Map<string, PriceData>
  getPrice: (symbol: string) => PriceData | undefined
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  isConnected: boolean
}

export function useRealtimePrices(symbols: string[] = ['btcusdt', 'ethusdt', 'solusdt']): UseRealtimePricesReturn {
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  const wsRef = useRef(getBinanceWebSocket())

  useEffect(() => {
    const ws = wsRef.current

    // Connect to WebSocket
    ws.connect(symbols)

    // Subscribe to connection status changes
    const unsubscribeConnection = ws.onConnectionChange(setConnectionStatus)

    // Subscribe to price updates for each symbol
    const unsubscribers = symbols.map((symbol) =>
      ws.subscribe(symbol, (data) => {
        setPrices((prev) => {
          const next = new Map(prev)
          next.set(symbol.toLowerCase(), data)
          return next
        })
      })
    )

    return () => {
      unsubscribeConnection()
      unsubscribers.forEach((unsub) => unsub())
      ws.disconnect()
    }
  }, [symbols.join(',')])

  const getPrice = useCallback(
    (symbol: string) => {
      return prices.get(symbol.toLowerCase())
    },
    [prices]
  )

  return {
    prices,
    getPrice,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
  }
}
