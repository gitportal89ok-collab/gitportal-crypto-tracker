'use client'

import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { PortfolioTable } from '@/components/portfolio-table'

export default function PortfolioPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-sm text-zinc-500">Track your cryptocurrency holdings</p>
          </div>
          <PortfolioTable />
        </main>
      </div>
    </div>
  )
}
