'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface NewsletterSubscriptionProps {
  className?: string
  variant?: 'default' | 'footer' | 'inline'
}

export default function NewsletterSubscription({ 
  className = '', 
  variant = 'default' 
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Email address is required')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, just simulate success
      // In production, integrate with services like Mailchimp, ConvertKit, etc.
      console.log('Newsletter subscription:', email)
      
      setStatus('success')
      setMessage('Thank you for subscribing! Check your email for confirmation.')
      setEmail('')
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
      
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
        <p className="text-gray-300 mb-4 text-sm">
          Get the latest updates on new products, exclusive offers, and engineering insights.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={status === 'loading'}
              />
              {status === 'loading' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          {message && (
            <div className={`flex items-center gap-2 text-sm ${
              status === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Join Our Newsletter</h3>
            <p className="text-purple-100 text-sm">
              Get exclusive deals and engineering content delivered to your inbox.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2 ml-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent min-w-[200px]"
                disabled={status === 'loading'}
              />
              {status === 'loading' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
        
        {message && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${
            status === 'success' ? 'text-green-200' : 'text-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg shadow-sm p-8 text-center ${className}`}>
      <div className="max-w-md mx-auto">
        <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay in the Loop</h3>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest engineering apparel, exclusive discounts, and tech insights.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                status === 'error' ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={status === 'loading'}
            />
            {status === 'loading' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Subscribe to Newsletter
              </>
            )}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message}</span>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
} 