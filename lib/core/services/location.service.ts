import { BaseService } from './base.service'
import { Location, LocationInsert, LocationUpdate } from '../types'

export class LocationService extends BaseService<Location, LocationInsert, LocationUpdate> {
  protected tableName = 'locations'

  async getByUser(userId: string): Promise<Location[]> {
    const { data, error } = await this.query
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })

    if (error) throw error
    return data as Location[]
  }

  async getPublicLocations(): Promise<Location[]> {
    const { data, error } = await this.query
      .select('*')
      .eq('is_public', true)
      .eq('is_active', true)

    if (error) throw error
    return data as Location[]
  }

  async setDefaultLocation(userId: string, locationId: string): Promise<void> {
    // Сначала снимаем флаг is_default со всех локаций пользователя
    await this.query
      .update({ is_default: false })
      .eq('user_id', userId)

    // Затем устанавливаем новый дефолтный адрес
    await this.update(locationId, { is_default: true } as LocationUpdate)
  }

  async getWarehouses(): Promise<Location[]> {
    const { data, error } = await this.query
      .select('*')
      .eq('type', 'warehouse')
      .eq('is_active', true)

    if (error) throw error
    return data as Location[]
  }
}

export const locationService = new LocationService()