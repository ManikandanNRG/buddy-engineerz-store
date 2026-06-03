'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Package, 
  ChevronDown,
  ShoppingBag,
  Shirt,
  Layers,
  Briefcase,
  Flame
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/hooks/useAuth'
import CartDrawer from '@/components/CartDrawer'

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
              href="/account/orders"
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
  const [productsDropdown, setProductsDropdown] = useState(false)
  const { items, isLoading, isHydrated, openCart } = useCartStore()

  const cartItemsCount = items.reduce((total: number, item: any) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <>
    <header className="bg-white shadow-sm sticky top-0 z-50" style={{ fontFamily: "'Inter', sans-serif" }}>
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
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Home
            </Link>

            {/* Products with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdown(true)}
              onMouseLeave={() => setProductsDropdown(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition-colors font-medium py-6">
                Products
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${productsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  productsDropdown ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="p-2">
                  {[
                    { label: 'All Products', href: '/products', icon: <ShoppingBag className="w-4 h-4 text-purple-500" /> },
                    { label: 'T-Shirts', href: '/products?category=tshirts', icon: <Shirt className="w-4 h-4 text-purple-500" /> },
                    { label: 'Hoodies', href: '/products?category=hoodies', icon: <Layers className="w-4 h-4 text-purple-500" /> },
                    { label: 'Accessories', href: '/products?category=accessories', icon: <Briefcase className="w-4 h-4 text-purple-500" /> },
                    { label: 'Sale Items', href: '/sale', icon: <Flame className="w-4 h-4 text-orange-500" /> },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setProductsDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <div className="bg-purple-50 p-1.5 rounded-md group-hover:bg-purple-100 transition-colors">
                        {item.icon}
                      </div>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/blog" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Wishlist
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
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
            {/* Cart — opens drawer */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {(isLoading || !isHydrated) ? (
                <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full h-5 w-5 animate-pulse"></div>
              ) : (
                cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )
              )}
            </button>

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
                href="/blog" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
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
              <hr className="my-2 border-gray-100" />
              <Link 
                href="/wishlist" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link 
                href="/account" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <Link 
                href="/account/orders" 
                className="block text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
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
    <CartDrawer />
    </>
  )
} 