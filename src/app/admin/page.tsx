'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Users, Utensils, BarChart3, Settings, LogOut, DollarSign, Phone, CreditCard, Shield, UserCog } from 'lucide-react'
import { AppData, User, UserRole } from '@/types'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'
import MenuManager from '@/components/MenuManager'
import CategoryManager from '@/components/CategoryManager'
import AdManager from '@/components/AdManager'
import CurrencySettings from '@/components/CurrencySettings'
import ContactManager from '@/components/ContactManager'
import PaymentSettings from '@/components/admin/PaymentSettings'
import PageTransition from '@/components/PageTransition'
import { isAuthenticated, logout, getCurrentUser, hasPermission } from '@/lib/auth'

// Mock data - in real app this would come from API
import mockData from '../../../data/dishes.json'

type AdminView = 'dashboard' | 'menu' | 'categories' | 'ads' | 'currency' | 'contact' | 'payments' | 'users'

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const [data, setData] = useState<AppData>(mockData as AppData)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleLogin = (user: User) => {
    setIsAuth(true)
    setCurrentUser(user)
  }

  const handleLogout = async () => {
    await logout()
    setIsAuth(false)
    setCurrentUser(null)
    setCurrentView('dashboard')
  }

  // Verify authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      setIsVerifying(true)
      
      // Check client-side auth first
      const clientAuth = isAuthenticated()
      
      if (clientAuth) {
        // Verify with server and get user
        const user = await getCurrentUser()
        if (user) {
          setIsAuth(true)
          setCurrentUser(user)
        } else {
          // Clear invalid session
          localStorage.removeItem('adminToken')
        }
      }
      
      setIsVerifying(false)
    }
    
    checkAuth()
  }, [])

  // Show loading while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return <AdminLogin onLogin={(user) => handleLogin(user)} />
  }

  // Role-based navigation items
  const getNavigationItems = () => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: 'view_dashboard' },
    ];

    if (hasPermission(currentUser?.role || 'guest', 'manage_menu')) {
      items.push({ id: 'menu', label: 'Menu Manager', icon: Utensils, permission: 'manage_menu' });
    }

    if (hasPermission(currentUser?.role || 'guest', 'manage_categories')) {
      items.push({ id: 'categories', label: 'Categories', icon: Users, permission: 'manage_categories' });
    }

    if (hasPermission(currentUser?.role || 'guest', 'manage_settings')) {
      items.push(
        { id: 'ads', label: 'Ad Manager', icon: Settings, permission: 'manage_settings' },
        { id: 'currency', label: 'Currency Settings', icon: DollarSign, permission: 'manage_settings' },
        { id: 'contact', label: 'Contact Info', icon: Phone, permission: 'manage_settings' },
        { id: 'payments', label: 'Payment Settings', icon: CreditCard, permission: 'manage_settings' }
      );
    }

    if (hasPermission(currentUser?.role || 'guest', 'manage_users')) {
      items.push({ id: 'users', label: 'User Management', icon: UserCog, permission: 'manage_users' });
    }

    return items;
  };

  return (
    <PageTransition type="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-yellow-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-yellow-400">Admin Panel</h1>
              <span className="text-sm text-gray-500 dark:text-gray-300">Port San Antonio Resort</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {currentUser?.username} ({currentUser?.role})
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="w-64 space-y-2">
            {getNavigationItems().map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AdminView)}
                  className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminDashboard data={data} />
                </motion.div>
              )}

              {currentView === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MenuManager dishes={data.dishes} categories={data.categories} onUpdate={(dishes) => setData({ ...data, dishes })} />
                </motion.div>
              )}

              {currentView === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CategoryManager data={data} onDataChange={setData} />
                </motion.div>
              )}

              {currentView === 'ads' && (
                <motion.div
                  key="ads"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdManager data={data} onDataChange={setData} />
                </motion.div>
              )}

              {currentView === 'currency' && (
                <motion.div
                  key="currency"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrencySettings />
                </motion.div>
              )}

              {currentView === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactManager />
                </motion.div>
              )}

              {currentView === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PaymentSettings />
                </motion.div>
              )}

              {currentView === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center py-12">
                    <UserCog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      User Management
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      User management interface coming soon...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
      </div>
    </PageTransition>
  )
}
