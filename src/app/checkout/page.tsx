'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  CreditCard, 
  Truck, 
  Shield,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cart'
import { getUserAddresses, createAddress, setDefaultAddress, deleteAddress, updateAddress, validateAddress, formatAddress, getAddressTypeDisplay, type AddressInput } from '@/lib/addresses'
import { formatPrice } from '@/lib/database'
import type { Address } from '@/lib/addresses'
import { createOrder } from '@/lib/orders'
import type { CreateOrderData } from '@/lib/orders'
import { sendOrderConfirmationEmail } from '@/app/actions/email'
import { COUNTRIES } from '@/lib/countries'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { items, getTotalPrice, getTotalItems, clearCart, isLoading: cartLoading, isHydrated: cartHydrated } = useCartStore()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address')
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'UPI' | 'COD'>('RAZORPAY')

  // Address form state
  const [addressForm, setAddressForm] = useState<AddressInput>({
    type: 'home',
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    is_default: false
  })
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [user, authLoading, router])

  // Redirect if cart is empty (but wait for cart to hydrate first)
  useEffect(() => {
    if (cartHydrated && !cartLoading && items.length === 0) {
      router.push('/products')
    }
  }, [items, router, cartHydrated, cartLoading])

  // Load user addresses
  useEffect(() => {
    if (user) {
      loadAddresses()
    }
  }, [user])

  const loadAddresses = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { addresses: userAddresses, error } = await getUserAddresses(user.id)
      
      if (error) {
        setError('Failed to load addresses')
        console.error('Address loading error:', error)
      } else if (userAddresses) {
        setAddresses(userAddresses)
        // Set default address as selected
        const defaultAddress = userAddresses.find(addr => addr.is_default)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress)
        } else if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0])
        }
      }
    } catch (error) {
      setError('Failed to load addresses')
      console.error('Address loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const validation = validateAddress(addressForm)
    if (!validation.isValid) {
      setAddressErrors(validation.errors)
      return
    }

    setSubmitting(true)
    try {
      const { address, error } = await createAddress(user.id, addressForm)
      
      if (error) {
        setError('Failed to save address')
        console.error('Address creation error:', error)
      } else if (address) {
        await loadAddresses() // Reload addresses
        setSelectedAddress(address)
        setShowAddressForm(false)
        resetAddressForm()
      }
    } catch (error) {
      setError('Failed to save address')
      console.error('Address creation error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !confirm('Are you sure you want to delete this address?')) return

    try {
      const { error } = await deleteAddress(addressId, user.id)
      
      if (error) {
        setError('Failed to delete address')
        console.error('Address deletion error:', error)
      } else {
        await loadAddresses()
        // If deleted address was selected, select another one
        if (selectedAddress?.id === addressId) {
          setSelectedAddress(addresses.length > 1 ? addresses.find(a => a.id !== addressId) || null : null)
        }
      }
    } catch (error) {
      setError('Failed to delete address')
      console.error('Address deletion error:', error)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    if (!user) return

    try {
      const { error } = await setDefaultAddress(addressId, user.id)
      
      if (error) {
        setError('Failed to set default address')
        console.error('Set default address error:', error)
      } else {
        await loadAddresses()
      }
    } catch (error) {
      setError('Failed to set default address')
      console.error('Set default address error:', error)
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      is_default: address.is_default
    })
    setShowAddressForm(true)
    setAddressErrors({})
  }

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingAddress) return

    const validation = validateAddress(addressForm)
    if (!validation.isValid) {
      setAddressErrors(validation.errors)
      return
    }

    setSubmitting(true)
    try {
      const { address, error } = await updateAddress(editingAddress.id, user.id, addressForm)
      
      if (error) {
        setError('Failed to update address')
        console.error('Address update error:', error)
      } else if (address) {
        await loadAddresses() // Reload addresses
        setSelectedAddress(address)
        setShowAddressForm(false)
        setEditingAddress(null)
        resetAddressForm()
      }
    } catch (error) {
      setError('Failed to update address')
      console.error('Address update error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      type: 'home',
      name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      is_default: false
    })
    setAddressErrors({})
    setEditingAddress(null)
  }

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const proceedToPayment = () => {
    if (!selectedAddress) {
      setError('Please select a delivery address')
      return
    }
    setStep('payment')
  }

  const handlePayment = async () => {
    if (!user || !selectedAddress) return
    
    setSubmitting(true)
    setError('')
    
    try {
      // Create the order data payload
      const orderData: CreateOrderData = {
        user_id: user.id,
        items: items,
        shipping_address: selectedAddress,
        subtotal: getTotalPrice(),
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        payment_method: paymentMethod
      }

      const { order, error: orderError } = await createOrder(orderData)

      // Handle stock-specific errors with a friendly message
      if (orderError?.code === 'INSUFFICIENT_STOCK') {
        setError(orderError.message + ' Please go back to your cart and remove or reduce the quantity of out-of-stock items.')
        setSubmitting(false)
        return
      }

      if (orderError || !order) {
        throw new Error(orderError?.message || 'Failed to create order')
      }

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(order.order_number, order.total, user.user_metadata?.name || 'Customer', user.email!)
      } catch (emailErr) {
        console.error('Failed to send confirmation email', emailErr)
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Clear the cart
      clearCart()
      
      // Redirect to confirmation page
      router.push(`/order-confirmation/${order.id}`)
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your order.')
      console.error(err)
      setSubmitting(false)
    }
  }


  if (authLoading || loading || cartLoading || !cartHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-gray-600">Loading checkout...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (items.length === 0) {
    return null // Will redirect to products
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 999 ? 0 : 99 // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            <div className={`flex items-center ${step === 'address' ? 'text-purple-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'address' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {step === 'address' ? '1' : '✓'}
              </div>
              <span className="ml-2 font-medium">Address</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${
              step === 'payment' ? 'text-purple-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(true)
                      setEditingAddress(null)
                      resetAddressForm()
                    }}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{address.name}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {getAddressTypeDisplay(address.type)}
                              </span>
                              {address.is_default && (
                                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-1">{formatAddress(address)}</p>
                            <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetDefault(address.id)
                              }}
                              className="text-gray-400 hover:text-purple-600"
                              title="Set as default"
                            >
                              <MapPin className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAddress(address)
                              }}
                              className="text-gray-400 hover:text-blue-600"
                              title="Edit address"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAddress(address.id)
                              }}
                              className="text-gray-400 hover:text-red-600"
                              title="Delete address"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <button
                      onClick={() => {
                        setShowAddressForm(true)
                        setEditingAddress(null)
                        resetAddressForm()
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Add Your First Address
                    </button>
                  </div>
                )}

                {/* Add/Edit Address Form */}
                {showAddressForm && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={editingAddress ? handleUpdateAddress : handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={addressForm.name}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter full name"
                          />
                          {addressErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter phone number"
                          />
                          {addressErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="address_line_1"
                          value={addressForm.address_line_1}
                          onChange={handleAddressFormChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            addressErrors.address_line_1 ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="House/Flat number, Building name, Street"
                        />
                        {addressErrors.address_line_1 && (
                          <p className="mt-1 text-sm text-red-600">{addressErrors.address_line_1}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="address_line_2"
                          value={addressForm.address_line_2}
                          onChange={handleAddressFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Area, Landmark (Optional)"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="City"
                          />
                          {addressErrors.city && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.state ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="State"
                          />
                          {addressErrors.state && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={addressForm.pincode}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.pincode ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="PIN Code"
                          />
                          {addressErrors.pincode && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.pincode}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type *
                          </label>
                          <select
                            name="type"
                            value={addressForm.type}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.type ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                          {addressErrors.type && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.type}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressFormChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              addressErrors.country ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            {COUNTRIES.map((country) => (
                              <option key={country.code} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                          {addressErrors.country && (
                            <p className="mt-1 text-sm text-red-600">{addressErrors.country}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_default"
                          checked={addressForm.is_default}
                          onChange={handleAddressFormChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {editingAddress ? 'Updating...' : 'Saving...'}
                            </div>
                          ) : (
                            editingAddress ? 'Update Address' : 'Save Address'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false)
                            resetAddressForm()
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Continue Button */}
                {addresses.length > 0 && !showAddressForm && (
                  <div className="pt-6 border-t">
                    <button
                      onClick={proceedToPayment}
                      disabled={!selectedAddress}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                {/* Selected Address Summary */}
                {selectedAddress && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Delivering to:</h3>
                    <p className="text-sm text-gray-600">{selectedAddress.name}</p>
                    <p className="text-sm text-gray-600">{formatAddress(selectedAddress)}</p>
                    <p className="text-sm text-gray-600">Phone: {selectedAddress.phone}</p>
                    <button
                      onClick={() => setStep('address')}
                      className="text-sm text-purple-600 hover:text-purple-700 mt-2"
                    >
                      Change Address
                    </button>
                  </div>
                )}

                {/* Payment Options */}
                <div className="space-y-4 mb-6">
                  {/* Razorpay Option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'RAZORPAY' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('RAZORPAY')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'RAZORPAY' ? 'border-purple-600' : 'border-gray-400'}`}>
                        {paymentMethod === 'RAZORPAY' && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                      </div>
                      <CreditCard className={`h-5 w-5 ${paymentMethod === 'RAZORPAY' ? 'text-purple-600' : 'text-gray-500'}`} />
                      <div>
                        <h3 className={`font-medium ${paymentMethod === 'RAZORPAY' ? 'text-purple-900' : 'text-gray-900'}`}>Razorpay (Cards, Wallets, NetBanking)</h3>
                        <p className="text-sm text-gray-600">Secure payment gateway</p>
                      </div>
                    </div>
                  </div>

                  {/* Direct UPI Option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'UPI' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-purple-600' : 'border-gray-400'}`}>
                        {paymentMethod === 'UPI' && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                      </div>
                      <div className="flex items-center justify-center h-5 w-5 text-gray-500 font-bold text-xs border border-gray-500 rounded">UPI</div>
                      <div>
                        <h3 className={`font-medium ${paymentMethod === 'UPI' ? 'text-purple-900' : 'text-gray-900'}`}>Direct UPI Transfer</h3>
                        <p className="text-sm text-gray-600">Scan QR Code or pay directly to our UPI ID</p>
                      </div>
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div className="mt-4 ml-8 p-3 bg-white border border-purple-100 rounded-md">
                        <p className="text-sm text-gray-700 font-medium mb-2">Scan QR Code or enter UPI ID:</p>
                        <p className="text-xs text-gray-500 mb-2">Our team will manually verify your payment after you place the order.</p>
                        <div className="bg-gray-100 p-2 rounded text-center font-mono text-sm border border-gray-200">
                          buddy-engineerz@upi
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery Option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-purple-600' : 'border-gray-400'}`}>
                        {paymentMethod === 'COD' && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                      </div>
                      <Truck className={`h-5 w-5 ${paymentMethod === 'COD' ? 'text-purple-600' : 'text-gray-500'}`} />
                      <div>
                        <h3 className={`font-medium ${paymentMethod === 'COD' ? 'text-purple-900' : 'text-gray-900'}`}>Cash on Delivery (COD)</h3>
                        <p className="text-sm text-gray-600">Pay when your order is delivered to your doorstep</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('address')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={submitting}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded-lg"
                        unoptimized={item.product.images[0]?.includes('unsplash.com')}
                      />
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {shipping === 0 ? 'FREE Shipping!' : 'Standard Shipping'}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {shipping === 0 
                    ? 'Your order qualifies for free shipping' 
                    : `Add ${formatPrice(1000 - subtotal)} more for FREE shipping`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 