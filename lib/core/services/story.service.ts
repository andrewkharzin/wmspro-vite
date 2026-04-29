import { BaseService } from './base.service'
import { Story, StoryInsert, StoryUpdate, StoryFilters, QueryOptions, PaginatedResponse } from '../types'
import { browserClient } from '@/lib/supabase/clients/browser.client'

export class StoryService extends BaseService<Story, StoryInsert, StoryUpdate> {
  protected tableName = 'stories'

  async getActiveStories(limit = 20): Promise<Story[]> {
    const now = new Date().toISOString()

    const { data, error } = await this.query
      .select(`
        *,
        user:profiles!user_id(
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('status', 'active')
      .gte('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Story[]
  }

  async getUserStories(userId: string): Promise<Story[]> {
    const { data, error } = await this.query
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Story[]
  }

  async getStoryWithDetails(id: string): Promise<any> {
    const { data, error } = await this.query
      .select(`
        *,
        user:profiles!user_id(
          id,
          username,
          full_name,
          avatar_url,
          role
        ),
        linked_item:items(
          id,
          title,
          price,
          image_url,
          inventory_number
        ),
        linked_category:categories(
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async search(filters: StoryFilters, options?: QueryOptions): Promise<PaginatedResponse<Story>> {
    const page = options?.page || 1
    const limit = options?.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = this.query.select('*, user:profiles!user_id(username, full_name, avatar_url)', { count: 'exact' })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.contentType) {
      query = query.eq('content_type', filters.contentType)
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.isActive !== undefined) {
      const now = new Date().toISOString()
      if (filters.isActive) {
        query = query.eq('status', 'active').gte('expires_at', now)
      }
    }

    const { data, error, count } = await query
      .range(from, to)
      .order(options?.sortBy || 'created_at', {
        ascending: options?.sortOrder === 'asc'
      })

    if (error) throw error

    return {
      data: data as Story[],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    const story = await this.getById(id)
    if (!story) throw new Error('Story not found')

    const { error } = await this.query
      .update({ view_count: (story.view_count || 0) + 1 })
      .eq('id', id)

    if (error) throw error
  }

  async incrementReplyCount(id: string): Promise<void> {
    const story = await this.getById(id)
    if (!story) throw new Error('Story not found')

    const { error } = await this.query
      .update({ reply_count: (story.reply_count || 0) + 1 })
      .eq('id', id)

    if (error) throw error
  }

  async incrementShareCount(id: string): Promise<void> {
    const story = await this.getById(id)
    if (!story) throw new Error('Story not found')

    const { error } = await this.query
      .update({ share_count: (story.share_count || 0) + 1 })
      .eq('id', id)

    if (error) throw error
  }

  async incrementSwipeUpCount(id: string): Promise<void> {
    const story = await this.getById(id)
    if (!story) throw new Error('Story not found')

    const { error } = await this.query
      .update({ swipe_up_count: (story.swipe_up_count || 0) + 1 })
      .eq('id', id)

    if (error) throw error
  }

  async archiveExpiredStories(): Promise<void> {
    const now = new Date().toISOString()

    const { error } = await this.query
      .update({ status: 'archived' })
      .lt('expires_at', now)
      .eq('status', 'active')

    if (error) throw error
  }

  async getStoriesByCategory(categoryId: number, limit = 10): Promise<Story[]> {
    const now = new Date().toISOString()

    const { data, error } = await this.query
      .select('*, user:profiles!user_id(username, full_name, avatar_url)')
      .eq('linked_category_id', categoryId)
      .eq('status', 'active')
      .gte('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Story[]
  }

  async getStoriesByItem(itemId: string, limit = 10): Promise<Story[]> {
    const now = new Date().toISOString()

    const { data, error } = await this.query
      .select('*, user:profiles!user_id(username, full_name, avatar_url)')
      .eq('linked_item_id', itemId)
      .eq('status', 'active')
      .gte('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Story[]
  }

  async getTrendingStories(limit = 10): Promise<Story[]> {
    const now = new Date().toISOString()
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await this.query
      .select('*, user:profiles!user_id(username, full_name, avatar_url)')
      .eq('status', 'active')
      .gte('expires_at', now)
      .gte('created_at', twentyFourHoursAgo)
      .order('view_count', { ascending: false, nullsLast: true })
      .order('reply_count', { ascending: false, nullsLast: true })
      .limit(limit)

    if (error) throw error
    return data as Story[]
  }

  async createStoryWithMedia(
    story: StoryInsert,
    files?: File[]
  ): Promise<Story> {
    let mediaUrls: string[] = []

    // Upload media files if provided
    if (files && files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `story-${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `stories/${fileName}`

        const { error: uploadError } = await browserClient.getClient()
          .storage
          .from('stories')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = browserClient.getClient()
          .storage
          .from('stories')
          .getPublicUrl(filePath)

        mediaUrls.push(publicUrl)
      }

      story.media_urls = mediaUrls

      // Set thumbnail as first image if not provided
      if (!story.thumbnail_url && mediaUrls.length > 0) {
        story.thumbnail_url = mediaUrls[0]
      }
    }

    // Set expires_at if not provided (24 hours by default)
    if (!story.expires_at) {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)
      story.expires_at = expiresAt.toISOString()
    }

    return this.create(story)
  }

  async moderateStory(id: string, status: Story['moderation_status'], notes?: string): Promise<Story> {
  const updates: StoryUpdate = {
    moderation_status: status,
    moderation_notes: notes,
  }

  // Исправлено: используем правильные значения для status
  if (status === 'rejected') {
    updates.status = 'archived' // или 'draft' или 'hidden'
  } else if (status === 'approved') {
    updates.status = 'active'
  }
  // Для 'pending' и 'auto_approved' не меняем status

  return this.update(id, updates)
}

  async getStoriesForModeration(): Promise<Story[]> {
    const { data, error } = await this.query
      .select('*, user:profiles!user_id(username, full_name, email)')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Story[]
  }

  async getStoryStats(userId?: string): Promise<{
    total: number
    active: number
    archived: number
    totalViews: number
    totalReplies: number
    totalShares: number
  }> {
    let query = this.query.select('*', { count: 'exact', head: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error, count } = await query

    if (error) throw error

    // Исправлено: добавлены явные типы для параметров
    const stories = data as Story[]

    const stats = {
      total: count || 0,
      active: stories?.filter((story: Story) => story.status === 'active').length || 0,
      archived: stories?.filter((story: Story) => story.status === 'archived').length || 0,
      totalViews: stories?.reduce((sum: number, story: Story) => sum + (story.view_count || 0), 0) || 0,
      totalReplies: stories?.reduce((sum: number, story: Story) => sum + (story.reply_count || 0), 0) || 0,
      totalShares: stories?.reduce((sum: number, story: Story) => sum + (story.share_count || 0), 0) || 0,
    }

    return stats
  }

  async deleteExpiredStories(): Promise<void> {
    const now = new Date().toISOString()

    const { error } = await this.query
      .delete()
      .lt('expires_at', now)
      .eq('status', 'archived')

    if (error) throw error
  }
}

export const storyService = new StoryService()