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
    const order: ('USD'|'LBP'|'EUR')[] = ['USD','LBP','EUR']
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
      <header data-testid="global-header" className="fixed top-0 inset-inline-0 w-full flex items-center justify-between px-4 py-3 bg-luxury-light-card/90 dark:bg-luxury-dark-bg/95 backdrop-blur-md z-[110] border-b border-luxury-light-border/20 dark:border-luxury-dark-border/20 shadow-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Site Logo & Resort Name */}
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-luxury-light-text dark:text-luxury-dark-text hover:text-luxury-light-accent dark:hover:text-luxury-dark-accent transition-colors accent-element">
            <img 
              src="/Photos/Logo.jpg" 
              alt="Port Antonio Resort Logo" 
              className="w-10 h-10 rounded-lg object-cover shadow-sm flex-shrink-0"
            />
            <span className="hidden sm:block">Port Antonio Resort</span>
            <Waves className="w-5 h-5 text-blue-500 animate-pulse" />
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {/* Cart Indicator - Mobile Optimized */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg hover:bg-luxury-light-warm/20 dark:hover:bg-luxury-dark-card text-luxury-light-text/70 dark:text-luxury-dark-muted transition-colors"
            aria-label={`${t('cart')} (${getTotalItems()} ${t('items')})`}
            data-testid="cart-indicator"
          >
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* Currency Toggle - Mobile Optimized */}
          <button 
            onClick={toggleCurrency}
            className="p-2 rounded-lg lebanese-btn text-white transition-colors touch-target"
            aria-label={`Switch currency. Current: ${currency}`}
            data-testid="currency-toggle"
          >
            <span className="text-xs font-bold">{currency}</span>
          </button>

          {/* Language Toggle - Mobile Optimized */}
          <button 
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-luxury-light-warm/20 dark:hover:bg-luxury-dark-card text-luxury-light-text/70 dark:text-luxury-dark-muted transition-colors touch-target"
            aria-label={`Switch language. Current: ${language.toUpperCase()}`}
            data-testid="language-toggle"
          >
            <span className="text-xs font-bold">{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle - Mobile Optimized */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-luxury-light-warm/20 dark:hover:bg-luxury-dark-card text-luxury-light-text/70 dark:text-luxury-dark-muted transition-colors touch-target"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            data-testid="theme-toggle"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Hamburger Menu - Now on the right */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleSidebar()
            }}
            className="p-2 rounded-lg hover:bg-luxury-light-warm/20 dark:hover:bg-luxury-dark-card text-luxury-light-text/70 dark:text-luxury-dark-muted transition-colors touch-target"
            aria-label="Toggle sidebar menu"
            data-testid="hamburger"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onStaffLoginClick={() => setShowLoginModal(true)}
      />
      
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