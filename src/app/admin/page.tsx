'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Users, Utensils, BarChart3, Settings, LogOut, DollarSign, Phone } from 'lucide-react'
import { AppData } from '@/types'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'
import MenuManager from '@/components/MenuManager'
import CategoryManager from '@/components/CategoryManager'
import AdManager from '@/components/AdManager'
import CurrencySettings from '@/components/CurrencySettings'
import ContactManager from '@/components/ContactManager'

// Mock data - in real app this would come from API
import mockData from '../../../data/dishes.json'

type AdminView = 'dashboard' | 'menu' | 'categories' | 'ads' | 'currency' | 'contact'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const [data, setData] = useState<AppData>(mockData as AppData)

  const handleLogin = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem('adminAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView('dashboard')
    sessionStorage.removeItem('adminAuthenticated')
  }

  // Check for existing admin session on load
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminAuthenticated')
    if (adminSession === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-yellow-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-yellow-400">Admin Panel</h1>
              <span className="text-sm text-gray-500 dark:text-gray-300">Port San Antonio Resort</span>
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
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="w-64 space-y-2">
            <motion.button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </motion.button>

            <motion.button
              onClick={() => setCurrentView('menu')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                currentView === 'menu'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Utensils className="h-5 w-5" />
              Menu Manager
            </motion.button>

            <motion.button
              onClick={() => setCurrentView('categories')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                currentView === 'categories'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="h-5 w-5" />
              Categories
            </motion.button>

            <motion.button
              onClick={() => setCurrentView('ads')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                currentView === 'ads'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="h-5 w-5" />
              Ad Manager
            </motion.button>

            <motion.button
              onClick={() => setCurrentView('currency')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                currentView === 'currency'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <DollarSign className="h-5 w-5" />
              Currency Settings
            </motion.button>

            <motion.button
              onClick={() => setCurrentView('contact')}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                currentView === 'contact'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="h-5 w-5" />
              Contact Info
            </motion.button>
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
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
