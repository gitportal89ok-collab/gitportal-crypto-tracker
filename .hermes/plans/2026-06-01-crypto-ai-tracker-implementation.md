# GitPortal Crypto AI Tracker — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a full-stack crypto intelligence web app with real-time prices, portfolio tracking, AI trading signals, sentiment analysis, and on-chain analytics.

**Architecture:** Next.js 14 monolith with App Router, Prisma ORM + PostgreSQL, AI/ML pipeline in Python (FastAPI microservice), deployed on Vercel + Supabase.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL, Python, PyTorch, FinBERT, CoinGecko API, Binance WebSocket, Etherscan API.

---

## Phase 1: Project Setup & Foundation

### Task 1: Initialize Next.js Project

**Objective:** Create the Next.js project with TypeScript and Tailwind CSS.

**Files:**
- Create: `gitportal-crypto-tracker/` (project root)

**Steps:**

```bash
# Create Next.js project
npx create-next-app@latest gitportal-crypto-tracker \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm

cd gitportal-crypto-tracker
```

**Verification:** Run `npm run dev` and verify http://localhost:3000 loads.

**Commit:** `feat: initialize Next.js project with TypeScript and Tailwind`

---

### Task 2: Install Core Dependencies

**Objective:** Install all required packages for the project.

**Files:**
- Modify: `package.json`

**Steps:**

```bash
# UI Library
npx shadcn@latest init
npx shadcn@latest add button card dialog input label select table tabs toast

# Data & API
npm install @prisma/client zod axios date-fns
npm install -D prisma

# Auth
npm install next-auth @next-auth/prisma-adapter
npm install bcryptjs @types/bcryptjs

# State & Fetching
npm install @tanstack/react-query

# Charts
npm install recharts lightweight-charts

# Utilities
npm install clsx tailwind-merge class-variance-authority
npm install lucide-react
```

**Verification:** Run `npm run build` — should complete without errors.

**Commit:** `feat: install core dependencies`

---

### Task 3: Setup Prisma & Database Schema

**Objective:** Define the database schema with all core tables.

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`

**Steps:**

1. Initialize Prisma:
```bash
npx prisma init
```

2. Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  portfolio     Portfolio[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Portfolio {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  coinId      String
  coinSymbol  String
  coinName    String
  quantity    Float
  avgBuyPrice Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, coinId])
}

model PriceHistory {
  id        String   @id @default(cuid())
  coinId    String
  price     Float
  marketCap Float?
  volume    Float?
  timestamp DateTime @default(now())

  @@index([coinId, timestamp])
}

model Signal {
  id         String   @id @default(cuid())
  coinId     String
  coinSymbol String
  signal     String   // BUY, SELL, HOLD
  confidence Float
  price      Float
  model      String
  features   Json
  createdAt  DateTime @default(now())

  @@index([coinId, createdAt])
}

model NewsArticle {
  id          String   @id @default(cuid())
  title       String
  content     String?
  source      String
  url         String   @unique
  coinIds     String[]
  publishedAt DateTime
  createdAt   DateTime @default(now())

  @@index([publishedAt])
}

model SentimentScore {
  id          String   @id @default(cuid())
  source      String   // twitter, reddit, news
  content     String
  sentiment   String   // positive, negative, neutral
  score       Float
  coinIds     String[]
  createdAt   DateTime @default(now())

  @@index([coinIds, createdAt])
}

model OnChainData {
  id           String   @id @default(cuid())
  chain        String   // ethereum, bitcoin
  address      String
  balance      Float?
  txCount      Int?
  lastActivity DateTime?
  metadata     Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

3. Create `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

4. Run migration:
```bash
npx prisma migrate dev --name init
```

**Verification:** Check database tables created successfully.

**Commit:** `feat: setup Prisma schema with all core tables`

---

### Task 4: Environment Variables & Config

**Objective:** Setup environment configuration.

**Files:**
- Create: `.env.local`
- Create: `src/lib/config.ts`

**Steps:**

