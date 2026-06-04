import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_USER_ID = 'anonymous'

export async function GET() {
  try {
    const holdings = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(holdings)
  } catch (error) {
    console.error('Portfolio GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { coinId, coinSymbol, coinName, quantity, avgBuyPrice } = body

    if (!coinId || !coinSymbol || !coinName || !quantity || !avgBuyPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if holding already exists for this coin
    const existing = await prisma.portfolio.findFirst({
      where: {
        coinId,
      },
    })

    if (existing) {
      // Update existing holding (average the buy price)
      const totalQuantity = existing.quantity + quantity
      const totalCost = existing.quantity * existing.avgBuyPrice + quantity * avgBuyPrice
      const newAvgPrice = totalCost / totalQuantity

      const updated = await prisma.portfolio.update({
        where: { id: existing.id },
        data: {
          quantity: totalQuantity,
          avgBuyPrice: newAvgPrice,
        },
      })
      return NextResponse.json(updated)
    }

    const holding = await prisma.portfolio.create({
      data: {
        userId: DEFAULT_USER_ID,
        coinId,
        coinSymbol,
        coinName,
        quantity,
        avgBuyPrice,
      },
    })

    return NextResponse.json(holding, { status: 201 })
  } catch (error) {
    console.error('Portfolio POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
