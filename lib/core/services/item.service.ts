import { BaseService } from './base.service'
import { Item, ItemInsert, ItemUpdate, ItemFilters, QueryOptions, PaginatedResponse } from '../types'
import { browserClient } from '@/lib/supabase/clients/browser.client'

export class ItemService extends BaseService<Item, ItemInsert, ItemUpdate> {
  protected tableName = 'items'

  async getWithDetails(id: string): Promise<any> {
    const { data, error } = await this.query
      .select(`
        *,
        categories!inner(*),
        seller:profiles!seller_id(id, username, full_name, avatar_url),
        location:locations(*),
        zone:storage_zones(*),
        bin:storage_bins(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async search(filters: ItemFilters, options?: QueryOptions): Promise<PaginatedResponse<Item>> {
    const page = options?.page || 1
    const limit = options?.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = this.query.select('*, categories!inner(name, slug)', { count: 'exact' })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters.sellerId) {
      query = query.eq('seller_id', filters.sellerId)
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,inventory_number.ilike.%${filters.search}%`)
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    const { data, error, count } = await query
      .range(from, to)
      .order(options?.sortBy || 'created_at', {
        ascending: options?.sortOrder === 'asc'
      })

    if (error) throw error

    return {
      data: data as Item[],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  async updateInventory(id: string, quantity: number, type: 'add' | 'remove'): Promise<Item> {
    const item = await this.getById(id)
    if (!item) throw new Error('Item not found')

    const newQuantity = type === 'add'
      ? item.quantity + quantity
      : item.quantity - quantity

    if (newQuantity < 0) {
      throw new Error('Insufficient inventory')
    }

    return this.update(id, {
      quantity: newQuantity,
      available_quantity: newQuantity - (item.reserved_quantity || 0),
      updated_at: new Date().toISOString(),
    } as ItemUpdate)
  }

  async getFeatured(limit = 10): Promise<Item[]> {
    const { data, error } = await this.query
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Item[]
  }

  async getBySeller(sellerId: string, options?: QueryOptions): Promise<PaginatedResponse<Item>> {
    return this.search({ sellerId, status: 'active' }, options)
  }

  async getByCategory(categoryId: number, options?: QueryOptions): Promise<PaginatedResponse<Item>> {
    return this.search({ categoryId, status: 'active' }, options)
  }
}

export const itemService = new ItemService()