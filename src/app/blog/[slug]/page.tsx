import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react'

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
    title: 'Top 10 Programming T-Shirts Every Developer Needs in 2024',
    excerpt: 'Discover the most popular programming t-shirts that showcase your coding skills and passion for technology. From minimalist designs to witty programming jokes.',
    content: `As a developer, your wardrobe speaks volumes about your passion for coding and technology. Whether you're working from home, attending a tech conference, or just grabbing coffee with fellow developers, the right programming t-shirt can be a great conversation starter and a way to express your personality.

Programming t-shirts are more than just clothing – they're a form of self-expression in the tech community. They can start conversations with fellow developers, show your expertise in specific technologies, express your sense of humor about coding challenges, and build community within the tech world.

Here are our top 10 picks for 2024:

**1. The Classic "Hello World" Tee**
Every developer's journey starts with "Hello World" – make it yours with this timeless design.

**2. Minimalist Algorithm Flowchart**
Clean, simple, and elegant – perfect for developers who appreciate good design.

**3. "There Are Only 10 Types of People" Binary Joke**
A classic programming joke that never gets old.

**4. Stack Overflow Survivor**
For those who've survived countless debugging sessions with the help of Stack Overflow.

**5. Git Commit Messages**
Featuring hilarious real-world git commit messages that every developer can relate to.

**6. Programming Language Hierarchy**
Show your favorite programming language with style.

**7. "99 Little Bugs in the Code"**
The programmer's version of the classic song – frustratingly accurate.

**8. Caffeine Molecule Structure**
Because every developer knows the molecular structure of their fuel.

**9. Error 404: Sleep Not Found**
Perfect for those late-night coding sessions.

**10. Code Quality Meter**
Let everyone know the quality of your code with this humorous meter design.

When choosing programming t-shirts, consider fabric quality (look for 100% cotton or cotton blends), print durability (ensure designs won't fade after washing), fit (choose cuts that are comfortable for long coding sessions), and brand reputation (support companies that understand developer culture).

Programming t-shirts are a fun and practical way to express your passion for coding. Whether you prefer subtle references or bold statements, there's a design out there that perfectly captures your developer personality.

Ready to upgrade your developer wardrobe? Check out our collection of premium programming t-shirts designed by developers, for developers.`,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-27',
    tags: ['programming', 't-shirts', 'developer fashion', 'coding'],
    slug: 'top-10-programming-tshirts-2024'
  },
  {
    id: '2',
    title: 'The Buddy Engineerz Story: From Code to Fashion',
    excerpt: 'Discover how Buddy Engineerz became the go-to brand for engineers, developers, and tech enthusiasts who want to wear their passion with pride.',
    content: `In 2024, a group of passionate software engineers and designers came together with a shared frustration: there was no premium apparel brand that truly understood and celebrated engineering culture. That's when Buddy Engineerz was born – not just as a clothing brand, but as a movement to celebrate the creativity, innovation, and unique culture of engineers worldwide.

**What Makes Buddy Engineerz Special**

Unlike other brands that simply slap code snippets on t-shirts, Buddy Engineerz designs are created by engineers who live and breathe the culture. Every design tells a story that resonates with developers, from the frustration of debugging to the joy of a successful deployment.

**Our Signature Collections**

Our flagship Algorithm Tee started it all. With its clean, minimalist design featuring elegant algorithm flowcharts, it quickly became a favorite among developers who appreciate both style and substance.

**The Buddy Engineerz Community**

Today, Buddy Engineerz is worn by over 10,000 engineers across 25+ countries. From Silicon Valley startups to tech giants in Bangalore, from freelance developers in Berlin to engineering students in São Paulo – our community spans the globe.

What unites us isn't just our love for well-designed apparel, but our shared passion for engineering, innovation, and the belief that code can change the world.

Join the Buddy Engineerz movement and wear your passion with pride.`,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
    author: 'Buddy Engineerz Team',
    publishedAt: '2024-12-27',
    tags: ['buddy engineerz', 'brand story', 'engineering fashion', 'developer community'],
    slug: 'buddy-engineerz-brand-story'
  }
]

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Buddy Engineerz Blog'
    }
  }

  return {
    title: `${post.title} | Buddy Engineerz Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    }
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  )
                }
                return (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>
            
            {/* Share Section */}
            <div className="border-t border-gray-200 mt-12 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Developer Wardrobe?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Discover our collection of premium programming t-shirts designed by developers, for developers.
          </p>
          <Link
            href="/products?category=tshirts"
            className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Programming T-Shirts
          </Link>
        </div>
      </div>
    </div>
  )
} 