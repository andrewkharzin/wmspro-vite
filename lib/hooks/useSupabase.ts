// lib/hooks/useSupabase.ts
import { useEffect, useState } from 'react'
import { browserClient } from '@/lib/supabase/clients/browser.client'
import { User } from '@supabase/supabase-js'

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Get initial session
    browserClient.getClient().auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = browserClient.getClient().auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await browserClient.getClient().auth.signOut()
  }

  return {
    supabase: browserClient.getClient(),
    user,
    session,
    loading,
    signOut
  }
}