'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { WalletBalance, Transaction } from '@/types/crypto'
import { WalletTracker } from '@/components/wallet-tracker'
import { TxHistory } from '@/components/tx-history'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { RefreshCw, Link2, Wallet, Gas, ArrowUpDown } from 'lucide-react'

export default function OnChainPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [gasPrice, setGasPrice] = useState<{ safeGasPrice: string; proposeGasPrice: string; fastGasPrice: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentAddress, setCurrentAddress] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const handleAddressSubmit = async (address: string) => {
    setLoading(true)
    setCurrentAddress(address)

    try {
      const [balanceRes, txRes, gasRes] = await Promise.all([
        fetch(`/api/onchain?address=${address}&action=balance`),
        fetch(`/api/onchain?address=${address}&action=transactions&offset=20`),
        fetch(`/api/onchain?action=gas`),
      ])

      const balanceData = await balanceRes.json()
      const txData = await txRes.json()
      const gasData = await gasRes.json()

      setBalance(balanceData)
      setTransactions(txData.transactions || [])
      setGasPrice(gasData)
    } catch (error) {
      console.error('Failed to fetch on-chain data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              On-chain Analytics
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Explore blockchain data and wallet analytics
            </p>
          </div>

          <div className="mb-6">
            <WalletTracker
              onAddressSubmit={handleAddressSubmit}
              loading={loading}
            />
          </div>

          {loading && (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          )}

          {!loading && balance && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2">
                        <Wallet className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">ETH Balance</p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {(parseInt(balance.balance) / 1e18).toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-50 p-2">
                        <ArrowUpDown className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Transactions</p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {transactions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <TxHistory
                  transactions={transactions}
                  currentAddress={currentAddress}
                />
              </div>

              <div className="space-y-6">
                {gasPrice && (
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-amber-50 p-2">
                        <Gas className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Gas Prices
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Current ETH gas fees</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">🐌 Safe</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {gasPrice.safeGasPrice} Gwei
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">🚗 Standard</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {gasPrice.proposeGasPrice} Gwei
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">🚀 Fast</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {gasPrice.fastGasPrice} Gwei
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2">
                      <Link2 className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Quick Links
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={`https://etherscan.io/address/${currentAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      View on Etherscan
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://ethplorer.io/address/${currentAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      View on Ethplorer
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !balance && (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-center">
                <Link2 className="mx-auto h-12 w-12 text-zinc-400" />
                <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                  Enter a wallet address to view on-chain data
                </p>
                <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                  Supports Ethereum mainnet addresses
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
