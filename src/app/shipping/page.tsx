import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Plane,
  Ship
} from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Truck className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
            <p className="text-xl text-purple-100">
              Fast, reliable delivery to your doorstep. Learn about our shipping options and policies.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Shipping Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Standard Shipping */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
              <div className="text-center mb-4">
                <Truck className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900">Standard Shipping</h3>
                <p className="text-gray-600">Most popular option</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">5-7 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">₹99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free shipping:</span>
                  <span className="font-medium text-green-600">Orders over ₹999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className="font-medium">✓ Included</span>
                </div>
              </div>
            </div>

            {/* Express Shipping */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-purple-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
              
              <div className="text-center mb-4">
                <Plane className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900">Express Shipping</h3>
                <p className="text-gray-600">Fastest delivery</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">₹199</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free shipping:</span>
                  <span className="font-medium text-green-600">Orders over ₹1999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className="font-medium">✓ Real-time</span>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
              <div className="text-center mb-4">
                <Ship className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900">International</h3>
                <p className="text-gray-600">Worldwide delivery</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Time:</span>
                  <span className="font-medium">7-14 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">₹599+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customs:</span>
                  <span className="font-medium">Customer pays</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className="font-medium">✓ Included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Zones */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Zones & Rates</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Regions</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Standard</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Express</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">Zone 1</td>
                    <td className="py-3 px-4 text-gray-600">Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune</td>
                    <td className="py-3 px-4 text-gray-600">₹99</td>
                    <td className="py-3 px-4 text-gray-600">₹199</td>
                    <td className="py-3 px-4 text-gray-600">2-4 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">Zone 2</td>
                    <td className="py-3 px-4 text-gray-600">Other Metro Cities</td>
                    <td className="py-3 px-4 text-gray-600">₹99</td>
                    <td className="py-3 px-4 text-gray-600">₹199</td>
                    <td className="py-3 px-4 text-gray-600">3-5 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">Zone 3</td>
                    <td className="py-3 px-4 text-gray-600">Tier 2 Cities</td>
                    <td className="py-3 px-4 text-gray-600">₹99</td>
                    <td className="py-3 px-4 text-gray-600">₹249</td>
                    <td className="py-3 px-4 text-gray-600">4-6 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">Zone 4</td>
                    <td className="py-3 px-4 text-gray-600">Remote Areas</td>
                    <td className="py-3 px-4 text-gray-600">₹149</td>
                    <td className="py-3 px-4 text-gray-600">₹299</td>
                    <td className="py-3 px-4 text-gray-600">5-8 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Free Shipping Available!</p>
                  <p className="text-green-700 text-sm">
                    Get free standard shipping on orders over ₹999 to all zones in India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Processing & Delivery */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Order Processing
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Processing Time</p>
                    <p className="text-gray-600 text-sm">1-2 business days for order verification and packaging</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Quality Check</p>
                    <p className="text-gray-600 text-sm">Every item is inspected before packaging</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Packaging</p>
                    <p className="text-gray-600 text-sm">Eco-friendly packaging with protective materials</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Delivery Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 mb-2">Delivery Attempts</p>
                  <p className="text-gray-600 text-sm">
                    We make up to 3 delivery attempts. If unsuccessful, the package will be held at the local facility for 7 days.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 mb-2">Delivery Hours</p>
                  <p className="text-gray-600 text-sm">
                    Monday to Saturday: 9:00 AM - 7:00 PM<br />
                    Sunday deliveries available in select cities
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 mb-2">Signature Required</p>
                  <p className="text-gray-600 text-sm">
                    Orders over ₹2000 require signature confirmation for security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Tracking</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Track Your Order</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-gray-600">Check your email for the shipping confirmation with tracking number</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-gray-600">Visit your account dashboard to view order status</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-gray-600">Use the tracking number on our courier partner's website</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Status Guide</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Confirmed</span>
                    <span className="text-blue-600">Processing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipped</span>
                    <span className="text-orange-600">In Transit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Out for Delivery</span>
                    <span className="text-purple-600">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered</span>
                    <span className="text-green-600">Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Please Note
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Delivery times are estimates and may vary during peak seasons</li>
                  <li>• PO Box addresses are not supported for delivery</li>
                  <li>• Additional charges may apply for remote locations</li>
                  <li>• Orders placed after 2 PM will be processed the next business day</li>
                  <li>• Weekend and holiday orders will be processed on the next business day</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Our Promise
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 100% secure packaging to prevent damage</li>
                  <li>• Real-time tracking updates via SMS and email</li>
                  <li>• Dedicated customer support for shipping queries</li>
                  <li>• Replacement guarantee for damaged items during shipping</li>
                  <li>• Carbon-neutral shipping options available</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 