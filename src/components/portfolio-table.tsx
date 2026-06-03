'use client'

import { useState, useEffect } from 'react'
import { PortfolioHolding } from '@/types/crypto'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddHoldingDialog } from '@/components/add-holding-dialog'
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'

export function PortfolioTable() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchHoldings()
  }, [])

  async function fetchHoldings() {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) {
        const data = await res.json()
        setHoldings(data)
      }
    } catch (err) {
      console.error('Failed to fetch holdings:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addHolding(holding: {
    coinId: string
    coinSymbol: string
    coinName: string
    quantity: number
    avgBuyPrice: number
  }) {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holding),
      })
      if (res.ok) {
        await fetchHoldings()
      }
    } catch (err) {
      console.error('Failed to add holding:', err)
    }
  }

  async function deleteHolding(id: string) {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setHoldings(holdings.filter((h) => h.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete holding:', err)
    }
  }

  const totalValue = holdings.reduce((sum, h) => sum + h.quantity * (h.currentPrice || h.avgBuyPrice), 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0)
  const totalPnL = totalValue - totalCost
  const totalPnLPercent = totalCost > 0 ? ((totalPnL / totalCost) * 100) : 0

  if (loading) {
    return (
      <Card className="p-8 text-center text-zinc-500">
        <Wallet className="mx-auto h-8 w-8 animate-pulse text-emerald-500 mb-2" />
        Loading portfolio...
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-zinc-500">Total Value</p>
          <p className="text-xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-zinc-500">Total Cost</p>
          <p className="text-xl font-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-zinc-500">Profit/Loss</p>
          <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-zinc-500">P&L %</p>
          <p className={`text-xl font-bold ${totalPnLPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </p>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Holdings</h2>
            <p className="text-sm text-zinc-500">{holdings.length} assets</p>
          </div>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Holding
          </Button>
        </div>

        {holdings.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            <Wallet className="mx-auto h-12 w-12 mb-3 text-zinc-300" />
            <p>No holdings yet. Add your first crypto!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coin</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Avg Buy</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">P&L</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((h) => {
                  const value = h.quantity * (h.currentPrice || h.avgBuyPrice)
                  const cost = h.quantity * h.avgBuyPrice
                  const pnl = value - cost
                  const isPositive = pnl >= 0
                  return (
                    <TableRow key={h.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{h.coinName}</div>
                          <div className="text-xs text-zinc-500 uppercase">{h.coinSymbol}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{h.quantity}</TableCell>
                      <TableCell className="text-right font-mono">${h.avgBuyPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-medium">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          ${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHolding(h.id)}
                          className="text-zinc-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <AddHoldingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={addHolding}
      />
    </div>
  )
}
