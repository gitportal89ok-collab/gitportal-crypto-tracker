import { config } from '../config'
import { CoinPrice, CoinDetail, PriceHistory } from '@/types/crypto'

// Mock data for development without API key
const mockCoins: CoinPrice[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 67542.32,
    price_change_24h: 1234.56,
    price_change_percentage_24h: 1.86,
    market_cap: 1328000000000,
    total_volume: 28500000000,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 65000 + Math.random() * 5000) },
    high_24h: 68200,
    low_24h: 65800,
    circulating_supply: 19600000,
    total_supply: 21000000,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3456.78,
    price_change_24h: -45.23,
    price_change_percentage_24h: -1.29,
    market_cap: 415000000000,
    total_volume: 14200000000,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 3300 + Math.random() * 300) },
    high_24h: 3520,
    low_24h: 3380,
    circulating_supply: 120200000,
    total_supply: null,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 178.45,
    price_change_24h: 8.92,
    price_change_percentage_24h: 5.26,
    market_cap: 78500000000,
    total_volume: 3200000000,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 165 + Math.random() * 20) },
    high_24h: 182,
    low_24h: 168,
    circulating_supply: 440000000,
    total_supply: null,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    current_price: 598.23,
    price_change_24h: 12.45,
    price_change_percentage_24h: 2.12,
    market_cap: 89200000000,
    total_volume: 1800000000,
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 580 + Math.random() * 30) },
    high_24h: 605,
    low_24h: 582,
    circulating_supply: 149000000,
    total_supply: 200000000,
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    current_price: 0.6234,
    price_change_24h: 0.0156,
    price_change_percentage_24h: 2.56,
    market_cap: 34200000000,
    total_volume: 1200000000,
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 0.6 + Math.random() * 0.05) },
    high_24h: 0.635,
    low_24h: 0.605,
    circulating_supply: 54800000000,
    total_supply: 100000000000,
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    current_price: 0.5123,
    price_change_24h: 0.0234,
    price_change_percentage_24h: 4.78,
    market_cap: 18100000000,
    total_volume: 520000000,
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 0.48 + Math.random() * 0.05) },
    high_24h: 0.525,
    low_24h: 0.485,
    circulating_supply: 35400000000,
    total_supply: 45000000000,
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    current_price: 0.1567,
    price_change_24h: 0.0089,
    price_change_percentage_24h: 6.03,
    market_cap: 22400000000,
    total_volume: 980000000,
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 0.14 + Math.random() * 0.03) },
    high_24h: 0.162,
    low_24h: 0.145,
    circulating_supply: 143000000000,
    total_supply: null,
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    current_price: 8.23,
    price_change_24h: 0.45,
    price_change_percentage_24h: 5.80,
    market_cap: 11200000000,
    total_volume: 320000000,
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 7.8 + Math.random() * 0.8) },
    high_24h: 8.45,
    low_24h: 7.75,
    circulating_supply: 1360000000,
    total_supply: null,
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    current_price: 42.56,
    price_change_24h: 2.34,
    price_change_percentage_24h: 5.82,
    market_cap: 16200000000,
    total_volume: 450000000,
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 40 + Math.random() * 5) },
    high_24h: 43.8,
    low_24h: 39.5,
    circulating_supply: 380000000,
    total_supply: 720000000,
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    current_price: 18.92,
    price_change_24h: 0.78,
    price_change_percentage_24h: 4.31,
    market_cap: 11100000000,
    total_volume: 680000000,
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => 18 + Math.random() * 1.5) },
    high_24h: 19.25,
    low_24h: 17.85,
    circulating_supply: 587000000,
    total_supply: 1000000000,
  },
]

export async function getTopCoins(limit = 20): Promise<CoinPrice[]> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('Using mock data for coins')
    return mockCoins.slice(0, limit)
  }

  try {
    const url = `${config.coingecko.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`

    const res = await fetch(url)

    if (!res.ok) {
      console.error('CoinGecko API error, falling back to mock data')
      return mockCoins.slice(0, limit)
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching from CoinGecko, using mock data:', error)
    return mockCoins.slice(0, limit)
  }
}

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    const mockCoin = mockCoins.find(c => c.id === id) || mockCoins[0]
    return {
      ...mockCoin,
      description: { en: 'Mock coin description for development' },
      links: { homepage: [''], blockchain_site: [''] },
      market_data: {
        high_24h: { usd: mockCoin.high_24h },
        low_24h: { usd: mockCoin.low_24h },
        ath: { usd: mockCoin.current_price * 1.5 },
        ath_change_percentage: { usd: -33.33 },
        market_cap: { usd: mockCoin.market_cap },
        total_volume: { usd: mockCoin.total_volume },
      },
    }
  }

  try {
    const res = await fetch(`${config.coingecko.baseUrl}/coins/${id}`)
    if (!res.ok) throw new Error('Failed to fetch coin detail')
    return res.json()
  } catch (error) {
    console.error('Error fetching coin detail:', error)
    throw error
  }
}

export async function getCoinHistory(id: string, days = 30): Promise<PriceHistory> {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    const mockPrices: [number, number][] = Array.from({ length: days * 24 }, (_, i) => {
      const date = new Date()
      date.setHours(date.getHours() - (days * 24 - i))
      return [date.getTime(), 65000 + Math.random() * 5000]
    })

    return {
      prices: mockPrices,
      market_caps: mockPrices.map(([time, price]) => [time, price * 20]),
      total_volumes: mockPrices.map(([time, price]) => [time, price * 0.5]),
    }
  }

  try {
    const res = await fetch(
      `${config.coingecko.baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    )
    if (!res.ok) throw new Error('Failed to fetch history')
    return res.json()
  } catch (error) {
    console.error('Error fetching coin history:', error)
    throw error
  }
}

export async function searchCoins(query: string) {
  // Check if mock mode is enabled
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    const filtered = mockCoins.filter(
      c => c.name.toLowerCase().includes(query.toLowerCase()) ||
           c.symbol.toLowerCase().includes(query.toLowerCase())
    )
    return { coins: filtered }
  }

  try {
    const res = await fetch(
      `${config.coingecko.baseUrl}/search?query=${encodeURIComponent(query)}`
    )
    if (!res.ok) throw new Error('Failed to search coins')
    return res.json()
  } catch (error) {
    console.error('Error searching coins:', error)
    return { coins: [] }
  }
}
