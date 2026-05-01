// hooks/useProfileData.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { profileService } from '@/lib/core/services/profile.service';
import { Database } from '@/types/supabase/core.types';

type Profile = Database['core']['Tables']['profiles']['Row'];

// Глобальный кэш вне хука - сохраняется между рендерами
const profileCache = new Map<string, { data: Profile; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Флаг для предотвращения дублирования запросов
const pendingRequests = new Map<string, Promise<Profile | null>>();

export function useProfileData(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    // Инициализация из кэша
    if (userId && profileCache.has(userId)) {
      const cached = profileCache.get(userId)!;
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const loadProfile = useCallback(async (forceRefresh = false) => {
    if (!userId) {
      setLoading(false);
      return null;
    }

    // Проверяем кэш
    if (!forceRefresh && profileCache.has(userId)) {
      const cached = profileCache.get(userId)!;
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        if (isMounted.current) {
          setProfile(cached.data);
          setLoading(false);
        }
        return cached.data;
      }
    }

    // Проверяем, нет ли уже активного запроса
    if (pendingRequests.has(userId)) {
      try {
        const data = await pendingRequests.get(userId);
        if (isMounted.current && data) {
          setProfile(data);
        }
        return data;
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    setLoading(true);

    // Создаем новый запрос
    const requestPromise = (async () => {
      try {
        const data = await profileService.getProfile(userId);
        if (data) {
          profileCache.set(userId, { data, timestamp: Date.now() });
        }
        return data;
      } catch (err) {
        console.error('Error loading profile:', err);
        return null;
      }
    })();

    pendingRequests.set(userId, requestPromise);

    try {
      const data = await requestPromise;
      if (isMounted.current) {
        setProfile(data);
        setError(null);
      }
      return data;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error loading profile');
      }
      return null;
    } finally {
      pendingRequests.delete(userId);
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!userId) return null;

    try {
      const updated = await profileService.updateProfile(userId, updates);
      if (updated) {
        setProfile(updated);
        // Обновляем кэш
        profileCache.set(userId, { data: updated, timestamp: Date.now() });
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
        const updatedProfile = { ...profile, avatar_url: url };
        setProfile(updatedProfile);
        profileCache.set(userId, { data: updatedProfile, timestamp: Date.now() });
      }
      return url;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  }, [userId, profile]);

  useEffect(() => {
    isMounted.current = true;
    loadProfile();

    return () => {
      isMounted.current = false;
    };
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: () => loadProfile(true)
  };
}