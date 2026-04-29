// hooks/useProfileData.ts
import { useState, useEffect, useCallback } from 'react';
import { profileService } from '@/lib/core/services/profile.service';
import { Database } from '@/types/supabase/core.types';

type Profile = Database['core']['Tables']['profiles']['Row'];

export function useProfileData(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await profileService.getProfile(userId);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!userId) return null;

    try {
      const updated = await profileService.updateProfile(userId, updates);
      if (updated) {
        setProfile(updated);
      }
      return updated;
    } catch (err) {
      console.error('Error updating profile:', err);
      return null;
    }
  }, [userId]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!userId) return null;

    try {
      const url = await profileService.uploadAvatar(userId, file);
      if (url && profile) {
        setProfile({ ...profile, avatar_url: url });
      }
      return url;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  }, [userId, profile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, loading, error, updateProfile, uploadAvatar, refetch: loadProfile };
}