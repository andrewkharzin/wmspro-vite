import { useState, useEffect, useCallback } from 'react'
import { itemService } from '../services/item.service'
import { Item, ItemFilters, ItemInsert, ItemUpdate, QueryOptions } from '../types'
import { useRealtime } from './useRealtime'

export function useItems(initialFilters?: ItemFilters, initialOptions?: QueryOptions) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(initialOptions?.page || 1)
  const [filters, setFilters] = useState<ItemFilters | undefined>(initialFilters)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await itemService.search(filters || {}, {
        ...initialOptions,
        page,
      })
      setItems(result.data)
      setTotalCount(result.count)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [filters, page, initialOptions])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Real-time updates
  useRealtime<Item>({
    table: 'items',
    onInsert: (newItem) => {
      setItems(prev => [newItem, ...prev])
      setTotalCount(prev => prev + 1)
    },
    onUpdate: (updatedItem) => {
      setItems(prev => prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ))
    },
    onDelete: (deletedItem) => {
      setItems(prev => prev.filter(item => item.id !== deletedItem.id))
      setTotalCount(prev => prev - 1)
    },
  })

  const createItem = useCallback(async (data: ItemInsert) => {
    const newItem = await itemService.create(data)
    return newItem
  }, [])

  const updateItem = useCallback(async (id: string, data: ItemUpdate) => {
    const updated = await itemService.update(id, data)
    return updated
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    await itemService.delete(id)
  }, [])

  const updateInventory = useCallback(async (id: string, quantity: number, type: 'add' | 'remove') => {
    const updated = await itemService.updateInventory(id, quantity, type)
    return updated
  }, [])

  return {
    items,
    loading,
    error,
    totalCount,
    page,
    setPage,
    filters,
    setFilters,
    createItem,
    updateItem,
    deleteItem,
    updateInventory,
    refetch: fetchItems,
  }
}