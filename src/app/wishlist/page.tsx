'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package, User, Flame, Sparkles } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { formatPrice, calculateDiscount } from '@/lib/database'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ProductCard } from '@/components/ProductCard'

export default function WishlistPage() {
  const [isClient, setIsClient] = useState(false)
  const { items, removeItem, clearWishlist, isHydrated } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  useEffect(() => {
    setIsClient(true)
  }, [])


  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist()
    }
  }

  // Don't render until hydrated to prevent hydration mismatch
  if (!isClient || !isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Products
            </Link>
            <div className="h-6 border-l border-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-8 relative inline-block">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-12 w-12 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center animate-pulse">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is waiting</h2>
            <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg">
              Save the engineering fashion you love most and we'll keep it safe for you right here.
            </p>
            
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 transition-all duration-300 transition-all shadow-lg hover:shadow-blue-200 font-bold mb-16"
            >
              Discover Products
            </Link>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Men's", href: "/products?gender=men", icon: <User className="w-8 h-8 text-blue-500" /> },
                { name: "Women's", href: "/products?gender=women", icon: <User className="w-8 h-8 text-pink-500" /> },
                { name: "Best Sellers", href: "/products?sort=popular", icon: <Flame className="w-8 h-8 text-orange-500" /> },
                { name: "New Arrivals", href: "/products?sort=newest", icon: <Sparkles className="w-8 h-8 text-purple-500" /> }
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-3"
                >
                  <div className="group-hover:scale-110 transition-transform bg-gray-50 p-3 rounded-xl group-hover:bg-purple-50">
                    {cat.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                index={index}
              />
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 