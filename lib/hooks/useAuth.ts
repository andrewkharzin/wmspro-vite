// lib/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { browserClient } from '@/lib/supabase/clients/browser.client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Проверяем текущую сессию при загрузке
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await browserClient.getClient().auth.getSession();

        if (error) throw error;

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkSession();

    // Слушаем изменения аутентификации
    const { data: { subscription } } = browserClient.getClient().auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }

        setLoading(false);
        setInitialized(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, initialized };
}