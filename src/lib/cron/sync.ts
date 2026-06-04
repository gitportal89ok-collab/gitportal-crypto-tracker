import { config } from '../config'

interface SyncResult {
  success: boolean
  message: string
  recordsSynced: number
  timestamp: string
}

export async function syncPriceHistory(): Promise<SyncResult> {
  try {
    // Fetch top 100 coins
    const res = await fetch(
      `${config.coingecko.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch prices')
    }

    const coins = await res.json()

    // In production, this would save to database
    // For now, we'll just log the sync
    console.log(`Synced ${coins.length} coins at ${new Date().toISOString()}`)

    return {
      success: true,
      message: `Synced ${coins.length} coins`,
      recordsSynced: coins.length,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Price sync error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      recordsSynced: 0,
      timestamp: new Date().toISOString(),
    }
  }
}

export async function syncNews(): Promise<SyncResult> {
  try {
    const res = await fetch(
      `${config.cryptopanic.baseUrl}/posts/?auth_token=${config.cryptopanic.apiKey}&filter=important&public=true&kind=news`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await res.json()

    // In production, this would save to database
    console.log(`Synced ${data.results.length} news articles at ${new Date().toISOString()}`)

    return {
      success: true,
      message: `Synced ${data.results.length} news articles`,
      recordsSynced: data.results.length,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('News sync error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      recordsSynced: 0,
      timestamp: new Date().toISOString(),
    }
  }
}

export async function runAllSyncs(): Promise<{
  prices: SyncResult
  news: SyncResult
}> {
  const [prices, news] = await Promise.all([syncPriceHistory(), syncNews()])

  return { prices, news }
}
