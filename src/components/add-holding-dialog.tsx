'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AddHoldingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (holding: {
    coinId: string
    coinSymbol: string
    coinName: string
    quantity: number
    avgBuyPrice: number
  }) => void
}

export function AddHoldingDialog({ open, onOpenChange, onAdd }: AddHoldingDialogProps) {
  const [coinId, setCoinId] = useState('')
  const [coinSymbol, setCoinSymbol] = useState('')
  const [coinName, setCoinName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [avgBuyPrice, setAvgBuyPrice] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await onAdd({
        coinId: coinId.toLowerCase(),
        coinSymbol: coinSymbol.toUpperCase(),
        coinName,
        quantity: parseFloat(quantity),
        avgBuyPrice: parseFloat(avgBuyPrice),
      })

      // Reset form
      setCoinId('')
      setCoinSymbol('')
      setCoinName('')
      setQuantity('')
      setAvgBuyPrice('')
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Holding</DialogTitle>
          <DialogDescription>
            Add a cryptocurrency to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coinId">Coin ID</Label>
              <Input
                id="coinId"
                placeholder="bitcoin"
                value={coinId}
                onChange={(e) => setCoinId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coinSymbol">Symbol</Label>
              <Input
                id="coinSymbol"
                placeholder="BTC"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coinName">Name</Label>
            <Input
              id="coinName"
              placeholder="Bitcoin"
              value={coinName}
              onChange={(e) => setCoinName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                placeholder="0.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgBuyPrice">Avg Buy Price ($)</Label>
              <Input
                id="avgBuyPrice"
                type="number"
                step="any"
                placeholder="42000"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Holding'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
