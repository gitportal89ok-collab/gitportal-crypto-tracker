'use client'

import { CoinsTable } from '@/components/coins-table'
import { PriceChart } from '@/components/price-chart'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Card } from '@/components/ui/card'
import { TrendingUp, Activity, BarChart3, Zap } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: string
  color: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={TrendingUp}
              label="Total Market Cap"
              value="$2.41T"
              color="bg-emerald-500"
            />
            <StatCard
              icon={Activity}
              label="24h Volume"
              value="$89.2B"
              color="bg-blue-500"
            />
            <StatCard
              icon={BarChart3}
              label="BTC Dominance"
              value="54.2%"
              color="bg-purple-500"
            />
            <StatCard
              icon={Zap}
              label="Active Coins"
              value="13,842"
              color="bg-amber-500"
            />
          </div>

          {/* Chart + Table */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <PriceChart />
            </div>
            <div className="xl:col-span-2">
              <CoinsTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
