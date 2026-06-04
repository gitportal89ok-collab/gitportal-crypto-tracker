1|'use client'
2|
3|import Link from 'next/link'
4|import { usePathname } from 'next/navigation'
5|import { cn } from '@/lib/utils'
6|import {
7|  LayoutDashboard,
8|  Briefcase,
9|  Brain,
10|  Newspaper,
11|  TrendingUp,
12|  Link2,
13|} from 'lucide-react'
14|
15|const navItems = [
16|  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
17|  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
18|  { href: '/signals', label: 'AI Signals', icon: Brain },
19|  { href: '/news', label: 'News', icon: Newspaper },
20|  { href: '/sentiment', label: 'Sentiment', icon: TrendingUp },
21|  { href: '/onchain', label: 'On-chain', icon: Link2 },
22|]
23|
24|export function Sidebar() {
25|  const pathname = usePathname()
26|
27|  return (
28|    <aside className="hidden lg:flex w-56 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
29|      <nav className="flex-1 space-y-1 p-4">
30|        {navItems.map((item) => {
31|          const isActive = pathname === item.href
32|          return (
33|            <Link
34|              key={item.href}
35|              href={item.href}
36|              className={cn(
37|                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
38|                isActive
39|                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
40|                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
41|              )}
42|            >
43|              <item.icon className="h-4 w-4" />
44|              {item.label}
45|            </Link>
46|          )
47|        })}
48|      </nav>
49|    </aside>
50|  )
51|}
52|