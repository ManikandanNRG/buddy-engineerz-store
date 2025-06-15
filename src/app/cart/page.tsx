'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Truck,
  Shield,
  Heart
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/database'

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice,
    isLoading,
    isHydrated
  } = useCartStore()

  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    setTimeout(() => {
      removeItem(itemId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 300)
  }

  // Filter out any invalid items (items without product data)
  const validItems = items.filter(item => item && item.product && item.product.id)

  const subtotal = getTotalPrice()
  const shipping = subtotal > 999 ? 0 : 99 // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  // Show loading skeleton while cart is hydrating
  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-gray-200 rounded animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (validItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {validItems.map((item) => {
                  // Additional safety checks
                  if (!item || !item.product) {
                    console.warn('Invalid cart item found:', item)
                    return null
                  }

                  const product = item.product
                  const productImages = product.images || []
                  const productImage = productImages[0] || '/placeholder-product.jpg'

                  return (
                    <div
                      key={item.id}
                      className={`p-6 transition-all duration-300 ${
                        removingItems.has(item.id) ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={productImage}
                            alt={product.name || 'Product'}
                            fill
                            sizes="96px"
                            className="object-cover rounded-lg"
                            unoptimized={productImage.includes('unsplash.com')}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                href={`/products/${product.id}`}
                                className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors"
                              >
                                {product.name || 'Unknown Product'}
                              </Link>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {product.description || 'No description available'}
                              </p>
                              
                              {/* Size and Color */}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                {item.size && (
                                  <span>Size: <span className="font-medium">{item.size}</span></span>
                                )}
                                {item.color && (
                                  <span>Color: <span className="font-medium">{item.color}</span></span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  {formatPrice(product.price || 0)}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.original_price)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => {/* TODO: Add to wishlist */}}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Add to wishlist"
                              >
                                <Heart className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Remove from cart"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice((product.price || 0) * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-600">
                                  {formatPrice(product.price || 0)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-6 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {shipping === 0 ? 'FREE Shipping!' : 'Standard Shipping'}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {shipping === 0 
                    ? 'Your order qualifies for free shipping' 
                    : `Add ${formatPrice(1000 - subtotal)} more for FREE shipping`
                  }
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Shield className="h-4 w-4" />
                <span>Secure checkout guaranteed</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center block"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-center">
              Recommended products will be displayed here based on your cart items.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 