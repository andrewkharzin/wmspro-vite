import { useState, useEffect, useCallback } from 'react'
import { storyService } from '../services/story.service'
import { Story, StoryFilters, StoryInsert } from '../types'
import { useRealtime } from './useRealtime'

export function useStories(initialFilters?: StoryFilters) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<StoryFilters | undefined>(initialFilters)

  const fetchStories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await storyService.getActiveStories()
      setStories(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  useRealtime<Story>({
    table: 'stories',
    onInsert: (newStory) => {
      if (newStory.status === 'active') {
        setStories(prev => [newStory, ...prev])
      }
    },
    onUpdate: (updatedStory) => {
      setStories(prev => prev.map(story =>
        story.id === updatedStory.id ? updatedStory : story
      ))
    },
  })

  const createStory = useCallback(async (data: StoryInsert) => {
    const newStory = await storyService.create(data)
    return newStory
  }, [])

  const incrementView = useCallback(async (id: string) => {
    await storyService.incrementViewCount(id)
  }, [])

  return {
    stories,
    loading,
    error,
    createStory,
    incrementView,
    refetch: fetchStories,
  }
}