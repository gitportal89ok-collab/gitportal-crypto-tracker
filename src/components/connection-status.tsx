'use client'

import { cn } from '@/lib/utils'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'connecting'
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const config = {
    connected: {
      label: 'Live',
      color: 'text-emerald-600 bg-emerald-50',
      icon: Wifi,
    },
    disconnected: {
      label: 'Offline',
      color: 'text-red-600 bg-red-50',
      icon: WifiOff,
    },
    connecting: {
      label: 'Connecting',
      color: 'text-amber-600 bg-amber-50',
      icon: Loader2,
    },
  }

  const { label, color, icon: Icon } = config[status]

  return (
    <div className={cn('flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium', color)}>
      <Icon className={cn('h-4 w-4', status === 'connecting' && 'animate-spin')} />
      <span>{label}</span>
    </div>
  )
}
