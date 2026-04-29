// lib/services/profile.service.ts
import { browserClient } from '@/lib/supabase/clients/browser.client';
import { Database } from '@/types/supabase/core.types';

type Profile = Database['core']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['core']['Tables']['profiles']['Update'];

class ProfileService {
  private static instance: ProfileService;
  private cache: Map<string, { data: Profile; timestamp: number }> = new Map();
  private cacheTTL = 300000; // 5 минут

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProfileService();
    }
    return this.instance;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    // Проверяем кэш
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const client = browserClient.getClient();
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Сохраняем в кэш
      this.cache.set(userId, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    try {
      const client = browserClient.getClient();
      const { data, error } = await client
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Обновляем кэш
      this.cache.set(userId, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      const client = browserClient.getClient();

      const { error: uploadError } = await client
        .storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client
        .storage
        .from('profiles')
        .getPublicUrl(filePath);

      await this.updateProfile(userId, { avatar_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  }

  clearCache(userId?: string) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}

export const profileService = ProfileService.getInstance();