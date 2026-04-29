'use server'

import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client'
import { LocationInsert, LocationUpdate } from '../types'
import { revalidatePath } from 'next/cache'

export async function getLocations() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getLocation(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.locations')
    .select('*, warehouses(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getUserLocations(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.locations')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getPublicLocations() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.locations')
    .select('*')
    .eq('is_public', true)
    .eq('is_active', true)

  if (error) throw new Error(error.message)
  return data
}

export async function createLocation(location: LocationInsert) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.locations')
    .insert(location)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/locations')
  revalidatePath(`/locations/${data.id}`)
  return data
}

export async function updateLocation(id: string, updates: LocationUpdate) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.locations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/locations')
  revalidatePath(`/locations/${id}`)
  return data
}

export async function deleteLocation(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('core.locations')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/locations')
}

export async function setDefaultLocation(userId: string, locationId: string) {
  const supabase = await createServerSupabaseClient()

  // Снимаем флаг со всех локаций пользователя
  await supabase
    .from('core.locations')
    .update({ is_default: false })
    .eq('user_id', userId)

  // Устанавливаем новую дефолтную локацию
  const { error } = await supabase
    .from('core.locations')
    .update({ is_default: true })
    .eq('id', locationId)

  if (error) throw new Error(error.message)

  revalidatePath('/locations')
}