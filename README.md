# Buddy Engineerz - Engineering Fashion Ecommerce Store

A modern, full-featured ecommerce platform for the Buddy Engineerz clothing brand, built with Next.js 14, React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Phase 1 - MVP (Current)
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Professional header with navigation and search
- ✅ Engaging homepage with hero section
- ✅ Featured products and categories
- ✅ Shopping cart with Zustand state management
- ✅ Supabase integration setup
- ✅ TypeScript for type safety
- ✅ Component-based architecture

### Phase 2 - Advanced Features (Upcoming)
- 🔄 Product catalog with filtering and search
- 🔄 Product details pages with image galleries
- 🔄 User authentication with Supabase Auth
- 🔄 Checkout process with Razorpay integration
- 🔄 Order management and tracking
- 🔄 Admin dashboard for product management
- 🔄 Reviews and ratings system
- 🔄 Wishlist functionality
- 🔄 Email notifications
- 🔄 Advanced analytics

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buddy-engineerz-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Razorpay Configuration
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Buddy Engineerz

   # Email Configuration (optional)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASSWORD=your_smtp_password
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase database:

   ```sql
   -- Products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     images TEXT[] DEFAULT '{}',
     category VARCHAR(100) NOT NULL,
     sizes TEXT[] DEFAULT '{}',
     colors TEXT[] DEFAULT '{}',
     stock INTEGER DEFAULT 0,
     featured BOOLEAN DEFAULT false,
     gender VARCHAR(10) CHECK (gender IN ('men', 'women', 'unisex')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Users table (extends Supabase auth.users)
   CREATE TABLE user_profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     name VARCHAR(255),
     phone VARCHAR(20),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Addresses table
   CREATE TABLE addresses (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     name VARCHAR(255) NOT NULL,
     phone VARCHAR(20) NOT NULL,
     address_line_1 VARCHAR(255) NOT NULL,
     address_line_2 VARCHAR(255),
     city VARCHAR(100) NOT NULL,
     state VARCHAR(100) NOT NULL,
     pincode VARCHAR(10) NOT NULL,
     country VARCHAR(100) DEFAULT 'India',
     is_default BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Orders table
   CREATE TABLE orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     items JSONB NOT NULL,
     total DECIMAL(10,2) NOT NULL,
     status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
     payment_id VARCHAR(255),
     shipping_address JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
   CREATE POLICY "User profiles are viewable by users themselves" ON user_profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
   CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
buddy-engineerz-store/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Cart page
│   │   ├── checkout/          # Checkout flow
│   │   └── admin/             # Admin dashboard
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utility functions
│   │   ├── supabase.ts        # Supabase client
│   │   └── utils.ts           # Helper functions
│   ├── store/                 # Zustand stores
│   │   └── cart.ts            # Cart state management
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🎨 Design System

The application uses a modern design system with:

- **Colors**: Engineering-themed gradients and professional color palette
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable UI components built with Radix UI
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 compliant components

## 🔧 Development

### Adding New Products
1. Use the Supabase dashboard to add products to the `products` table
2. Or build the admin dashboard (Phase 2) for easier management

### Customizing Styles
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Edit component files for specific styling

### Adding New Pages
- Create new directories in `src/app/` following Next.js 14 App Router conventions
- Add page.tsx files for new routes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Supabase](https://supabase.com/) for the backend-as-a-service
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide React](https://lucide.dev/) for beautiful icons

## 📞 Support

For support, email support@buddyengineerz.com or join our Slack channel.

---

Built with ❤️ by the Buddy Engineerz team
