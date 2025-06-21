// Test script to check orders table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testOrdersTable() {
  console.log('🔍 Testing orders table...')
  
  try {
    // Test 1: Check if orders table exists
    console.log('\n1. Testing orders table existence...')
    const { data: ordersTest, error: ordersError } = await supabase
      .from('orders')
      .select('count(*)')
      .limit(1)

    if (ordersError) {
      console.error('❌ Orders table error:', ordersError)
      return
    }
    
    console.log('✅ Orders table exists:', ordersTest)

    // Test 2: Try to fetch orders
    console.log('\n2. Testing orders fetch...')
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .limit(5)

    if (fetchError) {
      console.error('❌ Orders fetch error:', fetchError)
      return
    }

    console.log('✅ Orders fetch successful:', orders?.length || 0, 'orders found')
    if (orders && orders.length > 0) {
      console.log('Sample order:', orders[0])
    }

    // Test 3: Check user_profiles table
    console.log('\n3. Testing user_profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5)

    if (profilesError) {
      console.error('❌ User profiles error:', profilesError)
    } else {
      console.log('✅ User profiles table exists:', profiles?.length || 0, 'profiles found')
    }

    // Test 4: Check products table
    console.log('\n4. Testing products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count(*)')
      .limit(1)

    if (productsError) {
      console.error('❌ Products table error:', productsError)
    } else {
      console.log('✅ Products table exists:', products)
    }

    // Test 5: Check categories table
    console.log('\n5. Testing categories table...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count(*)')
      .limit(1)

    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError)
    } else {
      console.log('✅ Categories table exists:', categories)
    }

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testOrdersTable() 