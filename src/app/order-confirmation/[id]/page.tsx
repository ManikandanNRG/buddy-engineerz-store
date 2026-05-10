'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Package, Truck, ArrowLeft, Loader2 } from 'lucide-react'
import { getOrder } from '@/lib/orders'
import { formatPrice } from '@/lib/database'
import { useAuth } from '@/hooks/useAuth'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/products')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function loadOrder() {
      if (!params.id || !user) return
      
      try {
        const { order: data, error: err } = await getOrder(params.id as string, user.id)
        
        if (err || !data) {
          setError('Order not found or you do not have permission to view it.')
        } else if (data.user_id !== user.id) {
          setError('You do not have permission to view this order.')
        } else {
          setOrder(data)
        }
      } catch (err) {
        setError('Failed to load order details.')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [params.id, user])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-gray-600">Loading order details...</span>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  const deliveryDate = new Date(order.created_at)
  deliveryDate.setDate(deliveryDate.getDate() + 5) // Estimated 5 days delivery

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-8 text-center border-b border-gray-100">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order <span className="font-semibold text-gray-900">{order.order_number}</span> has been received.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Delivery Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                Delivery Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                <p className="text-gray-600 mt-1">{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && (
                  <p className="text-gray-600">{order.shipping_address.address_line_2}</p>
                )}
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                </p>
                <p className="text-gray-600 mt-2">Phone: {order.shipping_address.phone}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                  <p className="text-purple-600 font-semibold">{deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Order Summary
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Payment Method</span>
                    <span className="font-medium text-gray-900 capitalize">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Status</span>
                    <span className="font-medium text-amber-600 capitalize">{order.status}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-purple-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                  <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded"
                        unoptimized={item.product.images[0].includes('unsplash.com')}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                    <div className="text-xs text-gray-500 mt-1 flex gap-2">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right font-medium text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 rounded-b-lg p-6 text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/account/orders"
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
