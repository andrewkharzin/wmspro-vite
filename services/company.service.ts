// lib/services/company.service.ts
import { browserClient } from '@/lib/supabase/clients/browser.client';
import { Database } from '@/types/supabase/core.types';

type Company = Database['core']['Tables']['companies']['Row'];

class CompanyService {
  private static instance: CompanyService;
  private cache: { data: Company | null; timestamp: number } | null = null;
  private cacheTTL = 300000;

  static getInstance() {
    if (!this.instance) {
      this.instance = new CompanyService();
    }
    return this.instance;
  }

  async getCompany(): Promise<Company | null> {
    if (this.cache && Date.now() - this.cache.timestamp < this.cacheTTL) {
      return this.cache.data;
    }

    try {
      const client = browserClient.getClient();
      const { data, error } = await client
        .from('companies')
        .select('*')
        .eq('is_own_company', true)
        .maybeSingle();

      if (error) throw error;

      this.cache = { data: data || null, timestamp: Date.now() };
      return data || null;
    } catch (error) {
      console.error('Error fetching company:', error);
      return null;
    }
  }

  async saveCompany(companyData: Partial<Company>): Promise<Company | null> {
    try {
      const client = browserClient.getClient();
      const existing = await this.getCompany();

      let result;
      if (existing) {
        const { data, error } = await client
          .from('companies')
          .update(companyData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await client
          .from('companies')
          .insert({ ...companyData, is_own_company: true })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      this.cache = { data: result, timestamp: Date.now() };
      return result;
    } catch (error) {
      console.error('Error saving company:', error);
      return null;
    }
  }

  clearCache() {
    this.cache = null;
  }
}

export const companyService = CompanyService.getInstance();