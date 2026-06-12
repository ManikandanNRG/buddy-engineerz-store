'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  averageOrderValue: number
  conversionRate: number
  topProducts: ProductStat[]
  revenueByMonth: MonthlyRevenue[]
  ordersByStatus: OrderStatus[]
  customerGrowth: CustomerGrowth[]
}

interface ProductStat {
  id: string
  name: string
  sales: number
  revenue: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
  orders: number
}

interface OrderStatus {
  name: string // changed to name for recharts pie
  value: number // changed to value for recharts pie
}

interface CustomerGrowth {
  month: string
  newCustomers: number
}

const PIE_COLORS = {
  'pending': '#eab308', // yellow
  'confirmed': '#3b82f6', // blue
  'shipped': '#6366f1', // indigo
  'delivered': '#22c55e', // green
  'cancelled': '#ef4444', // red
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
        productsResult
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
          .select('id, name') // We just need total count, but fetching all for accurate count
      ])

      const orders = ordersResult.data || []
      const customers = customersResult.data || []
      const products = productsResult.data || []

      // Calculate analytics
      const analytics = calculateAnalytics(orders, customers, products)
      setAnalyticsData(analytics)

      console.log('✅ Analytics data processed')
    } catch (error: any) {
      console.error('💥 Error fetching analytics:', error)
      toast.error('Failed to fetch analytics data')
    } finally {
      setAnalyticsLoading(false)
    }
  }, [dateRange])

  // Calculate analytics from raw data
  const calculateAnalytics = (orders: any[], customers: any[], products: any[]): AnalyticsData => {
    // Basic metrics
    const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled')
    const totalRevenue = nonCancelledOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const totalCustomers = customers.length
    const totalProducts = products.length
    const averageOrderValue = nonCancelledOrders.length > 0 ? totalRevenue / nonCancelledOrders.length : 0

    // Top selling products calculated directly from JSON items in orders
    const productSalesMap: Record<string, { name: string, sales: number, revenue: number }> = {}
    
    orders.forEach(order => {
      if (order.status === 'cancelled') return
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
      items.forEach((item: any) => {
        const prodId = item.product?.id || item.id || 'unknown'
        const prodName = item.product?.name || item.name || 'Unknown Product'
        const qty = item.quantity || 1
        const price = item.price || item.product?.price || 0
        
        if (!productSalesMap[prodId]) {
          productSalesMap[prodId] = { name: prodName, sales: 0, revenue: 0 }
        }
        productSalesMap[prodId].sales += qty
        productSalesMap[prodId].revenue += (qty * price)
      })
    })

    const topProducts = Object.entries(productSalesMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // Revenue by month (last 6 months) for Line Chart
    const revenueByMonth: MonthlyRevenue[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      
      const monthOrders = nonCancelledOrders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
      })
      
      revenueByMonth.push({
        month: monthName,
        revenue: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: monthOrders.length
      })
    }

    // Orders by status for Pie Chart
    const statusCounts: { [key: string]: number } = {}
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    const ordersByStatus: OrderStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }))

    // Customer growth (last 6 months) for Bar Chart
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
        newCustomers: newCustomersThisMonth
      })
    }

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
      conversionRate: 2.4, // Since no page views tracked, keeping static mock
      topProducts,
      revenueByMonth,
      ordersByStatus,
      customerGrowth
    }
  }

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, fetchAnalytics])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
    toast.success('Analytics refreshed!')
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
                  className="bg-blue-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
                      <div className="bg-green-500 p-3 rounded-lg"><span className="text-white text-xl">💰</span></div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-500 p-3 rounded-lg"><span className="text-white text-xl">📋</span></div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalOrders.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-500 p-3 rounded-lg"><span className="text-white text-xl">👥</span></div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalCustomers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-orange-500 p-3 rounded-lg"><span className="text-white text-xl">📦</span></div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalProducts.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-indigo-500 p-3 rounded-lg"><span className="text-white text-xl">💳</span></div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="bg-pink-500 p-3 rounded-lg"><span className="text-white text-xl">📈</span></div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">{analyticsData.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart (Recharts) */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.revenueByMonth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `₹${value}`} 
                          />
                          <Tooltip 
                            formatter={(value: any) => [`₹${value}`, 'Revenue']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Order Status Chart (Recharts Pie) */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Status</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.ordersByStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                            label={(entry) => entry.name}
                          >
                            {analyticsData.ordersByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS] || '#9ca3af'} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any) => [value, 'Orders']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend className="capitalize" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Products and Customer Growth */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Top Selling Products Table */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {analyticsData.topProducts.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400 font-bold">#{index + 1}</span>
                                  <span>{product.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 text-right">{product.sales}</td>
                              <td className="px-4 py-3 text-sm text-green-600 font-medium text-right">{formatCurrency(product.revenue)}</td>
                            </tr>
                          ))}
                          {analyticsData.topProducts.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">No product sales yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Customer Growth Bar Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">New Customers</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.customerGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip 
                            formatter={(value: any) => [value, 'New Customers']}
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="newCustomers" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
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