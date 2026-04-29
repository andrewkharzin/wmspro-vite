export interface Profile {
  id: string;
  username: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff' | 'seller' | 'buyer';
  avatar_url?: string;
  subscription_tier?: 'free' | 'pro' | 'enterprise';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  items_count: number;
}

export interface Location {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  location_code: string; // Default 'DEF'
  type: 'home' | 'warehouse' | 'retail' | 'other';
  address: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  contact_phone?: string;
  contact_email?: string;
  working_hours?: Record<string, string>; // jsonb
  is_public: boolean;
  is_active: boolean;
  is_default: boolean;
  allow_pickup: boolean;
  items_count: number;
  created_at?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  capacity_volume: number;
  location_id: string;
  zones?: StorageZone[];
}

export interface StorageZone {
  id: string;
  name: string;
  code: string;
  zone_type: 'bulk' | 'rack' | 'shelf' | 'bin' | 'cold' | 'hazardous';
  bins?: StorageBin[];
}

export interface StorageBin {
  id: string;
  code: string;
  is_occupied: boolean;
  current_quantity: number;
  max_volume?: number;
}

export interface Item {
  id: string;
  title: string;
  inventory_number: string;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  price: number;
  status: 'draft' | 'active' | 'sold' | 'archived';
  category_id: number;
  location_id?: string;
  image_url?: string; // Simplified for UI from array
  condition: string;
  requires_moderation: boolean;
  is_featured?: boolean;
  seller_name?: string;
  seller_rating?: number;
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  item_name: string; // Joined for UI
  movement_type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity_before: number;
  quantity_after: number;
  movement_date: string;
  user?: string; // Who performed the action
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'moderation' | 'expiration' | 'system';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}