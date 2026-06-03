import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const holdings = await prisma.portfolio.findMany({
      where: { userId: session.user.id },
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { coinId, coinSymbol, coinName, quantity, avgBuyPrice } = body

    if (!coinId || !coinSymbol || !coinName || !quantity || !avgBuyPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if holding already exists for this coin
    const existing = await prisma.portfolio.findUnique({
      where: {
        userId_coinId: {
          userId: session.user.id,
          coinId,
        },
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
        userId: session.user.id,
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
