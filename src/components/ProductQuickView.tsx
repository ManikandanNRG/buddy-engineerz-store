'use client'

import { useState } from 'react'
import { X, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/database'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface ProductQuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedImage, setSelectedImage] = useState<number>(0)

  const { addItem } = useCartStore()

  if (!isOpen || !product) return null

  const discount = calculateDiscount(product.original_price || 0, product.price)

  const handleAddToCart = () => {
    addItem(product, selectedSize || product.sizes[0], selectedColor || product.colors[0], quantity)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick View</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.images[selectedImage] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized={product.images[selectedImage]?.includes('unsplash.com')}
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Grid */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={image?.includes('unsplash.com')}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          selectedSize === size
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 text-sm border rounded-lg capitalize ${
                          selectedColor === color
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                
                <Link
                  href={`/products/${product.id}`}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  View Full Details
                </Link>
              </div>

              {/* Stock Status */}
              <div className="text-sm">
                {product.stock > 0 ? (
                  <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 