-- Fix Addresses Table Structure
-- Run this in your Supabase SQL Editor to fix the addresses table

-- First, check if the table exists and drop it if it does (for clean setup)
DROP TABLE IF EXISTS addresses;

-- Recreate the addresses table with correct structure
CREATE TABLE addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(10) DEFAULT 'home' CHECK (type IN ('home', 'work', 'other')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for addresses
CREATE POLICY "Users can view their own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(user_id, is_default);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_addresses_updated_at 
    BEFORE UPDATE ON addresses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new/updated address is set as default
    IF NEW.is_default = true THEN
        -- Unset all other default addresses for this user
        UPDATE addresses 
        SET is_default = false 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one default address per user
CREATE TRIGGER ensure_single_default_address_trigger
    AFTER INSERT OR UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_address();

-- Also need to fix the orders table to match our interface
-- Check if orders table needs updating
DO $$
BEGIN
    -- Add missing columns to orders table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_cost') THEN
        ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tax_amount') THEN
        ALTER TABLE orders ADD COLUMN tax_amount DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
    END IF;
END $$;

-- Create order_items table for better normalization
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(10),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items
CREATE POLICY "Users can view their own order items" ON order_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own order items" ON order_items 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Create indexes for order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

COMMIT; 