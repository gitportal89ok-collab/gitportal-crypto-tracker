import { config } from '../config'
import { NewsArticle } from '@/types/crypto'

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
      return []
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
    console.error('Error fetching crypto news:', error)
    return []
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
