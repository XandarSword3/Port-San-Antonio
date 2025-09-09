'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X, Facebook, Instagram, Youtube, Home, Menu, Settings, Mail, Lock, Accessibility, Volume2 } from 'lucide-react'
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
  
  // Animation toggle state
  const [reducedMotion, setReducedMotion] = useState(false)
  
  // Ambient sounds state
  const [ambientEnabled, setAmbientEnabled] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

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

  // Animation toggle functions
  useEffect(() => {
    // Check for user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const savedPreference = localStorage.getItem('reducedMotion')
    
    if (savedPreference !== null) {
      setReducedMotion(savedPreference === 'true')
    } else {
      setReducedMotion(prefersReducedMotion)
    }

    // Apply reduced motion styles
    applyReducedMotion(reducedMotion)
  }, [reducedMotion])

  const applyReducedMotion = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--animation-iteration-count', '1')
      root.classList.add('reduced-motion')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--animation-iteration-count')
      root.classList.remove('reduced-motion')
    }
  }

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem('reducedMotion', newValue.toString())
    applyReducedMotion(newValue)
  }

  // Ambient sounds functions
  useEffect(() => {
    // Only enable on user interaction to avoid autoplay issues
    const handleUserInteraction = () => {
      if (!ambientEnabled && !audioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          setAudioContext(ctx)
          setAmbientEnabled(true)
        } catch (error) {
          console.log('Audio not supported')
        }
      }
    }

    // Add event listeners for user interaction if ambient sounds are enabled
    if (ambientEnabled) {
      document.addEventListener('click', handleUserInteraction, { once: true })
      document.addEventListener('touchstart', handleUserInteraction, { once: true })
    }

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [ambientEnabled, audioContext])

  useEffect(() => {
    if (!audioContext || !ambientEnabled) return

    // Create ocean wave sound using Web Audio API
    const createOceanWave = () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      // Configure filter for ocean-like sound
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, audioContext.currentTime)
      filter.Q.setValueAtTime(1, audioContext.currentTime)

      // Configure oscillator for wave sound
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(0.1, audioContext.currentTime)

      // Configure gain for volume control
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3)

      // Connect nodes
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Start and stop
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 3)
    }

    // Play ocean wave sound periodically
    const waveInterval = setInterval(createOceanWave, 8000)

    return () => {
      clearInterval(waveInterval)
    }
  }, [audioContext, ambientEnabled])

  const toggleAmbientSounds = () => {
    setAmbientEnabled(!ambientEnabled)
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
                    <span>{t('staffLogin')}</span>
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

              {/* Settings Section */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('settings')}</h3>
                <div className="space-y-3">
                  {/* Animation Toggle */}
                  <button
                    onClick={toggleReducedMotion}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      reducedMotion 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Accessibility className="w-5 h-5" />
                      <span className="text-sm font-medium">{t('animation')}</span>
                    </div>
                    <span className="text-xs">
                      {reducedMotion ? t('enableAnimations') : t('disableAnimations')}
                    </span>
                  </button>

                  {/* Ambient Sounds Toggle */}
                  <button
                    onClick={toggleAmbientSounds}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      ambientEnabled 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5" />
                      <span className="text-sm font-medium">{t('ambientSounds')}</span>
                    </div>
                    <span className="text-xs">
                      {ambientEnabled ? t('disableAmbientSounds') : t('enableAmbientSounds')}
                    </span>
                  </button>
                </div>
              </div>

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