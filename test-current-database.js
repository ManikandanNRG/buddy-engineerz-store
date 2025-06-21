const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testCurrentDatabase() {
  console.log('🔍 BUDDY ENGINEERZ DATABASE ANALYSIS')
  console.log('=====================================\n')

  try {
    // Test 1: Check if tables exist and count records
    console.log('📊 TABLE ANALYSIS:')
    console.log('------------------')

    const tables = ['products', 'categories', 'admin_users', 'orders', 'addresses', 'user_profiles']
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1)

        if (error) {
          console.log(`❌ ${table}: ERROR - ${error.message}`)
        } else {
          console.log(`✅ ${table}: ${count || 0} records`)
          if (data && data.length > 0) {
            console.log(`   Sample: ${JSON.stringify(data[0]).substring(0, 100)}...`)
          }
        }
      } catch (err) {
        console.log(`❌ ${table}: FAILED - ${err.message}`)
      }
    }

    console.log('\n🛍️ PRODUCTS ANALYSIS:')
    console.log('---------------------')
    
    // Check products in detail
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    if (productsError) {
      console.log('❌ Products Error:', productsError.message)
    } else {
      console.log(`✅ Found ${products?.length || 0} products`)
      if (products && products.length > 0) {
        console.log('Sample products:')
        products.forEach((p, i) => {
          console.log(`  ${i+1}. ${p.name} - ₹${p.price} (${p.category})`)
        })
      } else {
        console.log('⚠️  NO PRODUCTS FOUND - This is why your store appears empty!')
      }
    }

    console.log('\n📂 CATEGORIES ANALYSIS:')
    console.log('-----------------------')
    
    // Check categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

    if (categoriesError) {
      console.log('❌ Categories Error:', categoriesError.message)
    } else {
      console.log(`✅ Found ${categories?.length || 0} categories`)
      if (categories && categories.length > 0) {
        categories.forEach((c, i) => {
          console.log(`  ${i+1}. ${c.name} - ${c.description}`)
        })
      } else {
        console.log('⚠️  NO CATEGORIES FOUND')
      }
    }

    console.log('\n👨‍💼 ADMIN ANALYSIS:')
    console.log('--------------------')
    
    // Check admin users
    const { data: admins, error: adminError } = await supabase
      .from('admin_users')
      .select('*')

    if (adminError) {
      console.log('❌ Admin Users Error:', adminError.message)
    } else {
      console.log(`✅ Found ${admins?.length || 0} admin users`)
      if (admins && admins.length > 0) {
        admins.forEach((a, i) => {
          console.log(`  ${i+1}. ${a.email} (${a.role})`)
        })
      } else {
        console.log('⚠️  NO ADMIN USERS FOUND - You cannot access admin panel!')
      }
    }

    console.log('\n🛒 ORDERS ANALYSIS:')
    console.log('-------------------')
    
    // Check orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(3)

    if (ordersError) {
      console.log('❌ Orders Error:', ordersError.message)
    } else {
      console.log(`✅ Found ${orders?.length || 0} orders`)
      if (orders && orders.length > 0) {
        orders.forEach((o, i) => {
          console.log(`  ${i+1}. Order ${o.order_number} - ₹${o.total} (${o.status})`)
        })
      }
    }

    console.log('\n🎯 DIAGNOSIS & RECOMMENDATIONS:')
    console.log('===============================')

    // Provide recommendations based on findings
    const { data: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .limit(1)

    const { data: categoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .limit(1)

    const { data: adminCount } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact' })
      .limit(1)

    const productTotal = productCount?.length || 0
    const categoryTotal = categoryCount?.length || 0
    const adminTotal = adminCount?.length || 0

    if (productTotal === 0) {
      console.log('🚨 CRITICAL: No products found!')
      console.log('   → Your store will appear empty to customers')
      console.log('   → Run: database-setup.sql to add 15 sample products')
    }

    if (categoryTotal === 0) {
      console.log('🚨 CRITICAL: No categories found!')
      console.log('   → Product filtering will not work')
      console.log('   → Run: setup-categories.sql')
    }

    if (adminTotal === 0) {
      console.log('🚨 CRITICAL: No admin users found!')
      console.log('   → You cannot access admin panel')
      console.log('   → Run: add-current-user-as-admin.sql')
    }

    if (productTotal > 0 && categoryTotal > 0 && adminTotal > 0) {
      console.log('🎉 GREAT: Your database seems properly set up!')
      console.log('   → All core tables have data')
      console.log('   → Your store should be functional')
    }

    console.log('\n📋 NEXT STEPS:')
    console.log('--------------')
    
    if (productTotal === 0 || categoryTotal === 0) {
      console.log('1. Run complete-database-setup.sql in Supabase SQL Editor')
      console.log('2. This will add sample products and categories')
    }
    
    if (adminTotal === 0) {
      console.log('3. Run add-current-user-as-admin.sql to become admin')
    }
    
    if (productTotal > 0 && categoryTotal > 0 && adminTotal > 0) {
      console.log('1. Your database is ready!')
      console.log('2. Test your application: npm run dev')
      console.log('3. Check admin panel: /admin/login')
    }

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testCurrentDatabase() 