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
import { useWishlistStore } from '@/store/wishlist'
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

  const { toggleItem } = useWishlistStore()

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

  const handleAddToWishlist = (product: any) => {
    toggleItem(product)
  }

  // Filter out any invalid items (items without product data)
  const validItems = items.filter(item => item && item.product && item.product.id)

  const subtotal = getTotalPrice()
  const shipping = subtotal > 999 ? 0 : 99 // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  // Show loading state during hydration
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-6 h-fit">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
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
              Continue Shopping
            </Link>
            <div className="h-6 border-l border-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          {validItems.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart()
                }
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart State */}
        {validItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/products"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content */
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
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={productImage}
                              alt={product.name || 'Product'}
                              fill
                              sizes="96px"
                              className="object-cover"
                              unoptimized={productImage.includes('unsplash.com')}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Link 
                                  href={`/products/${product.id}`}
                                  className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors block"
                                >
                                  {product.name}
                                </Link>
                                
                                {/* Size and Color */}
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
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
                                  onClick={() => handleAddToWishlist(product)}
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
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Add {formatPrice(999 - subtotal)} more to get free shipping!
                    </p>
                  </div>
                )}
              </div>

              <Link
                href="/checkout"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium mt-6 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </Link>

              {/* Security badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        )}

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