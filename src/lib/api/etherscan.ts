import { config } from '../config'
import { WalletBalance, Transaction } from '@/types/crypto'

export async function getWalletBalance(address: string): Promise<WalletBalance> {
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
    console.error('Error fetching wallet balance:', error)
    throw error
  }
}

export async function getTransactions(
  address: string,
  page = 1,
  offset = 20
): Promise<Transaction[]> {
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
    console.error('Error fetching transactions:', error)
    throw error
  }
}

export async function getTokenBalances(address: string): Promise<Array<{
  contractAddress: string
  tokenName: string
  tokenSymbol: string
  balance: string
  decimals: number
}>> {
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
    console.error('Error fetching token balances:', error)
    return []
  }
}

export async function getGasPrice(): Promise<{ safeGasPrice: string; proposeGasPrice: string; fastGasPrice: string }> {
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
    console.error('Error fetching gas price:', error)
    throw error
  }
}
