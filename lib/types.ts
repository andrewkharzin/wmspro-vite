
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type UserRole = 'admin' | 'manager' | 'staff' | 'seller' | 'buyer';
export type SellerType = 'individual' | 'enterprise';
export type StoryContentType = 'image' | 'video' | 'carousel' | 'text' | 'poll' | 'question' | 'countdown' | 'product';
export type StoryStatus = 'draft' | 'active' | 'archived' | 'hidden' | 'reported';
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'auto_approved';
export type CTAActionType = 'shop_now' | 'learn_more' | 'book_now' | 'contact_us' | 'view_item' | 'visit_store';

export interface SellerMetrics {
  reliability: number;
  delivery_speed: number;
  integrity_score: number;
  verification_date: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  subscription_tier?: SubscriptionTier;
  email?: string;
  last_active?: string;
  status?: 'active' | 'suspended' | 'pending';
  hourly_rate?: number; 
  department?: string;
}

export interface Location {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  location_code: string;
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
  working_hours?: Record<string, string>;
  is_public: boolean;
  is_active: boolean;
  is_default: boolean;
  allow_pickup: boolean;
  items_count: number;
  created_at?: string;
}

export interface StorageBin {
  id: string;
  code: string;
  is_occupied: boolean;
  current_quantity: number;
  max_volume?: number;
}

export interface StorageZone {
  id: string;
  name: string;
  code: string;
  zone_type: 'bulk' | 'rack' | 'shelf' | 'bin' | 'cold' | 'hazardous';
  bins?: StorageBin[];
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  capacity_volume: number;
  location_id: string;
  zones?: StorageZone[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  items_count: number;
  parent_id?: number;
  description?: string;
  icon_name?: string;
  custom_icon_url?: string;
  color_code?: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'moderation' | 'expiration' | 'system';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
}

export interface Batch {
  id: string;
  batch_number: string;
  item_id: string;
  item_name: string;
  initial_quantity: number;
  current_quantity: number;
  production_date: string;
  expiry_date: string;
  status: 'active' | 'quarantine' | 'expired';
  location_id: string;
}

export interface Story {
  id: string;
  user_id: string;
  title?: string;
  content_type: StoryContentType;
  media_urls: string[];
  thumbnail_url?: string;
  content_text?: string;
  background_color?: string;
  text_color?: string;
  font_size?: number;
  font_family?: string;
  animation_effect?: string;
  auto_scroll?: boolean;
  scroll_speed?: number; 
  duration_seconds: number;
  has_sound: boolean;
  allow_replies: boolean;
  allow_sharing: boolean;
  show_view_count: boolean;
  linked_item_id?: string;
  linked_category_id?: number;
  call_to_action_type?: CTAActionType;
  call_to_action_text?: string;
  call_to_action_url?: string;
  poll_question?: string;
  poll_options?: any;
  question_prompt?: string;
  countdown_to?: string;
  view_count: number;
  reply_count: number;
  share_count: number;
  swipe_up_count: number;
  poll_vote_count: number;
  status: StoryStatus;
  requires_moderation: boolean;
  moderation_status: ModerationStatus;
  moderation_notes?: string;
  is_highlight: boolean;
  highlight_category?: string;
  expires_at: string;
  location_id?: string;
  tags: string[];
  mentions: string[];
  hashtags: string[];
  created_at: string;
  published_at?: string;
  user_full_name?: string;
  user_avatar?: string;
  bg_effect?: 'none' | 'kenburns' | 'crt' | 'drift' | 'matrix' | 'rgbpulse';
  show_grain?: boolean;
  card_style?: string;
  item_card_style?: string;
  user_block_style?: string; // New customization property
  /* Added missing fields to fix property doesn't exist errors */
  user_block_position?: string;
  audio_preset?: string;
}

export interface StoryHighlight {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  category?: string;
  is_featured: boolean;
  sort_order: number;
  view_count: number;
  stories?: Story[];
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  item_name: string;
  movement_type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  batch_id?: string;
  from_location_id?: string;
  from_zone_id?: string;
  to_location_id?: string;
  to_zone_id?: string;
  movement_date: string;
  user?: string;
  notes?: string;
  status?: 'completed' | 'pending';
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
  zone_id?: string;
  bin_id?: string;
  image_url?: string;
  condition: string;
  requires_moderation: boolean;
  is_featured?: boolean;
  seller_name?: string;
  seller_rating?: number;
  seller_type?: SellerType;
  seller_metrics?: SellerMetrics;
  description?: string;
  tags?: string[];
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participants: Profile[];
  subject: string;
  last_message: string;
  unread_count: number;
  updated_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  industry?: string;
  is_own_company: boolean;
  website?: string;
  tax_id?: string;
  logo_url?: string;
  contacts?: Contact[];
}

export interface WorkShift {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  day_of_week: string;
}

export interface PayrollRecord {
  id: string;
  user_id: string;
  amount: number;
  bonus: number;
  period: string;
  status: 'paid' | 'pending';
}