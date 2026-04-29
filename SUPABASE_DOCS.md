# Supabase Schema Implementation Guide

This guide outlines the detailed table structures, relationships, and Row Level Security (RLS) policies needed to implement the backend for the NexusAI WMS Pro (Warehouse Management System & Marketplace) using Supabase.

## 1. Supabase Initialization in React

First, you'll need to install the Supabase client:
```bash
npm install @supabase/supabase-js
```

Then, initialize the client in a dedicated file (e.g., `lib/supabase.ts`):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 2. Table Definitions & Schemas

The following sections translate the application's TypeScript interfaces into Postgres tables. You should execute these SQL queries in the Supabase SQL Editor.

### 2.1 Core Identity & Organizations

#### `profiles`
Extends the native Supabase `auth.users` table with application-specific user data.

```sql
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'seller', 'buyer');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'staff',
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  email TEXT UNIQUE,
  last_active TIMESTAMPTZ DEFAULT now(),
  status user_status DEFAULT 'pending',
  hourly_rate NUMERIC(10, 2),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `companies`
Stores B2B/Enterprise company profiles for sellers or internal organization logic.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  industry TEXT,
  is_own_company BOOLEAN DEFAULT false,
  website TEXT,
  tax_id TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `contacts`
External entity contacts linked to a company.

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 Geography, Warehouses & Logistics

#### `locations`
Represents physical locations (Warehouses, offices, user homes).

```sql
CREATE TYPE location_type AS ENUM ('home', 'warehouse', 'retail', 'other');

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Owner of location
  name TEXT NOT NULL,
  description TEXT,
  location_code TEXT UNIQUE NOT NULL,
  type location_type DEFAULT 'warehouse',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  postal_code TEXT,
  country TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  contact_phone TEXT,
  contact_email TEXT,
  working_hours JSONB,
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  allow_pickup BOOLEAN DEFAULT false,
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `warehouses`
Extends `locations` with warehouse capacity details.

```sql
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  capacity_volume NUMERIC,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE
);
```

#### `storage_zones`
Divides warehouses into logical zones.

```sql
CREATE TYPE zone_type AS ENUM ('bulk', 'rack', 'shelf', 'bin', 'cold', 'hazardous');

CREATE TABLE storage_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  zone_type zone_type DEFAULT 'bulk'
);
```

#### `storage_bins`
The most granular storage unit.

```sql
CREATE TABLE storage_bins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES storage_zones(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  is_occupied BOOLEAN DEFAULT false,
  current_quantity INTEGER DEFAULT 0,
  max_volume NUMERIC
);
```

### 2.3 Product Catalog & Inventory Lifecycle

#### `categories`

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  items_count INTEGER DEFAULT 0,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  icon_name TEXT,
  custom_icon_url TEXT,
  color_code TEXT
);
```

#### `items`
Represents generic items/products on the marketplace and inside warehouses.

```sql
CREATE TYPE item_status AS ENUM ('draft', 'active', 'sold', 'archived');
CREATE TYPE seller_type AS ENUM ('individual', 'enterprise');

CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  inventory_number TEXT UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  available_quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  price NUMERIC(10, 2) NOT NULL,
  status item_status DEFAULT 'draft',
  category_id INTEGER REFERENCES categories(id),
  location_id UUID REFERENCES locations(id),
  zone_id UUID REFERENCES storage_zones(id),
  bin_id UUID REFERENCES storage_bins(id),
  image_url TEXT,
  condition TEXT,
  requires_moderation BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  seller_id UUID REFERENCES profiles(id),
  seller_name TEXT,
  seller_rating NUMERIC(3, 2),
  seller_type seller_type,
  seller_metrics JSONB, -- For generic object storing reliability, speed, etc.
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `batches`
For tracking specific lots of products, with expirations.

```sql
CREATE TYPE batch_status AS ENUM ('active', 'quarantine', 'expired');

CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT UNIQUE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  initial_quantity INTEGER NOT NULL,
  current_quantity INTEGER NOT NULL,
  production_date DATE,
  expiry_date DATE,
  status batch_status DEFAULT 'active',
  location_id UUID REFERENCES locations(id)
);
```

