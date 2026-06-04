import { NextResponse } from 'next/server'
import { syncPriceHistory, syncNews, runAllSyncs } from '@/lib/cron/sync'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'all'

  try {
    let result

    switch (action) {
      case 'prices':
        result = await syncPriceHistory()
        return NextResponse.json({ sync: result })

      case 'news':
        result = await syncNews()
        return NextResponse.json({ sync: result })

      case 'all':
        result = await runAllSyncs()
        return NextResponse.json({ sync: result })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: prices, news, or all' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return sync status (in production, this would read from database)
  return NextResponse.json({
    lastSync: {
      prices: new Date().toISOString(),
      news: new Date().toISOString(),
    },
    status: 'idle',
  })
}
