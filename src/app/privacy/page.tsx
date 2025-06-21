import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Mail, 
  Database,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-purple-100">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-purple-200 mt-4">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Overview */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy at a Glance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Lock className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Data</h3>
                <p className="text-gray-600">We use industry-standard encryption to protect your personal information</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Eye className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-gray-600">We clearly explain what data we collect and how we use it</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Control</h3>
                <p className="text-gray-600">You can access, update, or delete your personal data anytime</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contents</h3>
              <nav className="space-y-2">
                <a href="#information-collection" className="block text-sm text-gray-600 hover:text-purple-600">
                  Information We Collect
                </a>
                <a href="#how-we-use" className="block text-sm text-gray-600 hover:text-purple-600">
                  How We Use Information
                </a>
                <a href="#information-sharing" className="block text-sm text-gray-600 hover:text-purple-600">
                  Information Sharing
                </a>
                <a href="#data-security" className="block text-sm text-gray-600 hover:text-purple-600">
                  Data Security
                </a>
                <a href="#cookies" className="block text-sm text-gray-600 hover:text-purple-600">
                  Cookies & Tracking
                </a>
                <a href="#your-rights" className="block text-sm text-gray-600 hover:text-purple-600">
                  Your Rights
                </a>
                <a href="#contact" className="block text-sm text-gray-600 hover:text-purple-600">
                  Contact Us
                </a>
              </nav>
            </div>
          </div>

          {/* Policy Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Information Collection */}
            <section id="information-collection" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Database className="h-6 w-6 text-purple-600" />
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <p className="text-gray-600 mb-3">
                    We collect information you provide directly to us, such as when you:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Create an account or make a purchase</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact our customer support</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">This includes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>• Name and contact information</div>
                      <div>• Billing and shipping addresses</div>
                      <div>• Payment information</div>
                      <div>• Order history and preferences</div>
                      <div>• Communication preferences</div>
                      <div>• Customer service interactions</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatic Information</h3>
                  <p className="text-gray-600 mb-3">
                    We automatically collect certain information when you visit our website:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Website usage and navigation patterns</li>
                    <li>Referral sources and search terms</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="how-we-use" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Processing & Fulfillment</h3>
                    <p className="text-gray-600">Process payments, ship orders, and provide customer support</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Account Management</h3>
                    <p className="text-gray-600">Create and maintain your account, personalize your experience</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Communication</h3>
                    <p className="text-gray-600">Send order updates, newsletters, and promotional offers (with your consent)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Website Improvement</h3>
                    <p className="text-gray-600">Analyze usage patterns to improve our website and services</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Legal Compliance</h3>
                    <p className="text-gray-600">Comply with legal obligations and protect our rights</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section id="information-sharing" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">We Never Sell Your Data</p>
                      <p className="text-blue-700 text-sm">
                        We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">We may share information with:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Service Providers</h4>
                      <p className="text-gray-600 text-sm">
                        Payment processors, shipping companies, and technology providers who help us operate our business
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Legal Requirements</h4>
                      <p className="text-gray-600 text-sm">
                        When required by law, court order, or to protect our rights and safety
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">Business Transfers</h4>
                      <p className="text-gray-600 text-sm">
                        In connection with a merger, acquisition, or sale of assets (with notice to you)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="h-6 w-6 text-green-600" />
                Data Security
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                    <p className="text-gray-600 text-sm">
                      All sensitive data is encrypted in transit and at rest using industry-standard protocols
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Access Controls</h3>
                    <p className="text-gray-600 text-sm">
                      Limited access to personal data on a need-to-know basis with regular access reviews
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Regular Audits</h3>
                    <p className="text-gray-600 text-sm">
                      Regular security assessments and monitoring to identify and address vulnerabilities
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Secure Infrastructure</h3>
                    <p className="text-gray-600 text-sm">
                      Hosting with reputable providers that maintain high security standards
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies & Tracking Technologies</h2>
              
              <div className="space-y-6">
                <p className="text-gray-600">
                  We use cookies and similar technologies to enhance your browsing experience and analyze website usage.
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Types of Cookies We Use:</h3>
                  <div className="space-y-3">
                    <div className="p-3 border-l-4 border-purple-400 bg-purple-50">
                      <h4 className="font-medium text-purple-900">Essential Cookies</h4>
                      <p className="text-purple-700 text-sm">Required for basic website functionality and security</p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                      <h4 className="font-medium text-blue-900">Performance Cookies</h4>
                      <p className="text-blue-700 text-sm">Help us understand how visitors interact with our website</p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-green-400 bg-green-50">
                      <h4 className="font-medium text-green-900">Functional Cookies</h4>
                      <p className="text-green-700 text-sm">Remember your preferences and personalize your experience</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Managing Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Your Privacy Rights
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  You have the following rights regarding your personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Access</h3>
                    <p className="text-gray-600 text-sm">
                      Request a copy of the personal information we hold about you
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                    <p className="text-gray-600 text-sm">
                      Update or correct inaccurate personal information
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                    <p className="text-gray-600 text-sm">
                      Request deletion of your personal information (subject to legal requirements)
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Portability</h3>
                    <p className="text-gray-600 text-sm">
                      Receive your data in a structured, machine-readable format
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Opt-out</h3>
                    <p className="text-gray-600 text-sm">
                      Unsubscribe from marketing communications at any time
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Restrict Processing</h3>
                    <p className="text-gray-600 text-sm">
                      Limit how we use your personal information
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="h-6 w-6 text-purple-600" />
                Contact Us About Privacy
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Privacy Officer</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Email: privacy@buddyengineerz.com</p>
                      <p>Phone: +91-XXX-XXX-XXXX</p>
                      <p>Response Time: Within 30 days</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Mailing Address</h3>
                    <div className="text-gray-600">
                      <p>Buddy Engineerz Privacy Team</p>
                      <p>[Address Line 1]</p>
                      <p>[City, State, PIN]</p>
                      <p>India</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Policy Updates</p>
                      <p className="text-yellow-700 text-sm">
                        We may update this Privacy Policy from time to time. We'll notify you of significant changes via email or website notice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 