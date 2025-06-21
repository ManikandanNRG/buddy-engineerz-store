'use client'

import { supabase } from './supabase'
import { getCurrentUser } from './auth'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  name: string
  created_at: string
  last_login?: string
}

export interface AdminAuthResponse {
  user: AdminUser | null
  error: any
}

// Admin login
export async function adminSignIn(email: string, password: string): Promise<AdminAuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error }
    }

    if (data.user) {
      // Check if user has admin role
      const adminUser = await getAdminProfile(data.user.id)
      if (!adminUser.user) {
        await supabase.auth.signOut()
        return { user: null, error: { message: 'Access denied. Admin privileges required.' } }
      }

      // Update last login
      await updateLastLogin(data.user.id)
      
      return { user: adminUser.user, error: null }
    }

    return { user: null, error: { message: 'Login failed' } }
  } catch (error) {
    return { user: null, error }
  }
}

// Get admin profile
export async function getAdminProfile(userId: string): Promise<AdminAuthResponse> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return { user: null, error }
    }

    return { user: data, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Update last login
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)
  } catch (error) {
    console.error('Failed to update last login:', error)
  }
}

// Admin logout
export async function adminSignOut(): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error }
  }
}

// Get current admin user - now uses the safe getCurrentUser function
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    // Use the safe getCurrentUser function from auth.ts instead of direct supabase call
    const user = await getCurrentUser()
    
    if (!user) return null

    const { user: adminUser } = await getAdminProfile(user.id)
    return adminUser
  } catch (error: any) {
    console.error('Error getting current admin user:', error)
    return null
  }
}

// Check if user has admin access
export async function checkAdminAccess(): Promise<boolean> {
  try {
    const adminUser = await getCurrentAdminUser()
    return adminUser !== null
  } catch (error) {
    return false
  }
}

// Auth state change listener
export function onAdminAuthStateChange(callback: (user: AdminUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { user: adminUser } = await getAdminProfile(session.user.id)
      callback(adminUser)
    } else {
      callback(null)
    }
  })
} 