1. Create `.env.local`:
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
COINGECKO_API_KEY=""
BINANCE_API_KEY=""
BINANCE_API_SECRET=""
ETHERSCAN_API_KEY=""
CRYPTOPANIC_API_KEY=""

# AI/ML
AI_SERVICE_URL="http://localhost:8000"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

2. Create `src/lib/config.ts`:
```typescript
export const config = {
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    apiKey: process.env.COINGECKO_API_KEY,
  },
  binance: {
    wsUrl: 'wss://stream.binance.com:9443/ws',
    restUrl: 'https://api.binance.com/api/v3',
  },
  etherscan: {
    baseUrl: 'https://api.etherscan.io/api',
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  cryptopanic: {
    baseUrl: 'https://cryptopanic.com/api/v1',
    apiKey: process.env.CRYPTOPANIC_API_KEY,
  },
  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  },
} as const
```

**Verification:** App starts without config errors.

**Commit:** `feat: setup environment config`

---

## Phase 2: Authentication

### Task 5: NextAuth.js Setup

**Objective:** Implement email/password authentication.

**Files:**
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/lib/auth.ts`
- Create: `src/components/auth-provider.tsx`

**Steps:**

1. Create `src/lib/auth.ts`:
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}
```

2. Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

3. Create `src/components/auth-provider.tsx`:
```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

4. Wrap root layout with AuthProvider.

**Verification:** Can sign in with test user via /auth/login.

**Commit:** `feat: implement NextAuth.js authentication`

---

### Task 6: Registration & Login Pages

**Objective:** Build auth UI pages.

**Files:**
- Create: `src/app/auth/login/page.tsx`
- Create: `src/app/auth/register/page.tsx`
- Create: `src/app/api/auth/register/route.ts`

**Steps:**

1. Create register API endpoint with password hashing
2. Create login page with form
3. Create register page with form
4. Add form validation with Zod

**Verification:** Can register new user and login.

**Commit:** `feat: add registration and login pages`

---

## Phase 3: Price & Portfolio Tracker (Pillar 1)

### Task 7: CoinGecko API Integration

**Objective:** Fetch real-time crypto prices from CoinGecko.

**Files:**
- Create: `src/app/api/prices/route.ts`
- Create: `src/lib/api/coingecko.ts`
- Create: `src/types/crypto.ts`

**Steps:**

1. Create types:
```typescript
// src/types/crypto.ts
export interface CoinPrice {
  id: string
  symbol: string
  name: string
  currentPrice: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCap: number
  volume: number
  image: string
}

export interface CoinDetail extends CoinPrice {
  description: string
  links: {
    homepage: string[]
    blockchain: string[]
  }
  marketData: {
    high24h: number
    low24h: number
    ath: number
    athChangePercentage: number
  }
}
```

2. Create CoinGecko client:
```typescript
// src/lib/api/coingecko.ts
import { config } from '../config'
import { CoinPrice } from '@/types/crypto'

export async function getTopCoins(limit = 20): Promise<CoinPrice[]> {
  const url = `${config.coingecko.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`

  const res = await fetch(url, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  })

  if (!res.ok) throw new Error('Failed to fetch prices')

  return res.json()
}

export async function getCoinDetail(id: string) {
  const res = await fetch(`${config.coingecko.baseUrl}/coins/${id}`)
  if (!res.ok) throw new Error('Failed to fetch coin detail')
  return res.json()
}

