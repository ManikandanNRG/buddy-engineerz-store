# 🗄️ Buddy Engineerz Database Setup Guide

This guide will help you set up the complete database schema for the Buddy Engineerz Store.

## 📋 Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **New Project**: Create a new Supabase project
3. **Environment Variables**: Update your `.env.local` file with Supabase credentials

## 🚀 Quick Setup (Recommended)

### Step 1: Run Complete Database Setup

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `complete-database-setup.sql`
4. Click **Run** to execute the script

This will create:
- ✅ All required tables
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Sample data (15 products)
- ✅ Admin user system
- ✅ Triggers and functions

### Step 2: Add Yourself as Admin User

After running the main setup, execute this SQL to add yourself as an admin:

```sql
-- Replace with your actual email address
INSERT INTO admin_users (id, email, name, role, is_active)
VALUES (
  auth.uid(),
  'your-email@example.com',  -- Replace with your email
  'Your Name',               -- Replace with your name
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
```

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `admin_users` | Admin authentication | Role-based access control |
| `categories` | Product categories | T-Shirts, Hoodies, Accessories |
| `products` | Product catalog | 15 engineering-themed products |
| `user_profiles` | Customer profiles | Extended user information |
| `addresses` | Shipping addresses | Multiple addresses per user |
| `orders` | Order management | Complete order tracking |

### Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Admin Policies**: Separate policies for admin operations
- **User Isolation**: Users can only access their own data
- **Public Access**: Products and categories are publicly viewable

## 🔧 Manual Setup (Alternative)

If you prefer to run scripts individually:

### 1. Core Tables
```bash
# Run in this order:
1. admin-setup.sql          # Admin users table
2. database-setup.sql       # Core tables and data
3. setup-categories.sql     # Categories with sample data
```

### 2. Fixes and Enhancements
```bash
# Optional fixes if needed:
1. fix-addresses-table.sql  # Address table fixes
2. fix-product-rls.sql      # Product access fixes
3. fix-admin-orders-access.sql  # Admin order access
```

## 🧪 Testing the Setup

### 1. Verify Tables Created
```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### 2. Check Sample Data
```sql
-- Verify products were inserted
SELECT COUNT(*) as product_count FROM products;

-- Verify categories were inserted
SELECT COUNT(*) as category_count FROM categories;

-- Check admin users
SELECT email, name, role FROM admin_users;
```

### 3. Test RLS Policies
```sql
-- Test public access to products
SELECT COUNT(*) FROM products;

-- Test categories access
SELECT COUNT(*) FROM categories;
```

## 🔐 Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🚨 Troubleshooting

### Common Issues

#### 1. RLS Policy Errors
```sql
-- If you get permission denied errors, check RLS policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('products', 'categories', 'orders');
```

#### 2. Admin Access Issues
```sql
-- Verify you're added as admin:
SELECT * FROM admin_users WHERE email = 'your-email@example.com';

-- If not found, run the admin insert script again
```

#### 3. Missing Categories
```sql
-- If categories are missing:
INSERT INTO categories (name, description, image_url) VALUES 
('T-Shirts', 'Engineering T-Shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
('Hoodies', 'Engineering Hoodies', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
('Accessories', 'Engineering Accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400')
ON CONFLICT (name) DO NOTHING;
```

#### 4. Product Access Issues
```sql
-- Reset product policies if needed:
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products 
  FOR SELECT USING (true);
```

## 📈 Performance Optimization

The setup includes these performance indexes:

```sql
-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Order indexes  
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
```

## ✅ Verification Checklist

After setup, verify:

- [ ] All tables created successfully
- [ ] Sample products (15) are visible
- [ ] Categories (3-5) are created
- [ ] Admin user added with your email
- [ ] RLS policies are working
- [ ] No permission errors in console
- [ ] Can access admin panel
- [ ] Public pages load products

## 🆘 Need Help?

If you encounter issues:

1. **Check Supabase Logs**: Go to Logs section in Supabase dashboard
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Look for failed API requests
4. **Database Tab**: Verify table structure in Supabase

## 🔄 Reset Database (If Needed)

To start fresh:

```sql
-- ⚠️ WARNING: This will delete all data!
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Then run complete-database-setup.sql again
```

---

**Next Step**: After database setup, you can run the application with `npm run dev` and access the admin panel at `/admin/login`. 