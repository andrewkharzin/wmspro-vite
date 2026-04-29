'use server'

import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client'
import { ItemInsert, ItemUpdate } from '../types'
import { revalidatePath } from 'next/cache'

export async function getItems(filters?: any) {
  const supabase = await createServerSupabaseClient()
  let query = supabase.from('core.items').select('*, categories(*)')

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getItem(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.items')
    .select('*, categories(*), seller:profiles!seller_id(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createItem(item: ItemInsert) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.items')
    .insert(item)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/items')
  revalidatePath(`/items/${data.id}`)
  return data
}

export async function updateItem(id: string, updates: ItemUpdate) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/items')
  revalidatePath(`/items/${id}`)
  return data
}

export async function deleteItem(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('core.items')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/items')
}

export async function toggleFeature(id: string, isFeatured: boolean) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('core.items')
    .update({ is_featured: isFeatured })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/items')
}