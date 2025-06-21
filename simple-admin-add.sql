-- Simple Admin User Addition
-- Run this in your Supabase SQL Editor

-- First, let's see the current user ID
SELECT auth.uid() as current_user_id;

-- Check the admin_users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

-- Check if admin_users table exists and has data
SELECT COUNT(*) as admin_count FROM admin_users;

-- Let's try a direct insert with the current user ID
-- Replace 'your-email@example.com' with your actual email
INSERT INTO admin_users (id, email, name, role, is_active) 
VALUES (
    auth.uid(),
    'admin@buddyengineerz.com',  -- Replace with your actual email
    'Admin User',
    'admin',
    true
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = true;

-- Verify the insertion
SELECT * FROM admin_users WHERE id = auth.uid();

-- Final test
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) 
        THEN 'SUCCESS - User is now admin'
        ELSE 'FAILED - User not found in admin_users'
    END as final_result; 