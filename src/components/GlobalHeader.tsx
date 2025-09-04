'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Globe, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Sidebar from '@/components/Sidebar'

export default function GlobalHeader() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleLanguage = () => {
    const order: ('en'|'ar'|'fr')[] = ['en','ar','fr']
    const idx = order.indexOf(language as any)
    const next = order[(idx + 1) % order.length]
    setLanguage(next as any)
    console.log('Language toggled:', next)
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
    console.log('Sidebar toggled:', !sidebarOpen)
  }

  return (
    <>
      <header className="fixed top-0 inset-inline-0 w-full flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-beach-dark-bg/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-beach-dark-muted/20 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu */}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors"
            aria-label="Toggle sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Site Title */}
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-beach-dark-text hover:text-resort-500 dark:hover:text-beach-dark-accent transition-colors accent-element">
            {t('siteTitle')}
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex gap-3 items-center">
            <Link 
              href="/menu" 
              className={`text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-beach-dark-card ${pathname === '/menu' ? 'text-resort-500 dark:text-beach-dark-accent accent-element' : 'text-gray-700 dark:text-beach-dark-muted text-muted'} transition-colors`}
            >
              {t('menu')}
            </Link>
            <Link 
              href="/admin" 
              className={`text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-beach-dark-card ${pathname === '/admin' ? 'text-resort-500 dark:text-beach-dark-accent accent-element' : 'text-gray-700 dark:text-beach-dark-muted text-muted'} transition-colors`}
              aria-label="Admin panel"
            >
              {t('admin')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors"
            aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
            data-testid="language-toggle"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}