'use server'

import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client'
import { CompanyInsert, CompanyUpdate } from '../types'
import { revalidatePath } from 'next/cache'

export async function getCompanies() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getCompany(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*, contacts(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getOwnCompany() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_own_company', true)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data
}

export async function createCompany(company: CompanyInsert) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/companies')
  revalidatePath(`/companies/${data.id}`)
  return data
}

export async function updateCompany(id: string, updates: CompanyUpdate) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/companies')
  revalidatePath(`/companies/${id}`)
  return data
}

export async function deleteCompany(id: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/companies')
}

export async function searchCompanies(query: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10)

  if (error) throw new Error(error.message)
  return data
}