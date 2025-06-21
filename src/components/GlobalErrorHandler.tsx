'use client'

import { useEffect } from 'react'

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Global error handler for AuthSessionMissingError
    const handleError = (event: ErrorEvent) => {
      if (event.error && 
          (event.error.message?.includes('Auth session missing') || 
           event.error.name === 'AuthSessionMissingError')) {
        console.log('ℹ️ Caught AuthSessionMissingError globally - user not authenticated')
        event.preventDefault()
        return false
      }
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && 
          (event.reason.message?.includes('Auth session missing') || 
           event.reason.name === 'AuthSessionMissingError')) {
        console.log('ℹ️ Caught AuthSessionMissingError in promise rejection - user not authenticated')
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return null
} 