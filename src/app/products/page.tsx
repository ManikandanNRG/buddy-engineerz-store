'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, ArrowUpDown, Grid, List, ShoppingCart, Heart, X } from 'lucide-react'
import { getProducts, getCategories, formatPrice, calculateDiscount } from '@/lib/database'
import { useCartStore } from '@/store/cart'
import type { Product, Category } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const { addItem } = useCartStore()

  // Initialize search term from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    const urlGender = searchParams.get('gender')
    
    if (urlSearch) setSearchTerm(urlSearch)
    if (urlCategory) setSelectedCategory(urlCategory)
    if (urlGender) setSelectedGender(urlGender)
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          getProducts(),
          getCategories()
        ])

        if (productsResult.error) {
          setError('Failed to load products. Please try again.')
          console.error('Products error:', productsResult.error)
        } else if (productsResult.products) {
          setProducts(productsResult.products)
          // Set price range based on actual product prices
          const prices = productsResult.products.map(p => p.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setPriceRange([minPrice, maxPrice])
        }

        if (categoriesResult.error) {
          console.error('Categories error:', categoriesResult.error)
        } else if (categoriesResult.categories) {
          setCategories(categoriesResult.categories)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by gender
    if (selectedGender !== 'all') {
      filtered = filtered.filter(product => product.gender === selectedGender)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, selectedGender, priceRange, sortBy])

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0] || 'M'
    const defaultColor = product.colors[0] || 'Default'
    addItem(product, defaultSize, defaultColor, 1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedGender('all')
    const prices = products.map(p => p.price)
    setPriceRange([Math.min(...prices), Math.max(...prices)])
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== 'all' ? selectedCategory : null,
    selectedGender !== 'all' ? selectedGender : null,
  ].filter(Boolean).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Engineering Apparel
          </h1>
          <p className="text-gray-600">
            Discover our collection of developer and engineer-themed clothing
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Filters Row */}
          <div className={`mt-4 pt-4 border-t border-gray-200 ${showFilters || 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={Math.min(...products.map(p => p.price))}
                    max={Math.max(...products.map(p => p.price))}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Results Count & Clear Filters */}
              <div className="flex flex-col justify-end">
                <p className="text-sm text-gray-600 mb-2">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 text-left"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'}`}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={() => handleAddToCart(product)}
                isPriority={index === 0} // First image gets priority for LCP
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  onAddToCart,
  isPriority = false
}: { 
  product: Product
  viewMode: 'grid' | 'list'
  onAddToCart: () => void
  isPriority?: boolean
}) {
  const discount = calculateDiscount(product.original_price || 0, product.price)

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              sizes="128px"
              className="object-cover rounded-lg"
              priority={isPriority}
              unoptimized={product.images[0]?.includes('unsplash.com')}
            />
            {product.featured && (
              <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              
              <button
                onClick={onAddToCart}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <div className="aspect-square relative">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
            priority={isPriority}
            unoptimized={product.images[0]?.includes('unsplash.com')}
          />
        </div>
        
        {product.featured && (
          <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
        
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        
        {!discount && (
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        )}
        
        {discount > 0 && (
          <button className="absolute bottom-3 right-3 text-gray-400 hover:text-red-500 transition-colors bg-white/80 p-1 rounded-full">
            <Heart className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
} 