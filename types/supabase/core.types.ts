//types/supabase/core.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  core: {
    Tables: {
      batches: {
        Row: {
          batch_number: string
          current_quantity: number
          expiry_date: string | null
          id: string
          initial_quantity: number
          item_id: string | null
          location_id: string | null
          production_date: string | null
          status: Database["core"]["Enums"]["batch_status"] | null
        }
        Insert: {
          batch_number: string
          current_quantity: number
          expiry_date?: string | null
          id?: string
          initial_quantity: number
          item_id?: string | null
          location_id?: string | null
          production_date?: string | null
          status?: Database["core"]["Enums"]["batch_status"] | null
        }
        Update: {
          batch_number?: string
          current_quantity?: number
          expiry_date?: string | null
          id?: string
          initial_quantity?: number
          item_id?: string | null
          location_id?: string | null
          production_date?: string | null
          status?: Database["core"]["Enums"]["batch_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color_code: string | null
          custom_icon_url: string | null
          description: string | null
          icon_name: string | null
          id: number
          items_count: number | null
          name: string
          parent_id: number | null
          slug: string
        }
        Insert: {
          color_code?: string | null
          custom_icon_url?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          items_count?: number | null
          name: string
          parent_id?: number | null
          slug: string
        }
        Update: {
          color_code?: string | null
          custom_icon_url?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          items_count?: number | null
          name?: string
          parent_id?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          sender_id: string | null
          status: Database["core"]["Enums"]["message_status"] | null
          text: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
          status?: Database["core"]["Enums"]["message_status"] | null
          text: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
          status?: Database["core"]["Enums"]["message_status"] | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          email: string
          id: string
          industry: string | null
          is_own_company: boolean | null
          logo_url: string | null
          name: string
          phone: string
          tax_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string | null
          email: string
          id?: string
          industry?: string | null
          is_own_company?: boolean | null
          logo_url?: string | null
          name: string
          phone: string
          tax_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          id?: string
          industry?: string | null
          is_own_company?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string
          tax_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company_id: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          position: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          position?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          profile_id: string
          unread_count: number | null
        }
        Insert: {
          conversation_id: string
          profile_id: string
          unread_count?: number | null
        }
        Update: {
          conversation_id?: string
          profile_id?: string
          unread_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          last_message: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          last_message?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          last_message?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          batch_id: string | null
          from_location_id: string | null
          from_zone_id: string | null
          id: string
          item_id: string | null
          movement_date: string | null
          movement_type: Database["core"]["Enums"]["movement_type"]
          notes: string | null
          quantity: number
          status: Database["core"]["Enums"]["movement_status"] | null
          to_location_id: string | null
          to_zone_id: string | null
          user_id: string | null
        }
        Insert: {
          batch_id?: string | null
          from_location_id?: string | null
          from_zone_id?: string | null
          id?: string
          item_id?: string | null
          movement_date?: string | null
          movement_type: Database["core"]["Enums"]["movement_type"]
          notes?: string | null
          quantity: number
          status?: Database["core"]["Enums"]["movement_status"] | null
          to_location_id?: string | null
          to_zone_id?: string | null
          user_id?: string | null
        }
        Update: {
          batch_id?: string | null
          from_location_id?: string | null
          from_zone_id?: string | null
          id?: string
          item_id?: string | null
          movement_date?: string | null
          movement_type?: Database["core"]["Enums"]["movement_type"]
          notes?: string | null
          quantity?: number
          status?: Database["core"]["Enums"]["movement_status"] | null
          to_location_id?: string | null
          to_zone_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_from_zone_id_fkey"
            columns: ["from_zone_id"]
            isOneToOne: false
            referencedRelation: "storage_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_to_zone_id_fkey"
            columns: ["to_zone_id"]
            isOneToOne: false
            referencedRelation: "storage_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          available_quantity: number | null
          bin_id: string | null
          category_id: number | null
          condition: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          inventory_number: string
          is_featured: boolean | null
          location_id: string | null
          price: number
          quantity: number | null
          requires_moderation: boolean | null
          reserved_quantity: number | null
          seller_id: string | null
          seller_metrics: Json | null
          seller_name: string | null
          seller_rating: number | null
          seller_type: Database["core"]["Enums"]["seller_type"] | null
          status: Database["core"]["Enums"]["item_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          zone_id: string | null
        }
        Insert: {
          available_quantity?: number | null
          bin_id?: string | null
          category_id?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_number: string
          is_featured?: boolean | null
          location_id?: string | null
          price: number
          quantity?: number | null
          requires_moderation?: boolean | null
          reserved_quantity?: number | null
          seller_id?: string | null
          seller_metrics?: Json | null
          seller_name?: string | null
          seller_rating?: number | null
          seller_type?: Database["core"]["Enums"]["seller_type"] | null
          status?: Database["core"]["Enums"]["item_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          zone_id?: string | null
        }
        Update: {
          available_quantity?: number | null
          bin_id?: string | null
          category_id?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_number?: string
          is_featured?: boolean | null
          location_id?: string | null
          price?: number
          quantity?: number | null
          requires_moderation?: boolean | null
          reserved_quantity?: number | null
          seller_id?: string | null
          seller_metrics?: Json | null
          seller_name?: string | null
          seller_rating?: number | null
          seller_type?: Database["core"]["Enums"]["seller_type"] | null
          status?: Database["core"]["Enums"]["item_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "storage_bins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "storage_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          allow_pickup: boolean | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          country: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          is_public: boolean | null
          items_count: number | null
          latitude: number | null
          location_code: string
          longitude: number | null
          name: string
          postal_code: string | null
          region: string | null
          type: Database["core"]["Enums"]["location_type"] | null
          user_id: string | null
          working_hours: Json | null
        }
        Insert: {
          address: string
          allow_pickup?: boolean | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_public?: boolean | null
          items_count?: number | null
          latitude?: number | null
          location_code: string
          longitude?: number | null
          name: string
          postal_code?: string | null
          region?: string | null
          type?: Database["core"]["Enums"]["location_type"] | null
          user_id?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: string
          allow_pickup?: boolean | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_public?: boolean | null
          items_count?: number | null
          latitude?: number | null
          location_code?: string
          longitude?: number | null
          name?: string
          postal_code?: string | null
          region?: string | null
          type?: Database["core"]["Enums"]["location_type"] | null
          user_id?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          amount: number
          bonus: number | null
          created_at: string | null
          id: string
          period: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bonus?: number | null
          created_at?: string | null
          id?: string
          period: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bonus?: number | null
          created_at?: string | null
          id?: string
          period?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string
          hourly_rate: number | null
          id: string
          last_active: string | null
          role: Database["core"]["Enums"]["user_role"] | null
          status: Database["core"]["Enums"]["user_status"] | null
          subscription_tier:
            | Database["core"]["Enums"]["subscription_tier"]
            | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          hourly_rate?: number | null
          id: string
          last_active?: string | null
          role?: Database["core"]["Enums"]["user_role"] | null
          status?: Database["core"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["core"]["Enums"]["subscription_tier"]
            | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          last_active?: string | null
          role?: Database["core"]["Enums"]["user_role"] | null
          status?: Database["core"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["core"]["Enums"]["subscription_tier"]
            | null
          username?: string
        }
        Relationships: []
      }
      storage_bins: {
        Row: {
          code: string
          current_quantity: number | null
          id: string
          is_occupied: boolean | null
          max_volume: number | null
          zone_id: string | null
        }
        Insert: {
          code: string
          current_quantity?: number | null
          id?: string
          is_occupied?: boolean | null
          max_volume?: number | null
          zone_id?: string | null
        }
        Update: {
          code?: string
          current_quantity?: number | null
          id?: string
          is_occupied?: boolean | null
          max_volume?: number | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_bins_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "storage_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_zones: {
        Row: {
          code: string
          id: string
          name: string
          warehouse_id: string | null
          zone_type: Database["core"]["Enums"]["zone_type"] | null
        }
        Insert: {
          code: string
          id?: string
          name: string
          warehouse_id?: string | null
          zone_type?: Database["core"]["Enums"]["zone_type"] | null
        }
        Update: {
          code?: string
          id?: string
          name?: string
          warehouse_id?: string | null
          zone_type?: Database["core"]["Enums"]["zone_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_zones_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          allow_replies: boolean | null
          allow_sharing: boolean | null
          audio_preset: string | null
          background_color: string | null
          bg_effect: string | null
          call_to_action_text: string | null
          call_to_action_type: string | null
          call_to_action_url: string | null
          card_style: string | null
          content_text: string | null
          content_type: Database["core"]["Enums"]["story_content_type"]
          created_at: string | null
          duration_seconds: number | null
          expires_at: string | null
          has_sound: boolean | null
          id: string
          linked_category_id: number | null
          linked_item_id: string | null
          media_urls: string[]
          moderation_notes: string | null
          moderation_status: Database["core"]["Enums"]["mod_status"] | null
          poll_vote_count: number | null
          reply_count: number | null
          requires_moderation: boolean | null
          share_count: number | null
          show_grain: boolean | null
          show_view_count: boolean | null
          status: Database["core"]["Enums"]["story_status"] | null
          swipe_up_count: number | null
          text_color: string | null
          thumbnail_url: string | null
          title: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          allow_replies?: boolean | null
          allow_sharing?: boolean | null
          audio_preset?: string | null
          background_color?: string | null
          bg_effect?: string | null
          call_to_action_text?: string | null
          call_to_action_type?: string | null
          call_to_action_url?: string | null
          card_style?: string | null
          content_text?: string | null
          content_type: Database["core"]["Enums"]["story_content_type"]
          created_at?: string | null
          duration_seconds?: number | null
          expires_at?: string | null
          has_sound?: boolean | null
          id?: string
          linked_category_id?: number | null
          linked_item_id?: string | null
          media_urls: string[]
          moderation_notes?: string | null
          moderation_status?: Database["core"]["Enums"]["mod_status"] | null
          poll_vote_count?: number | null
          reply_count?: number | null
          requires_moderation?: boolean | null
          share_count?: number | null
          show_grain?: boolean | null
          show_view_count?: boolean | null
          status?: Database["core"]["Enums"]["story_status"] | null
          swipe_up_count?: number | null
          text_color?: string | null
          thumbnail_url?: string | null
          title?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          allow_replies?: boolean | null
          allow_sharing?: boolean | null
          audio_preset?: string | null
          background_color?: string | null
          bg_effect?: string | null
          call_to_action_text?: string | null
          call_to_action_type?: string | null
          call_to_action_url?: string | null
          card_style?: string | null
          content_text?: string | null
          content_type?: Database["core"]["Enums"]["story_content_type"]
          created_at?: string | null
          duration_seconds?: number | null
          expires_at?: string | null
          has_sound?: boolean | null
          id?: string
          linked_category_id?: number | null
          linked_item_id?: string | null
          media_urls?: string[]
          moderation_notes?: string | null
          moderation_status?: Database["core"]["Enums"]["mod_status"] | null
          poll_vote_count?: number | null
          reply_count?: number | null
          requires_moderation?: boolean | null
          share_count?: number | null
          show_grain?: boolean | null
          show_view_count?: boolean | null
          status?: Database["core"]["Enums"]["story_status"] | null
          swipe_up_count?: number | null
          text_color?: string | null
          thumbnail_url?: string | null
          title?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_linked_category_id_fkey"
            columns: ["linked_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_linked_item_id_fkey"
            columns: ["linked_item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          capacity_volume: number | null
          code: string
          id: string
          location_id: string | null
          name: string
        }
        Insert: {
          capacity_volume?: number | null
          code: string
          id?: string
          location_id?: string | null
          name: string
        }
        Update: {
          capacity_volume?: number | null
          code?: string
          id?: string
          location_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      work_shifts: {
        Row: {
          day_of_week: string | null
          end_time: string
          id: string
          start_time: string
          user_id: string | null
        }
        Insert: {
          day_of_week?: string | null
          end_time: string
          id?: string
          start_time: string
          user_id?: string | null
        }
        Update: {
          day_of_week?: string | null
          end_time?: string
          id?: string
          start_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_shifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      batch_status: "active" | "quarantine" | "expired"
      item_status: "draft" | "active" | "sold" | "archived"
      location_type: "home" | "warehouse" | "retail" | "other"
      message_status: "sent" | "delivered" | "read"
      mod_status: "pending" | "approved" | "rejected" | "auto_approved"
      movement_status: "completed" | "pending"
      movement_type: "in" | "out" | "transfer" | "adjustment"
      seller_type: "individual" | "enterprise"
      story_content_type:
        | "image"
        | "video"
        | "carousel"
        | "text"
        | "poll"
        | "question"
        | "countdown"
        | "product"
      story_status: "draft" | "active" | "archived" | "hidden" | "reported"
      subscription_tier: "free" | "pro" | "enterprise"
      user_role: "admin" | "manager" | "staff" | "seller" | "buyer"
      user_status: "active" | "suspended" | "pending"
      zone_type: "bulk" | "rack" | "shelf" | "bin" | "cold" | "hazardous"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  core: {
    Enums: {
      batch_status: ["active", "quarantine", "expired"],
      item_status: ["draft", "active", "sold", "archived"],
      location_type: ["home", "warehouse", "retail", "other"],
      message_status: ["sent", "delivered", "read"],
      mod_status: ["pending", "approved", "rejected", "auto_approved"],
      movement_status: ["completed", "pending"],
      movement_type: ["in", "out", "transfer", "adjustment"],
      seller_type: ["individual", "enterprise"],
      story_content_type: [
        "image",
        "video",
        "carousel",
        "text",
        "poll",
        "question",
        "countdown",
        "product",
      ],
      story_status: ["draft", "active", "archived", "hidden", "reported"],
      subscription_tier: ["free", "pro", "enterprise"],
      user_role: ["admin", "manager", "staff", "seller", "buyer"],
      user_status: ["active", "suspended", "pending"],
      zone_type: ["bulk", "rack", "shelf", "bin", "cold", "hazardous"],
    },
  },
} as const
