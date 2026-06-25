import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Category, CategoryInsert } from '../types/database'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (category: CategoryInsert) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    setCategories(prev => [...prev, data])
    return data
  }

  const updateCategory = async (id: string, updates: Partial<CategoryInsert>) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setCategories(prev => prev.map(cat => cat.id === id ? data : cat))
    return data
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, addCategory, updateCategory, deleteCategory, refetch: fetchCategories }
}
