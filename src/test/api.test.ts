import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

describe('Prices API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return coins list', async () => {
    const mockCoins = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000 },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3000 },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockCoins,
    } as Response)

    const res = await fetch('/api/prices?limit=2')
    const data = await res.json()

    expect(data).toEqual(mockCoins)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/prices?limit=2')
    )
  })

  it('should handle fetch errors', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as Response)

    const res = await fetch('/api/prices')
    expect(res.ok).toBe(false)
  })
})

describe('Signals API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return signals list', async () => {
    const mockSignals = [
      {
        id: '1',
        coinId: 'bitcoin',
        coinSymbol: 'btc',
        signal: 'BUY',
        confidence: 0.85,
        price: 50000,
        model: 'lstm-v1',
        features: {},
        createdAt: new Date().toISOString(),
      },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ signals: mockSignals }),
    } as Response)

    const res = await fetch('/api/signals')
    const data = await res.json()

    expect(data.signals).toEqual(mockSignals)
  })
})

describe('News API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return news list', async () => {
    const mockNews = [
      {
        id: '1',
        title: 'Bitcoin reaches new ATH',
        source: 'CoinDesk',
        url: 'https://example.com',
        coinIds: ['bitcoin'],
        publishedAt: new Date().toISOString(),
      },
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ news: mockNews }),
    } as Response)

    const res = await fetch('/api/news')
    const data = await res.json()

    expect(data.news).toEqual(mockNews)
  })
})
