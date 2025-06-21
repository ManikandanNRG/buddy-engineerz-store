'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    // Suppress console errors for AuthSessionMissingError
    const originalConsoleError = console.error
    console.error = function(...args: any[]) {
      const errorMessage = args.join(' ')
      if (errorMessage.includes('Auth session missing') || 
          errorMessage.includes('AuthSessionMissingError')) {
        console.log('🛡️ AuthSessionMissingError suppressed - user not authenticated')
        return
      }
      originalConsoleError.apply(console, args)
    }

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      if (event.error && 
          (event.error.message?.includes('Auth session missing') || 
           event.error.name === 'AuthSessionMissingError')) {
        console.log('🛡️ AuthSessionMissingError caught globally')
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    // Promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && 
          (event.reason.message?.includes('Auth session missing') || 
           event.reason.name === 'AuthSessionMissingError')) {
        console.log('🛡️ AuthSessionMissingError promise rejection caught')
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('error', handleError, true)
    window.addEventListener('unhandledrejection', handleRejection, true)

    return () => {
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleRejection, true)
      console.error = originalConsoleError
    }
  }, [])

  return null
} 