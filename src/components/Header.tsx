'use client'

import Link from 'next/link'
import { Search, Settings, Globe, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en'
    setLanguage(newLang)
    console.log('Language toggled:', newLang)
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-md z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-bold text-white hover:text-resort-300 transition-colors">
          {t('siteTitle')}
        </Link>
        <nav className="hidden md:flex gap-3 items-center">
          <Link 
            href="/menu" 
            className="text-sm px-3 py-2 rounded hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            {t('menu')}
          </Link>
          <Link 
            href="/admin" 
            className="text-sm px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Admin panel"
          >
            {t('admin')}
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Search Button */}
        <button className="p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
        >
          <Globe className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
