import { Database } from '@/types/supabase/core.types'

export type CoreTables = Database['core']['Tables']
export type CoreEnums = Database['core']['Enums']

// Базовые типы для таблиц
export type Profile = CoreTables['profiles']['Row']
export type ProfileInsert = CoreTables['profiles']['Insert']
export type ProfileUpdate = CoreTables['profiles']['Update']

export type Item = CoreTables['items']['Row']
export type ItemInsert = CoreTables['items']['Insert']
export type ItemUpdate = CoreTables['items']['Update']

export type Category = CoreTables['categories']['Row']
export type CategoryInsert = CoreTables['categories']['Insert']
export type CategoryUpdate = CoreTables['categories']['Update']

export type Company = CoreTables['companies']['Row']
export type CompanyInsert = CoreTables['companies']['Insert']
export type CompanyUpdate = CoreTables['companies']['Update']

export type Location = CoreTables['locations']['Row']
export type LocationInsert = CoreTables['locations']['Insert']
export type LocationUpdate = CoreTables['locations']['Update']

export type Warehouse = CoreTables['warehouses']['Row']
export type WarehouseInsert = CoreTables['warehouses']['Insert']
export type WarehouseUpdate = CoreTables['warehouses']['Update']

export type Story = CoreTables['stories']['Row']
export type StoryInsert = CoreTables['stories']['Insert']
export type StoryUpdate = CoreTables['stories']['Update']

export type Conversation = CoreTables['conversations']['Row']
export type ConversationInsert = CoreTables['conversations']['Insert']
export type ConversationUpdate = CoreTables['conversations']['Update']

export type ChatMessage = CoreTables['chat_messages']['Row']
export type ChatMessageInsert = CoreTables['chat_messages']['Insert']
export type ChatMessageUpdate = CoreTables['chat_messages']['Update']

export type InventoryMovement = CoreTables['inventory_movements']['Row']
export type InventoryMovementInsert = CoreTables['inventory_movements']['Insert']
export type Batch = CoreTables['batches']['Row']
export type BatchInsert = CoreTables['batches']['Insert']

export type WorkShift = CoreTables['work_shifts']['Row']
export type WorkShiftInsert = CoreTables['work_shifts']['Insert']
export type PayrollRecord = CoreTables['payroll_records']['Row']
export type PayrollRecordInsert = CoreTables['payroll_records']['Insert']


// Query types
export interface QueryOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

// Filter types
export interface ItemFilters {
  status?: CoreEnums['item_status']
  categoryId?: number
  sellerId?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  tags?: string[]
  isFeatured?: boolean
}

export interface ProfileFilters {
  role?: CoreEnums['user_role']
  status?: CoreEnums['user_status']
  department?: string
  search?: string
}

export interface StoryFilters {
  status?: CoreEnums['story_status']
  contentType?: CoreEnums['story_content_type']
  userId?: string
  isActive?: boolean
}