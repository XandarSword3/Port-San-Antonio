import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          order_index: number
          description: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          order_index?: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          order_index?: number
          description?: string | null
          created_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          name: string
          short_desc: string | null
          full_desc: string | null
          price: number
          category_id: string
          currency: string
          image_url: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          short_desc?: string | null
          full_desc?: string | null
          price: number
          category_id: string
          currency?: string
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_desc?: string | null
          full_desc?: string | null
          price?: number
          category_id?: string
          currency?: string
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_email: string
          subtotal: number
          tax: number
          total: number
          status: 'pending' | 'preparing' | 'ready' | 'served'
          payment_status: 'pending' | 'paid' | 'refunded'
          created_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_email: string
          subtotal: number
          tax: number
          total: number
          status?: 'pending' | 'preparing' | 'ready' | 'served'
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_email?: string
          subtotal?: number
          tax?: number
          total?: number
          status?: 'pending' | 'preparing' | 'ready' | 'served'
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          dish_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          dish_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          dish_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}
