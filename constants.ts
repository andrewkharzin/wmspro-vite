import { Item, Warehouse, InventoryMovement, Alert, Category, Location } from './types';

export const APP_NAME = "NexusAI WMS";

export const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc-001",
    name: "Main Logistics Hub",
    location_code: "HUB01",
    type: "warehouse",
    address: "123 Industrial Parkway",
    city: "Moscow",
    region: "Moscow Oblast",
    country: "Russia",
    postal_code: "101000",
    contact_phone: "+7 (495) 123-45-67",
    contact_email: "logistics@nexusai.ru",
    is_active: true,
    is_default: true,
    is_public: false,
    allow_pickup: true,
    items_count: 1250,
    working_hours: { "mon_fri": "09:00-18:00" }
  },
  {
    id: "loc-002",
    name: "Downtown Retail Store",
    location_code: "RET02",
    type: "retail",
    address: "45 Tverskaya St",
    city: "Moscow",
    country: "Russia",
    postal_code: "125009",
    contact_phone: "+7 (495) 987-65-43",
    contact_email: "shop@nexusai.ru",
    is_active: true,
    is_default: false,
    is_public: true,
    allow_pickup: true,
    items_count: 340
  },
  {
    id: "loc-003",
    name: "Remote Storage Annex",
    location_code: "REM03",
    type: "warehouse",
    address: "88 Storage Ln",
    city: "Saint Petersburg",
    country: "Russia",
    is_active: true,
    is_default: false,
    is_public: false,
    allow_pickup: false,
    items_count: 0
  }
];

// Mock Data derived from schema logic
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics", items_count: 145 },
  { id: 2, name: "Industrial Parts", slug: "industrial-parts", items_count: 890 },
  { id: 3, name: "Office Supplies", slug: "office-supplies", items_count: 320 },
  { id: 4, name: "Raw Materials", slug: "raw-materials", items_count: 55 },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-001",
    name: "Central Logistics Hub",
    code: "CLH01",
    capacity_volume: 50000,
    location_id: "loc-001",
    zones: [
      {
        id: "zn-001",
        name: "High Rack A",
        code: "HRA",
        zone_type: "rack",
        bins: [
          { id: "bn-1", code: "A-01-01", is_occupied: true, current_quantity: 50 },
          { id: "bn-2", code: "A-01-02", is_occupied: true, current_quantity: 120 },
          { id: "bn-3", code: "A-01-03", is_occupied: false, current_quantity: 0 },
        ]
      },
      {
        id: "zn-002",
        name: "Cold Storage",
        code: "CS1",
        zone_type: "cold",
        bins: [
            { id: "bn-4", code: "C-01-01", is_occupied: true, current_quantity: 300 },
        ]
      }
    ]
  },
  {
    id: "wh-002",
    name: "Urban Distribution Center",
    code: "UDC02",
    capacity_volume: 15000,
    location_id: "loc-002",
    zones: []
  }
];

