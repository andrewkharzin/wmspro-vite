import { useEffect } from 'react'
import { browserClient } from '@/lib/supabase/clients/browser.client'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeOptions<T> {
  table: string
  event?: RealtimeEvent
  filter?: string
  onInsert?: (data: T) => void
  onUpdate?: (data: T) => void
  onDelete?: (data: T) => void
}

export function useRealtime<T = any>({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions<T>) {
  useEffect(() => {
    const channel = browserClient.getClient()
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'core',
          table,
          filter,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new as T)
              break
            case 'UPDATE':
              onUpdate?.(payload.new as T)
              break
            case 'DELETE':
              onDelete?.(payload.old as T)
              break
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table, event, filter, onInsert, onUpdate, onDelete])
}