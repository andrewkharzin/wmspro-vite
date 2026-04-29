'use server'

import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client'
import { ProfileUpdate } from '../types'
// Удалите эту строку, так как CoreEnums не используется
// import { CoreEnums } from '../types'
import { revalidatePath } from 'next/cache'

// Импортируем типы из Database напрямую
import { Database } from '@/types/supabase/core.types'

type UserRole = Database['core']['Enums']['user_role']
type UserStatus = Database['core']['Enums']['user_status']

export async function getProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/profile/${userId}`)
  return data
}

export async function updateProfileStatus(userId: string, status: UserStatus) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/users')
}

export async function getUsersByRole(role: UserRole) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)

  if (error) throw new Error(error.message)
  return data
}