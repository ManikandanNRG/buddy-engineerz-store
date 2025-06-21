import { 
  FileText, 
  Scale, 
  Shield, 
  CreditCard, 
  Truck, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Mail
} from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-purple-100">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-purple-200 mt-4">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Agreement Notice */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Agreement to Terms</h2>
                <p className="text-gray-600">
                  By accessing and using the Buddy Engineerz website and services, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
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
                <a href="#definitions" className="block text-sm text-gray-600 hover:text-purple-600">
                  Definitions
                </a>
                <a href="#account-terms" className="block text-sm text-gray-600 hover:text-purple-600">
                  Account Terms
                </a>
                <a href="#products-services" className="block text-sm text-gray-600 hover:text-purple-600">
                  Products & Services
                </a>
                <a href="#payment-terms" className="block text-sm text-gray-600 hover:text-purple-600">
                  Payment Terms
                </a>
                <a href="#shipping-delivery" className="block text-sm text-gray-600 hover:text-purple-600">
                  Shipping & Delivery
                </a>
                <a href="#returns-refunds" className="block text-sm text-gray-600 hover:text-purple-600">
                  Returns & Refunds
                </a>
                <a href="#contact" className="block text-sm text-gray-600 hover:text-purple-600">
                  Contact Information
                </a>
              </nav>
            </div>
          </div>

          {/* Terms Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Definitions */}
            <section id="definitions" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                Definitions
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">"Company" (referred to as "we", "us", or "our")</h3>
                  <p className="text-gray-600">Refers to Buddy Engineerz, the operator of this website and ecommerce platform.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">"User", "Customer", "You"</h3>
                  <p className="text-gray-600">Refers to any individual who accesses or uses our website and services.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">"Service"</h3>
                  <p className="text-gray-600">Refers to the website, mobile applications, and all related services provided by Buddy Engineerz.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">"Products"</h3>
                  <p className="text-gray-600">Refers to all merchandise, apparel, accessories, and items available for purchase through our platform.</p>
                </div>
              </div>
            </section>

            {/* Account Terms */}
            <section id="account-terms" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Terms</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Creation</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>You must provide accurate, complete, and current information</li>
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>One person or legal entity may not maintain more than one account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Responsibilities</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Keep your login credentials secure and confidential</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Notify us immediately of any unauthorized use of your account</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Update your information to keep it accurate and current</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Comply with all applicable laws and these Terms of Service</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Products & Services */}
            <section id="products-services" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Products & Services</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
                  <p className="text-gray-600 mb-3">
                    We strive to provide accurate product descriptions, images, and pricing. However:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Colors may vary due to monitor settings and lighting</li>
                    <li>Product specifications are subject to change without notice</li>
                    <li>We reserve the right to correct errors in product information</li>
                    <li>Availability is subject to inventory and may change without notice</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <ul className="text-blue-800 space-y-2">
                      <li>• All prices are listed in Indian Rupees (INR)</li>
                      <li>• Prices are subject to change without prior notice</li>
                      <li>• The price charged will be the price displayed at the time of order</li>
                      <li>• Additional taxes and shipping charges may apply</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Acceptance</h3>
                  <p className="text-gray-600">
                    We reserve the right to refuse or cancel any order for any reason, including but not limited to:
                    product availability, errors in product or pricing information, or suspected fraudulent activity.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section id="payment-terms" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-green-600" />
                Payment Terms
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accepted Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Credit/Debit Cards</h4>
                      <p className="text-gray-600 text-sm">Visa, MasterCard, American Express, RuPay</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Digital Wallets</h4>
                      <p className="text-gray-600 text-sm">Paytm, PhonePe, Google Pay, PayPal</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Net Banking</h4>
                      <p className="text-gray-600 text-sm">All major Indian banks supported</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">UPI</h4>
                      <p className="text-gray-600 text-sm">Unified Payments Interface</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Processing</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Payment is required at the time of order placement</li>
                    <li>We use secure third-party payment processors (Razorpay)</li>
                    <li>Your payment information is encrypted and securely processed</li>
                    <li>We do not store your complete payment card details</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Payment Failures</p>
                      <p className="text-red-700 text-sm">
                        Orders with failed payments will be automatically cancelled. Please ensure sufficient funds and correct payment details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping & Delivery */}
            <section id="shipping-delivery" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="h-6 w-6 text-blue-600" />
                Shipping & Delivery
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Locations</h3>
                  <p className="text-gray-600 mb-2">We currently ship to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>All locations within India</li>
                    <li>International shipping to select countries (additional charges apply)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Timeframes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Standard Shipping</h4>
                      <p className="text-gray-600 text-sm">5-7 business days</p>
                      <p className="text-gray-600 text-sm">₹99 (Free over ₹999)</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Express Shipping</h4>
                      <p className="text-gray-600 text-sm">2-3 business days</p>
                      <p className="text-gray-600 text-sm">₹199 (Free over ₹1999)</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">International</h4>
                      <p className="text-gray-600 text-sm">7-14 business days</p>
                      <p className="text-gray-600 text-sm">₹599+ (varies by location)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Terms</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>You must provide accurate shipping information</li>
                    <li>Someone must be available to receive the package</li>
                    <li>Risk of loss transfers to you upon delivery</li>
                    <li>We are not responsible for delays due to customs or weather</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Returns & Refunds */}
            <section id="returns-refunds" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <RotateCcw className="h-6 w-6 text-purple-600" />
                Returns & Refunds
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
                  <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <p className="text-green-800 font-medium">30-Day Return Window</p>
                    <p className="text-green-700 text-sm">You may return most items within 30 days of delivery for a full refund or exchange.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Eligible for Return:</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Items in original condition with tags</li>
                        <li>• Unworn and unwashed items</li>
                        <li>• Items in original packaging</li>
                        <li>• Defective or damaged items</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Not Eligible for Return:</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Items without tags or packaging</li>
                        <li>• Worn, washed, or damaged items</li>
                        <li>• Customized or personalized items</li>
                        <li>• Sale items (unless defective)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Process</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Refunds are processed within 3-5 business days after we receive your return</li>
                    <li>Refunds are issued to the original payment method</li>
                    <li>Shipping charges are non-refundable (except for defective items)</li>
                    <li>You are responsible for return shipping costs unless the item is defective</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section id="prohibited-uses" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prohibited Uses</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">You may not use our service:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">For any unlawful purpose or to solicit others to perform unlawful acts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To infringe upon or violate our intellectual property rights or the intellectual property rights of others</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To submit false or misleading information</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To upload or transmit viruses or any other type of malicious code</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To collect or track personal information of others</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-gray-600 text-sm">To spam, phish, pharm, pretext, spider, crawl, or scrape</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                Intellectual Property Rights
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Intellectual Property</h3>
                  <p className="text-gray-600 mb-3">
                    The service and its original content, features, and functionality are and will remain the exclusive property of Buddy Engineerz and its licensors. 
                    The service is protected by copyright, trademark, and other laws.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>Website design, layout, and graphics</li>
                    <li>Product designs and artwork</li>
                    <li>Buddy Engineerz name, logo, and branding</li>
                    <li>All written content and product descriptions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Use Rights</h3>
                  <p className="text-gray-600">
                    We grant you a limited, non-exclusive, non-transferable license to access and use our service for personal, non-commercial purposes. 
                    You may not reproduce, distribute, modify, or create derivative works without our written permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="limitation-liability" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Important Legal Notice</p>
                      <p className="text-amber-700 text-sm">
                        Please read this section carefully as it limits our liability to you.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600">
                  In no event shall Buddy Engineerz, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from your use of the service.
                </p>
                
                <p className="text-gray-600">
                  Our total liability to you for all claims arising out of or relating to the use of or any inability to use any portion of the service 
                  or otherwise under these terms, whether in contract, tort, or otherwise, is limited to the greater of: (a) the amount you have paid 
                  to us in the 12 months prior to the event giving rise to the liability, or (b) $100.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="h-6 w-6 text-blue-600" />
                Governing Law
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions.
                </p>
                
                <p className="text-gray-600">
                  Any disputes arising from these terms or your use of the service shall be subject to the exclusive jurisdiction of the courts located in 
                  [Your City], India.
                </p>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Dispute Resolution</h3>
                  <p className="text-blue-700 text-sm">
                    We encourage you to contact us first to resolve any disputes. We're committed to working with our customers to resolve issues fairly and quickly.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="h-6 w-6 text-purple-600" />
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Customer Support</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Email: support@buddyengineerz.com</p>
                      <p>Phone: +91-XXX-XXX-XXXX</p>
                      <p>Hours: Mon-Fri 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Legal Department</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Email: legal@buddyengineerz.com</p>
                      <p>For legal matters and terms inquiries</p>
                      <p>Response time: Within 5 business days</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Terms Updates</h4>
                  <p className="text-gray-600 text-sm">
                    We reserve the right to update these terms at any time. We will notify users of any material changes via email or website notice. 
                    Your continued use of the service after such modifications constitutes acceptance of the updated terms.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 