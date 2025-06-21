-- Verify Admin Status and Permissions
-- Run this to check if everything is working correctly

-- 1. Check current user authentication
SELECT 
    'Current User Info' as info,
    auth.uid() as user_id,
    auth.email() as user_email;

-- 2. Check if admin_users table exists and has data
SELECT 
    'Admin Users Table' as table_info,
    COUNT(*) as total_admins,
    array_agg(email) as admin_emails
FROM admin_users;

-- 3. Check if current user is in admin_users table
SELECT 
    'Current User Admin Status' as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) 
        THEN 'YES - User is admin'
        ELSE 'NO - User is not admin'
    END as is_admin,
    CASE 
        WHEN auth.uid() IS NULL 
        THEN 'User not authenticated'
        ELSE 'User is authenticated'
    END as auth_status;

-- 4. Show current user's admin record (if exists)
SELECT 
    'Current User Admin Record' as record_info,
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users 
WHERE id = auth.uid();

-- 5. Test product insertion permission
SELECT 
    'Product Insert Permission' as permission_test,
    CASE 
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) 
        THEN 'ALLOWED - Can insert products'
        ELSE 'DENIED - Cannot insert products'
    END as permission_status;

-- 6. Check RLS policies on products table
SELECT 
    'Products Table Policies' as policy_info,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY cmd; 