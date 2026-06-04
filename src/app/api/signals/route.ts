import { NextResponse } from 'next/server'
import { getSignals, getSignalHistory } from '@/lib/api/ai-service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get('coin_id')
  const history = searchParams.get('history')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    if (history && coinId) {
      const signals = await getSignalHistory(coinId, limit)
      return NextResponse.json({ signals })
    }

    const signals = await getSignals(coinId || undefined)
    return NextResponse.json({ signals })
  } catch (error) {
    console.error('Error in signals API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    )
  }
}
