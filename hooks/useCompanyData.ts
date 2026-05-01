// hooks/useCompanyData.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { companyService } from '@/lib/core/services/company.service';
import { Database } from '@/types/supabase/core.types';

type Company = Database['core']['Tables']['companies']['Row'];

// Глобальный кэш вне хука - сохраняется между рендерами
let cachedCompany: { data: Company | null; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

// Флаг для предотвращения дублирования запросов
let pendingRequest: Promise<Company | null> | null = null;

export function useCompanyData() {
  // Инициализируем state из кэша
  const [company, setCompany] = useState<Company | null>(() => {
    if (cachedCompany && Date.now() - cachedCompany.timestamp < CACHE_TTL) {
      return cachedCompany.data;
    }
    return null;
  });

  const [loading, setLoading] = useState(!company); // Если есть в кэше - не грузим
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const loadCompany = useCallback(async (forceRefresh = false) => {
    // Проверяем кэш
    if (!forceRefresh && cachedCompany && Date.now() - cachedCompany.timestamp < CACHE_TTL) {
      if (isMounted.current) {
        setCompany(cachedCompany.data);
        setLoading(false);
      }
      return cachedCompany.data;
    }

    // Проверяем, нет ли уже активного запроса
    if (pendingRequest) {
      try {
        const data = await pendingRequest;
        if (isMounted.current) {
          setCompany(data);
        }
        return data;
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    setLoading(true);

    // Создаем новый запрос
    pendingRequest = (async () => {
      try {
        const data = await companyService.getCompany();
        if (data !== undefined) {
          cachedCompany = { data, timestamp: Date.now() };
        }
        return data;
      } catch (err) {
        console.error('Error loading company:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'Error loading company');
        }
        return null;
      }
    })();

    try {
      const data = await pendingRequest;
      if (isMounted.current) {
        setCompany(data);
        setError(null);
      }
      return data;
    } finally {
      pendingRequest = null;
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const saveCompany = useCallback(async (data: Partial<Company>) => {
    try {
      const saved = await companyService.saveCompany(data);
      if (saved) {
        setCompany(saved);
        // Обновляем кэш
        cachedCompany = { data: saved, timestamp: Date.now() };
      }
      return saved;
    } catch (err) {
      console.error('Error saving company:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadCompany();

    return () => {
      isMounted.current = false;
    };
  }, [loadCompany]);

  return {
    company,
    loading,
    error,
    saveCompany,
    refetch: () => loadCompany(true)
  };
}