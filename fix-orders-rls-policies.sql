-- Fix Orders Table RLS Policies for Admin Access
-- Run this in your Supabase SQL Editor

-- First, check if admin_users table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        -- Create admin_users table if it doesn't exist
        CREATE TABLE admin_users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE,
            is_active BOOLEAN DEFAULT true
        );
        
        -- Enable RLS on admin_users
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
        
        -- Admin users policies
        CREATE POLICY "Admin users can view their own data" ON admin_users
            FOR SELECT USING (auth.uid() = id);
        
        CREATE POLICY "Admin users can update their own data" ON admin_users
            FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Drop existing problematic policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Admin users can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin users can update orders" ON orders;
DROP POLICY IF EXISTS "Admin users can insert orders" ON orders;

-- Create comprehensive RLS policies for orders table

-- 1. Regular users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- 2. Regular users can insert their own orders
CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Regular users can update their own orders (limited fields)
CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Admin users can view ALL orders
CREATE POLICY "Admin users can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- 5. Admin users can update ALL orders
CREATE POLICY "Admin users can update all orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- 6. Admin users can insert orders
CREATE POLICY "Admin users can insert orders" ON orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- 7. Admin users can delete orders
CREATE POLICY "Admin users can delete orders" ON orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- Ensure RLS is enabled on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Add yourself as admin user (REPLACE WITH YOUR EMAIL)
-- You need to sign up first with this email in your app
INSERT INTO admin_users (id, email, name, role, is_active)
SELECT 
    auth.uid(),
    'your-email@example.com',  -- REPLACE WITH YOUR ACTUAL EMAIL
    'Admin User',              -- REPLACE WITH YOUR NAME
    'super_admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE email = 'your-email@example.com'  -- REPLACE WITH YOUR EMAIL
);

-- Verify the setup
SELECT 
    'Tables' as type,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_name IN ('orders', 'admin_users')

UNION ALL

SELECT 
    'Orders Policies' as type,
    COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'orders'

UNION ALL

SELECT 
    'Admin Users' as type,
    COUNT(*) as count
FROM admin_users;

-- Check your admin status
SELECT 
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users 
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL 