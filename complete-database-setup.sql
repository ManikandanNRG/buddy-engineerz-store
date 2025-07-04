-- Buddy Engineerz Complete Database Setup Script
-- Run this in your Supabase SQL Editor
-- This file combines all database setup including admin functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ADMIN USERS TABLE (First - needed for RLS policies)
-- =============================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
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

-- =============================================
-- CORE TABLES
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    images TEXT[] DEFAULT '{}',
    category VARCHAR(100) NOT NULL,
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    gender VARCHAR(10) CHECK (gender IN ('men', 'women', 'unisex')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    type VARCHAR(20) DEFAULT 'home' CHECK (type IN ('home', 'work', 'other')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_id VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY SETUP
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PUBLIC ACCESS
-- =============================================

-- Categories - Public read, Admin write
CREATE POLICY "Categories are viewable by everyone" ON categories 
    FOR SELECT USING (true);

CREATE POLICY "Admin users can insert categories" ON categories 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin users can update categories" ON categories 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin users can delete categories" ON categories 
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

-- Products - Public read, Admin write
CREATE POLICY "Products are viewable by everyone" ON products 
    FOR SELECT USING (true);

CREATE POLICY "Admin users can insert products" ON products 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin users can update products" ON products 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

CREATE POLICY "Admin users can delete products" ON products 
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

-- =============================================
-- RLS POLICIES - USER DATA
-- =============================================

-- User profiles
CREATE POLICY "User profiles are viewable by users themselves" ON user_profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Addresses
CREATE POLICY "Users can view their own addresses" ON addresses 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON addresses 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON addresses 
    FOR UPDATE USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view their own orders" ON orders 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can view all orders
CREATE POLICY "Admin users can view all orders" ON orders 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
    );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically create admin_user record when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create admin_user record if the user email is in our admin list
    IF NEW.email LIKE '%@buddyengineerz.com' OR NEW.email = 'admin@buddyengineerz.com' THEN
        INSERT INTO public.admin_users (id, email, name, role)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            CASE 
                WHEN NEW.email = 'admin@buddyengineerz.com' THEN 'super_admin'
                ELSE 'admin'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- TRIGGERS
-- =============================================

-- Create trigger to automatically handle new admin users
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- =============================================
-- PERMISSIONS
-- =============================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert Categories
INSERT INTO categories (name, description, image_url) VALUES
('tshirts', 'Comfortable T-shirts for coding sessions', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop'),
('hoodies', 'Cozy hoodies for debugging marathons', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop'),
('accessories', 'Essential accessories for engineers', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop')
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Products
INSERT INTO products (name, description, price, original_price, images, category, sizes, colors, stock, featured, gender, tags) VALUES

-- T-Shirts
('Algorithm Master Tee', 'Premium cotton t-shirt featuring a minimalist algorithm flowchart design. Perfect for developers who love clean code.', 999, 1299, 
 ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop'], 
 'tshirts', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy'], 50, true, 'unisex', 
 ARRAY['algorithm', 'programming', 'developer']),

('Binary Code Tee', 'Soft cotton tee with elegant binary pattern. For those who think in 1s and 0s.', 899, 1199, 
 ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop'], 
 'tshirts', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Gray', 'White'], 45, true, 'unisex', 
 ARRAY['binary', 'code', 'tech']),

('Stack Overflow Survivor', 'Humorous tee for developers who have survived countless debugging sessions.', 949, 1249, 
 ARRAY['https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=500&h=600&fit=crop'], 
 'tshirts', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'Black', 'Maroon'], 30, false, 'unisex', 
 ARRAY['humor', 'debugging', 'stackoverflow']),

('Git Commit Champion', 'For developers who write meaningful commit messages. Features Git command aesthetics.', 1049, 1349, 
 ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&h=600&fit=crop'], 
 'tshirts', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Green'], 40, true, 'unisex', 
 ARRAY['git', 'version-control', 'programming']),

('Coffee && Code', 'Essential combination for productive coding. Vintage-style print on premium fabric.', 899, 1149, 
 ARRAY['https://images.unsplash.com/photo-1583743089695-4b816a340f82?w=500&h=600&fit=crop'], 
 'tshirts', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Brown', 'Black', 'Cream'], 35, false, 'unisex', 
 ARRAY['coffee', 'code', 'lifestyle']),

-- Hoodies
('Debug Mode Hoodie', 'Ultra-comfortable hoodie for those long debugging sessions. Features a subtle debug icon.', 1999, 2499, 
 ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop'], 
 'hoodies', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Gray', 'Navy'], 25, true, 'unisex', 
 ARRAY['debug', 'comfortable', 'coding']),

('Syntax Error Recovery', 'Warm hoodie with a humorous take on programming errors. Perfect for winter coding.', 2199, 2799, 
 ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop'], 
 'hoodies', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'Black', 'Gray'], 20, false, 'unisex', 
 ARRAY['syntax', 'error', 'humor']),

('Full Stack Developer', 'Premium hoodie celebrating the versatility of full-stack developers. Modern design.', 2399, 2999, 
 ARRAY['https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500&h=600&fit=crop'], 
 'hoodies', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Charcoal'], 18, true, 'unisex', 
 ARRAY['fullstack', 'developer', 'professional']),

('Caffeine.exe Loading', 'Soft hoodie with a loading bar design. For developers powered by caffeine.', 1899, 2399, 
 ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop'], 
 'hoodies', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Coffee', 'Black', 'Brown'], 22, false, 'unisex', 
 ARRAY['caffeine', 'loading', 'coffee']),

-- Accessories
('Binary Clock', 'Unique wall clock displaying time in binary format. Perfect for the engineering workspace.', 1299, 1699, 
 ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop'], 
 'accessories', ARRAY['One Size'], ARRAY['Black', 'White'], 15, true, 'unisex', 
 ARRAY['clock', 'binary', 'workspace']),

('Code Mug Pro', 'Premium ceramic mug with heat-sensitive coding patterns. Changes color with hot beverages.', 699, 899, 
 ARRAY['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=600&fit=crop'], 
 'accessories', ARRAY['350ml', '500ml'], ARRAY['Black', 'White', 'Blue'], 50, true, 'unisex', 
 ARRAY['mug', 'coffee', 'heat-sensitive']),

('Programmer Sticker Pack', 'Collection of 20 premium vinyl stickers featuring popular programming languages and frameworks.', 399, 599, 
 ARRAY['https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500&h=600&fit=crop'], 
 'accessories', ARRAY['Pack of 20'], ARRAY['Mixed'], 100, false, 'unisex', 
 ARRAY['stickers', 'programming', 'languages']),

('Git Keychain', 'Minimalist keychain with Git logo. Perfect for keeping your keys and Git skills together.', 299, 399, 
 ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=600&fit=crop'], 
 'accessories', ARRAY['One Size'], ARRAY['Silver', 'Black', 'Gold'], 75, false, 'unisex', 
 ARRAY['keychain', 'git', 'minimal']),

('Engineer Notebook', 'Dot-grid notebook designed for sketching algorithms, system designs, and taking notes.', 599, 799, 
 ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=600&fit=crop'], 
 'accessories', ARRAY['A5', 'A4'], ARRAY['Black', 'Gray', 'Blue'], 60, true, 'unisex', 
 ARRAY['notebook', 'engineering', 'notes'])
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check admin user status
SELECT 
    'Admin Status Check' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) 
        THEN 'SUCCESS - User is admin and can manage products'
        ELSE 'FAILED - User is not admin'
    END as result;

-- Show current admin users
SELECT 
    'Current Admin Users' as info,
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users; 