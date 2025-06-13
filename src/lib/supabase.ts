import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  gender: 'men' | 'women' | 'unisex'
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_id?: string
  shipping_address: Address
  created_at: string
  updated_at: string
}

export interface Address {
  id?: string
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  pincode: string
  country: string
  is_default?: boolean
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  addresses: Address[]
  created_at: string
} 