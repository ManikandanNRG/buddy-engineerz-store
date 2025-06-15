'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { formatPrice } from '@/lib/database'
import type { Category } from '@/lib/supabase'

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: string
  selectedGender: string
  priceRange: [number, number]
  maxPrice: number
  minPrice: number
  showInStock: boolean
  showFeatured: boolean
  onCategoryChange: (category: string) => void
  onGenderChange: (gender: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onInStockChange: (inStock: boolean) => void
  onFeaturedChange: (featured: boolean) => void
  onClearFilters: () => void
  activeFiltersCount: number
}

export default function ProductFilters({
  categories,
  selectedCategory,
  selectedGender,
  priceRange,
  maxPrice,
  minPrice,
  showInStock,
  showFeatured,
  onCategoryChange,
  onGenderChange,
  onPriceRangeChange,
  onInStockChange,
  onFeaturedChange,
  onClearFilters,
  activeFiltersCount
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Mobile Filter Header */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={`p-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === 'all'}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={selectedCategory === category.name}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gender
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'men', label: 'Men' },
                { value: 'women', label: 'Women' },
                { value: 'unisex', label: 'Unisex' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={selectedGender === option.value}
                    onChange={(e) => onGenderChange(e.target.value)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="px-3">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(minPrice)}</span>
                <span className="font-medium text-purple-600">{formatPrice(priceRange[1])}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || minPrice, priceRange[1]])}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Filters
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showInStock}
                  onChange={(e) => onInStockChange(e.target.checked)}
                  className="text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFeatured}
                  onChange={(e) => onFeaturedChange(e.target.checked)}
                  className="text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Products</span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onClearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Clear All Filters ({activeFiltersCount})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 