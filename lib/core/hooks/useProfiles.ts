import { useState, useEffect, useCallback } from 'react'
import { profileService } from '../services/profile.service'
import { Profile, ProfileFilters, ProfileUpdate } from '../types'
import { useRealtime } from './useRealtime'
import { useSupabase } from '@/lib/hooks/useSupabase'

export function useProfiles(initialFilters?: ProfileFilters) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<ProfileFilters | undefined>(initialFilters)
  const { user } = useSupabase()

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await profileService.search(filters || {})
      setProfiles(result.data)
      setTotalCount(result.count)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  useRealtime<Profile>({
    table: 'profiles',
    onUpdate: (updatedProfile) => {
      setProfiles(prev => prev.map(profile =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      ))
    },
  })

  const updateProfile = useCallback(async (id: string, data: ProfileUpdate) => {
    const updated = await profileService.update(id, data)
    return updated
  }, [])

  const updateStatus = useCallback(async (id: string, status: Profile['status']) => {
    const updated = await profileService.updateStatus(id, status)
    return updated
  }, [])

  const getCurrentProfile = useCallback(async () => {
    if (!user) return null
    return await profileService.getByUserId(user.id)
  }, [user])

  return {
    profiles,
    loading,
    error,
    totalCount,
    filters,
    setFilters,
    updateProfile,
    updateStatus,
    getCurrentProfile,
    refetch: fetchProfiles,
  }
}