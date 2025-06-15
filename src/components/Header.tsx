'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Package } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/hooks/useAuth'

// User Menu Component
function UserMenu() {
  const { user, profile, loading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  // Show loading skeleton while auth is loading
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/auth/login"
          className="text-sm text-gray-700 hover:text-purple-600 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-700 hover:text-purple-600 transition-colors"
      >
        <User className="h-6 w-6" />
        <span className="hidden md:block text-sm">{profile?.name || user.email}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            <Link
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Link>
            <Link
              href="/orders"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-4 w-4 mr-2" />
              My Orders
            </Link>
            <hr className="my-1" />
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items, isLoading, isHydrated } = useCartStore()

  const cartItemsCount = items.reduce((total: number, item: any) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BE</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Buddy Engineerz</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {(isLoading || !isHydrated) ? (
                // Show loading skeleton for cart count
                <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full h-5 w-5 animate-pulse"></div>
              ) : (
                cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )
              )}
            </Link>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              <Link 
                href="/" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  )
} 