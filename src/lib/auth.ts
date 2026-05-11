import { supabase } from './supabase'
import type { User, AuthError } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata: {
    name?: string
    phone?: string
  } & Record<string, any>
}

export interface UserProfile {
  id: string
  name: string
  phone: string
  created_at: string
  updated_at: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser | null
  error: AuthError | null
}

export interface ProfileResponse {
  profile: UserProfile | null
  error: any
}

// Authentication functions
export async function signUp({ email, password, name, phone }: SignUpData): Promise<AuthResponse> {
  try {
    console.log('🔐 Signing up user:', { email, name, phone })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        }
      }
    })

    if (error) {
      console.error('❌ Sign up error:', error)
      return { user: null, error }
    }

    // Try to create user profile - this may fail if email confirmation is required
    // (no active session yet), which is fine - profile will be created on first sign-in
    if (data.user) {
      try {
        await createUserProfile(data.user.id, { name, phone })
      } catch {
        // Non-critical: profile will be created/upserted after email confirmation
        console.log('ℹ️ Profile creation deferred until after email confirmation')
      }
    }

    console.log('✅ User signed up successfully:', data.user?.email)
    return { user: data.user as AuthUser, error: null }
  } catch (catchError) {
    console.error('💥 Sign up catch error:', catchError)
    return { user: null, error: catchError as AuthError }
  }
}

export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  try {
    console.log('🔐 Signing in user:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Sign in error:', error)
      return { user: null, error }
    }

    console.log('✅ User signed in successfully:', data.user?.email)
    return { user: data.user as AuthUser, error: null }
  } catch (catchError) {
    console.error('💥 Sign in catch error:', catchError)
    return { user: null, error: catchError as AuthError }
  }
}

export async function signInWithGoogle(): Promise<{ error: AuthError | null }> {
  try {
    console.log('🔐 Signing in with Google')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      console.error('❌ Google sign in error:', error)
      return { error }
    }

    return { error: null }
  } catch (catchError) {
    console.error('💥 Google sign in catch error:', catchError)
    return { error: catchError as AuthError }
  }
}

export async function signInWithFacebook(): Promise<{ error: AuthError | null }> {
  try {
    console.log('🔐 Signing in with Facebook')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      console.error('❌ Facebook sign in error:', error)
      return { error }
    }

    return { error: null }
  } catch (catchError) {
    console.error('💥 Facebook sign in catch error:', catchError)
    return { error: catchError as AuthError }
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    console.log('🔐 Signing out user')
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('❌ Sign out error:', error)
      return { error }
    }

    console.log('✅ User signed out successfully')
    return { error: null }
  } catch (catchError) {
    console.error('💥 Sign out catch error:', catchError)
    return { error: catchError as AuthError }
  }
}

// Safe wrapper for getting user that handles session errors
async function safeGetUser() {
  try {
    return await supabase.auth.getUser()
  } catch (error: any) {
    if (error?.message?.includes('Auth session missing') || 
        error?.name === 'AuthSessionMissingError') {
      console.log('ℹ️ No active session found')
      return { data: { user: null }, error: null }
    }
    throw error
  }
}

// Safe wrapper for getting session that handles session errors
export async function safeGetSession() {
  try {
    return await supabase.auth.getSession()
  } catch (error: any) {
    if (error?.message?.includes('Auth session missing') || 
        error?.name === 'AuthSessionMissingError') {
      console.log('ℹ️ No active session found')
      return { data: { session: null }, error: null }
    }
    throw error
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await safeGetUser()
    
    if (error) {
      console.error('❌ Get current user error:', error)
      return null
    }

    return user as AuthUser
  } catch (catchError: any) {
    console.error('💥 Get current user catch error:', catchError)
    return null
  }
}

export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    console.log('🔐 Resetting password for:', email)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error('❌ Reset password error:', error)
      return { error }
    }

    console.log('✅ Password reset email sent successfully')
    return { error: null }
  } catch (catchError) {
    console.error('💥 Reset password catch error:', catchError)
    return { error: catchError as AuthError }
  }
}

export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  try {
    console.log('🔐 Updating password')
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('❌ Update password error:', error)
      return { error }
    }

    console.log('✅ Password updated successfully')
    return { error: null }
  } catch (catchError) {
    console.error('💥 Update password catch error:', catchError)
    return { error: catchError as AuthError }
  }
}

// User Profile functions
export async function createUserProfile(userId: string, profileData: { name: string, phone?: string }): Promise<ProfileResponse> {
  try {
    console.log('👤 Creating user profile:', { userId, profileData })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        name: profileData.name,
        phone: profileData.phone || null,
      })
      .select()
      .single()

    if (error) {
      console.log('ℹ️ Create profile skipped (likely no active session yet):', error?.message || error)
      return { profile: null, error }
    }

    console.log('✅ User profile created successfully')
    return { profile: data, error: null }
  } catch (catchError) {
    console.error('💥 Create profile catch error:', catchError)
    return { profile: null, error: catchError }
  }
}

export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  try {
    console.log('👤 Fetching user profile:', userId)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() // Use maybeSingle instead of single to handle no rows

    if (error) {
      console.error('❌ Get profile error:', error)
      return { profile: null, error }
    }

    // If no profile exists, return null without error
    if (!data) {
      console.log('👤 No profile found for user:', userId)
      return { profile: null, error: null }
    }

    console.log('✅ User profile fetched successfully')
    return { profile: data, error: null }
  } catch (catchError) {
    console.error('💥 Get profile catch error:', catchError)
    return { profile: null, error: catchError }
  }
}

export async function updateUserProfile(userId: string, updates: Partial<{ name: string, phone: string }>): Promise<ProfileResponse> {
  try {
    console.log('👤 Updating user profile:', { userId, updates })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Update profile error:', error)
      return { profile: null, error }
    }

    console.log('✅ User profile updated successfully')
    return { profile: data, error: null }
  } catch (catchError) {
    console.error('💥 Update profile catch error:', catchError)
    return { profile: null, error: catchError }
  }
}

// Create or update user profile (upsert)
export async function createOrUpdateUserProfile(userId: string, profileData: { name: string, phone?: string }): Promise<ProfileResponse> {
  try {
    console.log('👤 Creating or updating user profile:', { userId, profileData })
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        name: profileData.name,
        phone: profileData.phone || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Create/update profile error:', error)
      return { profile: null, error }
    }

    console.log('✅ User profile created/updated successfully')
    return { profile: data, error: null }
  } catch (catchError) {
    console.error('💥 Create/update profile catch error:', catchError)
    return { profile: null, error: catchError }
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state changed:', event, session?.user?.email)
    callback(session?.user as AuthUser || null)
  })
}

// Utility functions
export function getErrorMessage(error: AuthError | any): string {
  if (!error) return 'An unknown error occurred'
  
  // Handle Supabase Auth errors
  if (error.message) {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.'
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link before signing in.'
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.'
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address.'
      case 'Signup is disabled':
        return 'New registrations are currently disabled. Please contact support.'
      default:
        return error.message
    }
  }
  
  return 'An unexpected error occurred. Please try again.'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
} 