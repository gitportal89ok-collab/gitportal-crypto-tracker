export interface CoinPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
  sparkline_in_7d?: {
    price: number[]
  }
  high_24h: number
  low_24h: number
  circulating_supply: number
  total_supply: number | null
}

export interface CoinDetail extends CoinPrice {
  description: {
    en: string
  }
  links: {
    homepage: string[]
    blockchain_site: string[]
  }
  market_data: {
    high_24h: { usd: number }
    low_24h: { usd: number }
    ath: { usd: number }
    ath_change_percentage: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
  }
}

export interface PortfolioHolding {
  id: string
  coinId: string
  coinSymbol: string
  coinName: string
  quantity: number
  avgBuyPrice: number
  currentPrice?: number
  profitLoss?: number
  profitLossPercent?: number
}

export interface PriceHistory {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}
