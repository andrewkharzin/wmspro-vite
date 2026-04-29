
import { Item, Warehouse, InventoryMovement, Alert, Category, Location, Profile, Story, StoryHighlight, Batch, Company, ChatMessage, Conversation, WorkShift, PayrollRecord } from './types';

export const APP_NAME = "NexusAI WMS";

export const MOCK_PROFILES: Profile[] = [
  { id: "u-001", username: "alex_admin", full_name: "Alex Manager", role: "admin", avatar_url: "https://picsum.photos/id/64/100/100", subscription_tier: "enterprise", hourly_rate: 45, department: "Operations", status: 'active', email: 'alex@nexus.ai' },
  { id: "u-seller-1", username: "megatools", full_name: "Dmitry Tools", role: "seller", avatar_url: "https://picsum.photos/id/102/100/100" }
];

export const MOCK_STORIES: Story[] = [
  {
    id: "s-1",
    user_id: "u-001",
    user_full_name: "Alex Manager",
    user_avatar: "https://picsum.photos/id/64/100/100",
    title: "Morning Hub Calibration",
    content_type: "image",
    media_urls: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800"],
    content_text: "Finalizing the staging area for the Q4 intake protocol.",
    background_color: "#0f172a",
    text_color: "#ffffff",
    duration_seconds: 5,
    has_sound: false,
    allow_replies: true,
    allow_sharing: true,
    show_view_count: true,
    view_count: 1240,
    reply_count: 12,
    share_count: 5,
    swipe_up_count: 8,
    poll_vote_count: 0,
    status: 'active',
    requires_moderation: false,
    moderation_status: 'approved',
    is_highlight: false,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    tags: ["Operations", "Calibration"],
    mentions: [],
    hashtags: ["nexus", "logistics"],
    created_at: new Date().toISOString()
  },
  {
    id: "s-2",
    user_id: "u-seller-1",
    user_full_name: "Dmitry Tools",
    user_avatar: "https://picsum.photos/id/102/100/100",
    title: "Flash Deal: S7 Controllers",
    content_type: "product",
    media_urls: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800"],
    content_text: "Limited 15 units left of Siemens S7-1500. Special grid pricing for the next 24h.",
    linked_item_id: "item-node-0",
    call_to_action_type: 'shop_now',
    call_to_action_text: 'Procure Now',
    duration_seconds: 7,
    has_sound: false,
    allow_replies: true,
    allow_sharing: true,
    show_view_count: true,
    view_count: 3500,
    reply_count: 45,
    share_count: 22,
    swipe_up_count: 110,
    poll_vote_count: 0,
    status: 'active',
    requires_moderation: false,
    moderation_status: 'approved',
    is_highlight: false,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    tags: ["Electronics", "Sale"],
    mentions: [],
    hashtags: ["siemens", "automation"],
    created_at: new Date().toISOString()
  }
];

export const MOCK_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: "h-1",
    user_id: "u-001",
    title: "Facility Upgrades",
    description: "Chronicles of our hub expansion project.",
    cover_image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400",
    is_featured: true,
    sort_order: 1,
    view_count: 15400
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics", items_count: 145 },
  { id: 2, name: "Industrial", slug: "industrial", items_count: 380 }
];

export const MOCK_ITEMS: Item[] = Array.from({ length: 20 }, (_, i) => ({
    id: `item-node-${i}`,
    title: i % 2 === 0 ? "Siemens S7-1500 Controller" : "Parker Hydraulic Pump",
    inventory_number: `SKU-${i+5000}`,
    quantity: 100,
    available_quantity: 80,
    reserved_quantity: 20,
    price: 15000 + (i * 1000),
    status: 'active',
    category_id: i % 2 === 0 ? 1 : 2,
    condition: 'new',
    requires_moderation: false,
    location_id: "loc-001",
    image_url: `https://picsum.photos/seed/item-${i}/800/800`,
    seller_name: "MegaTools Ltd",
    seller_rating: 4.8,
    seller_type: 'enterprise'
}));

export const MOCK_LOCATIONS: Location[] = [
    { id: "loc-001", name: "Main Hub", location_code: "HUB01", type: "warehouse", address: "123 Parkway", city: "Moscow", country: "Russia", is_active: true, is_default: true, is_public: false, allow_pickup: true, items_count: 500 }
];

export const MOCK_WAREHOUSES: Warehouse[] = [
    { id: "wh-001", name: "Central Warehouse", code: "CWH", capacity_volume: 50000, location_id: "loc-001", zones: [
      { id: "zn-1", name: "Sector A", code: "SEA", zone_type: "rack", bins: [{ id: "bn-1", code: "A-01", current_quantity: 10, is_occupied: true, max_volume: 50 }] }
    ] }
];

export const MOCK_MOVEMENTS: InventoryMovement[] = [];
export const MOCK_ALERTS: Alert[] = [];

// Added MOCK_BATCHES
export const MOCK_BATCHES: Batch[] = [
  {
    id: "bat-1",
    batch_number: "LOT-2024-001",
    item_id: "item-node-0",
    item_name: "Siemens S7-1500 Controller",
    initial_quantity: 100,
    current_quantity: 80,
    production_date: "2024-01-10",
    expiry_date: "2025-01-10",
    status: 'active',
    location_id: "loc-001"
  }
];

// Added MOCK_COMPANIES
export const MOCK_COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "Nexus Global Ops",
    address: "123 Industrial Way",
    city: "Moscow",
    country: "Russia",
    email: "ops@nexus.ai",
    phone: "+7 495 123 4567",
    industry: "Logistics",
    is_own_company: true,
    website: "nexus.ai",
    tax_id: "RU123456789",
    contacts: [
      { id: "c-1", first_name: "Alex", last_name: "Manager", email: "alex@nexus.ai", phone: "+7 495 123 4567", position: "Director" }
    ]
  }
];

// Added MOCK_MESSAGES
export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    conversation_id: "conv-1",
    sender_id: "u-seller-1",
    sender_name: "Dmitry Tools",
    text: "Hello, I am interested in the Siemens controllers.",
    timestamp: new Date().toISOString(),
    status: 'read'
  }
];

// Added MOCK_CONVERSATIONS
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participants: [MOCK_PROFILES[0], MOCK_PROFILES[1]],
    subject: "Siemens S7 Controllers Inquiry",
    last_message: "Hello, I am interested in the Siemens controllers.",
    unread_count: 1,
    updated_at: new Date().toISOString()
  },
  {
    id: "conv-2",
    participants: [MOCK_PROFILES[0], MOCK_PROFILES[1]],
    subject: "Technical Support",
    last_message: "We need help with the sorting system.",
    unread_count: 0,
    updated_at: new Date().toISOString()
  }
];

// Added MOCK_SHIFTS
export const MOCK_SHIFTS: WorkShift[] = [
  { id: "s-1", user_id: "u-001", start_time: "09:00", end_time: "18:00", day_of_week: "Thu" }
];

// Added MOCK_PAYROLL
export const MOCK_PAYROLL: PayrollRecord[] = [
  { id: "p-1", user_id: "u-001", amount: 5000, bonus: 500, period: "October 2024", status: 'paid' }
];
