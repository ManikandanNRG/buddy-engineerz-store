import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug logging with more details
console.log('🔧 Supabase Environment Check:', {
  url: supabaseUrl,
  urlValid: supabaseUrl?.includes('supabase.co'),
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  keyStartsWith: supabaseAnonKey?.substring(0, 20) + '...'
})

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing!')
  throw new Error('Missing Supabase URL')
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!')
  throw new Error('Missing Supabase Anon Key')
}

if (!supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl)
  throw new Error('Invalid Supabase URL format')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('✅ Supabase client created successfully')

// Updated Product interface matching database schema
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  gender: 'men' | 'women' | 'unisex'
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_id?: string
  payment_status: string
  shipping_address: Address
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  name: string
  phone: string
  created_at: string
  updated_at: string
} 