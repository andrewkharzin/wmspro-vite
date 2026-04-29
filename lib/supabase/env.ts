// lib/supabase/env.ts
export const getSupabaseEnv = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (typeof window !== 'undefined') {
    if (!url) {
      console.error('❌ VITE_SUPABASE_URL is missing!')
    }
    if (!key) {
      console.error('❌ VITE_SUPABASE_ANON_KEY is missing!')
    }
  }

  return { url, key }
}

export const cleanSupabaseUrl = (url: string) => {
  return url.replace(/\/rest\/v1\/?$/, '')
}