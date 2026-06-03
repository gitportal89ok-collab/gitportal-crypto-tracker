import { NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/api/coingecko'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const coins = await getTopCoins(limit)
    return NextResponse.json(coins)
  } catch (error) {
    console.error('Price API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    )
  }
}
