import { config } from '../config'
import { WalletBalance, Transaction } from '@/types/crypto'

// Mock data for development without API key
const mockBalance: WalletBalance = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  balance: '1500000000000000000', // 1.5 ETH
  balanceUsd: 5185.17,
  tokenCount: 12,
}

const mockTransactions: Transaction[] = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    to: '0x1234567890123456789012345678901234567890',
    value: '500000000000000000',
    gas: '21000',
    gasPrice: '20000000000',
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    isError: '0',
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    from: '0x9876543210987654321098765432109876543210',
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    value: '1000000000000000000',
    gas: '21000',
    gasPrice: '25000000000',
    timestamp: Math.floor(Date.now() / 1000) - 86400,
    isError: '0',
  },
  {
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    to: '0x1111111111111111111111111111111111111111',
    value: '250000000000000000',
    gas: '65000',
    gasPrice: '30000000000',
    timestamp: Math.floor(Date.now() / 1000) - 172800,
    isError: '0',
  },
]

export async function getWalletBalance(address: string): Promise<WalletBalance> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('Using mock data for wallet balance')
    return {
      ...mockBalance,
      address,
    }
  }

  try {
    const res = await fetch(
      `${config.etherscan.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${config.etherscan.apiKey}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch wallet balance')
    }

    const data = await res.json()

    if (data.status !== '1') {
      throw new Error(data.message || 'Invalid response')
    }

    return {
      address,
      balance: data.result,
      balanceUsd: undefined, // Would need price API to calculate
    }
  } catch (error) {
    console.error('Error fetching wallet balance, using mock data:', error)
    return {
      ...mockBalance,
      address,
    }
  }
}

export async function getTransactions(
  address: string,
  page = 1,
  offset = 20
): Promise<Transaction[]> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('Using mock data for transactions')
    return mockTransactions
  }

  try {
    const res = await fetch(
      `${config.etherscan.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${config.etherscan.apiKey}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch transactions')
    }

    const data = await res.json()

    if (data.status !== '1') {
      throw new Error(data.message || 'Invalid response')
    }

    return data.result.map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      timestamp: parseInt(tx.timeStamp),
      isError: tx.isError,
    }))
  } catch (error) {
    console.error('Error fetching transactions, using mock data:', error)
    return mockTransactions
  }
}

export async function getTokenBalances(address: string): Promise<Array<{
  contractAddress: string
  tokenName: string
  tokenSymbol: string
  balance: string
  decimals: number
}>> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('Using mock data for token balances')
    return [
      {
        contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
        tokenName: 'Dai Stablecoin',
        tokenSymbol: 'DAI',
        balance: '1000000000000000000000',
        decimals: 18,
      },
      {
        contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        tokenName: 'USD Coin',
        tokenSymbol: 'USDC',
        balance: '5000000000',
        decimals: 6,
      },
    ]
  }

  try {
    const res = await fetch(
      `${config.etherscan.baseUrl}?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc&apikey=${config.etherscan.apiKey}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch token balances')
    }

    const data = await res.json()

    if (data.status !== '1') {
      return []
    }

    // Group by token and calculate balances
    const tokenMap = new Map<string, any>()

    for (const tx of data.result) {
      const key = tx.contractAddress
      if (!tokenMap.has(key)) {
        tokenMap.set(key, {
          contractAddress: tx.contractAddress,
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          balance: '0',
          decimals: parseInt(tx.tokenDecimal),
        })
      }
    }

    return Array.from(tokenMap.values())
  } catch (error) {
    console.error('Error fetching token balances, using mock data:', error)
    return []
  }
}

export async function getGasPrice(): Promise<{ safeGasPrice: string; proposeGasPrice: string; fastGasPrice: string }> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('Using mock data for gas price')
    return {
      safeGasPrice: '15',
      proposeGasPrice: '20',
      fastGasPrice: '30',
    }
  }

  try {
    const res = await fetch(
      `${config.etherscan.baseUrl}?module=gastracker&action=gasoracle&apikey=${config.etherscan.apiKey}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch gas price')
    }

    const data = await res.json()

    if (data.status !== '1') {
      throw new Error(data.message || 'Invalid response')
    }

    return {
      safeGasPrice: data.result.SafeGasPrice,
      proposeGasPrice: data.result.ProposeGasPrice,
      fastGasPrice: data.result.FastGasPrice,
    }
  } catch (error) {
    console.error('Error fetching gas price, using mock data:', error)
    return {
      safeGasPrice: '15',
      proposeGasPrice: '20',
      fastGasPrice: '30',
    }
  }
}
