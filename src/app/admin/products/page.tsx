'use client'

import { useState, useEffect } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  gender: 'men' | 'women' | 'unisex'
  tags: string[]
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export default function AdminProductsPage() {
  const { user, loading } = useRequireAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    images: '',
    category: '',
    sizes: '',
    colors: '',
    stock: '',
    featured: false,
    gender: 'unisex' as 'men' | 'women' | 'unisex',
    tags: ''
  })

  useEffect(() => {
    if (user) {
      fetchProducts()
      fetchCategories()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      console.log('🔍 Fetching products...')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Products fetch error:', error)
        
        // Handle specific error cases
        if (error.code === '42P01') {
          toast.error('Products table does not exist. Please run the database setup script.')
          setProducts([])
          return
        }
        
        throw error
      }
      
      console.log('✅ Products fetched:', data?.length || 0)
      setProducts(data || [])
    } catch (error: any) {
      console.error('💥 Error fetching products:', error)
      
      if (error?.code === '42P01') {
        toast.error('Products table does not exist.')
      } else if (error?.code === 'PGRST116') {
        toast.error('Database connection issue.')
      } else {
        toast.error('Failed to fetch products')
      }
      
      setProducts([]) // Set empty array to prevent UI crashes
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...')
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('❌ Categories fetch error:', error)
        
        // Handle missing categories table gracefully
        if (error.code === '42P01') {
          console.log('ℹ️ Categories table does not exist, using default categories')
          setCategories([
            { id: '1', name: 'T-Shirts', description: 'Engineering T-Shirts', image_url: '', created_at: '' },
            { id: '2', name: 'Hoodies', description: 'Engineering Hoodies', image_url: '', created_at: '' },
            { id: '3', name: 'Accessories', description: 'Engineering Accessories', image_url: '', created_at: '' }
          ])
          return
        }
        
        throw error
      }
      
      console.log('✅ Categories fetched:', data?.length || 0)
      setCategories(data || [])
    } catch (error: any) {
      console.error('💥 Error fetching categories:', error)
      
      // Fallback to default categories
      setCategories([
        { id: '1', name: 'T-Shirts', description: 'Engineering T-Shirts', image_url: '', created_at: '' },
        { id: '2', name: 'Hoodies', description: 'Engineering Hoodies', image_url: '', created_at: '' },
        { id: '3', name: 'Accessories', description: 'Engineering Accessories', image_url: '', created_at: '' }
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('⏳ Already submitting, ignoring duplicate submission')
      return
    }
    
    console.log('🔍 Form submitted with data:', formData)
    
    if (!formData.name || !formData.price || !formData.category) {
      console.error('❌ Missing required fields:', {
        name: formData.name,
        price: formData.price,
        category: formData.category
      })
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('📝 Preparing product data...')
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        images: formData.images && formData.images.trim() ? formData.images.split(',').map(img => img.trim()).filter(img => img) : [],
        category: formData.category,
        sizes: formData.sizes && formData.sizes.trim() ? formData.sizes.split(',').map(size => size.trim()).filter(size => size) : [],
        colors: formData.colors && formData.colors.trim() ? formData.colors.split(',').map(color => color.trim()).filter(color => color) : [],
        stock: parseInt(formData.stock) || 0,
        featured: formData.featured,
        gender: formData.gender,
        tags: formData.tags && formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      }

      console.log('📊 Product data to insert:', productData)

      if (editingProduct) {
        console.log('✏️ Updating existing product:', editingProduct.id)
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) {
          console.error('❌ Update error:', error)
          throw error
        }
        console.log('✅ Product updated successfully!')
        toast.success('Product updated successfully!')
      } else {
        console.log('➕ Creating new product...')
        console.log('🔧 Supabase client check:', !!supabase)
        console.log('🔧 Product data type check:', typeof productData, productData)
        
        try {
          console.log('🚀 Starting Supabase insert...')
          const startTime = Date.now()
          
          const { data: insertedData, error } = await supabase
            .from('products')
            .insert(productData)
            .select()

          const endTime = Date.now()
          console.log(`⏱️ Insert took ${endTime - startTime}ms`)
          console.log('🔍 Raw Supabase response:', { data: insertedData, error })

          if (error) {
            console.error('❌ Insert error:', error)
            console.error('Error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            })
            throw error
          }
          
          if (!insertedData) {
            console.error('❌ No data returned from insert')
            throw new Error('Product was not created - no data returned')
          }
          
          console.log('✅ Product created successfully!', insertedData)
          toast.success('Product created successfully!')
        } catch (insertError) {
          console.error('💥 Caught insert error:', insertError)
          console.error('💥 Error type:', typeof insertError)
          console.error('💥 Error name:', (insertError as any)?.name)
          console.error('💥 Error message:', (insertError as any)?.message)
          throw insertError
        }
      }

      console.log('🔄 Resetting form and refreshing products...')
      resetForm()
      await fetchProducts()
      console.log('✅ Form reset and products refreshed')
    } catch (error) {
      console.error('💥 Error saving product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to save product: ${errorMessage}`)
    } finally {
      console.log('🏁 Setting isSubmitting to false')
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      images: product.images.join(', '),
      category: product.category,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      stock: product.stock.toString(),
      featured: product.featured,
      gender: product.gender,
      tags: product.tags.join(', ')
    })
    setShowAddModal(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      toast.success('Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      images: '',
      category: '',
      sizes: '',
      colors: '',
      stock: '',
      featured: false,
      gender: 'unisex',
      tags: ''
    })
    setEditingProduct(null)
    setShowAddModal(false)
    setIsSubmitting(false)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  const productStats = {
    total: products.length,
    active: products.length,
    lowStock: products.filter(p => p.stock < 10 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          title="Products"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span className="text-white font-bold">+</span>
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Total Products</div>
                <div className="text-2xl font-bold text-gray-900">{productStats.total}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Active Products</div>
                <div className="text-2xl font-bold text-green-600">{productStats.active}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Low Stock</div>
                <div className="text-2xl font-bold text-yellow-600">{productStats.lowStock}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Out of Stock</div>
                <div className="text-2xl font-bold text-red-600">{productStats.outOfStock}</div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Products</h3>
              </div>
              
              {productsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No products found</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    return (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-purple-600">₹{product.price}</span>
                            {product.original_price && product.original_price > product.price && (
                              <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>Stock: {product.stock}</span>
                          <span className="capitalize">{product.category}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (comma-separated URLs)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Black, White, Blue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'men' | 'women' | 'unisex' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="programming, developer, tech"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 