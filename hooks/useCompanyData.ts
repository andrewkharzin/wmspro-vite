// hooks/useCompanyData.ts
import { useState, useEffect, useCallback } from 'react';
import { companyService } from '@/lib/core/services/company.service';
import { Database } from '@/types/supabase/core.types';

type Company = Database['core']['Tables']['companies']['Row'];

export function useCompanyData() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompany = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompany();
      setCompany(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading company');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCompany = useCallback(async (data: Partial<Company>) => {
    try {
      const saved = await companyService.saveCompany(data);
      if (saved) {
        setCompany(saved);
      }
      return saved;
    } catch (err) {
      console.error('Error saving company:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  return { company, loading, error, saveCompany, refetch: loadCompany };
}