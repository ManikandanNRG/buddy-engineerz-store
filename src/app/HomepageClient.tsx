'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { formatPrice, calculateDiscount } from '@/lib/database'
import type { Product } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface HomepageClientProps {
  featuredProducts: Product[]
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, openCart } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [isAdding, setIsAdding] = useState(false)
  const discount = calculateDiscount(product.original_price || 0, product.price)
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addItem(product, product.sizes[0] || 'M', product.colors[0] || 'Default', 1)
    toast.success(`${product.name} added to cart!`)
    setTimeout(() => {
      setIsAdding(false)
      openCart()
    }, 600)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-purple-100 flex flex-col"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized={product.images[0]?.includes('unsplash.com')}
          />
        </Link>

        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-10 uppercase tracking-tight">
            -{discount}%
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-10 uppercase">
            Only {product.stock} left!
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all z-10 ${
            isWishlisted ? 'text-red-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-xs text-gray-400">(4.8) • 124 reviews</span>
        </div>

        <Link href={`/products/${product.id}`} className="mb-1">
          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-1 mb-4">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900">{formatPrice(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isAdding
                ? 'bg-green-500 text-white scale-95'
                : 'bg-blue-600 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 hover:shadow-lg active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HomepageClient({ featuredProducts }: HomepageClientProps) {
  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No featured products found.</p>
        <Link href="/products" className="text-orange-600 font-semibold mt-2 inline-block">
          Browse all products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredProducts.map((product, i) => (
        <FeaturedProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  )
}
