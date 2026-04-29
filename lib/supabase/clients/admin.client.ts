import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase/core.types'

type TypedSupabaseClient = SupabaseClient<Database>

class AdminSupabaseClient {
  private static instance: TypedSupabaseClient | null = null

  private static getInstance(): TypedSupabaseClient {
    if (!this.instance) {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
      }

      this.instance = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )
    }
    return this.instance
  }

  static table<T extends keyof Database['core']['Tables']>(tableName: T) {
    const client = this.getInstance()
    return client.from(`core.${String(tableName)}` as any)
  }

  // Исправленный RPC метод
  static rpc(fnName: string, args?: any) {
    const client = this.getInstance()
    // Используем type assertion для обхода проблемы с типизацией
    return (client.rpc as any)(fnName, args)
  }

  static get core() {
    const client = this.getInstance()
    return {
      from: (table: string) => client.from(`core.${table}` as any),
      rpc: (fn: string, args?: any) => (client.rpc as any)(fn, args),
      schema: () => client,
    }
  }

  static getClient(): TypedSupabaseClient {
    return this.getInstance()
  }
}

export const adminClient = AdminSupabaseClient