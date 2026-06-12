'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Check, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { 
  getUserAddresses, 
  deleteAddress, 
  setDefaultAddress, 
  createAddress, 
  updateAddress,
  formatAddress,
  getAddressTypeDisplay,
  validateAddress
} from '@/lib/addresses'
import type { Address, AddressInput } from '@/lib/addresses'
import Breadcrumb from '@/components/Breadcrumb'

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AddressInput>({
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadAddresses()
    }
  }, [user])

  const loadAddresses = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { addresses: data, error } = await getUserAddresses(user.id)
      if (error) {
        setError('Failed to load addresses')
      } else {
        setAddresses(data || [])
      }
    } catch (err) {
      setError('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
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
    setEditingId(address.id)
    setIsEditing(true)
    setFormErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this address?')) return
    
    setActionLoadingId(id)
    try {
      const { error } = await deleteAddress(id, user.id)
      if (error) {
        alert('Failed to delete address')
      } else {
        await loadAddresses()
      }
    } catch (err) {
      alert('Failed to delete address')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    if (!user) return
    
    setActionLoadingId(id)
    try {
      const { error } = await setDefaultAddress(id, user.id)
      if (error) {
        alert('Failed to set default address')
      } else {
        await loadAddresses()
      }
    } catch (err) {
      alert('Failed to set default address')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Validate
    const { isValid, errors } = validateAddress(formData)
    setFormErrors(errors)
    
    if (!isValid) {
      return
    }

    setIsSaving(true)
    try {
      if (editingId) {
        // Update
        const { error } = await updateAddress(editingId, user.id, formData)
        if (error) throw error
      } else {
        // Create
        // If it's the first address, make it default automatically
        const isFirst = addresses.length === 0
        const { error } = await createAddress(user.id, {
          ...formData,
          is_default: isFirst ? true : formData.is_default
        })
        if (error) throw error
      }
      
      // Success
      await loadAddresses()
      setIsEditing(false)
      setEditingId(null)
      // Reset form
      setFormData({
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
    } catch (err: any) {
      console.error(err)
      alert(err.userMessage || 'Failed to save address')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormErrors({})
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-gray-600">Loading addresses...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <Link href="/auth/login?redirect=/account/addresses" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 transition-all duration-300">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Account', href: '/account' },
            { label: 'Addresses', href: '/account/addresses' }
          ]}
        />

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href="/account" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Account
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 transition-all duration-300 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add New Address
              </button>
            )}
          </div>

          {/* Form Section */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+91 9876543210"
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Address Line 1 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={formData.address_line_1}
                      onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.address_line_1 ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="House/Flat No., Building Name, Street"
                    />
                    {formErrors.address_line_1 && <p className="mt-1 text-sm text-red-600">{formErrors.address_line_1}</p>}
                  </div>

                  {/* Address Line 2 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={formData.address_line_2}
                      onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Landmark, Area, etc."
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="6-digit pincode"
                    />
                    {formErrors.pincode && <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
                  </div>
                  
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      disabled
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {!editingId && addresses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_default" className="text-sm text-gray-700">
                      Set as default shipping address
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 transition-all duration-300 font-medium disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Section */}
          {!isEditing && (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                  <p className="text-gray-500 mb-6">You haven't saved any shipping addresses yet.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-100 hover:text-gray-900 transition-all duration-300 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`bg-white rounded-lg shadow-sm p-6 border ${address.is_default ? 'border-purple-300 ring-1 ring-purple-100' : 'border-gray-100'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {getAddressTypeDisplay(address.type)}
                          </span>
                          {address.is_default && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                              <Check className="h-3 w-3" /> Default
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(address)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(address.id)}
                            disabled={actionLoadingId === address.id}
                            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoadingId === address.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        <p className="font-semibold text-gray-900">{address.name}</p>
                        <p className="text-gray-600">{address.address_line_1}</p>
                        {address.address_line_2 && <p className="text-gray-600">{address.address_line_2}</p>}
                        <p className="text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                        <p className="text-gray-600">{address.country}</p>
                        <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
                      </div>

                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          disabled={actionLoadingId === address.id}
                          className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
