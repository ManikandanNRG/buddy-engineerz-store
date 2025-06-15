'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, Edit2, Save, X, Package, MapPin, CreditCard } from 'lucide-react'
import { useRequireAuth, useAuth } from '@/hooks/useAuth'
import { createOrUpdateUserProfile, getErrorMessage } from '@/lib/auth'
import Breadcrumb from '@/components/Breadcrumb'

export default function AccountPage() {
  const { user, loading } = useRequireAuth()
  const { profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
      })
    } else if (user && user.user_metadata) {
      setFormData({
        name: user.user_metadata.name || '',
        phone: user.user_metadata.phone || '',
      })
    }
  }, [user, profile])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setMessage('')
    setErrors({})

    try {
      const { error } = await createOrUpdateUserProfile(user.id, {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
      })

      if (error) {
        setMessage(getErrorMessage(error))
      } else {
        setMessage('Profile updated successfully!')
        setEditing(false)
        await refreshProfile() // Refresh the profile data
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
      })
    } else if (user && user.user_metadata) {
      setFormData({
        name: user.user_metadata.name || '',
        phone: user.user_metadata.phone || '',
      })
    }
    setEditing(false)
    setErrors({})
    setMessage('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // useRequireAuth will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Account', href: '/account' }
          ]}
        />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {message && (
                  <div className={`mb-4 p-3 rounded-md ${
                    message.includes('successful') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.email}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {editing ? (
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{formData.name || 'Not provided'}</span>
                      </div>
                    )}
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {editing ? (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{formData.phone || 'Not provided'}</span>
                      </div>
                    )}
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total orders</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account status</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    <span>View Orders</span>
                  </Link>
                  <a
                    href="/account/addresses"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Manage Addresses</span>
                  </a>
                  <a
                    href="/account/payment-methods"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Methods</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 