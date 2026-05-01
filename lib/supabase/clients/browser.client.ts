// lib/supabase/clients/browser.client.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase/core.types'

class BrowserSupabaseClient {
  private static instance: ReturnType<typeof createClient<Database>> | null = null

  static getInstance() {
    if (!this.instance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }

      // Очищаем URL от /rest/v1/ если есть
      const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '')

      this.instance = createClient<Database>(cleanUrl, supabaseAnonKey, {
        db: {
          schema: 'core' // ВАЖНО: Указываем схему по умолчанию
        }
      })
    }
    return this.instance
  }

  // Прямой доступ к таблицам без указания схемы (так как схема уже указана в db.schema)
  static from<T extends keyof Database['core']['Tables']>(tableName: T) {
    const client = this.getInstance()
    return client.from(String(tableName) as any)
  }

  static rpc(fnName: string, args?: any) {
    const client = this.getInstance()
    return (client.rpc as any)(fnName, args)
  }

  static get core() {
    const client = this.getInstance()
    return {
      from: (table: string) => client.from(table as any),
      rpc: (fn: string, args?: any) => (client.rpc as any)(fn, args),
      schema: () => client,
    }
  }

  static getClient() {
    return this.getInstance()
  }
}

export const browserClient = BrowserSupabaseClient