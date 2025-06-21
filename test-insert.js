const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testProductInsert() {
  console.log('🧪 Testing product insertion...')
  
  const testProduct = {
    name: 'Test Product ' + Date.now(),
    description: 'This is a test product',
    price: 999,
    original_price: 1299,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop'],
    category: 'hoodies',
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    stock: 12,
    featured: false,
    gender: 'men',
    tags: ['test']
  }

  console.log('📊 Test product data:', testProduct)

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select()

    if (error) {
      console.error('❌ Insert error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } else {
      console.log('✅ Insert successful:', data)
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

testProductInsert() 