import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Tag, Share2, Heart, Code, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Buddy Engineerz Story: From Code to Fashion | Engineering Apparel Brand',
  description: 'Discover the story behind Buddy Engineerz - the premium engineering fashion brand created by developers, for developers. Learn about our mission to celebrate engineering culture through premium apparel.',
  keywords: ['buddy engineerz', 'engineering fashion brand', 'developer clothing', 'programming apparel', 'tech fashion story', 'engineering culture'],
  openGraph: {
    title: 'The Buddy Engineerz Story: From Code to Fashion',
    description: 'Discover the story behind Buddy Engineerz - the premium engineering fashion brand created by developers, for developers.',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop'],
    type: 'article',
  },
}

export default function BrandStoryPage() {
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
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  <Tag className="h-3 w-3" />
                  buddy engineerz
                </span>
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  <Tag className="h-3 w-3" />
                  brand story
                </span>
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  <Tag className="h-3 w-3" />
                  engineering fashion
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                The Buddy Engineerz Story: From Code to Fashion
              </h1>
              
              <div className="flex items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Buddy Engineerz Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 27, 2024</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover how Buddy Engineerz became the go-to brand for engineers, developers, and tech enthusiasts who want to wear their passion with pride.
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
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop"
              alt="Buddy Engineerz - Engineering Fashion Brand Story"
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
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Birth of Buddy Engineerz</h2>
              
              <p className="mb-4 text-gray-700 leading-relaxed">
                In 2024, a group of passionate software engineers and designers came together with a shared frustration: there was no premium apparel brand that truly understood and celebrated engineering culture. While other industries had their iconic fashion brands, engineers were left with generic tech company swag or low-quality novelty t-shirts.
              </p>

              <p className="mb-4 text-gray-700 leading-relaxed">
                That's when <strong>Buddy Engineerz</strong> was born – not just as a clothing brand, but as a movement to celebrate the creativity, innovation, and unique culture of engineers worldwide.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Makes Buddy Engineerz Special</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Authentic Engineering Culture</h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Unlike other brands that simply slap code snippets on t-shirts, Buddy Engineerz designs are created by engineers who live and breathe the culture. Every design tells a story that resonates with developers, from the frustration of debugging to the joy of a successful deployment.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Premium Quality, Engineer-Tested</h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                We understand that engineers value quality and durability. That's why every Buddy Engineerz product is crafted with premium materials and tested by real engineers for comfort during those long coding sessions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Community-Driven Design</h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                The Buddy Engineerz community actively participates in our design process. From suggesting new concepts to voting on upcoming releases, our customers are true partners in building the brand.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Signature Collections</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Algorithm Collection</h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Our flagship Algorithm Tee started it all. With its clean, minimalist design featuring elegant algorithm flowcharts, it quickly became a favorite among developers who appreciate both style and substance.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Debug Mode Essentials</h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Perfect for those marathon coding sessions, our Debug Mode Hoodie and comfort wear collection ensures you stay comfortable while solving the world's most complex problems.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Coffee & Code Accessories</h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                From our Binary Mug featuring the molecular structure of caffeine to laptop stickers that showcase your favorite programming languages, our accessories complete the engineer lifestyle.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Buddy Engineerz Community</h2>

              <p className="mb-4 text-gray-700 leading-relaxed">
                Today, <strong>Buddy Engineerz</strong> is worn by over 10,000 engineers across 25+ countries. From Silicon Valley startups to tech giants in Bangalore, from freelance developers in Berlin to engineering students in São Paulo – our community spans the globe.
              </p>

              <p className="mb-4 text-gray-700 leading-relaxed">
                What unites us isn't just our love for well-designed apparel, but our shared passion for engineering, innovation, and the belief that code can change the world.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Looking Forward: The Future of Engineering Fashion</h2>

              <p className="mb-4 text-gray-700 leading-relaxed">
                As we continue to grow, <strong>Buddy Engineerz</strong> remains committed to our core mission: celebrating and empowering the global engineering community through premium apparel that tells our story.
              </p>

              <p className="mb-4 text-gray-700 leading-relaxed">
                We're working on exciting new collections, sustainable manufacturing processes, and innovative designs that push the boundaries of what engineering fashion can be. Because at Buddy Engineerz, we believe that great engineers deserve great apparel.
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 my-8">
                <p className="text-purple-800 font-medium">
                  "Buddy Engineerz isn't just about clothing – it's about wearing your passion, connecting with fellow engineers, and celebrating the culture that drives innovation forward."
                </p>
                <p className="text-purple-600 text-sm mt-2">— The Buddy Engineerz Team</p>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join the Buddy Engineerz Movement</h2>

              <p className="mb-4 text-gray-700 leading-relaxed">
                Whether you're a seasoned software architect, a passionate full-stack developer, a data scientist, or an engineering student just starting your journey, there's a place for you in the Buddy Engineerz community.
              </p>

              <p className="mb-4 text-gray-700 leading-relaxed">
                Explore our collections, share your engineering stories, and help us continue building the premier fashion brand for the global engineering community.
              </p>

            </div>
            
            {/* Share Section */}
            <div className="border-t border-gray-200 mt-12 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Share the Buddy Engineerz Story</h3>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Buddy Engineerz Community?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Discover premium engineering apparel designed by developers, for developers. Wear your passion with pride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 