#### `inventory_movements`
The event-sourced ledger for all inventory changes.

```sql
CREATE TYPE movement_type AS ENUM ('in', 'out', 'transfer', 'adjustment');
CREATE TYPE movement_status AS ENUM ('completed', 'pending');

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES items(id),
  movement_type movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  batch_id UUID REFERENCES batches(id),
  from_location_id UUID REFERENCES locations(id),
  from_zone_id UUID REFERENCES storage_zones(id),
  to_location_id UUID REFERENCES locations(id),
  to_zone_id UUID REFERENCES storage_zones(id),
  movement_date TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES profiles(id),
  notes TEXT,
  status movement_status DEFAULT 'completed'
);
```

### 2.4 Marketplace Social (Stories & Moderation)

#### `stories`

```sql
CREATE TYPE story_content_type AS ENUM ('image', 'video', 'carousel', 'text', 'poll', 'question', 'countdown', 'product');
CREATE TYPE story_status AS ENUM ('draft', 'active', 'archived', 'hidden', 'reported');
CREATE TYPE mod_status AS ENUM ('pending', 'approved', 'rejected', 'auto_approved');

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content_type story_content_type NOT NULL,
  media_urls TEXT[] NOT NULL,
  thumbnail_url TEXT,
  content_text TEXT,
  background_color TEXT,
  text_color TEXT,
  duration_seconds INTEGER DEFAULT 5,
  has_sound BOOLEAN DEFAULT false,
  
  -- Metrics
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  swipe_up_count INTEGER DEFAULT 0,
  poll_vote_count INTEGER DEFAULT 0,
  
  -- Config
  allow_replies BOOLEAN DEFAULT true,
  allow_sharing BOOLEAN DEFAULT true,
  show_view_count BOOLEAN DEFAULT true,
  
  linked_item_id UUID REFERENCES items(id),
  linked_category_id INTEGER REFERENCES categories(id),
  call_to_action_type TEXT,
  call_to_action_text TEXT,
  call_to_action_url TEXT,
  
  -- UI Styling State
  bg_effect TEXT DEFAULT 'none',
  show_grain BOOLEAN DEFAULT false,
  card_style TEXT,
  audio_preset TEXT,
  
  status story_status DEFAULT 'active',
  requires_moderation BOOLEAN DEFAULT true,
  moderation_status mod_status DEFAULT 'pending',
  moderation_notes TEXT,
  
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.5 Messenger / Chat

#### `conversations` & `conversation_participants`
Because conversations have multiple users.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT,
  last_message TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  PRIMARY KEY (conversation_id, profile_id)
);
```

#### `chat_messages`

```sql
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  text TEXT NOT NULL,
  status message_status DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.6 Payroll & Shifts (Personnel Management)

```sql
CREATE TABLE work_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  day_of_week TEXT
);

CREATE TABLE payroll_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  bonus NUMERIC(10,2) DEFAULT 0,
  period TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Recommended RLS Policies

Do not forget to enable RLS on every table using `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.

### Example Policies

**Profiles**
```sql
-- Allow users to read all public profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

**Items (Marketplace & Inventory)**
```sql
-- Items can be read by everyone if active, draft only by owners or admins
CREATE POLICY "Items query" ON items FOR SELECT 
USING (
  status = 'active'
  OR seller_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role='admin' OR role='manager'))
);

-- Only owners/admins can insert or update
CREATE POLICY "Items insert" ON items FOR INSERT
WITH CHECK (seller_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role='admin'));
```

**Messages**
```sql
-- Security barrier: Users can only select messages if they are participating in the conversation
CREATE POLICY "Select Participant Messages" ON chat_messages FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = chat_messages.conversation_id 
    AND profile_id = auth.uid()
  )
);
```

## 4. Next Steps
1. Run these DDL statements in your Supabase project's SQL Editor.
2. Initialize auth triggers to automatically insert `auth.users` into `profiles` on sign-up:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', 'staff');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```
3. Generate TypeScript typings using the Supabase CLI (`supabase gen types typescript --project-id ...`) and integrate them natively with your existing frontend types in `lib/types.ts`.
