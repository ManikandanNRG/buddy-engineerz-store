'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function PageTransition() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    
    // Simulate page load time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg px-6 py-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <span className="text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  )
} 