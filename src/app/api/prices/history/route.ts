import { NextResponse } from 'next/server'
import { getCoinHistory } from '@/lib/api/coingecko'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId') || 'bitcoin'
    const days = parseInt(searchParams.get('days') || '7')

    const data = await getCoinHistory(coinId, days)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Price history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}
