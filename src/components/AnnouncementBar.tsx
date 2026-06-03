'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  '🚚 Free shipping on all orders over ₹999 — Shop Now',
  '🎉 Use code ENGINEER10 for 10% off your first order',
  '↩️ Easy 30-day returns on all products',
  '⚡ New collection just dropped — Limited stock available!',
]

const STORAGE_KEY = 'be-announcement-dismissed'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)
  const [currentMsg, setCurrentMsg] = useState(0)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [visible])

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="relative z-50 text-white text-sm font-medium overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #5b21b6 0%, #7c3aed 40%, #3b82f6 80%, #5b21b6 100%)',
        backgroundSize: '200% 100%',
        animation: 'gradient-shift 6s ease infinite',
      }}
    >
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-in-msg {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .announcement-msg {
          animation: slide-in-msg 0.4s ease forwards;
        }
      `}</style>

      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        {/* Left spacer */}
        <div className="w-6" />

        {/* Rotating message */}
        <p
          key={currentMsg}
          className="announcement-msg text-center flex-1 tracking-wide"
        >
          {MESSAGES[currentMsg]}
        </p>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
