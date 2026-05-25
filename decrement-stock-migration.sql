-- =============================================
-- STOCK DECREMENT MIGRATION
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. RPC function to safely decrement stock for a single product
--    Uses GREATEST(0, stock - quantity) to prevent negative stock.
--    SECURITY DEFINER means it runs with the privileges of the function owner (postgres),
--    bypassing the RLS policy that restricts product updates to admins only.
CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id UUID, p_quantity INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET
    stock = GREATEST(0, stock - p_quantity),
    updated_at = NOW()
  WHERE id = p_product_id;
END;
$$;

-- 2. RPC function to check if sufficient stock exists before placing an order.
--    Returns TRUE if all items have sufficient stock, FALSE otherwise.
--    This is a read-only check, safe to call from the client.
CREATE OR REPLACE FUNCTION check_stock_availability(p_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item JSONB;
  v_product_id UUID;
  v_required_qty INT;
  v_current_stock INT;
  v_insufficient JSONB[] := '{}';
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Support both item.product.id and item.id structures
    v_product_id := COALESCE(
      (v_item -> 'product' ->> 'id')::UUID,
      (v_item ->> 'id')::UUID
    );
    v_required_qty := (v_item ->> 'quantity')::INT;

    SELECT stock INTO v_current_stock
    FROM products
    WHERE id = v_product_id;

    IF v_current_stock IS NULL OR v_current_stock < v_required_qty THEN
      v_insufficient := v_insufficient || jsonb_build_object(
        'product_id', v_product_id,
        'requested', v_required_qty,
        'available', COALESCE(v_current_stock, 0)
      );
    END IF;
  END LOOP;

  IF array_length(v_insufficient, 1) > 0 THEN
    RETURN jsonb_build_object('available', false, 'insufficient_items', to_jsonb(v_insufficient));
  END IF;

  RETURN jsonb_build_object('available', true, 'insufficient_items', '[]'::JSONB);
END;
$$;

-- Verify the functions were created
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('decrement_product_stock', 'check_stock_availability');
