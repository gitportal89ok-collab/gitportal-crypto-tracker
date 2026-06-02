export const config = {
  coingecko: {
    baseUrl: "https://api.coingecko.com/api/v3",
    apiKey: process.env.COINGECKO_API_KEY,
  },
  binance: {
    wsUrl: "wss://stream.binance.com:9443/ws",
    restUrl: "https://api.binance.com/api/v3",
  },
  etherscan: {
    baseUrl: "https://api.etherscan.io/api",
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  cryptopanic: {
    baseUrl: "https://cryptopanic.com/api/v1",
    apiKey: process.env.CRYPTOPANIC_API_KEY,
  },
  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
  },
} as const
