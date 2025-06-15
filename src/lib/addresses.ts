import { supabase } from './supabase'
import type { AuthError } from '@supabase/supabase-js'

export interface Address {
  id: string
  user_id: string
  type: 'home' | 'work' | 'other'
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
  updated_at: string
}

export interface AddressInput {
  type: 'home' | 'work' | 'other'
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

export interface AddressResponse {
  address: Address | null
  error: any
}

export interface AddressesResponse {
  addresses: Address[] | null
  error: any
}

// Get all addresses for a user
export async function getUserAddresses(userId: string): Promise<AddressesResponse> {
  try {
    console.log('📍 Getting addresses for user:', userId)
    
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Get addresses error:', error)
      return { addresses: null, error }
    }

    console.log('✅ Addresses retrieved successfully:', data?.length || 0)
    return { addresses: data, error: null }
  } catch (catchError) {
    console.error('💥 Get addresses catch error:', catchError)
    return { addresses: null, error: catchError }
  }
}

// Get default address for a user
export async function getDefaultAddress(userId: string): Promise<AddressResponse> {
  try {
    console.log('📍 Getting default address for user:', userId)
    
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Get default address error:', error)
      return { address: null, error }
    }

    console.log('✅ Default address retrieved:', !!data)
    return { address: data || null, error: null }
  } catch (catchError) {
    console.error('💥 Get default address catch error:', catchError)
    return { address: null, error: catchError }
  }
}

// Create a new address
export async function createAddress(userId: string, addressData: AddressInput): Promise<AddressResponse> {
  try {
    console.log('📍 Creating address for user:', userId)
    console.log('📍 Address data:', addressData)
    
    // Validate required fields
    if (!userId) {
      const error = new Error('User ID is required')
      console.error('❌ Create address error:', error.message)
      return { address: null, error }
    }

    // If this is set as default, unset other default addresses first
    if (addressData.is_default) {
      console.log('📍 Unsetting other default addresses...')
      const { error: updateError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
      
      if (updateError) {
        console.error('❌ Error unsetting default addresses:', updateError)
      }
    }

    const insertData = {
      user_id: userId,
      ...addressData,
    }
    
    console.log('📍 Inserting address data:', insertData)

    const { data, error } = await supabase
      .from('addresses')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ Create address error:', {
        message: error.message || 'Unknown database error',
        details: error.details || 'No details available',
        hint: error.hint || 'No hint available',
        code: error.code || 'No error code',
        fullError: error
      })
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to save address'
      if (error.message?.includes('relation "addresses" does not exist')) {
        userMessage = 'Database table not found. Please contact support.'
      } else if (error.message?.includes('permission denied')) {
        userMessage = 'Permission denied. Please log in again.'
      } else if (error.message?.includes('violates')) {
        userMessage = 'Invalid address data. Please check all fields.'
      }
      
      return { address: null, error: { ...error, userMessage } }
    }

    console.log('✅ Address created successfully:', data)
    return { address: data, error: null }
  } catch (catchError) {
    console.error('💥 Create address catch error:', {
      message: catchError instanceof Error ? catchError.message : 'Unknown error',
      stack: catchError instanceof Error ? catchError.stack : undefined,
      error: catchError
    })
    return { address: null, error: catchError }
  }
}

// Update an existing address
export async function updateAddress(addressId: string, userId: string, updates: Partial<AddressInput>): Promise<AddressResponse> {
  try {
    console.log('📍 Updating address:', addressId)
    
    // If this is set as default, unset other default addresses first
    if (updates.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .eq('user_id', userId) // Ensure user can only update their own addresses
      .select()
      .single()

    if (error) {
      console.error('❌ Update address error:', error)
      return { address: null, error }
    }

    console.log('✅ Address updated successfully')
    return { address: data, error: null }
  } catch (catchError) {
    console.error('💥 Update address catch error:', catchError)
    return { address: null, error: catchError }
  }
}

// Delete an address
export async function deleteAddress(addressId: string, userId: string): Promise<{ error: any }> {
  try {
    console.log('📍 Deleting address:', addressId)
    
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId) // Ensure user can only delete their own addresses

    if (error) {
      console.error('❌ Delete address error:', error)
      return { error }
    }

    console.log('✅ Address deleted successfully')
    return { error: null }
  } catch (catchError) {
    console.error('💥 Delete address catch error:', catchError)
    return { error: catchError }
  }
}

// Set an address as default
export async function setDefaultAddress(addressId: string, userId: string): Promise<AddressResponse> {
  try {
    console.log('📍 Setting default address:', addressId)
    
    // First, unset all default addresses for the user
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)

    // Then set the specified address as default
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Set default address error:', error)
      return { address: null, error }
    }

    console.log('✅ Default address set successfully')
    return { address: data, error: null }
  } catch (catchError) {
    console.error('💥 Set default address catch error:', catchError)
    return { address: null, error: catchError }
  }
}

// Validation functions
export function validateAddress(address: AddressInput): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!address.type || !address.type.trim()) {
    errors.type = 'Address type is required'
  }

  if (!address.name || !address.name.trim()) {
    errors.name = 'Full name is required'
  }

  if (!address.phone || !address.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(address.phone.trim())) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (!address.address_line_1 || !address.address_line_1.trim()) {
    errors.address_line_1 = 'Address line 1 is required'
  }

  if (!address.city || !address.city.trim()) {
    errors.city = 'City is required'
  }

  if (!address.state || !address.state.trim()) {
    errors.state = 'State is required'
  }

  if (!address.pincode || !address.pincode.trim()) {
    errors.pincode = 'Pincode is required'
  } else if (!/^\d{6}$/.test(address.pincode.trim())) {
    errors.pincode = 'Please enter a valid 6-digit pincode'
  }

  if (!address.country || !address.country.trim()) {
    errors.country = 'Country is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Format address for display
export function formatAddress(address: Address): string {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.state,
    address.pincode,
    address.country
  ].filter(Boolean)

  return parts.join(', ')
}

// Get address type display name
export function getAddressTypeDisplay(type: Address['type']): string {
  switch (type) {
    case 'home':
      return 'Home'
    case 'work':
      return 'Work'
    case 'other':
      return 'Other'
    default:
      return 'Address'
  }
} 