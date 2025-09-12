'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Check, Shield } from 'lucide-react'
import { updateConsent } from '@/lib/tracker'
import { useLanguage } from '@/contexts/LanguageContext'

interface CookieConsentProps {
  className?: string
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('ps_consent') || getCookie('ps_consent')
    
    if (!hasConsent) {
      // Small delay to allow page to load
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift()
      return cookieValue ? decodeURIComponent(cookieValue) : null
    }
    
    return null
  }

  const handleConsent = async (accepted: boolean) => {
    setIsLoading(true)
    
    try {
      // Update tracker consent
      updateConsent(accepted)
      
      // Hide the banner
      setIsVisible(false)
      
      // Optional: track the consent decision itself (only if accepted)
      if (accepted && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        })
      }
    } catch (error) {
      console.error('Error updating consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const consentTexts = {
    en: {
      title: 'Cookie Preferences',
      description: 'We use cookies to improve your browsing experience and analyze website traffic. This helps us provide better service and understand how visitors use our site.',
      accept: 'Accept Analytics',
      reject: 'Essential Only',
      learnMore: 'Learn More',
      details: 'We only collect anonymous usage data to improve our restaurant experience. No personal information is stored.'
    },
    ar: {
      title: 'تفضيلات الكوكيز',
      description: 'نحن نستخدم الكوكيز لتحسين تجربة التصفح وتحليل حركة الموقع. هذا يساعدنا في تقديم خدمة أفضل وفهم كيفية استخدام الزوار لموقعنا.',
      accept: 'قبول التحليلات',
      reject: 'الأساسي فقط',
      learnMore: 'اعرف أكثر',
      details: 'نحن نجمع فقط بيانات الاستخدام المجهولة لتحسين تجربة المطعم. لا يتم تخزين أي معلومات شخصية.'
    },
    fr: {
      title: 'Préférences des Cookies',
      description: 'Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic du site. Cela nous aide à fournir un meilleur service.',
      accept: 'Accepter Analytics',
      reject: 'Essentiels Seulement',
      learnMore: 'En Savoir Plus',
      details: 'Nous ne collectons que des données d\'utilisation anonymes pour améliorer l\'expérience du restaurant.'
    }
  }

  const texts = consentTexts.en // Default to English, can be enhanced with language context

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {texts.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {texts.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {texts.details}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Learn More Button */}
              <button
                onClick={() => {
                  // Could open a privacy policy modal or navigate to privacy page
                  window.open('/privacy', '_blank')
                }}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                disabled={isLoading}
              >
                <Shield className="w-3 h-3" />
                {texts.learnMore}
              </button>

              {/* Reject Button */}
              <button
                onClick={() => handleConsent(false)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                {texts.reject}
              </button>

              {/* Accept Button */}
              <button
                onClick={() => handleConsent(true)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Check className="w-4 h-4" />
                {isLoading ? 'Saving...' : texts.accept}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar for visual feedback */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="h-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieConsent
