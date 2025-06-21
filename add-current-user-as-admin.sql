-- Add Current User as Admin
-- Run this in your Supabase SQL Editor

-- First, let's see who the current user is
SELECT 
    'Current User Info' as info,
    auth.uid() as user_id,
    auth.email() as user_email;

-- Check if user already exists in admin_users
SELECT 
    'Existing Admin Check' as check_type,
    COUNT(*) as admin_count,
    CASE 
        WHEN COUNT(*) > 0 THEN 'User is already admin'
        ELSE 'User needs to be added as admin'
    END as status
FROM admin_users 
WHERE id = auth.uid();

-- Add current user as admin (this will only work if user is authenticated)
INSERT INTO admin_users (id, email, name, role, is_active)
SELECT 
    auth.uid(),
    auth.email(),
    COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'name'),
        split_part(auth.email(), '@', 1)
    ),
    'admin',
    true
WHERE auth.uid() IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    is_active = true,
    last_login = NOW();

-- Verify the user was added
SELECT 
    'Admin User Added' as result,
    id,
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users 
WHERE id = auth.uid();

-- Test if user can now insert products
SELECT 
    'Product Insert Permission Test' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        ) THEN 'YES - User is now admin and can insert products'
        ELSE 'NO - Something went wrong'
    END as result; 