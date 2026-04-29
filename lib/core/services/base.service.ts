import { browserClient } from '@/lib/supabase/clients/browser.client'
import { QueryOptions, PaginatedResponse } from '../types'

export abstract class BaseService<T, TInsert, TUpdate> {
  protected abstract tableName: keyof Database['core']['Tables']

  protected get client() {
    return browserClient
  }

  protected get query() {
    return this.client.from(this.tableName as string)
  }

  async getAll(options?: QueryOptions): Promise<PaginatedResponse<T>> {
    const page = options?.page || 1
    const limit = options?.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = this.query.select('*', { count: 'exact' })

    if (options?.sortBy) {
      query = query.order(options.sortBy, {
        ascending: options.sortOrder === 'asc'
      })
    }

    const { data, error, count } = await query
      .range(from, to)

    if (error) throw error

    return {
      data: data as T[],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.query
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as T | null
  }

  async create(data: TInsert): Promise<T> {
    const { data: created, error } = await this.query
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return created as T
  }

  async update(id: string, data: TUpdate): Promise<T> {
    const { data: updated, error } = await this.query
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return updated as T
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.query
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async bulkCreate(items: TInsert[]): Promise<T[]> {
    const { data, error } = await this.query
      .insert(items)
      .select()

    if (error) throw error
    return data as T[]
  }

  async bulkUpdate(updates: { id: string; data: TUpdate }[]): Promise<void> {
    const promises = updates.map(({ id, data }) =>
      this.update(id, data)
    )
    await Promise.all(promises)
  }
}