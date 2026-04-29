
import { useState, useMemo, useCallback } from 'react';
import { MOCK_ITEMS, MOCK_CATEGORIES } from '../lib/constants';
import { Item } from '../lib/types';

export interface FilterState {
  priceRange: [number, number];
  minRating: number;
  conditions: string[];
  sellerTypes: string[];
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export function useMarketplace(externalSearch: string = '') {
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    minRating: 0,
    conditions: [],
    sellerTypes: [],
    sortBy: 'newest'
  });

  const searchQuery = externalSearch || localSearchQuery;

  const filteredListings = useMemo(() => {
    const targetCategories = new Set<number>();
    if (categoryFilter !== 'all') {
      targetCategories.add(categoryFilter);
      MOCK_CATEGORIES.filter(c => c.parent_id === categoryFilter).forEach(sc => targetCategories.add(sc.id));
    }

    let result = MOCK_ITEMS.filter(item => {
      const matchesCategory = categoryFilter === 'all' || targetCategories.has(item.category_id);
      
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
                           item.title.toLowerCase().includes(q) || 
                           item.seller_name?.toLowerCase().includes(q) ||
                           item.description?.toLowerCase().includes(q) ||
                           item.inventory_number?.toLowerCase().includes(q);
      
      const matchesPrice = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
      const matchesRating = (item.seller_rating || 0) >= filters.minRating;
      const matchesCondition = filters.conditions.length === 0 || filters.conditions.includes(item.condition);
      const matchesSellerType = filters.sellerTypes.length === 0 || filters.sellerTypes.includes(item.seller_type || '');
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesCondition && matchesSellerType && item.status === 'active';
    });

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.seller_rating || 0) - (a.seller_rating || 0)); break;
      default: break; // Default mock order
    }

    return result;
  }, [categoryFilter, searchQuery, filters]);

  const resetAllFilters = useCallback(() => {
    setCategoryFilter('all');
    setLocalSearchQuery('');
    setFilters({
      priceRange: [0, 1000000],
      minRating: 0,
      conditions: [],
      sellerTypes: [],
      sortBy: 'newest'
    });
  }, []);

  const updateFilters = useCallback((update: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...update }));
  }, []);

  return {
    listings: filteredListings,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery: setLocalSearchQuery,
    filters,
    updateFilters,
    resetAllFilters
  };
}
