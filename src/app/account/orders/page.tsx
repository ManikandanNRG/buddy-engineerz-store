'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  X, 
  Eye,
  Loader2,
  Calendar,
  CreditCard
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserOrders, getOrderStatusDisplay, getPaymentStatusDisplay, cancelOrder } from '@/lib/orders'
import { formatPrice } from '@/lib/database'
import { formatAddress } from '@/lib/addresses'
import type { Order } from '@/lib/orders'

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { orders: userOrders, error } = await getUserOrders(user.id)
      
      if (error) {
        setError('Failed to load orders')
        console.error('Orders loading error:', error)
      } else if (userOrders) {
        setOrders(userOrders)
      }
    } catch (error) {
      setError('Failed to load orders')
      console.error('Orders loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!user || !confirm('Are you sure you want to cancel this order?')) return

    setCancellingOrder(orderId)
    try {
      const { error } = await cancelOrder(orderId, user.id)
      
      if (error) {
        setError('Failed to cancel order')
        console.error('Order cancellation error:', error)
      } else {
        await loadOrders() // Reload orders
      }
    } catch (error) {
      setError('Failed to cancel order')
      console.error('Order cancellation error:', error)
    } finally {
      setCancellingOrder(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-gray-600">Loading orders...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
          <Link
            href="/auth/login?redirect=/account/orders"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              href="/products"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancelOrder}
                isCancelling={cancellingOrder === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderTimeline({ status }: { status: Order['status'] }) {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Loader2 },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ]

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3">
        <X className="h-5 w-5 text-red-600" />
        <span className="text-red-700 font-medium">This order has been cancelled</span>
      </div>
    )
  }

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
    const currentIdx = statusOrder.indexOf(status)
    const stepIdx = statusOrder.indexOf(stepKey)

    if (stepIdx < currentIdx) return 'completed'
    if (stepIdx === currentIdx) return 'current'
    return 'upcoming'
  }

  return (
    <div className="relative pt-4 pb-2">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6 md:gap-0">
        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.key)
          const Icon = step.icon

          return (
            <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2 relative z-10 w-full md:w-auto">
              {/* Progress Line for Mobile */}
              {idx < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 md:hidden" />
              )}
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                stepStatus === 'completed' ? 'bg-green-600 border-green-600 text-white' :
                stepStatus === 'current' ? 'bg-white border-purple-600 text-purple-600 ring-4 ring-purple-50' :
                'bg-white border-gray-300 text-gray-300'
              }`}>
                {stepStatus === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className={`h-4 w-4 ${stepStatus === 'current' && step.key === 'processing' ? 'animate-spin' : ''}`} />
                )}
              </div>
              <div className="flex flex-col md:items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  stepStatus === 'completed' ? 'text-green-600' :
                  stepStatus === 'current' ? 'text-purple-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {stepStatus === 'current' && (
                  <span className="text-[10px] text-gray-500 md:text-center">In progress</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({ 
  order, 
  onCancel, 
  isCancelling 
}: { 
  order: Order
  onCancel: (orderId: string) => void
  isCancelling: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const statusDisplay = getOrderStatusDisplay(order.status)
  const paymentDisplay = getPaymentStatusDisplay(order.payment_status)

  const canCancel = ['pending', 'confirmed'].includes(order.status)
  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Placed on {orderDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatPrice(order.total || 0)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusDisplay.color === 'green' ? 'bg-green-100 text-green-800' :
                statusDisplay.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                statusDisplay.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                statusDisplay.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                statusDisplay.color === 'red' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {statusDisplay.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                paymentDisplay.color === 'green' ? 'bg-green-100 text-green-800' :
                paymentDisplay.color === 'red' ? 'bg-red-100 text-red-800' :
                paymentDisplay.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {paymentDisplay.label}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item: any) => (
              <div key={item.id} className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white">
                <Image
                  src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.product?.name || 'Product'}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized={item.product?.images?.[0]?.includes('unsplash.com')}
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{order.items.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            <Eye className="h-4 w-4" />
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
          
          {canCancel && (
            <button
              onClick={() => onCancel(order.id)}
              disabled={isCancelling}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        {/* Visual Timeline */}
        <OrderTimeline status={order.status} />
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Items Ordered</h4>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product?.name || 'Product'}
                        fill
                        sizes="64px"
                        className="object-cover rounded-lg"
                        unoptimized={item.product?.images?.[0]?.includes('unsplash.com')}
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.product?.name}</h5>
                      <div className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.product?.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Shipping */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatAddress(order.shipping_address)}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {order.shipping_address.phone}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment</span>
                    <span className="text-gray-900 capitalize">{order.payment_status}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(order.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 