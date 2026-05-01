// lib/supabase/env.ts
export const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (typeof window !== 'undefined') {
    if (!url) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing!')
    }
    if (!key) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!')
    }
  }

  return { url, key }
}

export const cleanSupabaseUrl = (url: string) => {
  return url.replace(/\/rest\/v1\/?$/, '')
}