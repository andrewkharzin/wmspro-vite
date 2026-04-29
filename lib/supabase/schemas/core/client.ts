import { browserClient } from '../../clients/browser.client'
import { serverClient } from '../../clients/server.client'
import { adminClient } from '../../clients/admin.client'
import type { Database } from '@/types/supabase/core.types'

type CoreTables = Database['core']['Tables']
type CoreEnums = Database['core']['Enums']

export class CoreSchemaClient {
  private static instance: CoreSchemaClient

  static getInstance() {
    if (!this.instance) {
      this.instance = new CoreSchemaClient()
    }
    return this.instance
  }

  // Browser (client-side) queries
  get browser() {
    return {
      // Tables
      profiles: () => browserClient.core.from('profiles'),
      companies: () => browserClient.core.from('companies'),
      contacts: () => browserClient.core.from('contacts'),
      items: () => browserClient.core.from('items'),
      categories: () => browserClient.core.from('categories'),
      stories: () => browserClient.core.from('stories'),
      conversations: () => browserClient.core.from('conversations'),
      chatMessages: () => browserClient.core.from('chat_messages'),
      inventoryMovements: () => browserClient.core.from('inventory_movements'),
      locations: () => browserClient.core.from('locations'),
      warehouses: () => browserClient.core.from('warehouses'),
      storageZones: () => browserClient.core.from('storage_zones'),
      storageBins: () => browserClient.core.from('storage_bins'),
      batches: () => browserClient.core.from('batches'),
      workShifts: () => browserClient.core.from('work_shifts'),
      payrollRecords: () => browserClient.core.from('payroll_records'),
      conversationParticipants: () => browserClient.core.from('conversation_participants'),
    }
  }

  // Server-side queries (Next.js server components)
  get server() {
    return {
      profiles: async () => (await serverClient.core).from('profiles'),
      companies: async () => (await serverClient.core).from('companies'),
      contacts: async () => (await serverClient.core).from('contacts'),
      items: async () => (await serverClient.core).from('items'),
      categories: async () => (await serverClient.core).from('categories'),
      stories: async () => (await serverClient.core).from('stories'),
      conversations: async () => (await serverClient.core).from('conversations'),
      chatMessages: async () => (await serverClient.core).from('chat_messages'),
      inventoryMovements: async () => (await serverClient.core).from('inventory_movements'),
      locations: async () => (await serverClient.core).from('locations'),
      warehouses: async () => (await serverClient.core).from('warehouses'),
      storageZones: async () => (await serverClient.core).from('storage_zones'),
      storageBins: async () => (await serverClient.core).from('storage_bins'),
      batches: async () => (await serverClient.core).from('batches'),
      workShifts: async () => (await serverClient.core).from('work_shifts'),
      payrollRecords: async () => (await serverClient.core).from('payroll_records'),
      conversationParticipants: async () => (await serverClient.core).from('conversation_participants'),
    }
  }

  // Admin queries (service role)
  get admin() {
    return {
      profiles: () => adminClient.core.from('profiles'),
      companies: () => adminClient.core.from('companies'),
      items: () => adminClient.core.from('items'),
      // ... другие таблицы
    }
  }

  // Real-time subscriptions
  get realtime() {
    return {
      onItemsChange: (callback: (payload: any) => void) => {
        const channel = browserClient.getClient().channel('core_items_changes')
        return channel
          .on('postgres_changes',
            { event: '*', schema: 'core', table: 'items' },
            callback
          )
          .subscribe()
      },
      onProfilesChange: (callback: (payload: any) => void) => {
        const channel = browserClient.getClient().channel('core_profiles_changes')
        return channel
          .on('postgres_changes',
            { event: '*', schema: 'core', table: 'profiles' },
            callback
          )
          .subscribe()
      },
      onMessagesChange: (callback: (payload: any) => void) => {
        const channel = browserClient.getClient().channel('core_messages_changes')
        return channel
          .on('postgres_changes',
            { event: '*', schema: 'core', table: 'chat_messages' },
            callback
          )
          .subscribe()
      },
    }
  }

  // Enums helper
  get enums() {
    return {
      userRole: {
        ADMIN: 'admin' as CoreEnums['user_role'],
        MANAGER: 'manager' as CoreEnums['user_role'],
        STAFF: 'staff' as CoreEnums['user_role'],
        SELLER: 'seller' as CoreEnums['user_role'],
        BUYER: 'buyer' as CoreEnums['user_role'],
      },
      itemStatus: {
        DRAFT: 'draft' as CoreEnums['item_status'],
        ACTIVE: 'active' as CoreEnums['item_status'],
        SOLD: 'sold' as CoreEnums['item_status'],
        ARCHIVED: 'archived' as CoreEnums['item_status'],
      },
      // ... другие enums
    }
  }
}

// Экспортируем синглтон
export const coreClient = CoreSchemaClient.getInstance()