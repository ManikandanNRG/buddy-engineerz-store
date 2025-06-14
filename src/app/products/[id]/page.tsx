'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { getProductById, formatPrice, calculateDiscount } from '@/lib/database'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addItem } = useCartStore()

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return
      
      setLoading(true)
      try {
        const { product: fetchedProduct, error } = await getProductById(params.id as string)
        
        if (error) {
          console.error('Error fetching product:', error)
          return
        }
        
        if (fetchedProduct) {
          setProduct(fetchedProduct)
          setSelectedSize(fetchedProduct.sizes[0] || '')
          setSelectedColor(fetchedProduct.colors[0] || '')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      product,
      quantity,
      size: selectedSize,
      color: selectedColor
    })

    // Show success feedback (you could add a toast here)
    alert('Product added to cart!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const discount = calculateDiscount(product.original_price || 0, product.price)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-sm px-3 py-1 rounded">
                  Featured
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
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
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-600">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rating (placeholder) */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8) • 124 reviews</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex items-center gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg ${
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg ${
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Free shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-600">30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-600">2-year warranty included</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900 capitalize">{product.category}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-600">Gender:</span>
                  <span className="text-gray-900 capitalize">{product.gender}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-600">Available Sizes:</span>
                  <span className="text-gray-900">{product.sizes.join(', ')}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-gray-600">Available Colors:</span>
                  <span className="text-gray-900">{product.colors.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}