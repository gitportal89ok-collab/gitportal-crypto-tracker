import { config } from '../config'
import { Signal } from '@/types/crypto'

export async function getSignals(coinId?: string): Promise<Signal[]> {
  const url = coinId
    ? `${config.ai.serviceUrl}/signals?coin_id=${coinId}`
    : `${config.ai.serviceUrl}/signals`

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('Failed to fetch signals:', res.statusText)
      return []
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching signals:', error)
    return []
  }
}

export async function getSignalHistory(
  coinId: string,
  limit = 50
): Promise<Signal[]> {
  try {
    const res = await fetch(
      `${config.ai.serviceUrl}/signals/history?coin_id=${coinId}&limit=${limit}`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      console.error('Failed to fetch signal history:', res.statusText)
      return []
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching signal history:', error)
    return []
  }
}

export async function trainModel(coinId: string): Promise<{ status: string; message: string }> {
  try {
    const res = await fetch(`${config.ai.serviceUrl}/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coin_id: coinId }),
    })

    if (!res.ok) {
      throw new Error('Failed to train model')
    }

    return res.json()
  } catch (error) {
    console.error('Error training model:', error)
    throw error
  }
}

export async function getModelStatus(): Promise<Record<string, { accuracy: number; lastTrained: string }>> {
  try {
    const res = await fetch(`${config.ai.serviceUrl}/models/status`)

    if (!res.ok) {
      return {}
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching model status:', error)
    return {}
  }
}
