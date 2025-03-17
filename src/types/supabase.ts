
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          created_at: string
          full_address: string
          id: string
          is_default: boolean
          label: string
          latitude: number | null
          longitude: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          full_address: string
          id?: string
          is_default?: boolean
          label: string
          latitude?: number | null
          longitude?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          full_address?: string
          id?: string
          is_default?: boolean
          label?: string
          latitude?: number | null
          longitude?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_items: {
        Row: {
          calories: number | null
          category: string
          created_at: string
          description: string
          featured: boolean
          id: string
          image: string
          ingredients: string[] | null
          is_available: boolean
          is_vegan: boolean
          is_vegetarian: boolean
          name: string
          price: number
          restaurant_id: string
        }
        Insert: {
          calories?: number | null
          category: string
          created_at?: string
          description: string
          featured?: boolean
          id?: string
          image: string
          ingredients?: string[] | null
          is_available?: boolean
          is_vegan?: boolean
          is_vegetarian?: boolean
          name: string
          price: number
          restaurant_id: string
        }
        Update: {
          calories?: number | null
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image?: string
          ingredients?: string[] | null
          is_available?: boolean
          is_vegan?: boolean
          is_vegetarian?: boolean
          name?: string
          price?: number
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          address_id: string
          created_at: string
          delivered_at: string | null
          delivery_partner_id: string | null
          estimated_delivery_time: string | null
          id: string
          items: Json
          payment_method: string
          payment_status: string
          placed_at: string
          restaurant_id: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          address_id: string
          created_at?: string
          delivered_at?: string | null
          delivery_partner_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          items: Json
          payment_method: string
          payment_status: string
          placed_at: string
          restaurant_id: string
          status: string
          total_amount: number
          user_id: string
        }
        Update: {
          address_id?: string
          created_at?: string
          delivered_at?: string | null
          delivery_partner_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          items?: Json
          payment_method?: string
          payment_status?: string
          placed_at?: string
          restaurant_id?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          profile_image: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          profile_image?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profile_image?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      restaurants: {
        Row: {
          address: string
          closing_hours: string
          created_at: string
          cuisine_type: string[]
          delivery_time: number
          description: string
          featured_image: string
          id: string
          images: string[]
          is_active: boolean
          is_featured: boolean
          latitude: number
          longitude: number
          name: string
          opening_hours: string
          owner_id: string
          price_range: number
          rating: number
        }
        Insert: {
          address: string
          closing_hours: string
          created_at?: string
          cuisine_type: string[]
          delivery_time: number
          description: string
          featured_image: string
          id?: string
          images: string[]
          is_active?: boolean
          is_featured?: boolean
          latitude: number
          longitude: number
          name: string
          opening_hours: string
          owner_id: string
          price_range: number
          rating?: number
        }
        Update: {
          address?: string
          closing_hours?: string
          created_at?: string
          cuisine_type?: string[]
          delivery_time?: number
          description?: string
          featured_image?: string
          id?: string
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          latitude?: number
          longitude?: number
          name?: string
          opening_hours?: string
          owner_id?: string
          price_range?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          images: string[] | null
          order_id: string
          rating: number
          restaurant_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          images?: string[] | null
          order_id: string
          rating: number
          restaurant_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          images?: string[] | null
          order_id?: string
          rating?: number
          restaurant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
