'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  created_at: string
  updated_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  role?: string
  total_orders?: number
  total_spent?: number
}

interface CustomerOrder {
  id: string
  order_number: string
  total: number
  status: string
  created_at: string
}

export default function AdminCustomersPage() {
  const { user, loading } = useRequireAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([])
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Optimized fetch customers with stats
  const fetchCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true)
      console.log('🔍 Fetching customers...')
      
      // Fetch users from auth.users table via user_profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })

      if (profilesError) {
        console.error('❌ Profiles fetch error:', profilesError)
        
        if (profilesError.code === '42P01') {
          toast.error('User profiles table does not exist.')
          setCustomers([])
          return
        }
        
        throw profilesError
      }

      console.log('✅ Profiles fetched:', profilesData?.length || 0)

      // Enhance with order statistics
      const customersWithStats = await Promise.all(
        (profilesData || []).map(async (profile) => {
          try {
            // Get order statistics
            const { data: ordersData } = await supabase
              .from('orders')
              .select('total, status')
              .eq('user_id', profile.id)

            const totalOrders = ordersData?.length || 0
            const totalSpent = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

            return {
              ...profile,
              total_orders: totalOrders,
              total_spent: totalSpent
            }
          } catch (error) {
            console.warn('⚠️ Could not fetch orders for user:', profile.id)
            return {
              ...profile,
              total_orders: 0,
              total_spent: 0
            }
          }
        })
      )

      setCustomers(customersWithStats)
    } catch (error: any) {
      console.error('💥 Error fetching customers:', error)
      
      if (error?.code === '42P01') {
        toast.error('Required tables do not exist.')
      } else {
        toast.error('Failed to fetch customers')
      }
      
      setCustomers([])
    } finally {
      setCustomersLoading(false)
    }
  }, [sortBy, sortOrder])

  // Fetch customer orders
  const fetchCustomerOrders = useCallback(async (customerId: string) => {
    try {
      console.log('🔍 Fetching orders for customer:', customerId)
      
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, total, status, created_at')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Customer orders fetch error:', error)
        setCustomerOrders([])
        return
      }

      console.log('✅ Customer orders fetched:', data?.length || 0)
      setCustomerOrders(data || [])
    } catch (error) {
      console.error('💥 Error fetching customer orders:', error)
      setCustomerOrders([])
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchCustomers()
    }
  }, [user, fetchCustomers])

  // Handle customer details view
  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
    await fetchCustomerOrders(customer.id)
  }

  // Handle customer role update
  const handleUpdateRole = async (customerId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', customerId)

      if (error) throw error
      
      toast.success('Customer role updated successfully!')
      await fetchCustomers()
      
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, role: newRole })
      }
    } catch (error) {
      console.error('Error updating customer role:', error)
      toast.error('Failed to update customer role')
    }
  }

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return

    try {
      // Note: In production, you might want to soft delete or archive instead
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', customerId)

      if (error) throw error
      
      toast.success('Customer deleted successfully!')
      await fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Failed to delete customer')
    }
  }

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && customer.email_confirmed_at) ||
        (statusFilter === 'inactive' && !customer.email_confirmed_at) ||
        (statusFilter === 'admin' && customer.role === 'admin')
      
      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  // Customer statistics
  const customerStats = useMemo(() => {
    const total = customers.length
    const active = customers.filter(c => c.email_confirmed_at).length
    const inactive = total - active
    const admins = customers.filter(c => c.role === 'admin').length
    const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0)

    return { total, active, inactive, admins, totalRevenue }
  }, [customers])

  const getCustomerStatus = (customer: Customer) => {
    if (customer.role === 'admin') return { label: 'Admin', color: 'bg-purple-100 text-purple-800' }
    if (customer.email_confirmed_at) return { label: 'Active', color: 'bg-green-100 text-green-800' }
    return { label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`

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
          title="Customers"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
                <p className="text-gray-600">Manage and view customer information</p>
              </div>
              <button
                onClick={fetchCustomers}
                disabled={customersLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <span>🔄</span>
                <span>{customersLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Total Customers</div>
                <div className="text-2xl font-bold text-gray-900">{customerStats.total}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Active</div>
                <div className="text-2xl font-bold text-green-600">{customerStats.active}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Inactive</div>
                <div className="text-2xl font-bold text-gray-600">{customerStats.inactive}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Admins</div>
                <div className="text-2xl font-bold text-purple-600">{customerStats.admins}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(customerStats.totalRevenue)}</div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Customers</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Customers</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="created_at">Join Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="total_spent">Total Spent</option>
                    <option value="total_orders">Total Orders</option>
                  </select>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('')
                      setSortBy('created_at')
                      setSortOrder('desc')
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Customers ({filteredCustomers.length})</h3>
              </div>
              
              {customersLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading customers...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No customers found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => {
                        const status = getCustomerStatus(customer)
                        return (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.name || 'No Name'}
                                </div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                                {customer.phone && (
                                  <div className="text-sm text-gray-500">{customer.phone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {customer.total_orders || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(customer.total_spent || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(customer.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleViewCustomer(customer)}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                View
                              </button>
                              <select
                                value={customer.role || 'user'}
                                onChange={(e) => handleUpdateRole(customer.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Customer Details - {selectedCustomer.name || selectedCustomer.email}
                </h3>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedCustomer.name || 'Not provided'}</p>
                    <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedCustomer.phone || 'Not provided'}</p>
                    <p><span className="font-medium">Role:</span> {selectedCustomer.role || 'user'}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCustomerStatus(selectedCustomer).color}`}>
                        {getCustomerStatus(selectedCustomer).label}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Account Statistics</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Total Orders:</span> {selectedCustomer.total_orders || 0}</p>
                    <p><span className="font-medium">Total Spent:</span> {formatCurrency(selectedCustomer.total_spent || 0)}</p>
                    <p><span className="font-medium">Join Date:</span> {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                    <p><span className="font-medium">Last Sign In:</span> {selectedCustomer.last_sign_in_at ? new Date(selectedCustomer.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
                    <p><span className="font-medium">Email Confirmed:</span> {selectedCustomer.email_confirmed_at ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Customer Orders */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Order History</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-gray-500">No orders found</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Order #{order.order_number}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-gray-500">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 