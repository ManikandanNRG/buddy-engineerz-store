import { 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Shield,
  Truck
} from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <RotateCcw className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-xl text-purple-100">
              Easy returns and exchanges within 30 days. Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Overview */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Return Policy Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Window</h3>
                <p className="text-gray-600">Return or exchange items within 30 days of delivery</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Refund</h3>
                <p className="text-gray-600">Get your money back or exchange for a different item</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Truck className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Returns</h3>
                <p className="text-gray-600">We cover return shipping costs for eligible items</p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">How to Return an Item</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Initiate Return Request</h3>
                  <p className="text-gray-600 mb-3">
                    Log into your account and go to "My Orders". Find the order you want to return and click "Return Item".
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Required Information:</strong> Order number, reason for return, and preferred resolution (refund or exchange)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Your Item</h3>
                  <p className="text-gray-600 mb-3">
                    Pack the item in its original packaging with all tags attached. Include the return form we'll email you.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Packaging Tips:</strong> Use the original box if available, or a sturdy alternative. Include all accessories and documentation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship the Return</h3>
                  <p className="text-gray-600 mb-3">
                    Use the prepaid return label we provide or drop off at any of our partner locations.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Tracking:</strong> Keep the tracking number to monitor your return shipment status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Receive Refund/Exchange</h3>
                  <p className="text-gray-600 mb-3">
                    Once we receive and inspect your return, we'll process your refund or send your exchange within 3-5 business days.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Refund Timeline:</strong> Refunds appear in your original payment method within 5-10 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Eligible for Return
              </h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Items in original condition with tags attached</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Unworn, unwashed, and undamaged items</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Items returned within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Items in original packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Defective or damaged items (any time)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Wrong item received</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Not Eligible for Return
              </h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Items without original tags or packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Worn, washed, or damaged items</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Items returned after 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Customized or personalized items</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Sale items (unless defective)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Gift cards and digital products</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exchange Policy */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Policy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Exchanges</h3>
                <p className="text-gray-600 mb-4">
                  Need a different size? We offer free size exchanges within 30 days of purchase.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Same item, different size only</li>
                  <li>• Subject to availability</li>
                  <li>• Free exchange shipping</li>
                  <li>• Process takes 5-7 business days</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Color/Style Exchanges</h3>
                <p className="text-gray-600 mb-4">
                  Want a different color or style? Exchange for any item of equal or lesser value.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Any item of equal/lesser value</li>
                  <li>• Pay difference for higher-priced items</li>
                  <li>• Subject to availability</li>
                  <li>• Standard return shipping applies</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Information */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Original Payment Method</p>
                      <p className="text-gray-600 text-sm">Refunds are processed to your original payment method</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Store Credit</p>
                      <p className="text-gray-600 text-sm">Option to receive store credit for faster processing</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Inspection:</span>
                    <span className="font-medium">1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Processing:</span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Processing:</span>
                    <span className="font-medium">5-10 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store Credit:</span>
                    <span className="font-medium text-green-600">Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Special Circumstances */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Circumstances</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Defective Items
                </h3>
                <p className="text-gray-600">
                  If you receive a defective item, contact us immediately. We'll provide a prepaid return label and expedite your replacement or refund.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Wrong Item Received
                </h3>
                <p className="text-gray-600">
                  Received the wrong item? We'll send you the correct item immediately and provide a prepaid return label for the incorrect item.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Damaged in Shipping
                </h3>
                <p className="text-gray-600">
                  Items damaged during shipping are covered by our guarantee. We'll replace the item at no cost to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Your Return?</h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help you with any questions about returns or exchanges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:returns@buddyengineerz.com"
                className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Email Returns Team
              </a>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <p>Returns Email: returns@buddyengineerz.com</p>
              <p>Phone: +91 98765 43210 (Mon-Fri, 9 AM - 6 PM IST)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 