export async function getCoinHistory(id: string, days = 30) {
  const res = await fetch(
    `${config.coingecko.baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  )
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}
```

3. Create API route:
```typescript
// src/app/api/prices/route.ts
import { NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/api/coingecko'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')

  const coins = await getTopCoins(limit)
  return NextResponse.json(coins)
}
```

**Verification:** `curl http://localhost:3000/api/prices?limit=5` returns JSON with 5 coins.

**Commit:** `feat: integrate CoinGecko price API`

---

### Task 8: Dashboard Page

**Objective:** Build the main dashboard with top coins table and price charts.

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/coins-table.tsx`
- Create: `src/components/price-chart.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/sidebar.tsx`

**Steps:**

1. Create header with navigation
2. Create sidebar with nav links
3. Create coins table component with sorting
4. Create price chart with Recharts
5. Compose dashboard layout

**Verification:** Dashboard loads with live price data and charts.

**Commit:** `feat: build dashboard page with price table and charts`

---

### Task 9: Portfolio Management

**Objective:** Allow users to track their crypto holdings.

**Files:**
- Create: `src/app/portfolio/page.tsx`
- Create: `src/app/api/portfolio/route.ts`
- Create: `src/app/api/portfolio/[id]/route.ts`
- Create: `src/components/portfolio-table.tsx`
- Create: `src/components/add-holding-dialog.tsx`

**Steps:**

1. Create CRUD API routes for portfolio
2. Create portfolio table showing holdings
3. Create add/edit holding dialog
4. Calculate total portfolio value and P&L
5. Show portfolio allocation pie chart

**Verification:** Can add, edit, delete holdings; portfolio value updates in real-time.

**Commit:** `feat: implement portfolio management`

---

## Phase 4: AI Signal Trading (Pillar 2)

### Task 10: Signal API Route

**Objective:** Create API endpoint for AI trading signals.

**Files:**
- Create: `src/app/api/signals/route.ts`
- Create: `src/lib/api/ai-service.ts`

**Steps:**

1. Create AI service client:
```typescript
// src/lib/api/ai-service.ts
import { config } from '../config'

export interface Signal {
  coinId: string
  coinSymbol: string
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  price: number
  model: string
  features: Record<string, number>
  createdAt: string
}

export async function getSignals(coinId?: string): Promise<Signal[]> {
  const url = coinId
    ? `${config.ai.serviceUrl}/signals?coin_id=${coinId}`
    : `${config.ai.serviceUrl}/signals`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch signals')
  return res.json()
}

export async function trainModel(coinId: string) {
  const res = await fetch(`${config.ai.serviceUrl}/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coin_id: coinId }),
  })
  return res.json()
}
```

2. Create API route that fetches from AI service

**Verification:** Signal endpoint returns prediction data.

**Commit:** `feat: create signal API route`

---

### Task 11: AI Signals Page

**Objective:** Build the AI signals dashboard.

**Files:**
- Create: `src/app/signals/page.tsx`
- Create: `src/components/signal-card.tsx`
- Create: `src/components/signal-history.tsx`

**Steps:**

1. Create signal card component (shows current signal with confidence)
2. Create signal history chart
3. Build signals page with coin selector
4. Add "Retrain Model" button

**Verification:** Signals page shows predictions with visual indicators.

**Commit:** `feat: build AI signals page`

---

## Phase 5: News & Sentiment (Pillar 3)

### Task 12: News Aggregation

**Objective:** Fetch and display crypto news.

**Files:**
- Create: `src/app/api/news/route.ts`
- Create: `src/lib/api/cryptopanic.ts`
- Create: `src/components/news-card.tsx`

**Steps:**

1. Create CryptoPanic API client
2. Create news API route with caching
3. Build news card component
4. Create news page with filters

**Verification:** News page shows latest articles with sentiment badges.

**Commit:** `feat: integrate crypto news aggregation`

---

### Task 13: Sentiment Analysis Display

**Objective:** Show sentiment scores for crypto assets.

**Files:**
- Create: `src/app/sentiment/page.tsx`
- Create: `src/components/sentiment-gauge.tsx`
- Create: `src/components/social-feed.tsx`

**Steps:**

1. Create sentiment gauge component (visual meter)
2. Create social feed component (tweets, Reddit)
3. Build sentiment page with per-coin breakdown
4. Add sentiment trend chart

**Verification:** Sentiment page shows analysis with visual gauges.

**Commit:** `feat: build sentiment analysis display`

---

## Phase 6: On-chain Analytics (Pillar 4)

### Task 14: On-chain Data Integration

**Objective:** Fetch blockchain data from Etherscan/Alchemy.

**Files:**
- Create: `src/app/api/onchain/route.ts`
- Create: `src/lib/api/etherscan.ts`

**Steps:**

1. Create Etherscan API client
2. Fetch wallet balances, token holdings
3. Create on-chain data API route
4. Cache results in Redis/DB

**Verification:** On-chain endpoint returns wallet data.

**Commit:** `feat: integrate on-chain data from Etherscan`

---

### Task 15: On-chain Analytics Page

**Objective:** Build on-chain data explorer.

**Files:**
- Create: `src/app/onchain/page.tsx`
- Create: `src/components/wallet-tracker.tsx`
- Create: `src/components/tx-history.tsx`

**Steps:**

1. Create wallet address input
2. Show token balances with values
3. Display recent transactions
4. Show gas usage analytics

**Verification:** Can enter wallet address and view holdings.

**Commit:** `feat: build on-chain analytics page`

---

## Phase 7: Real-time Features

### Task 16: WebSocket Price Feed

**Objective:** Implement real-time price updates via Binance WebSocket.

**Files:**
- Create: `src/lib/websocket.ts`
- Create: `src/hooks/use-realtime-prices.ts`

**Steps:**

1. Create WebSocket connection manager
2. Create React hook for real-time prices
3. Integrate with dashboard and portfolio
4. Add connection status indicator

**Verification:** Prices update in real-time without page refresh.

**Commit:** `feat: add WebSocket real-time price feed`

---

### Task 17: Background Data Sync

**Objective:** Sync price history and news in background.

**Files:**
- Create: `src/lib/cron/price-sync.ts`
- Create: `src/lib/cron/news-sync.ts`

**Steps:**

1. Create price history sync job
2. Create news sync job
3. Setup cron schedule in Vercel
4. Add sync status dashboard

**Verification:** Price history builds over time.

**Commit:** `feat: add background data sync jobs`

---

## Phase 8: Polish & Deploy

### Task 18: UI Polish & Responsive Design

**Objective:** Ensure consistent UI across all pages.

**Files:**
- Modify: Various component files
- Create: `src/components/ui/loading.tsx`
- Create: `src/components/ui/error-boundary.tsx`

**Steps:**

1. Add loading skeletons
2. Add error boundaries
3. Ensure mobile responsive
4. Add dark mode toggle

**Verification:** App looks good on mobile and desktop.

**Commit:** `feat: polish UI and add responsive design`

---

### Task 19: Testing

**Objective:** Add tests for critical paths.

**Files:**
- Create: `__tests__/api/prices.test.ts`
- Create: `__tests__/api/portfolio.test.ts`
- Create: `__tests__/components/coins-table.test.tsx`

**Steps:**

1. Setup Vitest
2. Write API route tests
3. Write component tests
4. Achieve 80% coverage on critical paths

**Verification:** `npm run test` passes.

**Commit:** `test: add tests for API routes and components`

---

### Task 20: Deploy to Vercel

**Objective:** Deploy the app to production.

**Files:**
- Create: `vercel.json` (if needed)

**Steps:**

1. Push to GitHub
2. Connect repo to Vercel
3. Setup environment variables
4. Configure custom domain
5. Setup Supabase database
6. Run production build test

**Verification:** App is live and accessible at production URL.

**Commit:** `chore: deploy to Vercel`

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1 | 1-4 | Project setup, DB, config |
| 2 | 5-6 | Authentication |
| 3 | 7-9 | Price & Portfolio |
| 4 | 10-11 | AI Signals |
| 5 | 12-13 | News & Sentiment |
| 6 | 14-15 | On-chain Analytics |
| 7 | 16-17 | Real-time Features |
| 8 | 18-20 | Polish, Test, Deploy |

**Total: 20 tasks across 8 phases**

---

## Next Steps

1. Confirm this plan with user
2. Start Phase 1 (Tasks 1-4)
3. Use `subagent-driven-development` for parallel task execution
4. Deploy MVP after Phase 3 (price + portfolio)
5. Iterate on AI/ML after MVP validation

---

*Plan created by GitPortal AI Agent • 2026-06-01*
