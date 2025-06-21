# 🚀 Admin Dashboard Setup Guide

## Phase 1: Admin Authentication & Layout ✅

### What's Included

1. **Admin Authentication System**
   - Secure login with role-based access control
   - Admin user management with `admin` and `super_admin` roles
   - Protected routes with middleware
   - Session management and auto-logout

2. **Dashboard Layout**
   - Responsive sidebar navigation
   - Professional header with user info
   - Mobile-friendly design
   - Modern UI with Tailwind CSS

3. **Dashboard Overview**
   - Real-time statistics (orders, revenue, products, customers)
   - Recent orders display
   - Quick action buttons
   - Welcome message with user info

## 🛠️ Setup Instructions

### Step 1: Database Setup

1. **Run the admin setup SQL** in your Supabase SQL Editor:
   ```bash
   # Copy and paste the contents of admin-setup.sql into Supabase SQL Editor
   ```

2. **Create your first admin user**:
   - Go to Supabase Auth → Users
   - Click "Add User" 
   - Use email: `admin@buddyengineerz.com` (or your preferred admin email)
   - Set a strong password
   - The trigger will automatically create the admin_users record

### Step 2: Environment Variables

Make sure your `.env.local` has the Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Install Dependencies

```bash
npm install @supabase/auth-helpers-nextjs
# (Already installed in your project)
```

### Step 4: Test the Admin Dashboard

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Access the admin panel**:
   - Go to: `http://localhost:3000/admin/login`
   - Login with your admin credentials
   - You'll be redirected to: `http://localhost:3000/admin/dashboard`

## 🔐 Security Features

- **Route Protection**: Middleware automatically protects all `/admin/*` routes
- **Role-Based Access**: Only users in `admin_users` table can access admin panel
- **Session Management**: Automatic logout on session expiry
- **RLS Policies**: Row-level security on admin_users table

## 📱 Features

### Current Features (Phase 1)
- ✅ Admin login/logout
- ✅ Dashboard overview with stats
- ✅ Responsive sidebar navigation
- ✅ Recent orders display
- ✅ Quick action buttons
- ✅ User profile display

### Navigation Menu
- Dashboard (overview)
- Products (coming in Phase 2)
- Orders (coming in Phase 2)
- Customers (coming in Phase 2)
- Categories (coming in Phase 2)
- Analytics (coming in Phase 2)
- Settings (coming in Phase 2)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading animations
- **Toast Notifications**: User feedback for actions
- **Consistent Branding**: Purple theme matching your store

## 🔧 Customization

### Adding New Admin Users

1. **Automatic Method** (Recommended):
   - Create user in Supabase Auth with email ending in `@buddyengineerz.com`
   - The trigger will automatically create admin record

2. **Manual Method**:
   ```sql
   INSERT INTO admin_users (id, email, name, role) 
   VALUES ('user-uuid-from-auth', 'admin@example.com', 'Admin Name', 'admin');
   ```

### Changing Admin Email Domain

Edit the trigger function in `admin-setup.sql`:
```sql
IF NEW.email LIKE '%@yourdomain.com' OR NEW.email = 'admin@yourdomain.com' THEN
```

## 🚀 Next Steps (Phase 2)

1. **Product Management**
   - Add/Edit/Delete products
   - Bulk operations
   - Image upload
   - Inventory management

2. **Order Management**
   - View all orders
   - Update order status
   - Order details
   - Customer communication

3. **Customer Management**
   - View customer list
   - Customer details
   - Order history

## 🐛 Troubleshooting

### Common Issues

1. **"Access denied" error**:
   - Make sure user exists in `admin_users` table
   - Check if `is_active` is `true`

2. **Redirect loop on login**:
   - Clear browser cookies
   - Check Supabase connection

3. **Stats not loading**:
   - Verify database tables exist
   - Check browser console for errors

### Debug Mode

Add this to your `.env.local` for debugging:
```env
NEXT_PUBLIC_DEBUG_ADMIN=true
```

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase connection
3. Ensure admin user is properly set up
4. Check middleware logs

---

**🎉 Congratulations!** Your admin dashboard Phase 1 is now ready. You have a secure, professional admin panel with authentication and a beautiful dashboard overview. 