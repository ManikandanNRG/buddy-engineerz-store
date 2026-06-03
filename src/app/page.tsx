import Link from 'next/link'
import { ArrowRight, Code, Cpu, Zap, Shield, Truck, RefreshCw, Star, Users, Award, Package } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import HomepageClient from './HomepageClient'
import type { Product } from '@/lib/supabase'
import NewsletterSubscription from '@/components/NewsletterSubscription'

// Server-side Supabase for static data fetch
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabaseServer
    .from('products')
    .select('*')
    .eq('featured', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!data || data.length === 0) {
    // Fallback: latest 3 products
    const { data: fallback } = await supabaseServer
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
    return (fallback as Product[]) || []
  }
  return data as Product[]
}

const categories = [
  {
    id: 'tshirts',
    name: 'T-Shirts',
    description: 'Code in comfort',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&crop=center',
    href: '/products?category=tshirts',
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    description: 'Debug mode activated',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop&crop=center',
    href: '/products?category=hoodies',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Level up your setup',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop&crop=center',
    href: '/products?category=accessories',
  },
]

const stats = [
  { icon: Users, value: '5,000+', label: 'Engineers Dressed' },
  { icon: Star, value: '4.8★', label: 'Average Rating' },
  { icon: Package, value: '50+', label: 'Products' },
  { icon: Award, value: '30-Day', label: 'Easy Returns' },
]

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹999' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Shield, title: 'Secure Payment', description: 'SSL encrypted checkout' },
  { icon: Zap, title: 'Fast Delivery', description: '2-3 business days' },
]

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&crop=top"
          alt="Engineering fashion hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-950/80 to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Floating code pill — decorative */}
        <div className="absolute top-12 right-12 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-mono">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          git push origin main
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Code className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200 text-sm font-medium">New Summer Collection 2026</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05]">
              Wear Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                Passion.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Premium engineering-themed apparel crafted for developers, engineers, and tech enthusiasts.
              Express your code in style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 hover:-translate-y-0.5 active:translate-y-0"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/sale"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 backdrop-blur-sm"
              >
                View Sale 🔥
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── FEATURES STRIP ─────────────────────────────────── */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / STATS ─────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950 text-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-purple-300 text-sm font-semibold uppercase tracking-widest mb-10">
            Trusted by engineers worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-purple-300" />
                </div>
                <p className="text-3xl font-black mb-1">{s.value}</p>
                <p className="text-purple-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-purple-600 text-sm font-bold uppercase tracking-widest mb-3">Collections</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Carefully curated collections designed for the modern engineer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={cat.href} className="group relative overflow-hidden rounded-3xl aspect-[3/4] block">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Content on top of image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/70 text-sm mb-1">{cat.description}</p>
                  <h3 className="text-white text-2xl font-black mb-3">{cat.name}</h3>
                  <span className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (LIVE FROM DB) ─────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-purple-600 text-sm font-bold uppercase tracking-widest mb-3">Handpicked</p>
              <h2 className="text-4xl font-black text-gray-900">Featured Products</h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Client component renders interactive product cards */}
          <HomepageClient featuredProducts={featuredProducts} />
        </div>
      </section>

      {/* ─── ABOUT STRIP ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-purple-600 text-sm font-bold uppercase tracking-widest mb-4">Our Story</p>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Built by Engineers,<br />for Engineers</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                We understand the passion that drives engineers and developers. Our mission is to create premium apparel
                that celebrates the engineering mindset — from algorithm-inspired designs to witty programming jokes.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Every piece is crafted with the attention to detail and quality that engineers appreciate.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-purple-700 transition-colors duration-200"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=500&fit=crop&crop=center"
                alt="Engineering team"
                className="rounded-3xl shadow-2xl w-full"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-900">"Best merch for devs!"</p>
                <p className="text-xs text-gray-500 mt-0.5">— Priya S., Senior Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <NewsletterSubscription />
        </div>
      </section>
    </div>
  )
}
