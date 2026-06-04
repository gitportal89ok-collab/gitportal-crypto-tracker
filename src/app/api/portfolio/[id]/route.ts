import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const holding = await prisma.portfolio.findFirst({
      where: { id },
    })

    if (!holding) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(holding)
  } catch (error) {
    console.error('Portfolio [id] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.portfolio.findFirst({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        quantity: body.quantity ?? existing.quantity,
        avgBuyPrice: body.avgBuyPrice ?? existing.avgBuyPrice,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Portfolio [id] PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.portfolio.findFirst({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.portfolio.delete({ where: { id } })

    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Portfolio [id] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
