import { supabase } from './supabase'
import type { CartItem } from './supabase'
import type { Address } from './addresses'

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  subtotal: number
  shipping_cost: number
  tax_amount: number
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_id?: string
  shipping_address: Address
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  price: number
  size?: string
  color?: string
  created_at: string
}

export interface CreateOrderData {
  user_id: string
  items: CartItem[]
  shipping_address: Address
  subtotal: number
  shipping_cost: number
  tax_amount: number
  total_amount: number
  payment_method: string
}

export interface OrderResponse {
  order: Order | null
  error: any
}

export interface OrdersResponse {
  orders: Order[] | null
  error: any
}

// Create a new order
export async function createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
  try {
    console.log('📦 Creating order for user:', orderData.user_id)
    
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        status: 'pending',
        total_amount: orderData.total_amount,
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shipping_cost,
        tax_amount: orderData.tax_amount,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        shipping_address: orderData.shipping_address,
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Create order error:', orderError)
      return { order: null, error: orderError }
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images[0] || '',
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
      color: item.color,
    }))

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (itemsError) {
      console.error('❌ Create order items error:', itemsError)
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id)
      return { order: null, error: itemsError }
    }

    const fullOrder: Order = {
      ...order,
      items: items || []
    }

    console.log('✅ Order created successfully:', order.id)
    return { order: fullOrder, error: null }
  } catch (catchError) {
    console.error('💥 Create order catch error:', catchError)
    return { order: null, error: catchError }
  }
}

// Get user orders
export async function getUserOrders(userId: string): Promise<OrdersResponse> {
  try {
    console.log('📦 Getting orders for user:', userId)
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Get orders error:', ordersError)
      return { orders: null, error: ordersError }
    }

    console.log('✅ Orders retrieved successfully:', orders?.length || 0)
    return { orders: orders || [], error: null }
  } catch (catchError) {
    console.error('💥 Get orders catch error:', catchError)
    return { orders: null, error: catchError }
  }
}

// Get single order
export async function getOrder(orderId: string, userId: string): Promise<OrderResponse> {
  try {
    console.log('📦 Getting order:', orderId)
    
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('❌ Get order error:', error)
      return { order: null, error }
    }

    console.log('✅ Order retrieved successfully')
    return { order, error: null }
  } catch (catchError) {
    console.error('💥 Get order catch error:', catchError)
    return { order: null, error: catchError }
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'],
  userId?: string
): Promise<OrderResponse> {
  try {
    console.log('📦 Updating order status:', orderId, status)
    
    let query = supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    // If userId provided, ensure user can only update their own orders
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: order, error } = await query.select().single()

    if (error) {
      console.error('❌ Update order status error:', error)
      return { order: null, error }
    }

    console.log('✅ Order status updated successfully')
    return { order, error: null }
  } catch (catchError) {
    console.error('💥 Update order status catch error:', catchError)
    return { order: null, error: catchError }
  }
}

// Update payment status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order['payment_status'],
  paymentId?: string
): Promise<OrderResponse> {
  try {
    console.log('💳 Updating payment status:', orderId, paymentStatus)
    
    const updateData: any = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    }

    if (paymentId) {
      updateData.payment_id = paymentId
    }

    // If payment is completed, update order status to confirmed
    if (paymentStatus === 'completed') {
      updateData.status = 'confirmed'
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('❌ Update payment status error:', error)
      return { order: null, error }
    }

    console.log('✅ Payment status updated successfully')
    return { order, error: null }
  } catch (catchError) {
    console.error('💥 Update payment status catch error:', catchError)
    return { order: null, error: catchError }
  }
}

// Cancel order
export async function cancelOrder(orderId: string, userId: string): Promise<OrderResponse> {
  try {
    console.log('📦 Cancelling order:', orderId)
    
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_id', userId)
      .in('status', ['pending', 'confirmed']) // Only allow cancellation of pending/confirmed orders
      .select()
      .single()

    if (error) {
      console.error('❌ Cancel order error:', error)
      return { order: null, error }
    }

    console.log('✅ Order cancelled successfully')
    return { order, error: null }
  } catch (catchError) {
    console.error('💥 Cancel order catch error:', catchError)
    return { order: null, error: catchError }
  }
}

// Get order status display
export function getOrderStatusDisplay(status: Order['status']): { label: string; color: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'yellow' }
    case 'confirmed':
      return { label: 'Confirmed', color: 'blue' }
    case 'processing':
      return { label: 'Processing', color: 'purple' }
    case 'shipped':
      return { label: 'Shipped', color: 'indigo' }
    case 'delivered':
      return { label: 'Delivered', color: 'green' }
    case 'cancelled':
      return { label: 'Cancelled', color: 'red' }
    default:
      return { label: 'Unknown', color: 'gray' }
  }
}

// Get payment status display
export function getPaymentStatusDisplay(status: Order['payment_status']): { label: string; color: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'yellow' }
    case 'completed':
      return { label: 'Completed', color: 'green' }
    case 'failed':
      return { label: 'Failed', color: 'red' }
    case 'refunded':
      return { label: 'Refunded', color: 'blue' }
    default:
      return { label: 'Unknown', color: 'gray' }
  }
}

// Calculate order totals
export function calculateOrderTotals(items: CartItem[]): {
  subtotal: number
  shipping: number
  tax: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 999 ? 0 : 99 // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  return { subtotal, shipping, tax, total }
} 