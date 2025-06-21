'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Category {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export default function AdminCategoriesPage() {
  const { user, loading } = useRequireAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  })

  // Optimized fetch with error handling
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true)
      console.log('🔍 Fetching categories...')
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('❌ Categories fetch error:', error)
        
        if (error.code === '42P01') {
          toast.error('Categories table does not exist. Creating default categories...')
          await createCategoriesTable()
          return
        }
        
        throw error
      }
      
      console.log('✅ Categories fetched:', data?.length || 0)
      setCategories(data || [])
    } catch (error: any) {
      console.error('💥 Error fetching categories:', error)
      
      if (error?.code === '42P01') {
        toast.error('Categories table does not exist.')
      } else {
        toast.error('Failed to fetch categories')
      }
      
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  // Create categories table if it doesn't exist
  const createCategoriesTable = async () => {
    try {
      console.log('🔧 Creating categories table...')
      
      // Create table using RPC or direct SQL
      const { error } = await supabase.rpc('create_categories_table')
      
      if (error) {
        console.log('ℹ️ RPC failed, using fallback categories')
        // Fallback to default categories
        const defaultCategories = [
          { id: '1', name: 'T-Shirts', description: 'Engineering T-Shirts', image_url: '', created_at: new Date().toISOString() },
          { id: '2', name: 'Hoodies', description: 'Engineering Hoodies', image_url: '', created_at: new Date().toISOString() },
          { id: '3', name: 'Accessories', description: 'Engineering Accessories', image_url: '', created_at: new Date().toISOString() },
          { id: '4', name: 'Stickers', description: 'Engineering Stickers', image_url: '', created_at: new Date().toISOString() }
        ]
        setCategories(defaultCategories)
        toast.success('Using default categories')
        return
      }
      
      // Fetch after creating
      await fetchCategories()
    } catch (error) {
      console.error('Error creating categories table:', error)
      toast.error('Failed to create categories table')
    }
  }

  useEffect(() => {
    if (user) {
      fetchCategories()
    }
  }, [user, fetchCategories])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setIsSubmitting(true)

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image_url: formData.image_url.trim()
      }

      if (editingCategory) {
        console.log('✏️ Updating category:', editingCategory.id)
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)

        if (error) throw error
        toast.success('Category updated successfully!')
      } else {
        console.log('➕ Creating new category...')
        const { error } = await supabase
          .from('categories')
          .insert(categoryData)

        if (error) throw error
        toast.success('Category created successfully!')
      }

      resetForm()
      await fetchCategories()
    } catch (error: any) {
      console.error('Error saving category:', error)
      
      if (error?.code === '42P01') {
        toast.error('Categories table does not exist. Please run database setup.')
      } else {
        toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url
    })
    setShowAddModal(true)
  }

  // Handle delete
  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      toast.success('Category deleted successfully!')
      await fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: ''
    })
    setEditingCategory(null)
    setShowAddModal(false)
  }

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [categories, searchTerm])

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
          title="Categories"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                <p className="text-gray-600">Manage product categories</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={fetchCategories}
                  disabled={categoriesLoading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span>🔄</span>
                  <span>{categoriesLoading ? 'Loading...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span>➕</span>
                  <span>Add Category</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Total Categories</div>
                <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Active Categories</div>
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">With Images</div>
                <div className="text-2xl font-bold text-blue-600">{categories.filter(c => c.image_url).length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Without Images</div>
                <div className="text-2xl font-bold text-orange-600">{categories.filter(c => !c.image_url).length}</div>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Categories ({filteredCategories.length})</h3>
              </div>
              
              {categoriesLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading categories...</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No categories found</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create First Category
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{category.description || 'No description'}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-400">
                        Created: {new Date(category.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., T-Shirts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Category description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 