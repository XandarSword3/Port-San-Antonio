'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Settings, Shield } from 'lucide-react'
import { useCookieConsent, COOKIE_CATEGORIES, CookieConsent } from '@/lib/cookies'
import { useLanguage } from '@/contexts/LanguageContext'

interface CookieConsentBannerProps {
  position?: 'bottom' | 'top'
}

export default function CookieConsentBanner({ position = 'bottom' }: CookieConsentBannerProps) {
  const { t } = useLanguage()
  const { needsConsent, acceptAll, acceptNecessaryOnly, saveConsent } = useCookieConsent()
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [customConsent, setCustomConsent] = useState<Record<string, boolean>>({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true
  })

  useEffect(() => {
    // Show banner after a short delay if consent is needed
    if (needsConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [needsConsent])

  const handleAcceptAll = () => {
    acceptAll()
    setIsVisible(false)
  }

  const handleAcceptNecessary = () => {
    acceptNecessaryOnly()
    setIsVisible(false)
  }

  const handleSaveCustom = () => {
    saveConsent(customConsent as Partial<CookieConsent>)
    setIsVisible(false)
    setShowDetails(false)
  }

  const handleCustomConsentChange = (category: string, enabled: boolean) => {
    if (category === 'necessary') return // Can't disable necessary cookies
    setCustomConsent(prev => ({ ...prev, [category]: enabled }))
  }

  if (!needsConsent || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
        className={`fixed ${position === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0 z-[200] bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-2xl`}
      >
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {!showDetails ? (
            // Simple Banner
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cookies help us provide analytics and improve your browsing experience. 
                    They're completely optional - you can use our website fully without them.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Customize
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm bg-resort-600 hover:bg-resort-700 text-white rounded-lg transition-colors font-medium"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Detailed Settings
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-resort-600" />
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose which types of cookies you're comfortable with. Essential cookies are required for the site to function.
              </p>

              <div className="grid gap-4">
                {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </h4>
                          {category.required && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {category.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Examples: {category.examples.join(', ')}
                        </p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customConsent[key] ?? false}
                            onChange={(e) => handleCustomConsentChange(key, e.target.checked)}
                            disabled={category.required}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-resort-300 dark:peer-focus:ring-resort-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-resort-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="px-6 py-2 text-sm bg-resort-600 hover:bg-resort-700 text-white rounded-lg transition-colors font-medium"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
