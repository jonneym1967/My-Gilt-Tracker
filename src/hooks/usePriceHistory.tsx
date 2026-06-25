import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { PriceHistory } from '../types/database'

export function usePriceHistory(giltItemId: string | null) {
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    if (!giltItemId) {
      setHistory([])
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('gilt_item_id', giltItemId)
        .order('recorded_at', { ascending: true })

      if (error) throw error
      setHistory(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price history')
    } finally {
      setLoading(false)
    }
  }

  const addPriceEntry = async (price: number) => {
    if (!giltItemId) return null

    const { data, error } = await supabase
      .from('price_history')
      .insert({ gilt_item_id: giltItemId, price })
      .select()
      .single()

    if (error) throw error
    setHistory(prev => [...prev, data])
    return data
  }

  useEffect(() => {
    fetchHistory()
  }, [giltItemId])

  return { history, loading, error, addPriceEntry, refetch: fetchHistory }
}
