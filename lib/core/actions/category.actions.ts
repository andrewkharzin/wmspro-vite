'use server'

import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client'
import { CategoryInsert, CategoryUpdate } from '../types'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('parent_id', { nullsFirst: true })
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getCategory(id: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getRootCategories() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getSubcategories(parentId: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getCategoryHierarchy() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('parent_id', { nullsFirst: true })
    .order('name')

  if (error) throw new Error(error.message)

  // Построение иерархии
  const categories = data as any[]
  const categoryMap = new Map()
  const roots: any[] = []

  categories.forEach(category => {
    category.children = []
    categoryMap.set(category.id, category)
  })

  categories.forEach(category => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id)
      if (parent) {
        parent.children.push(category)
      }
    } else {
      roots.push(category)
    }
  })

  return roots
}

export async function createCategory(category: CategoryInsert) {
  const supabase = await createServerSupabaseClient()

  // Генерация slug если не предоставлен
  if (!category.slug && category.name) {
    category.slug = category.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/categories')
  revalidatePath('/admin/categories')
  return data
}

export async function updateCategory(id: number, updates: CategoryUpdate) {
  const supabase = await createServerSupabaseClient()

  // Генерация slug если обновлено имя
  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/categories')
  revalidatePath(`/categories/${id}`)
  revalidatePath('/admin/categories')
  return data
}

export async function deleteCategory(id: number) {
  const supabase = await createServerSupabaseClient()

  // Проверяем наличие подкатегорий
  const { data: subcategories } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', id)

  if (subcategories && subcategories.length > 0) {
    throw new Error('Cannot delete category with subcategories')
  }

  // Проверяем наличие товаров в категории
  const { count } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)

  if (count && count > 0) {
    throw new Error(`Cannot delete category with ${count} items`)
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/categories')
  revalidatePath('/admin/categories')
}

export async function getCategoryWithItems(slug: string) {
  const supabase = await createServerSupabaseClient()

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (categoryError) throw new Error(categoryError.message)

  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('category_id', category.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (itemsError) throw new Error(itemsError.message)

  return { ...category, items }
}

export async function updateCategoryIcon(id: number, iconName: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('categories')
    .update({ icon_name: iconName })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/categories')
  revalidatePath(`/categories/${id}`)
}

export async function reorderCategories(orderedIds: number[]) {
  const supabase = await createServerSupabaseClient()

  // Обновляем порядок категорий (если есть поле order)
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('categories')
      .update({ order: i } as any)
      .eq('id', orderedIds[i])

    if (error) throw new Error(error.message)
  }

  revalidatePath('/categories')
  revalidatePath('/admin/categories')
}