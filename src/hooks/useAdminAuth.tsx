'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentAdminUser, onAdminAuthStateChange, adminSignOut } from '@/lib/admin-auth'
import type { AdminUser } from '@/lib/admin-auth'

interface AdminAuthContextType {
  user: AdminUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

interface AdminAuthProviderProps {
  children: ReactNode
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentAdminUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing admin user:', error)
      setUser(null)
    }
  }

  const handleSignOut = async () => {
    await adminSignOut()
    setUser(null)
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentAdminUser()
        if (mounted) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          // Minimum loading time to prevent flickering
          setTimeout(() => {
            setLoading(false)
          }, 300)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = onAdminAuthStateChange((adminUser) => {
      if (mounted) {
        setUser(adminUser)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    loading,
    signOut: handleSignOut,
    refreshUser,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

// Hook for protected admin routes
export function useRequireAdminAuth() {
  const { user, loading } = useAdminAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/admin/login'
    }
  }, [user, loading])

  return { user, loading }
} 