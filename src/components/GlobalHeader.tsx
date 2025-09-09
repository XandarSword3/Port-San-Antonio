'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Globe, Sun, Moon, DollarSign, ShoppingCart, Waves, Shell, Anchor, Home, ShoppingBag, TreePine, Mountain, LogOut, Lock } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import CartModal from '@/components/CartModal'
import CartSidebar from '@/components/CartSidebar'
import LoginModal from '@/components/LoginModal'

export default function GlobalHeader() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { currency, setCurrency } = useCurrency()
  const { getTotalItems } = useCart()
  const { isLoggedIn, userRole, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFullCartOpen, setIsFullCartOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()

  const toggleLanguage = () => {
    const order: ('en'|'ar'|'fr')[] = ['en','ar','fr']
    const idx = order.indexOf(language as any)
    const next = order[(idx + 1) % order.length]
    setLanguage(next as any)
    console.log('Language toggled:', next)
  }

  const toggleCurrency = () => {
    const order: ('USD'|'LBP')[] = ['USD','LBP']
    const idx = order.indexOf(currency as any)
    const next = order[(idx + 1) % order.length]
    setCurrency(next as any)
  }

  const toggleSidebar = () => {
    console.log('hamburger: open', !sidebarOpen)
    setSidebarOpen(prev => {
      console.log('Sidebar state changing from', prev, 'to', !prev)
      return !prev
    })
  }

  return (
    <>
      <header data-testid="global-header" className="fixed top-0 inset-inline-0 w-full flex items-center justify-between px-6 py-3 bg-white/90 dark:bg-beach-dark-bg/95 backdrop-blur-md z-[110] border-b border-gray-200 dark:border-beach-dark-muted/20 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleSidebar()
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors"
            aria-label="Toggle sidebar menu"
            data-testid="hamburger"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Site Logo & Title */}
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-beach-dark-text hover:text-resort-500 dark:hover:text-beach-dark-accent transition-colors accent-element">
            <img 
              src="/Photos/Logo.jpg" 
              alt="Port San Antonio Resort Logo" 
              className="w-10 h-10 rounded-lg object-cover shadow-sm"
            />
            <span>{t('siteTitle')}</span>
            <Mountain className="w-4 h-4 text-amber-500" />
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex gap-3 items-center">
            <Link 
              href="/menu" 
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-beach-dark-card ${pathname === '/menu' ? 'text-resort-500 dark:text-beach-dark-accent accent-element' : 'text-gray-700 dark:text-beach-dark-muted text-muted'} transition-colors`}
            >
              <Anchor className="w-4 h-4" />
              {t('menu')}
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/admin" 
                  className={`text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-beach-dark-card ${pathname === '/admin' ? 'text-resort-500 dark:text-beach-dark-accent accent-element' : 'text-gray-700 dark:text-beach-dark-muted text-muted'} transition-colors flex items-center gap-2`}
                  aria-label="Admin panel"
                >
                  <Lock className="w-4 h-4" />
                  {t('admin')} ({userRole})
                </Link>
                <button
                  onClick={logout}
                  className="text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors flex items-center gap-2"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors flex items-center gap-2"
                aria-label="Staff login"
              >
                <Lock className="w-4 h-4" />
                Staff Login
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Cart Indicator with Lebanese Basket */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors wave-ripple"
            aria-label={`${t('cart')} (${getTotalItems()} ${t('items')})`}
            data-testid="cart-indicator"
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">{t('cart')}</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* Currency Toggle with Lebanese Button */}
          <button 
            onClick={toggleCurrency}
            className="flex items-center gap-2 px-3 py-2 rounded-lg lebanese-btn text-white transition-colors"
            aria-label={`Switch currency. Current: ${currency}`}
            data-testid="currency-toggle"
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">{currency}</span>
          </button>

          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors"
            aria-label={`Switch language. Current: ${language.toUpperCase()}`}
            data-testid="language-toggle"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            data-testid="theme-toggle"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-sm font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onOpenFullCart={() => {
          setIsCartOpen(false);
          setIsFullCartOpen(true);
        }}
      />

      {/* Full Cart Sidebar */}
      <CartSidebar isOpen={isFullCartOpen} onClose={() => setIsFullCartOpen(false)} />

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}