import { NextResponse } from 'next/server'
import { getWalletBalance, getTransactions, getTokenBalances, getGasPrice } from '@/lib/api/etherscan'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const action = searchParams.get('action') || 'balance'

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    )
  }

  // Validate Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid Ethereum address format' },
      { status: 400 }
    )
  }

  try {
    switch (action) {
      case 'balance': {
        const balance = await getWalletBalance(address)
        return NextResponse.json(balance)
      }

      case 'transactions': {
        const page = parseInt(searchParams.get('page') || '1')
        const offset = parseInt(searchParams.get('offset') || '20')
        const transactions = await getTransactions(address, page, offset)
        return NextResponse.json({ transactions })
      }

      case 'tokens': {
        const tokens = await getTokenBalances(address)
        return NextResponse.json({ tokens })
      }

      case 'gas': {
        const gasPrice = await getGasPrice()
        return NextResponse.json(gasPrice)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: balance, transactions, tokens, or gas' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in onchain API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch on-chain data' },
      { status: 500 }
    )
  }
}
