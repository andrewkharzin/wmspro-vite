// lib/hooks/useAuthCheck.ts
import { useAuthStore } from '@/lib/store/authStore';
import { useCallback } from 'react';

export const useAuthCheck = () => {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();

  const checkAuth = useCallback(async () => {
    if (!isLoading && !isAuthenticated) {
      await initialize();
    }
  }, [initialize, isLoading, isAuthenticated]);

  return { checkAuth, isLoading, isAuthenticated };
};