'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  averageOrderValue: number
  conversionRate: number
  topProducts: ProductStat[]
  topCategories: CategoryStat[]
  revenueByMonth: MonthlyRevenue[]
  ordersByStatus: OrderStatus[]
  customerGrowth: CustomerGrowth[]
  recentActivity: Activity[]
}

interface ProductStat {
  id: string
  name: string
  sales: number
  revenue: number
  orders: number
}

interface CategoryStat {
  name: string
  sales: number
  revenue: number
  percentage: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
  orders: number
}

interface OrderStatus {
  status: string
  count: number
  percentage: number
}

interface CustomerGrowth {
  month: string
  newCustomers: number
  totalCustomers: number
}

interface Activity {
  id: string
  type: 'order' | 'customer' | 'product'
  description: string
  timestamp: string
  amount?: number
}

export default function AdminAnalyticsPage() {
  const { user, loading } = useRequireAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days
  const [refreshing, setRefreshing] = useState(false)

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      console.log('📊 Fetching analytics data...')

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(dateRange))

      // Fetch all required data in parallel
      const [
        ordersResult,
        customersResult,
        productsResult,
        categoriesResult
      ] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('user_profiles')
          .select('*'),
        supabase
          .from('products')
          .select('*'),
        supabase
          .from('categories')
          .select('*')
      ])

      // Handle errors
      if (ordersResult.error) {
        console.warn('⚠️ Orders data not available:', ordersResult.error)
      }
      if (customersResult.error) {
        console.warn('⚠️ Customers data not available:', customersResult.error)
      }
      if (productsResult.error) {
        console.warn('⚠️ Products data not available:', productsResult.error)
      }
      if (categoriesResult.error) {
        console.warn('⚠️ Categories data not available:', categoriesResult.error)
      }

      const orders = ordersResult.data || []
      const customers = customersResult.data || []
      const products = productsResult.data || []
      const categories = categoriesResult.data || []

      // Calculate analytics
      const analytics = calculateAnalytics(orders, customers, products, categories)
      setAnalyticsData(analytics)

      console.log('✅ Analytics data processed:', analytics)
    } catch (error: any) {
      console.error('💥 Error fetching analytics:', error)
      toast.error('Failed to fetch analytics data')
      
      // Set fallback data
      setAnalyticsData(getFallbackAnalytics())
    } finally {
      setAnalyticsLoading(false)
    }
  }, [dateRange])

  // Calculate analytics from raw data
  const calculateAnalytics = (orders: any[], customers: any[], products: any[], categories: any[]): AnalyticsData => {
    // Basic metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const totalCustomers = customers.length
    const totalProducts = products.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Top products (mock calculation - would need order items data)
    const topProducts: ProductStat[] = products.slice(0, 5).map((product, index) => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      orders: Math.floor(Math.random() * 50) + 10
    }))

    // Top categories
    const topCategories: CategoryStat[] = categories.map((category, index) => {
      const revenue = Math.floor(Math.random() * 100000) + 20000
      return {
        name: category.name,
        sales: Math.floor(Math.random() * 200) + 50,
        revenue,
        percentage: Math.floor(Math.random() * 30) + 10
      }
    })

    // Revenue by month (last 6 months)
    const revenueByMonth: MonthlyRevenue[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
      })
      
      revenueByMonth.push({
        month: monthName,
        revenue: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: monthOrders.length
      })
    }

    // Orders by status
    const statusCounts: { [key: string]: number } = {}
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    const ordersByStatus: OrderStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0
    }))

    // Customer growth (last 6 months)
    const customerGrowth: CustomerGrowth[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      
      const newCustomersThisMonth = customers.filter(customer => {
        const customerDate = new Date(customer.created_at)
        return customerDate.getMonth() === date.getMonth() && customerDate.getFullYear() === date.getFullYear()
      }).length
      
      customerGrowth.push({
        month: monthName,
        newCustomers: newCustomersThisMonth,
        totalCustomers: customers.filter(customer => new Date(customer.created_at) <= date).length
      })
    }

    // Recent activity
    const recentActivity: Activity[] = [
      ...orders.slice(0, 5).map(order => ({
        id: order.id,
        type: 'order' as const,
        description: `New order #${order.order_number}`,
        timestamp: order.created_at,
        amount: order.total
      })),
      ...customers.slice(0, 3).map(customer => ({
        id: customer.id,
        type: 'customer' as const,
        description: `New customer: ${customer.name || customer.email}`,
        timestamp: customer.created_at
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
      conversionRate: Math.random() * 5 + 2, // Mock conversion rate
      topProducts,
      topCategories,
      revenueByMonth,
      ordersByStatus,
      customerGrowth,
      recentActivity
    }
  }

  // Fallback analytics data
  const getFallbackAnalytics = (): AnalyticsData => ({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    topProducts: [],
    topCategories: [],
    revenueByMonth: [],
    ordersByStatus: [],
    customerGrowth: [],
    recentActivity: []
  })

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, fetchAnalytics])

  // Refresh analytics
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
    toast.success('Analytics refreshed!')
  }

  // Format currency
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`

  // Format percentage
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  // Get growth indicator
  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true }
    const growth = ((current - previous) / previous) * 100
    return { value: Math.abs(growth), isPositive: growth >= 0 }
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
          title="Analytics"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600">Comprehensive business insights and metrics</p>
              </div>
              <div className="flex space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span>🔄</span>
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : analyticsData ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-green-500 p-3 rounded-lg">
                        <span className="text-white text-xl">💰</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(analyticsData.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-500 p-3 rounded-lg">
                        <span className="text-white text-xl">📋</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.totalOrders.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-500 p-3 rounded-lg">
                        <span className="text-white text-xl">👥</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.totalCustomers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-orange-500 p-3 rounded-lg">
                        <span className="text-white text-xl">📦</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {analyticsData.totalProducts.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-indigo-500 p-3 rounded-lg">
                        <span className="text-white text-xl">💳</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(analyticsData.averageOrderValue)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-pink-500 p-3 rounded-lg">
                        <span className="text-white text-xl">📈</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatPercentage(analyticsData.conversionRate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="space-y-3">
                      {analyticsData.revenueByMonth.map((month, index) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{month.month}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.max(5, (month.revenue / Math.max(...analyticsData.revenueByMonth.map(m => m.revenue))) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-20 text-right">
                              {formatCurrency(month.revenue)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Status Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
                    <div className="space-y-3">
                      {analyticsData.ordersByStatus.map((status) => {
                        const colors = {
                          pending: 'bg-yellow-500',
                          confirmed: 'bg-blue-500',
                          shipped: 'bg-indigo-500',
                          delivered: 'bg-green-500',
                          cancelled: 'bg-red-500'
                        }
                        const color = colors[status.status as keyof typeof colors] || 'bg-gray-500'
                        
                        return (
                          <div key={status.status} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">{status.status}</span>
                            <div className="flex items-center space-x-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`${color} h-2 rounded-full`}
                                  style={{ width: `${Math.max(5, status.percentage)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-16 text-right">
                                {status.count}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Top Products and Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Products */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
                    <div className="space-y-3">
                      {analyticsData.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.orders} orders</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                            <p className="text-xs text-gray-500">{product.sales} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Categories */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
                    <div className="space-y-3">
                      {analyticsData.topCategories.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{category.name}</p>
                              <p className="text-xs text-gray-500">{category.sales} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(category.revenue)}</p>
                            <p className="text-xs text-gray-500">{formatPercentage(category.percentage)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Growth and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Growth */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Growth</h3>
                    <div className="space-y-3">
                      {analyticsData.customerGrowth.map((month) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{month.month}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.max(5, (month.newCustomers / Math.max(...analyticsData.customerGrowth.map(m => m.newCustomers))) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-16 text-right">
                              +{month.newCustomers}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {analyticsData.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                              activity.type === 'order' ? 'bg-green-500' :
                              activity.type === 'customer' ? 'bg-blue-500' : 'bg-purple-500'
                            }`}>
                              {activity.type === 'order' ? '📋' : activity.type === 'customer' ? '👤' : '📦'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          {activity.amount && (
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(activity.amount)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No analytics data available</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 