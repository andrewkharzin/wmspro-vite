
import { useState, useMemo } from 'react';
import { MOCK_ITEMS } from '../lib/constants';
import { Item } from '../lib/types';

export function useInventory() {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');

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

  const addItem = (newItem: Item) => {
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, updatedItem: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedItem } as Item : item
    ));
  };

  const deleteItem = (id: string) => {
    if (confirm('Verify: Permanent asset decommissioning. This action cannot be reversed.')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateStock = (id: string, amount: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + amount, available_quantity: item.available_quantity + amount } : item
    ));
  };

  return {
    items: filteredItems,
    all_items: items,
    stats,
    searchTerm,
    setSearchTerm,
    addItem,
    updateItem,
    deleteItem,
    updateStock
  };
}
