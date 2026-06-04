import { config } from '../config'

type PriceCallback = (data: {
  symbol: string
  price: number
  timestamp: number
}) => void

type ConnectionCallback = (status: 'connected' | 'disconnected' | 'connecting') => void

class BinanceWebSocket {
  private ws: WebSocket | null = null
  private subscribers: Map<string, Set<PriceCallback>> = new Map()
  private connectionCallbacks: Set<ConnectionCallback> = new Set()
  private reconnectTimeout: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private symbols: string[] = []

  constructor() {
    this.handleMessage = this.handleMessage.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  connect(symbols: string[] = ['btcusdt', 'ethusdt', 'solusdt']) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.symbols = symbols
    this.notifyConnectionStatus('connecting')

    const streams = symbols.map((s) => `${s}@ticker`).join('/')
    const url = `${config.binance.wsUrl}/${streams}`

    try {
      this.ws = new WebSocket(url)
      this.ws.onmessage = this.handleMessage
      this.ws.onclose = this.handleClose
      this.ws.onerror = this.handleError
      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.notifyConnectionStatus('connected')
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.scheduleReconnect()
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.notifyConnectionStatus('disconnected')
  }

  subscribe(symbol: string, callback: PriceCallback): () => void {
    const normalizedSymbol = symbol.toLowerCase()

    if (!this.subscribers.has(normalizedSymbol)) {
      this.subscribers.set(normalizedSymbol, new Set())
    }

    this.subscribers.get(normalizedSymbol)!.add(callback)

    return () => {
      this.subscribers.get(normalizedSymbol)?.delete(callback)
    }
  }

  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.add(callback)
    return () => {
      this.connectionCallbacks.delete(callback)
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)
      const symbol = data.s?.toLowerCase()

      if (symbol && data.c) {
        const callbacks = this.subscribers.get(symbol)
        callbacks?.forEach((callback) => {
          callback({
            symbol: data.s,
            price: parseFloat(data.c),
            timestamp: Date.now(),
          })
        })
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  private handleClose() {
    this.notifyConnectionStatus('disconnected')
    this.scheduleReconnect()
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error)
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    this.reconnectAttempts++

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting... attempt ${this.reconnectAttempts}`)
      this.connect(this.symbols)
    }, delay)
  }

  private notifyConnectionStatus(status: 'connected' | 'disconnected' | 'connecting') {
    this.connectionCallbacks.forEach((callback) => callback(status))
  }
}

// Singleton instance
let instance: BinanceWebSocket | null = null

export function getBinanceWebSocket(): BinanceWebSocket {
  if (!instance) {
    instance = new BinanceWebSocket()
  }
  return instance
}
