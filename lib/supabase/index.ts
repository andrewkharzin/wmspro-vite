// Экспорт клиентов
export { browserClient } from './clients/browser.client'
export { serverClient } from './clients/server.client'
export { adminClient } from './clients/admin.client'

// Экспорт schema клиентов
export { coreClient } from './schemas/core/client'

// Экспорт типов
export type { Database } from '@/types/supabase/core.types'
export type {
  SchemaName,
  TableName,
  FunctionName
} from './clients/types'