export const queryKeys = {
  inventory: {
    all: ['inventory'] as const,
    list: (filters?: Record<string, unknown>) => ['inventory', 'list', filters ?? {}] as const,
    detail: (id: string) => ['inventory', 'detail', id] as const,
  },
  warehouses: {
    all: ['warehouses'] as const,
    list: () => ['warehouses', 'list'] as const,
    detail: (id: string) => ['warehouses', 'detail', id] as const,
  },
};
