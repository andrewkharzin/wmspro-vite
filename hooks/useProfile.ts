// hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { browserClient } from '@/lib/supabase/clients/browser.client';

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const client = browserClient.getClient();
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
};

export const useCompany = () => {
  return useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const client = browserClient.getClient();
      const { data, error } = await client
        .from('companies')
        .select('*')
        .eq('is_own_company', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};