export const MOCK_ITEMS: Item[] = [
  {
    id: "item-101",
    title: "Bosch Professional Drill 18V",
    inventory_number: "TLS001-220011-BE-DE-2023",
    quantity: 45,
    available_quantity: 40,
    reserved_quantity: 5,
    price: 125.00,
    status: 'active',
    category_id: 2,
    location_id: "loc-001",
    condition: "new",
    requires_moderation: false,
    image_url: "https://picsum.photos/400/300?random=1",
    is_featured: true,
    seller_name: "MegaTools Ltd",
    seller_rating: 4.8
  },
  {
    id: "item-102",
    title: "Industrial Bearing 55mm",
    inventory_number: "PRT002-998877-CN-RU-2024",
    quantity: 500,
    available_quantity: 500,
    reserved_quantity: 0,
    price: 45.50,
    status: 'active',
    category_id: 2,
    location_id: "loc-001",
    condition: "new",
    requires_moderation: false,
    image_url: "https://picsum.photos/400/300?random=2",
    is_featured: false,
    seller_name: "Parts Express",
    seller_rating: 4.5
  },
  {
    id: "item-103",
    title: "Dell Latitude 5420 Laptop",
    inventory_number: "ELE003-123123-US-EU-2023",
    quantity: 12,
    available_quantity: 10,
    reserved_quantity: 2,
    price: 650.00,
    status: 'active',
    category_id: 1,
    location_id: "loc-002",
    condition: "used_good",
    requires_moderation: true,
    image_url: "https://picsum.photos/400/300?random=3",
    is_featured: true,
    seller_name: "TechResale Pro",
    seller_rating: 4.9
  },
  {
    id: "item-104",
    title: "Hydraulic Pump Unit",
    inventory_number: "HYD004-555444-DE-RU-2024",
    quantity: 2,
    available_quantity: 2,
    reserved_quantity: 0,
    price: 1500.00,
    status: 'draft',
    category_id: 2,
    location_id: "loc-001",
    condition: "new",
    requires_moderation: true,
    image_url: "https://picsum.photos/400/300?random=4",
    is_featured: false,
    seller_name: "HeavyMachinery Co",
    seller_rating: 4.2
  },
  {
    id: "item-105",
    title: "Generic Copper Wire 50m",
    inventory_number: "RAW005-999000-CN-RU-2024",
    quantity: 100,
    available_quantity: 100,
    reserved_quantity: 0,
    price: 35.00,
    status: 'draft',
    category_id: 4,
    location_id: "loc-001",
    condition: "new",
    requires_moderation: true,
    image_url: "https://picsum.photos/400/300?random=5",
    is_featured: false,
    seller_name: "Raw Materials Inc",
    seller_rating: 3.9
  },
  {
    id: "item-106",
    title: "Unknown Circuit Board",
    inventory_number: "ELE006-000000-UN-UN-2024",
    quantity: 15,
    available_quantity: 15,
    reserved_quantity: 0,
    price: 0.00,
    status: 'draft',
    category_id: 1,
    location_id: "loc-002",
    condition: "used_fair",
    requires_moderation: true,
    image_url: "https://picsum.photos/400/300?random=6",
    is_featured: false,
    seller_name: "Salvage Kings",
    seller_rating: 3.0
  }
];

export const MOCK_MOVEMENTS: InventoryMovement[] = [
  {
    id: "mov-1",
    item_id: "item-101",
    item_name: "Bosch Professional Drill 18V",
    movement_type: "in",
    quantity_before: 0,
    quantity_after: 50,
    movement_date: "2024-05-10T09:00:00Z",
    user: "Alex Manager",
    notes: "Initial stock intake"
  },
  {
    id: "mov-2",
    item_id: "item-102",
    item_name: "Industrial Bearing 55mm",
    movement_type: "out",
    quantity_before: 550,
    quantity_after: 500,
    movement_date: "2024-05-11T14:30:00Z",
    user: "John Staff",
    notes: "Order #9982 fulfillment"
  },
  {
    id: "mov-3",
    item_id: "item-103",
    item_name: "Dell Latitude 5420 Laptop",
    movement_type: "transfer",
    quantity_before: 12,
    quantity_after: 12,
    movement_date: "2024-05-12T10:00:00Z",
    user: "Alex Manager",
    notes: "Transfer to Retail Store"
  },
   {
    id: "mov-4",
    item_id: "item-101",
    item_name: "Bosch Professional Drill 18V",
    movement_type: "adjustment",
    quantity_before: 50,
    quantity_after: 45,
    movement_date: "2024-05-13T16:20:00Z",
    user: "System",
    notes: "Inventory count correction"
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert-1",
    type: "low_stock",
    message: "Hydraulic Pump Unit is below minimum threshold (2)",
    severity: "high",
    date: "2024-05-12T08:00:00Z"
  },
  {
    id: "alert-2",
    type: "moderation",
    message: "4 new items require moderation approval",
    severity: "medium",
    date: "2024-05-12T10:15:00Z"
  }
];