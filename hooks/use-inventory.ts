
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_ITEMS } from '../lib/constants';
import { Item } from '../lib/types';
import { queryKeys } from '@/lib/query/keys';

export function useInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: items = MOCK_ITEMS } = useQuery({
    queryKey: queryKeys.inventory.list(),
    queryFn: async () => MOCK_ITEMS,
    staleTime: 1000 * 60 * 2,
  });

  const stats = useMemo(() => {
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const lowStockCount = items.filter(i => i.available_quantity < 10).length;
    return { totalValue, lowStockCount, totalItems: items.length };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inventory_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const addItemMutation = useMutation({
    mutationFn: async (newItem: Item) => newItem,
    onSuccess: (newItem) => {
      queryClient.setQueryData<Item[]>(queryKeys.inventory.list(), (prev = []) => [newItem, ...prev]);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updatedItem }: { id: string; updatedItem: Partial<Item> }) => ({ id, updatedItem }),
    onSuccess: ({ id, updatedItem }) => {
      queryClient.setQueryData<Item[]>(queryKeys.inventory.list(), (prev = []) =>
        prev.map((item) => (item.id === id ? ({ ...item, ...updatedItem } as Item) : item))
      );
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: (id) => {
      queryClient.setQueryData<Item[]>(queryKeys.inventory.list(), (prev = []) => prev.filter((item) => item.id !== id));
    },
  });

  const deleteItem = (id: string) => {
    if (confirm('Verify: Permanent asset decommissioning. This action cannot be reversed.')) {
      deleteItemMutation.mutate(id);
    }
  };

  const updateStock = (id: string, amount: number) => {
    queryClient.setQueryData<Item[]>(queryKeys.inventory.list(), (prev = []) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + amount, available_quantity: item.available_quantity + amount }
          : item
      )
    );
  };

  return {
    items: filteredItems,
    all_items: items,
    stats,
    searchTerm,
    setSearchTerm,
    addItem: (newItem: Item) => addItemMutation.mutate(newItem),
    updateItem: (id: string, updatedItem: Partial<Item>) => updateItemMutation.mutate({ id, updatedItem }),
    deleteItem,
    updateStock
  };
}
