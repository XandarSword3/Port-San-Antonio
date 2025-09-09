'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { FooterSettings } from '@/types'

export default function Footer() {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    id: 'default',
    companyName: 'Port Antonio Resort',
    description: 'Luxury beachfront resort with world-class dining',
    address: 'Port Antonio, Mastita, Lebanon',
    phone: '+1 (876) 555-0123',
    email: 'info@portantonio.com',
    diningHours: 'Dining Available 24/7',
    diningLocation: 'Main Restaurant & Beachside',
    socialLinks: {},
    lastUpdated: new Date(),
    updatedBy: 'system'
  })

  const currentYear = new Date().getFullYear()

  // Load footer settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('footerSettings')
      if (saved) {
        setFooterSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading footer settings:', error)
    }
  }, [])

  return (
    <footer className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} ${isDark ? 'text-white' : 'text-gray-900'} wave-separator transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Restaurant Info */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
              <span>⚓</span>
              {footerSettings.companyName}
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {footerSettings.description}
            </p>
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <MapPin className="w-4 h-4" />
              <span>{footerSettings.address}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
              🐚
              {t('contact')}
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Phone className="w-4 h-4" />
                <span>{footerSettings.phone}</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Mail className="w-4 h-4" />
                <span>{footerSettings.email}</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Clock className="w-4 h-4" />
                <span>{footerSettings.diningHours}</span>
                {footerSettings.diningLocation && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{footerSettings.diningLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
              🏖️
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/menu" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  {t('menu')}
                </a>
              </li>
              <li>
                <a href={`tel:${footerSettings.phone.replace(/\s+/g, '')}`} className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors flex items-center gap-2`}>
                  <Phone className="w-4 h-4" />
                  {t('callUs')} - {t('reservations')}
                </a>
              </li>
              <li>
                <a href="/events" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  {t('events')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
              ⚓
              {t('legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  {t('terms')}
                </a>
              </li>
              <li>
                <a href="/accessibility" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  {t('accessibility')}
                </a>
              </li>
              <li>
                <a href="/careers" className={`${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                  {t('careers')}
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-300'} mt-8 pt-8 text-center`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              © {currentYear} {footerSettings.companyName}. {t('copyright')} — {t('relaxOnSands')}
            </p>
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Globe className="w-4 h-4" />
              <span>Available in English, العربية, Français</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
