import { config } from '../config'
import { CoinPrice, CoinDetail, PriceHistory } from '@/types/crypto'

export async function getTopCoins(limit = 20): Promise<CoinPrice[]> {
  const url = `${config.coingecko.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`

  const res = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error('Failed to fetch prices')

  return res.json()
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const res = await fetch(`${config.coingecko.baseUrl}/coins/${id}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error('Failed to fetch coin detail')
  return res.json()
}

export async function getCoinHistory(id: string, days = 30): Promise<PriceHistory> {
  const res = await fetch(
    `${config.coingecko.baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    { next: { revalidate: 120 } }
  )
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function searchCoins(query: string) {
  const res = await fetch(
    `${config.coingecko.baseUrl}/search?query=${encodeURIComponent(query)}`,
    { next: { revalidate: 600 } }
  )
  if (!res.ok) throw new Error('Failed to search coins')
  return res.json()
}
