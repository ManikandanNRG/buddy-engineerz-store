'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  tags: string[]
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Essential T-Shirts Every Engineer Needs in Their Professional Wardrobe',
    excerpt: 'Discover the must-have t-shirt styles that combine comfort, quality, and professional appeal for modern engineers. From casual office wear to weekend essentials.',
    content: '',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-27',
    tags: ['engineer fashion', 't-shirts', 'professional wear', 'wardrobe essentials'],
    slug: 'essential-tshirts-engineer-wardrobe-2024'
  },
  {
    id: '2',
    title: 'The Buddy Engineerz Story: Redefining Professional Fashion for Engineers',
    excerpt: 'Discover how Buddy Engineerz became the go-to fashion brand for engineers and technical professionals who want quality, style, and comfort in their wardrobe.',
    content: '',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-27',
    tags: ['buddy engineerz', 'brand story', 'engineering fashion', 'professional apparel'],
    slug: 'buddy-engineerz-brand-story'
  },
  {
    id: '3',
    title: 'Engineering Fashion Trends: What Professionals Are Wearing in 2024',
    excerpt: 'Explore the latest fashion trends in the engineering industry. From modern office casual to conference-ready outfits, discover how professionals are expressing their style.',
    content: '',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-26',
    tags: ['engineering fashion', 'professional trends', 'workplace style'],
    slug: 'engineering-fashion-trends-2024'
  },
  {
    id: '4',
    title: 'The Perfect Hoodie for Modern Engineers: Comfort Meets Style',
    excerpt: 'Discover how to choose the perfect hoodie that balances comfort, quality, and professional appeal. Essential guide for building your engineering wardrobe.',
    content: '',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-25',
    tags: ['hoodies', 'engineer comfort', 'professional casual'],
    slug: 'perfect-hoodie-modern-engineers'
  },
  {
    id: '5',
    title: 'Ultimate Gift Guide for Engineers and Technical Professionals',
    excerpt: 'Find the perfect apparel gifts for the engineers in your life. From premium basics to stylish accessories, discover thoughtful gifts they will actually wear.',
    content: '',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-24',
    tags: ['engineer gifts', 'professional apparel', 'gift guide'],
    slug: 'ultimate-gift-guide-engineers'
  },
  {
    id: '6',
    title: 'How to Style Engineering Apparel for Different Occasions',
    excerpt: 'Learn how to style your engineering apparel for various occasions - from casual office days to professional conferences and networking events.',
    content: '',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-23',
    tags: ['engineering fashion', 'styling tips', 'professional wear'],
    slug: 'style-engineering-apparel-different-occasions'
  },
  {
    id: '7',
    title: 'Building a Professional Wardrobe: Engineering Edition',
    excerpt: 'Essential guide to building a versatile, professional wardrobe that works for modern engineers. From office basics to weekend essentials.',
    content: '',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-22',
    tags: ['professional wardrobe', 'engineer fashion', 'wardrobe building'],
    slug: 'building-professional-wardrobe-engineers'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Engineering Fashion Blog
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              Insights, trends, and guides for the modern tech professional
            </p>
            <p className="text-lg text-purple-200">
              Discover the latest in programming fashion, developer culture, and tech lifestyle
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative aspect-video">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest articles about engineering fashion, developer trends, and tech culture delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 