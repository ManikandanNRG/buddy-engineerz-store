import { 
  Ruler, 
  User, 
  Shirt, 
  Users,
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Ruler className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Size Guide</h1>
            <p className="text-xl text-purple-100">
              Find your perfect fit with our comprehensive sizing charts and measurement guide.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* How to Measure */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Measure Yourself</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Need</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• A flexible measuring tape</li>
                  <li>• A friend to help (recommended)</li>
                  <li>• Well-fitting clothes for reference</li>
                  <li>• A mirror</li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Pro Tip</p>
                      <p className="text-blue-700 text-sm">
                        Measure over your undergarments or close-fitting clothes for the most accurate measurements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Measurement Tips</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Keep the tape measure snug but not tight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Stand straight with arms at your sides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Measure at the fullest part of each area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Take measurements in inches or centimeters</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Men's Size Chart */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Men's Size Chart
            </h2>
            
            {/* T-Shirts & Casual Wear */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">T-Shirts & Casual Wear</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Chest (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Shoulder (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sleeve (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">XS</td>
                      <td className="border border-gray-300 px-4 py-3">34-36</td>
                      <td className="border border-gray-300 px-4 py-3">26</td>
                      <td className="border border-gray-300 px-4 py-3">16</td>
                      <td className="border border-gray-300 px-4 py-3">7</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">S</td>
                      <td className="border border-gray-300 px-4 py-3">36-38</td>
                      <td className="border border-gray-300 px-4 py-3">27</td>
                      <td className="border border-gray-300 px-4 py-3">17</td>
                      <td className="border border-gray-300 px-4 py-3">7.5</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">M</td>
                      <td className="border border-gray-300 px-4 py-3">38-40</td>
                      <td className="border border-gray-300 px-4 py-3">28</td>
                      <td className="border border-gray-300 px-4 py-3">18</td>
                      <td className="border border-gray-300 px-4 py-3">8</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">L</td>
                      <td className="border border-gray-300 px-4 py-3">40-42</td>
                      <td className="border border-gray-300 px-4 py-3">29</td>
                      <td className="border border-gray-300 px-4 py-3">19</td>
                      <td className="border border-gray-300 px-4 py-3">8.5</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">XL</td>
                      <td className="border border-gray-300 px-4 py-3">42-44</td>
                      <td className="border border-gray-300 px-4 py-3">30</td>
                      <td className="border border-gray-300 px-4 py-3">20</td>
                      <td className="border border-gray-300 px-4 py-3">9</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">XXL</td>
                      <td className="border border-gray-300 px-4 py-3">44-46</td>
                      <td className="border border-gray-300 px-4 py-3">31</td>
                      <td className="border border-gray-300 px-4 py-3">21</td>
                      <td className="border border-gray-300 px-4 py-3">9.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hoodies & Sweatshirts */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoodies & Sweatshirts</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Chest (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sleeve (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">S</td>
                      <td className="border border-gray-300 px-4 py-3">38-40</td>
                      <td className="border border-gray-300 px-4 py-3">26</td>
                      <td className="border border-gray-300 px-4 py-3">24</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">M</td>
                      <td className="border border-gray-300 px-4 py-3">40-42</td>
                      <td className="border border-gray-300 px-4 py-3">27</td>
                      <td className="border border-gray-300 px-4 py-3">25</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">L</td>
                      <td className="border border-gray-300 px-4 py-3">42-44</td>
                      <td className="border border-gray-300 px-4 py-3">28</td>
                      <td className="border border-gray-300 px-4 py-3">26</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">XL</td>
                      <td className="border border-gray-300 px-4 py-3">44-46</td>
                      <td className="border border-gray-300 px-4 py-3">29</td>
                      <td className="border border-gray-300 px-4 py-3">27</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">XXL</td>
                      <td className="border border-gray-300 px-4 py-3">46-48</td>
                      <td className="border border-gray-300 px-4 py-3">30</td>
                      <td className="border border-gray-300 px-4 py-3">28</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Women's Size Chart */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-pink-600" />
              Women's Size Chart
            </h2>
            
            {/* T-Shirts & Tops */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">T-Shirts & Tops</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Bust (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Waist (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Length (inches)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">XS</td>
                      <td className="border border-gray-300 px-4 py-3">32-34</td>
                      <td className="border border-gray-300 px-4 py-3">24-26</td>
                      <td className="border border-gray-300 px-4 py-3">24</td>
                      <td className="border border-gray-300 px-4 py-3">14</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">S</td>
                      <td className="border border-gray-300 px-4 py-3">34-36</td>
                      <td className="border border-gray-300 px-4 py-3">26-28</td>
                      <td className="border border-gray-300 px-4 py-3">25</td>
                      <td className="border border-gray-300 px-4 py-3">15</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">M</td>
                      <td className="border border-gray-300 px-4 py-3">36-38</td>
                      <td className="border border-gray-300 px-4 py-3">28-30</td>
                      <td className="border border-gray-300 px-4 py-3">26</td>
                      <td className="border border-gray-300 px-4 py-3">16</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">L</td>
                      <td className="border border-gray-300 px-4 py-3">38-40</td>
                      <td className="border border-gray-300 px-4 py-3">30-32</td>
                      <td className="border border-gray-300 px-4 py-3">27</td>
                      <td className="border border-gray-300 px-4 py-3">17</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">XL</td>
                      <td className="border border-gray-300 px-4 py-3">40-42</td>
                      <td className="border border-gray-300 px-4 py-3">32-34</td>
                      <td className="border border-gray-300 px-4 py-3">28</td>
                      <td className="border border-gray-300 px-4 py-3">18</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">XXL</td>
                      <td className="border border-gray-300 px-4 py-3">42-44</td>
                      <td className="border border-gray-300 px-4 py-3">34-36</td>
                      <td className="border border-gray-300 px-4 py-3">29</td>
                      <td className="border border-gray-300 px-4 py-3">19</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Fit Guide */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fit Guide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Shirt className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Slim Fit</h3>
                <p className="text-gray-600 text-sm">
                  Close to body fit with minimal ease. Perfect for a modern, tailored look.
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Shirt className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Fit</h3>
                <p className="text-gray-600 text-sm">
                  Classic fit with comfortable room. Our most popular fit for everyday wear.
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Shirt className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Relaxed Fit</h3>
                <p className="text-gray-600 text-sm">
                  Loose, comfortable fit with extra room. Great for layering and casual wear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Measurement Guide */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Take Measurements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chest/Bust</h3>
                  <p className="text-gray-600 text-sm">
                    Measure around the fullest part of your chest/bust, keeping the tape measure level and snug but not tight.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Waist</h3>
                  <p className="text-gray-600 text-sm">
                    Measure around your natural waistline, which is typically the narrowest part of your torso.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hip</h3>
                  <p className="text-gray-600 text-sm">
                    Measure around the fullest part of your hips, typically about 8 inches below your waist.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Shoulder Width</h3>
                  <p className="text-gray-600 text-sm">
                    Measure from the edge of one shoulder to the edge of the other shoulder across your back.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sleeve Length</h3>
                  <p className="text-gray-600 text-sm">
                    Measure from the shoulder seam down to where you want the sleeve to end.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Length</h3>
                  <p className="text-gray-600 text-sm">
                    Measure from the highest point of the shoulder down to where you want the garment to end.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Size Recommendations */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Size Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">If You're Between Sizes</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• For a fitted look, choose the smaller size</li>
                  <li>• For a relaxed fit, choose the larger size</li>
                  <li>• Consider the fabric - cotton may shrink slightly</li>
                  <li>• Check the specific product's fit notes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Considerations</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Hoodies run slightly larger for comfort</li>
                  <li>• Women's fitted tees run smaller</li>
                  <li>• Vintage-style items may have different sizing</li>
                  <li>• Check individual product pages for specific notes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help Finding Your Size?</h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help you find the perfect fit. We offer free exchanges if the size isn't right.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Contact Size Expert
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/returns"
                className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Exchange Policy
              </a>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Free Size Exchanges Available</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Not sure about the size? Order your best guess and exchange for free if needed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 