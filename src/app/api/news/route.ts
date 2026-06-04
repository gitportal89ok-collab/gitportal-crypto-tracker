import { NextResponse } from 'next/server'
import { getCryptoNews, getNewsByCoin } from '@/lib/api/cryptopanic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get('coin_id')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let news

    if (coinId) {
      news = await getNewsByCoin(coinId, limit)
    } else {
      news = await getCryptoNews(undefined, limit)
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error in news API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
