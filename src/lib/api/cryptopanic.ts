import { config } from '../config'
import { NewsArticle } from '@/types/crypto'

// Mock news data for development without API key
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin Reaches New All-Time High Above $70,000',
    source: 'CoinDesk',
    url: 'https://example.com/news/1',
    coinIds: ['bitcoin'],
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Upgrade Shows Promising Results',
    source: 'Decrypt',
    url: 'https://example.com/news/2',
    coinIds: ['ethereum'],
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    sentiment: 'positive',
  },
  {
    id: '3',
    title: 'SEC Announces New Crypto Regulations Framework',
    source: 'Reuters',
    url: 'https://example.com/news/3',
    coinIds: ['bitcoin', 'ethereum'],
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    sentiment: 'neutral',
  },
  {
    id: '4',
    title: 'Solana Network Experiences Brief Outage',
    source: 'The Block',
    url: 'https://example.com/news/4',
    coinIds: ['solana'],
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    sentiment: 'negative',
  },
  {
    id: '5',
    title: 'Major Bank Announces Bitcoin Custody Service',
    source: 'Bloomberg',
    url: 'https://example.com/news/5',
    coinIds: ['bitcoin'],
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    sentiment: 'positive',
  },
  {
    id: '6',
    title: 'DeFi Total Value Locked Surpasses $100 Billion',
    source: 'DeFi Pulse',
    url: 'https://example.com/news/6',
    coinIds: ['ethereum', 'avalanche-2', 'solana'],
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    sentiment: 'positive',
  },
  {
    id: '7',
    title: 'Crypto Mining Difficulty Reaches Record High',
    source: 'CoinTelegraph',
    url: 'https://example.com/news/7',
    coinIds: ['bitcoin'],
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    sentiment: 'neutral',
  },
  {
    id: '8',
    title: 'New Layer 2 Solution Promises 10x Faster Transactions',
    source: 'TechCrunch',
    url: 'https://example.com/news/8',
    coinIds: ['ethereum'],
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    createdAt: new Date(Date.now() - 25200000).toISOString(),
    sentiment: 'positive',
  },
]

interface CryptoPanicResponse {
  results: Array<{
    id: number
    title: string
    slug: string
    published_at: string
    source: {
      title: string
    }
    url: string
    votes: {
      negative: number
      positive: number
      important: number
      liked: number
      lol: number
      insightful: number
      total: number
    }
    currencies?: Array<{
      code: string
      title: string
      slug: string
    }>
  }>
}

export async function getCryptoNews(
  coinIds?: string[],
  limit = 20
): Promise<NewsArticle[]> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('Using mock data for news')
    let filtered = mockNews
    if (coinIds && coinIds.length > 0) {
      filtered = mockNews.filter(article =>
        article.coinIds.some(id => coinIds.includes(id))
      )
    }
    return filtered.slice(0, limit)
  }

  const params = new URLSearchParams()
  params.append('filter', 'important')
  params.append('public', 'true')
  params.append('kind', 'news')

  if (coinIds && coinIds.length > 0) {
    coinIds.forEach((id) => params.append('currencies', id))
  }

  try {
    const res = await fetch(
      `${config.cryptopanic.baseUrl}/posts/?auth_token=${config.cryptopanic.apiKey}&${params.toString()}`
    )

    if (!res.ok) {
      console.error('Failed to fetch crypto news:', res.statusText)
      return mockNews.slice(0, limit)
    }

    const data: CryptoPanicResponse = await res.json()

    return data.results.slice(0, limit).map((item) => ({
      id: item.id.toString(),
      title: item.title,
      source: item.source.title,
      url: item.url,
      coinIds: item.currencies?.map((c) => c.slug) || [],
      publishedAt: item.published_at,
      createdAt: item.published_at,
      sentiment: getSentimentFromVotes(item.votes),
    }))
  } catch (error) {
    console.error('Error fetching crypto news, using mock data:', error)
    return mockNews.slice(0, limit)
  }
}

function getSentimentFromVotes(votes: {
  negative: number
  positive: number
}): 'positive' | 'negative' | 'neutral' {
  if (votes.positive > votes.negative * 1.5) return 'positive'
  if (votes.negative > votes.positive * 1.5) return 'negative'
  return 'neutral'
}

export async function getNewsByCoin(
  coinId: string,
  limit = 10
): Promise<NewsArticle[]> {
  return getCryptoNews([coinId], limit)
}
