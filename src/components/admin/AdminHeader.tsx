'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Bell, Plus, ChevronDown, User, Settings, LogOut } from 'lucide-react'

interface AdminHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  title?: string
}

// Shared notification data - in real app this would come from database/context
const getNotifications = () => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('admin_notifications')
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Default mock notifications
  const defaultNotifications = [
    { id: 1, message: 'New order received', time: '2 min ago', type: 'order', read: false },
    { id: 2, message: 'Low stock alert: T-shirt', time: '1 hour ago', type: 'inventory', read: false },
    { id: 3, message: 'New customer registered', time: '3 hours ago', type: 'customer', read: false },
  ]
  
  localStorage.setItem('admin_notifications', JSON.stringify(defaultNotifications))
  return defaultNotifications
}

const updateNotifications = (notifications: any[]) => {
  localStorage.setItem('admin_notifications', JSON.stringify(notifications))
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('notificationsUpdated'))
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen, title = 'Dashboard' }: AdminHeaderProps) {
  const { user, signOut } = useAdminAuth()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  // Load notifications on mount and listen for updates
  useEffect(() => {
    const loadNotifications = () => {
      setNotifications(getNotifications())
    }
    
    loadNotifications()
    
    // Listen for notification updates from other components
    const handleNotificationsUpdate = () => {
      loadNotifications()
    }
    
    window.addEventListener('notificationsUpdated', handleNotificationsUpdate)
    
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate)
    }
  }, [])

  const handleQuickAdd = () => {
    router.push('/admin/products?action=add')
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const markNotificationAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    )
    setNotifications(updatedNotifications)
    updateNotifications(updatedNotifications)
  }

  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu button and title */}
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="ml-4 md:ml-0 text-2xl font-semibold text-gray-900">
            {title}
          </h1>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full transition-colors"
              onClick={handleNotifications}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">
                      Notifications {unreadNotifications.length > 0 && (
                        <span className="ml-1 text-red-600">({unreadNotifications.length})</span>
                      )}
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markNotificationAsRead(notification.id)
                                }}
                                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button 
                      className="text-sm text-purple-600 hover:text-purple-700"
                      onClick={() => {
                        setShowNotifications(false)
                        router.push('/admin/notifications')
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              onClick={handleQuickAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </button>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'admin'}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role || 'Super_admin'}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowUserMenu(false)
                      router.push('/admin/settings')
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowUserMenu(false)
                      router.push('/admin/settings')
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowUserMenu(false)
                      handleSignOut()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}