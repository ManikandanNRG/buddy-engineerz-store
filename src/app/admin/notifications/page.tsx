'use client'

import { useState, useEffect } from 'react'
import { useRequireAdminAuth } from '@/hooks/useAdminAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { toast } from 'react-hot-toast'
import { Bell, Trash2, CheckCircle } from 'lucide-react'

interface Notification {
  id: number
  message: string
  time: string
  type: string
  read: boolean
}

// Shared notification functions
const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('admin_notifications')
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Default mock notifications
  const defaultNotifications = [
    { id: 1, message: 'New order received from John Doe - Order #ORD-001', time: '2 min ago', type: 'order', read: false },
    { id: 2, message: 'Low stock alert: Premium T-shirt (Blue) - Only 5 remaining', time: '1 hour ago', type: 'inventory', read: false },
    { id: 3, message: 'New customer registered: Sarah Smith', time: '3 hours ago', type: 'customer', read: false },
    { id: 4, message: 'Daily backup completed successfully', time: '6 hours ago', type: 'system', read: true },
    { id: 5, message: 'Payment failed for Order #ORD-002', time: '12 hours ago', type: 'payment', read: false },
  ]
  
  localStorage.setItem('admin_notifications', JSON.stringify(defaultNotifications))
  return defaultNotifications
}

const updateNotifications = (notifications: Notification[]) => {
  localStorage.setItem('admin_notifications', JSON.stringify(notifications))
  // Trigger event to update header
  window.dispatchEvent(new CustomEvent('notificationsUpdated'))
}

export default function AdminNotificationsPage() {
  const { user, loading } = useRequireAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    const loadNotifications = () => {
      setNotifications(getNotifications())
    }
    
    loadNotifications()
    
    // Listen for updates from header
    const handleNotificationsUpdate = () => {
      loadNotifications()
    }
    
    window.addEventListener('notificationsUpdated', handleNotificationsUpdate)
    
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate)
    }
  }, [])

  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    )
    setNotifications(updatedNotifications)
    updateNotifications(updatedNotifications)
    toast.success('Notification marked as read')
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
    setNotifications(updatedNotifications)
    updateNotifications(updatedNotifications)
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: number) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id)
    setNotifications(updatedNotifications)
    updateNotifications(updatedNotifications)
    toast.success('Notification deleted')
  }

  const clearAllNotifications = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([])
      updateNotifications([])
      toast.success('All notifications cleared')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📋'
      case 'inventory':
        return '📦'
      case 'customer':
        return '👤'
      case 'system':
        return '⚙️'
      case 'payment':
        return '💳'
      default:
        return '🔔'
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'read') return notif.read
    if (filter === 'unread') return !notif.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

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

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          title="Notifications"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Notifications 
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadCount} unread
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">Stay updated with your store activities</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark All Read</span>
                </button>
                <button
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'all', name: 'All', count: notifications.length },
                    { id: 'unread', name: 'Unread', count: unreadCount },
                    { id: 'read', name: 'Read', count: notifications.length - unreadCount }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        filter === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        filter === tab.id ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {filter === 'unread' ? 'No unread notifications' : 
                     filter === 'read' ? 'No read notifications' : 
                     'No notifications found'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm ${
                                !notification.read ? 'font-medium text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  {notification.time}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {notification.type}
                                </span>
                                {!notification.read && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Demo Notification System
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>This is a demo with mock data stored in localStorage. In a real application:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Notifications would be stored in Supabase database</li>
                      <li>Real-time updates via Supabase Realtime subscriptions</li>
                      <li>Automatic notifications from order/inventory triggers</li>
                      <li>Push notifications for mobile/browser alerts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 