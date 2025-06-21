'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { formatPrice, calculateDiscount } from '@/lib/database'
import Image from 'next/image'
import Link from 'next/link'

export default function WishlistPage() {
  const [isClient, setIsClient] = useState(false)
  const { items, removeItem, clearWishlist, isHydrated } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAddToCart = (product: any) => {
    // Add to cart with default size and color
    const defaultSize = product.sizes[0] || ''
    const defaultColor = product.colors[0] || ''
    addToCart(product, defaultSize, defaultColor, 1)
  }

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId)
  }

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
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">
                Save items you love by clicking the heart icon on any product.
              </p>
              <Link
                href="/products"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
              >
                <Package className="h-5 w-5" />
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => {
              const discount = calculateDiscount(product.original_price || 0, product.price)
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative">
                    <div className="aspect-square relative">
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={product.images[0]?.includes('unsplash.com')}
                      />
                    </div>
                    
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full text-red-500 hover:text-red-600 transition-colors shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    
                    {discount > 0 && (
                      <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{discount}% OFF
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex items-center gap-1 mb-3">
                      {product.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                    
                    {/* Stock status */}
                    <div className="mt-2 text-center">
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-600">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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