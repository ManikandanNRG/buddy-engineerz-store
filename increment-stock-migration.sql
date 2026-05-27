-- =============================================
-- INCREMENT STOCK MIGRATION
-- Run this in your Supabase SQL Editor
-- =============================================

-- Creates a secure function to increment stock when an order is cancelled.
-- This runs as SECURITY DEFINER to bypass the restriction that only admins can update products.

CREATE OR REPLACE FUNCTION increment_product_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock = stock + p_quantity,
      updated_at = NOW()
  WHERE id = p_product_id;
END;
$$;

-- Verify
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'increment_product_stock';
