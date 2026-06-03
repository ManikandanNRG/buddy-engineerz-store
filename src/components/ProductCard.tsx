'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Eye, Check, Star } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/database'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import type { Product } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  index?: number
  isPriority?: boolean
}

export function ProductCard({ 
  product, 
  viewMode, 
  index = 0,
  isPriority = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist, isHydrated } = useWishlistStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isWishlisted = isClient && isHydrated && isInWishlist(product.id)
  const discount = calculateDiscount(product.original_price || 0, product.price)
  const isNew = new Date().getTime() - new Date(product.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size first')
      return
    }

    setIsAdding(true)
    const defaultColor = product.colors[0] || 'Default'
    addItem(product, selectedSize || product.sizes[0] || 'M', defaultColor, 1)
    toast.success('Added to cart!')
    
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
    toast.success(isInWishlist(product.id) ? 'Added to wishlist' : 'Removed from wishlist')
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : null

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-up border border-gray-100 group"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative overflow-hidden bg-gray-50">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-500 ${isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
                  onError={handleImageError}
                  priority={isPriority}
                />
                {secondaryImage && (
                  <Image
                    src={secondaryImage}
                    alt={`${product.name} alternate view`}
                    fill
                    className={`object-cover transition-opacity duration-500 absolute inset-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  />
                )}
              </div>
            </Link>
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm z-10">
                {discount}% OFF
              </div>
            )}
          </div>
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-full transition-all duration-300 hover:bg-red-50 ${
                    isWishlisted ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{product.description}</p>
              
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[40px] h-9 px-2 rounded-md text-sm font-medium border transition-all ${
                          selectedSize === size 
                            ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                            : 'border-gray-200 text-gray-700 hover:border-purple-600 hover:text-purple-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isAdding 
                    ? 'bg-green-500 text-white scale-95' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg active:scale-95'
                }`}
              >
                {isAdding ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {isAdding ? 'Added' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-up border border-transparent hover:border-purple-100 group flex flex-col h-full"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'}`}
            onError={handleImageError}
            priority={isPriority}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className={`object-cover transition-all duration-700 absolute inset-0 group-hover:scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </Link>
        
        {/* Overlays */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg z-10 uppercase tracking-tighter">
            {discount}% OFF
          </div>
        )}
        {!discount && isNew && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg z-10 uppercase">
            New
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg z-10 uppercase">
            Only {product.stock} left!
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 z-10 group/wishlist ${
            isWishlisted ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''} group-active/wishlist:scale-150 transition-transform`} />
        </button>

        {/* Quick Add Sizes Overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 border-t border-gray-100`}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Add Size</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Auto-add on size click for quick add
                  const defaultColor = product.colors[0] || 'Default'
                  addItem(product, size, defaultColor, 1);
                  toast.success(`Size ${size} added to cart!`);
                }}
                className="h-8 min-w-[32px] px-2 rounded-md border border-gray-200 text-xs font-medium hover:border-purple-600 hover:text-purple-600 hover:bg-white transition-all bg-white/50"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quick View Button */}
        <Link 
          href={`/products/${product.id}`}
          className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-5 w-5 text-gray-900" />
          </div>
        </Link>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-auto">
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.tags.slice(0, 1).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          {/* Star rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">(4.8)</span>
          </div>
          <p className="text-gray-500 text-xs line-clamp-1 mb-3">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-purple-600 hover:text-white transition-all duration-300 active:scale-90"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
