'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  Tag, 
  Clock,
  Flame,
  Percent,
  ArrowRight
} from 'lucide-react'
import { getProducts, formatPrice } from '@/lib/database'
import { useCartStore } from '@/store/cart'

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  images: string[]
  category: string
  gender: string
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  sale: boolean
  created_at: string
}

export default function SalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('discount')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterGender, setFilterGender] = useState('all')
  const { addItem } = useCartStore()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const allProducts = await getProducts()
      // Filter only sale products and add mock discounts
      const saleProducts = allProducts
        .filter(product => product.sale || Math.random() > 0.7) // Mock sale filter
        .map(product => ({
          ...product,
          original_price: product.original_price || Math.round(product.price * 1.3), // Mock original price
          sale: true
        }))
      setProducts(saleProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDiscountPercentage = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const getSavings = (price: number, originalPrice: number) => {
    return originalPrice - price
  }

  const filteredAndSortedProducts = products
    .filter(product => {
      if (filterCategory !== 'all' && product.category !== filterCategory) return false
      if (filterGender !== 'all' && product.gender !== filterGender) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          const discountA = a.original_price ? getDiscountPercentage(a.price, a.original_price) : 0
          const discountB = b.original_price ? getDiscountPercentage(b.price, b.original_price) : 0
          return discountB - discountA
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const handleAddToCart = (product: Product) => {
    // Use default size and color if available, or empty strings
    const defaultSize = product.sizes?.[0] || ''
    const defaultColor = product.colors?.[0] || ''
    addItem(product, defaultSize, defaultColor, 1)
  }

  const totalSavings = filteredAndSortedProducts.reduce((total, product) => {
    if (product.original_price) {
      return total + getSavings(product.price, product.original_price)
    }
    return total
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sale items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-8 w-8 text-yellow-300" />
              <Tag className="h-16 w-16" />
              <Flame className="h-8 w-8 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">MEGA SALE</h1>
            <p className="text-xl md:text-2xl text-pink-100 mb-6">
              Up to 50% off on engineering apparel & accessories
            </p>
            <div className="flex items-center justify-center gap-8 text-pink-200">
              <div className="text-center">
                <div className="text-3xl font-bold">{filteredAndSortedProducts.length}</div>
                <div className="text-sm">Items on Sale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{formatPrice(totalSavings)}</div>
                <div className="text-sm">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm">Max Discount</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="bg-yellow-400 text-black py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-center">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Limited Time Offer - Sale ends in 3 days!</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="accessories">Accessories</option>
                  <option value="stickers">Stickers</option>
                </select>
              </div>

              {/* Gender Filter */}
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="discount">Highest Discount</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredAndSortedProducts.length} items
              </span>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No sale items found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new deals.
            </p>
            <Link
              href="/products"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredAndSortedProducts.map((product) => {
              const discountPercentage = product.original_price 
                ? getDiscountPercentage(product.price, product.original_price)
                : 0
              const savings = product.original_price 
                ? getSavings(product.price, product.original_price)
                : 0

              if (viewMode === 'list') {
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        sizes="128px"
                        className="object-cover rounded-lg"
                        unoptimized={product.images[0]?.includes('unsplash.com')}
                      />
                      {discountPercentage > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/products/${product.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.original_price && (
                                <span className="text-lg text-gray-500 line-through">
                                  {formatPrice(product.original_price)}
                                </span>
                              )}
                            </div>
                            {savings > 0 && (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                Save {formatPrice(savings)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={product.images[0]?.includes('unsplash.com')}
                    />
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {discountPercentage}% OFF
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>
                  
                  <div className="p-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>
                      
                      {savings > 0 && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mb-3">
                          You save {formatPrice(savings)}
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Sale CTA */}
        <section className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-purple-100 mb-6">
            These deals won't last forever. Grab your favorite engineering apparel at unbeatable prices.
          </p>
          <Link
            href="/products"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium inline-flex items-center gap-2"
          >
            Shop All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
} 