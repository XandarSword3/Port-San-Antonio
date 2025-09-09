'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X, Facebook, Instagram, Youtube, Home, Menu, Settings, Mail, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useTransitionRouter } from '@/hooks/useTransitionRouter'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onStaffLoginClick?: () => void
}

export default function Sidebar({ isOpen, onClose, onStaffLoginClick }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const { isLoggedIn } = useAuth()
  const { navigateWithTransition } = useTransitionRouter()
  const [nameClickCount, setNameClickCount] = useState(0)
  const [showStaffLogin, setShowStaffLogin] = useState(false)

  const handleNameClick = () => {
    const newCount = nameClickCount + 1
    setNameClickCount(newCount)
    
    if (newCount === 5) {
      setShowStaffLogin(true)
      onStaffLoginClick?.()
    }
    
    // Reset counter after 3 seconds of inactivity
    setTimeout(() => {
      setNameClickCount(0)
    }, 3000)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 start-0 h-full w-72 bg-white dark:bg-beach-dark-bg shadow-xl z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation sidebar"
            data-testid="sidebar"
          >
            <div className="flex flex-col h-full p-6">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-beach-dark-text accent-element">{t('siteTitle')}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 mb-8">
                <Link
                  href="/"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted text-muted"
                  onClick={onClose}
                >
                  <Home className="w-5 h-5" />
                  <span>{t('home')}</span>
                </Link>
                <Link
                  href="/menu"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted text-muted"
                  onClick={onClose}
                >
                  <Menu className="w-5 h-5" />
                  <span>{t('menu')}</span>
                </Link>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      onClose()
                      navigateWithTransition('/admin', 'admin')
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-beach-dark-card text-gray-700 dark:text-beach-dark-muted text-muted transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <Settings className="w-5 h-5" />
                    <span>{t('admin')}</span>
                  </button>
                )}
                {showStaffLogin && onStaffLoginClick && (
                  <button
                    onClick={onStaffLoginClick}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-md border-2 border-amber-200 dark:border-amber-800 animate-pulse"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Staff Login</span>
                  </button>
                )}
                <Link
                  href="#contact"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onClick={onClose}
                >
                  <Mail className="w-5 h-5" />
                  <span>{t('contact')}</span>
                </Link>
              </nav>

              {/* Social Links */}
              <div className="mt-auto">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('followUs')}</h3>
                <div className="flex gap-4 mb-6">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>

                {/* Attribution */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Site made by{' '}
                  <button
                    onClick={handleNameClick}
                    className="text-resort-500 dark:text-resort-300 hover:underline focus:outline-none"
                  >
                    Alessandro Abi Safi
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}