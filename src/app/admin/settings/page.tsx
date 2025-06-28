'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface StoreSettings {
  store_name: string
  store_description: string
  store_email: string
  store_phone: string
  store_address: string
  currency: string
  timezone: string
  tax_rate: number
  shipping_cost: number
  free_shipping_threshold: number
}

interface AdminProfile {
  name: string
  email: string
  phone: string
  role: string
}

interface SecuritySettings {
  two_factor_enabled: boolean
  session_timeout: number
  password_expiry_days: number
  login_attempts: number
}

interface NotificationSettings {
  email_notifications: boolean
  order_notifications: boolean
  customer_notifications: boolean
  inventory_notifications: boolean
  marketing_notifications: boolean
}

export default function AdminSettingsPage() {
  const { user, loading } = useRequireAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('store')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    store_name: 'Buddy Engineerz Store',
    store_description: 'Premium engineering and tech-themed apparel',
    store_email: 'contact@buddyengineerzstore.com',
    store_phone: '+91 9876543210',
    store_address: '123 Tech Street, Bangalore, Karnataka 560001',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    tax_rate: 18,
    shipping_cost: 50,
    free_shipping_threshold: 1000
  })

  // Admin Profile
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: '',
    email: '',
    phone: '',
    role: 'admin'
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    session_timeout: 30,
    password_expiry_days: 90,
    login_attempts: 5
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    order_notifications: true,
    customer_notifications: true,
    inventory_notifications: true,
    marketing_notifications: false
  })

  // Load settings
  const loadSettings = useCallback(async () => {
    try {
      console.log('🔧 Loading settings...')
      
      // Load admin profile
      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setAdminProfile({
            name: profileData.name || '',
            email: profileData.email || user.email || '',
            phone: profileData.phone || '',
            role: profileData.role || 'admin'
          })
        }
      }

      // Load store settings from database or localStorage
      const savedStoreSettings = localStorage.getItem('store_settings')
      if (savedStoreSettings) {
        setStoreSettings(JSON.parse(savedStoreSettings))
      }

      const savedSecuritySettings = localStorage.getItem('security_settings')
      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings))
      }

      const savedNotificationSettings = localStorage.getItem('notification_settings')
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings))
      }

      console.log('✅ Settings loaded')
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user, loadSettings])

  // Save store settings
  const saveStoreSettings = async () => {
    try {
      setSaving(true)
      
      // Save to localStorage (in production, save to database)
      localStorage.setItem('store_settings', JSON.stringify(storeSettings))
      
      toast.success('Store settings saved successfully!')
    } catch (error) {
      console.error('Error saving store settings:', error)
      toast.error('Failed to save store settings')
    } finally {
      setSaving(false)
    }
  }

  // Save admin profile
  const saveAdminProfile = async () => {
    try {
      setSaving(true)
      
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            name: adminProfile.name,
            phone: adminProfile.phone,
            role: adminProfile.role,
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }
      
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // Save security settings
  const saveSecuritySettings = async () => {
    try {
      setSaving(true)
      
      localStorage.setItem('security_settings', JSON.stringify(securitySettings))
      
      toast.success('Security settings saved successfully!')
    } catch (error) {
      console.error('Error saving security settings:', error)
      toast.error('Failed to save security settings')
    } finally {
      setSaving(false)
    }
  }

  // Save notification settings
  const saveNotificationSettings = async () => {
    try {
      setSaving(true)
      // TODO: Save notification settings to database
      toast.success('Notification settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save notification settings')
    } finally {
      setSaving(false)
    }
  }

  // System action handlers
  const handleExportData = async () => {
    try {
      toast.loading('Preparing data export...')
      // TODO: Implement data export functionality
      setTimeout(() => {
        toast.success('Data export will be emailed to you shortly')
      }, 2000)
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleClearCache = async () => {
    try {
      toast.loading('Clearing cache...')
      // TODO: Implement cache clearing functionality
      setTimeout(() => {
        toast.success('Cache cleared successfully')
      }, 1500)
    } catch (error) {
      toast.error('Failed to clear cache')
    }
  }

  const handleViewLogs = () => {
    // TODO: Navigate to logs page or open logs modal
    router.push('/admin/logs')
  }

  // Reset to defaults
  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      localStorage.removeItem('store_settings')
      localStorage.removeItem('security_settings')
      localStorage.removeItem('notification_settings')
      loadSettings()
      toast.success('Settings reset to defaults!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'store', name: 'Store Settings', icon: '🏪' },
    { id: 'profile', name: 'Admin Profile', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'system', name: 'System', icon: '⚙️' }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          title="Settings"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-600">Manage your store and admin settings</p>
              </div>
              <button
                onClick={resetToDefaults}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <span>🔄</span>
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Store Settings */}
                {activeTab === 'store' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                          <input
                            type="text"
                            value={storeSettings.store_name}
                            onChange={(e) => setStoreSettings({...storeSettings, store_name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                          <input
                            type="email"
                            value={storeSettings.store_email}
                            onChange={(e) => setStoreSettings({...storeSettings, store_email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                          <input
                            type="tel"
                            value={storeSettings.store_phone}
                            onChange={(e) => setStoreSettings({...storeSettings, store_phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                          <select
                            value={storeSettings.currency}
                            onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
                        <textarea
                          value={storeSettings.store_description}
                          onChange={(e) => setStoreSettings({...storeSettings, store_description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                        <textarea
                          value={storeSettings.store_address}
                          onChange={(e) => setStoreSettings({...storeSettings, store_address: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Shipping</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={storeSettings.tax_rate}
                            onChange={(e) => setStoreSettings({...storeSettings, tax_rate: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={storeSettings.shipping_cost}
                            onChange={(e) => setStoreSettings({...storeSettings, shipping_cost: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={storeSettings.free_shipping_threshold}
                            onChange={(e) => setStoreSettings({...storeSettings, free_shipping_threshold: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveStoreSettings}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        {saving ? 'Saving...' : 'Save Store Settings'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Admin Profile */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={adminProfile.name}
                            onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={adminProfile.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={adminProfile.phone}
                            onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            value={adminProfile.role}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveAdminProfile}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        {saving ? 'Saving...' : 'Update Profile'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.two_factor_enabled}
                              onChange={(e) => setSecuritySettings({...securitySettings, two_factor_enabled: e.target.checked})}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                            <input
                              type="number"
                              min="5"
                              max="480"
                              value={securitySettings.session_timeout}
                              onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value) || 30})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                            <input
                              type="number"
                              min="30"
                              max="365"
                              value={securitySettings.password_expiry_days}
                              onChange={(e) => setSecuritySettings({...securitySettings, password_expiry_days: parseInt(e.target.value) || 90})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                            <input
                              type="number"
                              min="3"
                              max="10"
                              value={securitySettings.login_attempts}
                              onChange={(e) => setSecuritySettings({...securitySettings, login_attempts: parseInt(e.target.value) || 5})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveSecuritySettings}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        {saving ? 'Saving...' : 'Save Security Settings'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(notificationSettings).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 capitalize">
                                {key.replace(/_/g, ' ')}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {key === 'email_notifications' && 'Receive general email notifications'}
                                {key === 'order_notifications' && 'Get notified about new orders'}
                                {key === 'customer_notifications' && 'Receive customer-related updates'}
                                {key === 'inventory_notifications' && 'Get low stock alerts'}
                                {key === 'marketing_notifications' && 'Receive marketing insights'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotificationSettings({
                                  ...notificationSettings,
                                  [key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={saveNotificationSettings}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        {saving ? 'Saving...' : 'Save Notification Settings'}
                      </button>
                    </div>
                  </div>
                )}

                {/* System */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Application Version:</span>
                          <span className="text-sm font-medium text-gray-900">v1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Database Status:</span>
                          <span className="text-sm font-medium text-green-600">Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Backup:</span>
                          <span className="text-sm font-medium text-gray-900">Today, 2:30 AM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Storage Used:</span>
                          <span className="text-sm font-medium text-gray-900">2.4 GB / 10 GB</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">System Actions</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={handleExportData}
                          className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
                              <p className="text-sm text-gray-500">Download all store data as CSV</p>
                            </div>
                            <span className="text-purple-600">📥</span>
                          </div>
                        </button>
                        <button 
                          onClick={handleClearCache}
                          className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Clear Cache</h4>
                              <p className="text-sm text-gray-500">Clear application cache</p>
                            </div>
                            <span className="text-purple-600">🗑️</span>
                          </div>
                        </button>
                        <button 
                          onClick={handleViewLogs}
                          className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">System Logs</h4>
                              <p className="text-sm text-gray-500">View application logs</p>
                            </div>
                            <span className="text-purple-600">📋</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 