import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { GiltItem, GiltItemInsert } from '../types/database'

export function useGiltItems() {
  const [items, setItems] = useState<GiltItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('gilt_items')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (item: GiltItemInsert) => {
    const { data, error } = await supabase
      .from('gilt_items')
      .insert(item)
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    setItems(prev => [data, ...prev])
    return data
  }

  const updateItem = async (id: string, updates: Partial<GiltItemInsert>) => {
    const { data, error } = await supabase
      .from('gilt_items')
      .update(updates)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    setItems(prev => prev.map(item => item.id === id ? data : item))
    return data
  }

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('gilt_items')
      .delete()
      .eq('id', id)

    if (error) throw error
    setItems(prev => prev.filter(item => item.id !== id))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return { items, loading, error, addItem, updateItem, deleteItem, refetch: fetchItems }
}
