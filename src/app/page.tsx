import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code, Cpu, Zap, Shield, Truck, RefreshCw } from 'lucide-react'

export default function HomePage() {
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
      id: '1',
      name: 'Algorithm Tee',
      description: 'Premium cotton tee with minimalist algorithm design',
      price: 999,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
      badge: 'Best Seller'
    },
    {
      id: '2',
      name: 'Code Hoodie',
      description: 'Comfortable hoodie perfect for coding sessions',
      price: 1999,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
      badge: 'New'
    },
    {
      id: '3',
      name: 'Binary Mug',
      description: 'Start your day with binary coffee',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center',
      badge: 'Limited'
    }
  ]

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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                View Collection
              </Button>
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
              <Link key={category.id} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
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
              Our most popular items loved by the engineering community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">₹{product.price}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      </div>
                      <Button size="sm">Add to Cart</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="outline">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Cpu className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Engineering Community
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Get exclusive access to new releases, engineering memes, and special discounts for our community members.
            </p>
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
