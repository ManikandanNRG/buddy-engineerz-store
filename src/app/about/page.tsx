import Image from 'next/image'
import Link from 'next/link'
import { 
  Code, 
  Users, 
  Zap, 
  Heart, 
  Globe, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Buddy Engineerz
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8">
              Empowering the global engineering community with premium apparel that celebrates code, creativity, and innovation.
            </p>
            <div className="flex items-center justify-center gap-8 text-purple-200">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm">Happy Engineers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-sm">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Buddy Engineerz was born from a simple observation: engineers and developers are some of the most creative, 
                    passionate, and innovative people in the world, yet there was no premium apparel brand that truly celebrated 
                    their unique culture and achievements.
                  </p>
                  <p>
                    Founded in 2024 by a team of software engineers and designers, we set out to create more than just clothing. 
                    We wanted to build a brand that engineers could wear with pride, whether they're debugging code at 3 AM, 
                    presenting at a tech conference, or just hanging out with fellow developers.
                  </p>
                  <p>
                    Every design tells a story. From our iconic "Algorithm Tee" to the beloved "Debug Mode Hoodie," 
                    each piece is crafted with attention to detail and a deep understanding of engineering culture.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Code className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Code-Inspired</div>
                      <div className="text-sm text-gray-600">Designs</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Community</div>
                      <div className="text-sm text-gray-600">Driven</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Innovation</div>
                      <div className="text-sm text-gray-600">Focused</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Passion</div>
                      <div className="text-sm text-gray-600">Powered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600">
              We're on a mission to celebrate and empower the global engineering community through premium apparel and accessories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Community</h3>
              <p className="text-gray-600">
                Connecting engineers worldwide through shared experiences, inside jokes, and the universal language of code.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Using only the finest materials and sustainable practices to create apparel that's as durable as your code.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Engineer First</h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for the engineering community we proudly serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
              <p className="text-xl text-gray-600">
                We're not just another apparel brand. We're engineers creating for engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Authentic Engineering Culture</h3>
                    <p className="text-gray-600">
                      Our designs are created by engineers who understand the culture, humor, and daily experiences of the tech world.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Premium Materials</h3>
                    <p className="text-gray-600">
                      We use only the highest quality fabrics and printing techniques to ensure your apparel looks great and lasts long.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sustainable Practices</h3>
                    <p className="text-gray-600">
                      We're committed to environmental responsibility with eco-friendly materials and ethical manufacturing processes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                    <p className="text-gray-600">
                      Our product roadmap is influenced by feedback from our community of engineers, developers, and tech enthusiasts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">By the Numbers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold text-gray-900">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repeat Customers</span>
                    <span className="font-semibold text-gray-900">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">5-Star Reviews</span>
                    <span className="font-semibold text-gray-900">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Global Shipping</span>
                    <span className="font-semibold text-gray-900">25+ Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600">
              A diverse group of engineers, designers, and creators passionate about celebrating engineering culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Arjun Kumar</h3>
              <p className="text-purple-600 mb-2">Co-Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Full-stack engineer with 8+ years experience. Passionate about building products that engineers love.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">PS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Priya Sharma</h3>
              <p className="text-blue-600 mb-2">Co-Founder & CTO</p>
              <p className="text-gray-600 text-sm">
                DevOps engineer and design enthusiast. Ensures our platform scales as beautifully as our designs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">RG</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Rahul Gupta</h3>
              <p className="text-green-600 mb-2">Head of Design</p>
              <p className="text-gray-600 text-sm">
                Creative director with a background in both graphic design and software engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Buddy Engineerz Community</h2>
            <p className="text-xl text-purple-100 mb-8">
              Ready to wear your passion for engineering? Explore our collection and become part of the global engineering community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-medium"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 