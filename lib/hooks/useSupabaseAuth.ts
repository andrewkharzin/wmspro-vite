// lib/hooks/useSupabaseAuth.ts
import { browserClient } from '@/lib/supabase/clients/browser.client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = browserClient.getClient();

    client.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await browserClient.getClient().auth.signOut();
  };

  return { user, loading, signOut };
}