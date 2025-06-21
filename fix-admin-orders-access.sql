-- Fix Admin Access to Orders Table
-- Run this in your Supabase SQL Editor

-- First, let's add admin policies for orders table
-- Admin users should be able to view all orders

-- Drop existing restrictive policy and create admin-friendly ones
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

-- Create new policies that allow both user access and admin access
CREATE POLICY "Users can view their own orders" ON orders 
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own orders" ON orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin users can update any order (for status changes)
CREATE POLICY "Admin users can update orders" ON orders 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Admin users can delete orders if needed
CREATE POLICY "Admin users can delete orders" ON orders 
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Also fix user_profiles access for admins
DROP POLICY IF EXISTS "User profiles are viewable by users themselves" ON user_profiles;

CREATE POLICY "User profiles are viewable by users and admins" ON user_profiles 
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Let's also create a simple test order for demonstration
-- (You can delete this later)
DO $$
DECLARE
    test_user_id UUID;
    test_order_id UUID;
BEGIN
    -- Create a test user profile if it doesn't exist
    INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
    VALUES (
        gen_random_uuid(),
        'test@example.com',
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO test_user_id;
    
    -- If user already exists, get their ID
    IF test_user_id IS NULL THEN
        SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
    END IF;
    
    -- Create user profile
    INSERT INTO user_profiles (id, name, phone)
    VALUES (test_user_id, 'Test Customer', '+1234567890')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create a test order
    INSERT INTO orders (
        user_id,
        order_number,
        items,
        total,
        status,
        payment_status,
        shipping_address
    ) VALUES (
        test_user_id,
        'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT,
        '[
            {
                "product": {
                    "id": "test-product-1",
                    "name": "Algorithm Master Tee",
                    "price": 999,
                    "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop"]
                },
                "quantity": 2,
                "size": "L",
                "color": "Black"
            }
        ]'::jsonb,
        1998.00,
        'pending',
        'pending',
        '{
            "name": "Test Customer",
            "phone": "+1234567890",
            "address_line_1": "123 Test Street",
            "city": "Test City",
            "state": "Test State",
            "pincode": "12345",
            "country": "India"
        }'::jsonb
    );
    
    RAISE NOTICE 'Test order created successfully for user: %', test_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not create test order: %', SQLERRM;
END $$;

-- Verify the setup
SELECT 
    'Orders table' as table_name,
    COUNT(*) as record_count
FROM orders
UNION ALL
SELECT 
    'User profiles table' as table_name,
    COUNT(*) as record_count  
FROM user_profiles
UNION ALL
SELECT 
    'Admin users table' as table_name,
    COUNT(*) as record_count
FROM admin_users; 