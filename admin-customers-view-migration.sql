-- =============================================
-- ADMIN CUSTOMERS FUNCTION - v2 (Fixed)
-- Copy the ENTIRE content below and paste into
-- Supabase SQL Editor, then click Run
-- =============================================

-- Step 1: Drop old version first (required when changing return type)
DROP FUNCTION IF EXISTS get_admin_customers();

-- Step 2: Recreate with order stats included (single query, no N+1)
CREATE FUNCTION get_admin_customers()
RETURNS TABLE (
  id                 UUID,
  email              TEXT,
  name               TEXT,
  phone              TEXT,
  created_at         TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ,
  last_sign_in_at    TIMESTAMPTZ,
  email_confirmed_at TIMESTAMPTZ,
  role               TEXT,
  total_orders       BIGINT,
  total_spent        NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can call this
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT
    up.id,
    au.email,
    up.name,
    up.phone,
    up.created_at,
    up.updated_at,
    au.last_sign_in_at,
    au.email_confirmed_at,
    au.raw_user_meta_data->>'role' AS role,
    COUNT(o.id)                    AS total_orders,
    COALESCE(SUM(o.total), 0)      AS total_spent
  FROM
    user_profiles up
    JOIN auth.users au ON up.id = au.id
    LEFT JOIN orders o ON o.user_id = up.id
  GROUP BY
    up.id, au.email, up.name, up.phone,
    up.created_at, up.updated_at,
    au.last_sign_in_at, au.email_confirmed_at,
    au.raw_user_meta_data->>'role'
  ORDER BY up.created_at DESC;
END;
$$;

-- Step 3: Verify
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'get_admin_customers';
