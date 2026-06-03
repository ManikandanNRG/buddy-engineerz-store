'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Plus, Minus, Check, ChevronUp } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/database'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import type { Product } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ProductCard } from '@/components/ProductCard'

interface ProductDetailsProps {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '')
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [isClient, setIsClient] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const mainAtcRef = useRef<HTMLDivElement>(null)

  const { addItem, openCart } = useCartStore()
  const { toggleItem, isInWishlist, isHydrated } = useWishlistStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show sticky bar when main ATC scrolls out of view
  useEffect(() => {
    if (!mainAtcRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
    )
    observer.observe(mainAtcRef.current)
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity)
    toast.success(`${product.name} added to cart!`)
    openCart()
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const handleWishlistToggle = () => {
    toggleItem(product)
    toast.success(isInWishlist(product.id) ? 'Added to wishlist' : 'Removed from wishlist')
  }

  const isProductInWishlist = isClient && isHydrated ? isInWishlist(product.id) : false
  const discount = calculateDiscount(product.original_price || 0, product.price)

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-purple-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized={product.images[selectedImage]?.includes('unsplash.com')}
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-purple-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder-product.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                      unoptimized={image?.includes('unsplash.com')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-full transition-colors ${
                      isProductInWishlist 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-6 w-6 ${isProductInWishlist ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
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
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4" ref={mainAtcRef}>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
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
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <span className="ml-2 font-medium capitalize">{product.gender}</span>
                </div>
                <div>
                  <span className="text-gray-600">Available Sizes:</span>
                  <span className="ml-2 font-medium">{product.sizes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Available Colors:</span>
                  <span className="ml-2 font-medium">{product.colors.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-purple-600 text-sm font-bold uppercase tracking-widest mb-2">More to explore</p>
              <h2 className="text-3xl font-black text-gray-900">You might also like</h2>
            </div>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp, i) => (
                <ProductCard key={rp.id} product={rp} viewMode="grid" index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <p className="text-gray-400">No related products found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── STICKY ATC BAR ─────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
            <p className="text-purple-600 font-black">{formatPrice(product.price)}</p>
          </div>
          {/* Compact size selector */}
          {product.sizes.length > 0 && (
            <div className="hidden sm:flex gap-1.5">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    selectedSize === s
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-200 text-gray-600 hover:border-purple-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-purple-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
