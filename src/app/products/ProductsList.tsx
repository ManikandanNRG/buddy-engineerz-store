'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Grid, List, ShoppingCart, Heart, X, Filter } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/database'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import type { Product, Category } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton'

interface ProductsListProps {
  initialProducts: Product[]
  initialCategories: Category[]
}

export default function ProductsList({ initialProducts, initialCategories }: ProductsListProps) {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const productsPerPage = 12
  const productsTopRef = useRef<HTMLDivElement>(null)

  const { addItem } = useCartStore()

  // Initialize filters from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    const urlGender = searchParams.get('gender')
    const urlSize = searchParams.get('size')
    const urlColor = searchParams.get('color')
    
    if (urlSearch) setSearchTerm(urlSearch)
    if (urlCategory) setSelectedCategory(urlCategory)
    if (urlGender) setSelectedGender(urlGender)
    if (urlSize) setSelectedSize(urlSize)
    if (urlColor) setSelectedColor(urlColor)
  }, [searchParams])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedGender, selectedSize, selectedColor, priceRange, sortBy])

  // Filter and sort products
  let filteredProducts = [...initialProducts]

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === selectedCategory)
  }

  if (selectedGender !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.gender === selectedGender)
  }

  if (selectedSize !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.sizes.includes(selectedSize))
  }

  if (selectedColor !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.colors.includes(selectedColor))
  }

  filteredProducts = filteredProducts.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1]
  )

  filteredProducts.sort((a, b) => {
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

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0] || 'M'
    const defaultColor = product.colors[0] || 'Default'
    addItem(product, defaultSize, defaultColor, 1)
    toast.success(`${product.name} added to cart!`)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedGender('all')
    setSelectedSize('all')
    setSelectedColor('all')
    const prices = initialProducts.map(p => p.price)
    setPriceRange([Math.min(...prices), Math.max(...prices)])
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== 'all' ? selectedCategory : null,
    selectedGender !== 'all' ? selectedGender : null,
    selectedSize !== 'all' ? selectedSize : null,
    selectedColor !== 'all' ? selectedColor : null,
  ].filter(Boolean).length

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to the top of the products section
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8" ref={productsTopRef}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Engineering Apparel
        </h1>
        <p className="text-gray-600">
          Discover our collection of developer and engineer-themed clothing
        </p>
      </div>

      {/* Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 lg:mb-0 lg:sticky lg:top-24 border border-gray-100">
            <div className="flex flex-col gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            <Filter className="h-4 w-4" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Controls */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
          {/* Category Pills */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {['all', ...initialCategories.map(c => c.name.toLowerCase())].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Pills */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</p>
            <div className="flex flex-wrap gap-2">
              {['all', 'unisex', 'men', 'women'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    selectedGender === g
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
                  }`}
                >
                  {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Size Chips */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[44px] h-9 px-3 rounded-lg text-sm font-bold border transition-all duration-200 ${
                    selectedSize === s
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
                  }`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color</p>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setSelectedColor('all')}
                className={`h-8 px-3 rounded-full text-xs font-bold border transition-all ${
                  selectedColor === 'all'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'
                }`}
              >
                All
              </button>
              {Array.from(new Set(initialProducts.flatMap(p => p.colors))).map(color => {
                const colorMap: Record<string, string> = {
                  'Black': '#1a1a1a', 'White': '#f5f5f5', 'Gray': '#9ca3af',
                  'Navy': '#1e3a5f', 'Blue': '#3b82f6', 'Red': '#ef4444',
                  'Green': '#22c55e', 'Yellow': '#eab308', 'Purple': '#a855f7',
                  'Pink': '#ec4899', 'Orange': '#f97316', 'Brown': '#92400e',
                }
                const hex = colorMap[color] || '#888'
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-purple-600 scale-110 shadow-md'
                        : 'border-gray-200 hover:border-purple-400 hover:scale-110'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {color === 'White' && (
                      <span className="absolute inset-0 rounded-full border border-gray-200" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price Range + Clear Filters */}
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Price</span>
                <span className="text-sm font-bold text-gray-900">₹{priceRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-purple-600"
              />
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2.5 rounded-xl transition-all w-full mt-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
        </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar (Results count + Sort/View mode) */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100">
            <p className="text-gray-600 font-medium text-sm">
              Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> of {initialProducts.length} products
              {searchTerm && (
                <span> for "<span className="text-gray-900 font-bold">{searchTerm}</span>"</span>
              )}
            </p>

            <div className="flex items-center gap-3">
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-inner' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-inner' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {[...Array(productsPerPage)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearAllFilters}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {currentProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                index={index}
                isPriority={index < 4}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
        </main>
      </div>
    </div>
  )
}
