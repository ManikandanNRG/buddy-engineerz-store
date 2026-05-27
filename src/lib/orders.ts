import { supabase } from './supabase'
import type { CartItem } from './supabase'
import type { Address } from './addresses'

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_id?: string
  shipping_address: Address
  created_at: string
  updated_at: string
  items: any[]
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

// Generate an order number
function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${dateStr}-${randomStr}`
}

// Check if all items in the cart have sufficient stock
export async function checkStockAvailability(items: CartItem[]): Promise<{
  available: boolean
  insufficientItems: Array<{ product_id: string; requested: number; available: number }>
  error: any
}> {
  try {
    console.log('🔍 Checking stock availability for', items.length, 'items')

    const itemsPayload = items.map(item => ({
      product: { id: item.product.id },
      quantity: item.quantity,
    }))

    const { data, error } = await supabase.rpc('check_stock_availability', {
      p_items: JSON.stringify(itemsPayload),
    })

    if (error) {
      console.error('❌ Stock check RPC error:', error)
      // If the RPC doesn't exist yet, allow the order to proceed (graceful degradation)
      if (error.code === 'PGRST202' || error.message?.includes('function') ) {
        console.warn('⚠️ Stock check function not found — skipping validation. Please run decrement-stock-migration.sql.')
        return { available: true, insufficientItems: [], error: null }
      }
      return { available: false, insufficientItems: [], error }
    }

    return {
      available: data.available,
      insufficientItems: data.insufficient_items || [],
      error: null,
    }
  } catch (catchError) {
    console.error('💥 Stock check catch error:', catchError)
    // Graceful degradation — don't block the order if check itself fails
    return { available: true, insufficientItems: [], error: null }
  }
}

// Decrement stock for all ordered items after successful order creation
async function decrementStockForOrder(items: CartItem[]): Promise<void> {
  console.log('📉 Decrementing stock for', items.length, 'items')

  const decrementPromises = items.map(item =>
    supabase.rpc('decrement_product_stock', {
      p_product_id: item.product.id,
      p_quantity: item.quantity,
    })
  )

  const results = await Promise.allSettled(decrementPromises)

  results.forEach((result, index) => {
    const item = items[index]
    if (result.status === 'rejected') {
      console.error(`❌ Failed to decrement stock for product ${item.product.id} (${item.product.name}):`, result.reason)
    } else if (result.value.error) {
      console.error(`❌ Stock decrement error for product ${item.product.id} (${item.product.name}):`, result.value.error)
    } else {
      console.log(`✅ Stock decremented for ${item.product.name} by ${item.quantity}`)
    }
  })
}

export async function createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
  try {
    console.log('📦 Creating order for user:', orderData.user_id)

    // Step 1: Check stock availability before creating the order
    const stockCheck = await checkStockAvailability(orderData.items)

    if (!stockCheck.available) {
      const itemNames = stockCheck.insufficientItems.map(item => {
        const cartItem = orderData.items.find(i => i.product.id === item.product_id)
        return `${cartItem?.product.name || 'Unknown'} (requested: ${item.requested}, available: ${item.available})`
      })
      console.error('❌ Insufficient stock for items:', itemNames)
      return {
        order: null,
        error: {
          message: `Insufficient stock for: ${itemNames.join(', ')}. Please update your cart.`,
          code: 'INSUFFICIENT_STOCK',
          insufficientItems: stockCheck.insufficientItems,
        },
      }
    }

    // Step 2: Create the order
    const orderNumber = generateOrderNumber()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        order_number: orderNumber,
        status: 'pending',
        total: orderData.total_amount,
        items: JSON.parse(JSON.stringify(orderData.items)),
        shipping_address: orderData.shipping_address,
        payment_status: 'pending',
        payment_id: null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Create order error:', orderError)
      return { order: null, error: orderError }
    }

    console.log('✅ Order created successfully:', order.id)

    // Step 3: Decrement stock — run after order is committed
    // We don't await this blocking the response; failures are logged but order is NOT rolled back.
    // Stock can be reconciled manually if decrement fails.
    decrementStockForOrder(orderData.items).catch(err => {
      console.error('💥 Critical: Stock decrement failed after order creation:', order.id, err)
    })

    return { order, error: null }
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
      .select('*')
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
      .select('*')
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
    
    // Perform the cancellation update
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

    if (order && order.items) {
      // Restore stock for all cancelled items in the background
      console.log('📈 Restoring stock for cancelled order items:', order.items.length)
      const incrementPromises = order.items.map((item: any) =>
        supabase.rpc('increment_product_stock', {
          p_product_id: item.product.id,
          p_quantity: item.quantity,
        })
      )

      Promise.allSettled(incrementPromises).then(results => {
        results.forEach((result, index) => {
          if (result.status === 'rejected' || (result.status === 'fulfilled' && result.value.error)) {
            console.error(`❌ Failed to restore stock for item ${index}:`, result)
          }
        })
      })
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