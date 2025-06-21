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

// Create base Supabase client
const baseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'buddy-engineerz-store'
    }
  },
  // Add realtime options to prevent connection issues
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to handle auth session errors
const handleAuthSessionError = (error: any, methodName: string) => {
  if (error?.message?.includes('Auth session missing') || 
      error?.name === 'AuthSessionMissingError') {
    console.log(`🛡️ AuthSessionMissingError caught in ${methodName} - returning safe response`)
    return true
  }
  return false
}

// Patch ALL auth methods that might throw AuthSessionMissingError
const originalGetUser = baseClient.auth.getUser.bind(baseClient.auth)
const originalGetSession = baseClient.auth.getSession.bind(baseClient.auth)

baseClient.auth.getUser = async (jwt?: string) => {
  try {
    return await originalGetUser(jwt)
  } catch (error: any) {
    if (handleAuthSessionError(error, 'getUser')) {
      return { data: { user: null }, error: { message: 'No active session' } as any }
    }
    throw error
  }
}

baseClient.auth.getSession = async () => {
  try {
    return await originalGetSession()
  } catch (error: any) {
    if (handleAuthSessionError(error, 'getSession')) {
      return { data: { session: null }, error: { message: 'No active session' } as any }
    }
    throw error
  }
}

// Patch internal methods that are actually causing the errors
const authClient = baseClient.auth as any

// Patch _useSession method
if (authClient._useSession) {
  const original_useSession = authClient._useSession.bind(authClient)
  authClient._useSession = async (...args: any[]) => {
    try {
      return await original_useSession(...args)
    } catch (error: any) {
      if (handleAuthSessionError(error, '_useSession')) {
        return null
      }
      throw error
    }
  }
}

// Patch _getUser method
if (authClient._getUser) {
  const original_getUser = authClient._getUser.bind(authClient)
  authClient._getUser = async (...args: any[]) => {
    try {
      return await original_getUser(...args)
    } catch (error: any) {
      if (handleAuthSessionError(error, '_getUser')) {
        return { data: { user: null }, error: null }
      }
      throw error
    }
  }
}

// Patch any other internal methods that might exist
const methodsToPatch = ['_refreshAccessToken', '_recover', '_recoverAndRefresh', '_callRefreshToken']
methodsToPatch.forEach(methodName => {
  if (authClient[methodName]) {
    const originalMethod = authClient[methodName].bind(authClient)
    authClient[methodName] = async (...args: any[]) => {
      try {
        return await originalMethod(...args)
      } catch (error: any) {
        if (handleAuthSessionError(error, methodName)) {
          return { data: null, error: { message: 'No active session' } }
        }
        throw error
      }
    }
  }
})

// Global error suppression as final fallback
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error
  console.error = (...args: any[]) => {
    const message = args.join(' ')
    if (message.includes('Auth session missing') || message.includes('AuthSessionMissingError')) {
      console.log('🛡️ AuthSessionMissingError suppressed from console')
      return
    }
    originalConsoleError.apply(console, args)
  }
}

export const supabase = baseClient

console.log('✅ Supabase client created with comprehensive AuthSessionMissingError protection')

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