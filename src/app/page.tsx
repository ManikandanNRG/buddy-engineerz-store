'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code, Cpu, Zap, Shield, Truck, RefreshCw } from 'lucide-react'
import NewsletterSubscription from '@/components/NewsletterSubscription'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'
import Head from 'next/head'

export default function HomePage() {
  const { addItem } = useCartStore()
  const categories = [
    {
      id: 'tshirts',
      name: 'T-Shirts',
      description: 'Code in comfort',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&crop=center',
      href: '/products?category=tshirts'
    },
    {
      id: 'hoodies',
      name: 'Hoodies',
      description: 'Debug mode activated',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop&crop=center',
      href: '/products?category=hoodies'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      description: 'Level up your setup',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop&crop=center',
      href: '/products?category=accessories'
    }
  ]

  const featuredProducts = [
    {
      id: 'featured-1',
      name: 'Algorithm Tee',
      description: 'Premium cotton tee with minimalist algorithm design',
      price: 999,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
      badge: 'Best Seller',
      category: 'tshirts',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      stock: 10
    },
    {
      id: 'featured-2',
      name: 'Code Hoodie',
      description: 'Comfortable hoodie perfect for coding sessions',
      price: 1999,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
      badge: 'New',
      category: 'hoodies',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Gray', 'Black'],
      stock: 15
    },
    {
      id: 'featured-3',
      name: 'Binary Mug',
      description: 'Start your day with binary coffee',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center',
      badge: 'Limited',
      category: 'accessories',
      sizes: ['One Size'],
      colors: ['White'],
      stock: 5
    }
  ]

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: [product.image],
        category: product.category,
        sizes: product.sizes,
        colors: product.colors,
        stock: product.stock,
        featured: false,
        gender: 'unisex',
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      product.sizes[0], // Default to first available size
      product.colors[0], // Default to first available color
      1 // quantity
    )
    
    toast.success(`${product.name} added to cart!`)
  }

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Shipping',
      description: 'On orders over ₹999'
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Payment',
      description: 'SSL encrypted checkout'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast Delivery',
      description: '2-3 business days'
    }
  ]

  return (
    <>
      {/* SEO Structured Data */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Buddy Engineerz",
              "description": "Premium engineering-themed apparel for developers and tech enthusiasts",
              "url": "https://buddyengineerz.com",
              "logo": "https://buddyengineerz.com/images/logo.png",
              "image": "https://buddyengineerz.com/images/og-image.jpg",
              "priceRange": "₹599-₹2499",
              "currenciesAccepted": "INR",
              "paymentAccepted": ["Credit Card", "Debit Card", "UPI", "Net Banking"],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Engineering Fashion Collection",
                "itemListElement": featuredProducts.map(product => ({
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": product.image,
                    "brand": "Buddy Engineerz",
                    "category": product.category
                  },
                  "price": product.price,
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock"
                }))
              }
            })
          }}
        />
      </Head>

      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-8 h-8 text-blue-400" />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400">
                  New Collection
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Engineering
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {' '}Fashion
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
                Where code meets style. Premium apparel designed for developers, engineers, and tech enthusiasts who want to wear their passion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated collections designed for the modern engineer
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} href={category.href} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={category.image}
                        alt={`${category.name} - ${category.description}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="mb-2">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our most popular items loved by engineers worldwide
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden relative">
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <Badge className="absolute top-3 left-3 bg-primary">
                      {product.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <Link href={`/products/${product.id}`}>
                      <CardTitle className="mb-2 hover:text-primary transition-colors">{product.name}</CardTitle>
                    </Link>
                    <CardDescription className="mb-4">{product.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <Button 
                        onClick={(e) => handleAddToCart(product, e)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline">
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Buddy Engineerz</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We understand the passion that drives engineers and developers. Our mission is to create premium apparel that celebrates the engineering mindset and allows you to wear your expertise with pride.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  From algorithm-inspired designs to witty programming jokes, every piece in our collection is crafted with attention to detail and quality that engineers appreciate.
                </p>
                <Link href="/about">
                  <Button size="lg">
                    Learn More About Us
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
                  alt="Engineering team collaboration"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <NewsletterSubscription />
          </div>
        </section>
      </div>
    </>
  )
}
