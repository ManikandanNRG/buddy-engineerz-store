-- Add UPDATE policy for regular users on the orders table
-- Run this script in your Supabase SQL Editor

CREATE POLICY "Users can update their own orders" ON orders 
    FOR UPDATE USING (auth.uid() = user_id);

-- Verify it was added by listing policies on orders table
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename = 'orders';
