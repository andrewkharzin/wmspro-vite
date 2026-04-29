import { BaseService } from './base.service'
import { Category, CategoryInsert, CategoryUpdate } from '../types'

export class CategoryService extends BaseService<Category, CategoryInsert, CategoryUpdate> {
  protected tableName = 'categories'

  async getHierarchy(): Promise<Category[]> {
    const { data, error } = await this.query
      .select('*')
      .order('parent_id', { nullsFirst: true })
      .order('name')

    if (error) throw error
    return data as Category[]
  }

  async getSubcategories(parentId: number): Promise<Category[]> {
    const { data, error } = await this.query
      .select('*')
      .eq('parent_id', parentId)
      .order('name')

    if (error) throw error
    return data as Category[]
  }

  async getRootCategories(): Promise<Category[]> {
    const { data, error } = await this.query
      .select('*')
      .is('parent_id', null)
      .order('name')

    if (error) throw error
    return data as Category[]
  }

  async incrementItemCount(categoryId: number): Promise<void> {
    const category = await this.getById(categoryId.toString())
    if (!category) return

    await this.update(categoryId.toString(), {
      items_count: (category.items_count || 0) + 1
    } as CategoryUpdate)
  }

  async decrementItemCount(categoryId: number): Promise<void> {
    const category = await this.getById(categoryId.toString())
    if (!category) return

    await this.update(categoryId.toString(), {
      items_count: Math.max(0, (category.items_count || 0) - 1)
    } as CategoryUpdate)
  }
}

export const categoryService = new CategoryService()