'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, onAuthStateChange, getUserProfile, createOrUpdateUserProfile } from '@/lib/auth'
import type { AuthUser, UserProfile } from '@/lib/auth'

export interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const refreshProfile = async () => {
    if (user) {
      try {
        // Check if user is an admin
        const { supabase } = await import('@/lib/supabase')
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle()
        
        setIsAdmin(!!adminUser)

        const { profile: userProfile, error } = await getUserProfile(user.id)
        
        // If no profile exists, create one from user metadata
        if (!userProfile && !error && user.user_metadata) {
          const name = user.user_metadata.name || user.email?.split('@')[0] || 'User'
          const phone = user.user_metadata.phone || undefined
          
          const { profile: newProfile } = await createOrUpdateUserProfile(user.id, { name, phone })
          setProfile(newProfile)
        } else {
          setProfile(userProfile)
        }
      } catch (error: any) {
        // Handle auth session errors gracefully
        if (error?.message?.includes('Auth session missing') || 
            error?.name === 'AuthSessionMissingError') {
          console.log('ℹ️ Session expired during profile refresh')
          setUser(null)
          setProfile(null)
          setIsAdmin(false)
          return
        }
        console.error('Error in refreshProfile:', error)
        // Don't throw the error, just log it
      }
    } else {
      setIsAdmin(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { signOut } = await import('@/lib/auth')
      await signOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      // Always clear state regardless of sign out success/failure
      setUser(null)
      setProfile(null)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    let mounted = true
    
    const initializeAuth = async () => {
      try {
        // Get initial user with enhanced error handling
        const currentUser = await getCurrentUser()
        
        if (mounted) {
          setUser(currentUser)
          if (currentUser) {
            await refreshProfile()
          }
        }
      } catch (error: any) {
        // Handle auth session errors during initialization
        if (error?.message?.includes('Auth session missing') || 
            error?.name === 'AuthSessionMissingError') {
          console.log('ℹ️ No active session during initialization')
          if (mounted) {
            setUser(null)
            setProfile(null)
            setIsAdmin(false)
          }
        } else {
          console.error('Error initializing auth:', error)
        }
      } finally {
        if (mounted) {
          // Minimum loading time to prevent flickering
          setTimeout(() => {
            setLoading(false)
            setInitialLoadComplete(true)
          }, 300)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes with enhanced error handling
    const { data: { subscription } } = onAuthStateChange(async (authUser) => {
      
      if (mounted) {
        setUser(authUser)
        if (authUser) {
          try {
            await refreshProfile()
          } catch (error: any) {
            // Handle auth session errors during profile refresh
            if (error?.message?.includes('Auth session missing') || 
                error?.name === 'AuthSessionMissingError') {
              console.log('ℹ️ Session expired during auth state change')
              setUser(null)
              setProfile(null)
            } else {
              console.error('Error refreshing profile:', error)
            }
          }
        } else {
          setProfile(null)
        }
        
        // Only set loading to false after initial load is complete
        if (initialLoadComplete) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [initialLoadComplete])

  // The dangerous useEffect that caused infinite loops has been removed.
  // Profile refreshing is already handled properly in initializeAuth and onAuthStateChange.

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signOut: handleSignOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login'
    }
  }, [user, loading])

  return { user, loading }
} 