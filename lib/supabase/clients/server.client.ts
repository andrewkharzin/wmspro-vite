// lib/supabase/clients/server.client.ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase/core.types'

// Добавьте эту функцию
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

class ServerSupabaseClient {
  private static async getInstance() {
    return await createServerSupabaseClient()
  }

  static async core() {
    const client = await this.getInstance()
    return {
      from: (table: string) => client.from(`core.${table}` as any),
      rpc: (fn: string, args?: any) => (client.rpc as any)(fn, args),
      schema: () => client,
    }
  }

  static async table<T extends keyof Database['core']['Tables']>(tableName: T) {
    const client = await this.getInstance()
    return client.from(`core.${String(tableName)}` as any)
  }

  static async rpc(fnName: string, args?: any) {
    const client = await this.getInstance()
    return (client.rpc as any)(fnName, args)
  }

  static async getClient() {
    return await this.getInstance()
  }
}

export const serverClient = ServerSupabaseClient