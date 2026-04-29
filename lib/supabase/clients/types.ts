import { Database as CoreDatabase } from '@/types/supabase/core.types'

// Определяем интерфейс для всех схем
export interface DatabaseSchemas {
  core: CoreDatabase
  // analytics: AnalyticsDatabase
  // audit: AuditDatabase
}

// Тип для имени схемы
export type SchemaName = keyof DatabaseSchemas // 'core'

// Вспомогательные типы для извлечения таблиц из схемы (учитывая структуру Database)
export type SchemaTables<S extends SchemaName> =
  DatabaseSchemas[S] extends { core: { Tables: infer T } } ? T : never

export type SchemaViews<S extends SchemaName> =
  DatabaseSchemas[S] extends { core: { Views: infer V } } ? V : never

export type SchemaFunctions<S extends SchemaName> =
  DatabaseSchemas[S] extends { core: { Functions: infer F } } ? F : never

export type SchemaEnums<S extends SchemaName> =
  DatabaseSchemas[S] extends { core: { Enums: infer E } } ? E : never

// Тип для имени таблицы в конкретной схеме
export type TableName<S extends SchemaName> = keyof SchemaTables<S> & string

// Тип для имени функции
export type FunctionName<S extends SchemaName> = keyof SchemaFunctions<S> & string

// Типизированный клиент с поддержкой схем
export interface TypedSupabaseQueryBuilder<S extends SchemaName> {
  select: <T extends TableName<S>>(table: T) => any
  insert: <T extends TableName<S>>(table: T) => any
  update: <T extends TableName<S>>(table: T) => any
  delete: <T extends TableName<S>>(table: T) => any
  rpc: <F extends FunctionName<S>>(fn: F) => any
}