import { NextResponse } from 'next/server'
import { SentimentScore } from '@/types/crypto'

// Mock sentiment data - in production, this would come from the AI service
const mockSentimentData: SentimentScore[] = [
  {
    id: '1',
    source: 'twitter',
    content: 'Bitcoin looking bullish! Breaking resistance at $70k. 🚀',
    sentiment: 'positive',
    score: 0.85,
    coinIds: ['bitcoin'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    source: 'reddit',
    content: 'ETH merge was overhyped, price action is disappointing',
    sentiment: 'negative',
    score: -0.6,
    coinIds: ['ethereum'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    source: 'news',
    content: 'SEC announces new crypto regulations framework',
    sentiment: 'neutral',
    score: 0.1,
    coinIds: ['bitcoin', 'ethereum'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    source: 'twitter',
    content: 'SOL ecosystem growing fast! New DeFi protocols launching daily',
    sentiment: 'positive',
    score: 0.72,
    coinIds: ['solana'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    source: 'reddit',
    content: 'Market seems uncertain, waiting for clear direction',
    sentiment: 'neutral',
    score: 0.05,
    coinIds: ['bitcoin', 'ethereum', 'solana'],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get('coin_id')
  const source = searchParams.get('source')

  try {
    let data = mockSentimentData

    if (coinId) {
      data = data.filter((item) => item.coinIds.includes(coinId))
    }

    if (source) {
      data = data.filter((item) => item.source === source)
    }

    // Calculate overall sentiment
    const avgScore = data.reduce((acc, item) => acc + item.score, 0) / data.length || 0
    const positiveCount = data.filter((item) => item.sentiment === 'positive').length
    const negativeCount = data.filter((item) => item.sentiment === 'negative').length
    const neutralCount = data.filter((item) => item.sentiment === 'neutral').length

    return NextResponse.json({
      sentiment: data,
      summary: {
        averageScore: avgScore,
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
        total: data.length,
      },
    })
  } catch (error) {
    console.error('Error in sentiment API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sentiment data' },
      { status: 500 }
    )
  }
}
