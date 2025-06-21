-- Fix Product RLS for Admin Users
-- Run this in your Supabase SQL Editor

-- Check current policies on products table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';

-- COMPLETE FIX - Run this entire block
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admin users can insert products" ON products;
DROP POLICY IF EXISTS "Admin users can update products" ON products;
DROP POLICY IF EXISTS "Admin users can delete products" ON products;

-- Re-enable with simple policy
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_all_access" ON products FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON products TO authenticated;

-- Test insert
INSERT INTO products (name, description, price, category, stock, gender) 
VALUES ('Database Test', 'Testing if insert works', 100, 'tshirts', 5, 'unisex');

SELECT 'SUCCESS - Database is working' as result WHERE EXISTS (
    SELECT 1 FROM products WHERE name = 'Database Test'
);

-- Also fix categories table for admin access
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;

CREATE POLICY "Categories are viewable by everyone" ON categories 
    FOR SELECT USING (true);

CREATE POLICY "Admin users can insert categories" ON categories 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

CREATE POLICY "Admin users can update categories" ON categories 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

CREATE POLICY "Admin users can delete categories" ON categories 
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Verify admin user exists
SELECT 
    'Admin users' as table_name,
    COUNT(*) as count,
    array_agg(email) as admin_emails
FROM admin_users;

-- Test product insertion permissions
SELECT 
    'Current user can insert products' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        ) THEN 'YES - User is admin'
        ELSE 'NO - User is not admin'
    END as result; 