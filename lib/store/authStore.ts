// lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { browserClient } from '@/lib/supabase/clients/browser.client';
import { Database } from '@/types/supabase/core.types';
import { queryCache } from '@/lib/supabase/cache'

type Profile = Database['core']['Tables']['profiles']['Row'];

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: Profile | null) => void;  // <-- ДОБАВЛЕНО
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const client = browserClient.getClient();
          const { data: { session } } = await client.auth.getSession();

          if (session?.user) {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Initialize error:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to initialize authentication'
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const client = browserClient.getClient();
          const { data, error } = await client.auth.signInWithPassword({ email, password });

          if (error) throw error;

          if (data.user) {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          }
          return false;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      signup: async (email: string, password: string, username: string, fullName: string) => {
        set({ isLoading: true, error: null });
        try {
          const client = browserClient.getClient();
          const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
              data: { username, full_name: fullName },
            },
          });

          if (error) throw error;

          if (data.user) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            set({ isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const client = browserClient.getClient();
          await client.auth.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      updateUser: (user) => set({ user, isAuthenticated: !!user }), // <-- ДОБАВЛЕНО
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);