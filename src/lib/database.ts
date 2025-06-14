import { supabase } from './supabase'
import type { Product } from './supabase'

// Product fetching functions
export async function getProducts(filters?: {
  category?: string
  gender?: string
  featured?: boolean
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest'
  limit?: number
}) {
  try {
    console.log('🔍 Fetching products with filters:', filters)
    
    // Start with a simple query
    let query = supabase
      .from('products')
      .select('*')

    // Apply filters only if they exist and are not 'all'
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.gender && filters.gender !== 'all') {
      query = query.eq('gender', filters.gender)
    }
    
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    console.log('📡 Executing Supabase query...')
    const result = await query

    console.log('📊 Full query result:', {
      data: result.data,
      error: result.error,
      count: result.count,
      status: result.status,
      statusText: result.statusText
    })

    if (result.error) {
      console.error('❌ Supabase error:', result.error)
      console.error('Error properties:', {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code
      })
      return { products: [], error: result.error }
    }

    console.log('✅ Products fetched successfully:', result.data?.length || 0, 'items')
    if (result.data && result.data.length > 0) {
      console.log('Sample product:', result.data[0])
    }
    
    return { products: result.data || [], error: null }
  } catch (catchError) {
    console.error('💥 JavaScript error:', catchError)
    return { products: [], error: catchError }
  }
}

export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return { product: null, error }
    }

    return { product: data, error: null }
  } catch (catchError) {
    console.error('Network/Connection error:', catchError)
    return { product: null, error: catchError }
  }
}

export async function getFeaturedProducts(limit: number = 6) {
  return getProducts({ featured: true, limit })
}

export async function getProductsByCategory(category: string, limit?: number) {
  return getProducts({ category, limit })
}

export async function searchProducts(searchTerm: string, limit?: number) {
  return getProducts({ search: searchTerm, limit })
}

// Category functions
export async function getCategories() {
  try {
    console.log('📂 Fetching categories...')
    
    const result = await supabase
      .from('categories')
      .select('*')
      .order('name')

    console.log('📂 Categories result:', {
      data: result.data,
      error: result.error,
      count: result.count
    })

    if (result.error) {
      console.error('❌ Categories error:', result.error)
      console.error('Error properties:', {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code
      })
      return { categories: [], error: result.error }
    }

    console.log('✅ Categories fetched successfully:', result.data?.length || 0, 'items')
    return { categories: result.data || [], error: null }
  } catch (catchError) {
    console.error('💥 Categories JavaScript error:', catchError)
    return { categories: [], error: catchError }
  }
}

// Helper function to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}

// Helper function to calculate discount percentage
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
} 