'use server'

import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client'
import { StoryInsert, StoryUpdate } from '../types'
import { revalidatePath } from 'next/cache'

export async function getStories() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.stories')
    .select('*, user:profiles!user_id(id, username, full_name, avatar_url)')
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getStory(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.stories')
    .select('*, user:profiles!user_id(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getUserStories(userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createStory(story: StoryInsert) {
  const supabase = await createServerSupabaseClient()

  // Устанавливаем expires_at если не указано (24 часа по умолчанию)
  if (!story.expires_at) {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
    story.expires_at = expiresAt.toISOString()
  }

  const { data, error } = await supabase
    .from('core.stories')
    .insert(story)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/stories')
  revalidatePath(`/stories/${data.id}`)
  return data
}

export async function updateStory(id: string, updates: StoryUpdate) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('core.stories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/stories')
  revalidatePath(`/stories/${id}`)
  return data
}

export async function deleteStory(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('core.stories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/stories')
}

export async function incrementStoryView(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data: story } = await supabase
    .from('core.stories')
    .select('view_count')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('core.stories')
    .update({ view_count: (story?.view_count || 0) + 1 })
    .eq('id', id)

  if (error) throw new Error(error.message)
}