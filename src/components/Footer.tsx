'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { FooterSettings } from '@/types'
import InstallPWAButton from '@/components/InstallPWAButton'

export default function Footer() {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    id: 'default',
    companyName: 'Port Antonio Resort',
    description: 'Lebanese luxury dining by the Mediterranean Sea',
    address: 'Mastita, Lebanon',
    phone: '+961 1 234 567',
    email: 'info@portantonioresort.com',
    diningHours: 'Dining Available 24/7',
    diningLocation: 'Mediterranean Terrace & Lebanese Garden',
    socialLinks: {},
    lastUpdated: new Date(),
    updatedBy: 'system'
  })

  const currentYear = new Date().getFullYear()

  // Load footer settings from API (Supabase)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/footer', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          const f = json.footer
          if (f) {
            setFooterSettings({
              id: f.id,
              companyName: f.company_name,
              description: f.description,
              address: f.address,
              phone: f.phone,
              email: f.email,
              diningHours: f.dining_hours,
              diningLocation: f.dining_location,
              socialLinks: f.social_links || {},
              lastUpdated: new Date(f.updated_at || Date.now()),
              updatedBy: 'admin'
            })
          }
        }
      } catch (e) {}
    }
    load()
  }, [])

  return (
    <footer className={`${isDark ? 'bg-luxury-dark-bg' : 'bg-luxury-light-bg'} ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'} wave-separator transition-colors duration-300`}>
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
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'} flex items-center gap-2`}>
              <span>⚓</span>
              {footerSettings.companyName}
            </h3>
            <p className={`${isDark ? 'text-luxury-dark-text/80' : 'text-luxury-light-text/70'} mb-4`}>
              {footerSettings.description}
            </p>
            <div className={`flex items-center gap-2 ${isDark ? 'text-luxury-dark-text/80' : 'text-luxury-light-text/70'}`}>
              <MapPin className="w-4 h-4" />
              <span>{footerSettings.address}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'} flex items-center gap-2`}>
              🐚
              {t('contact')}
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-2 ${isDark ? 'text-luxury-dark-text/80' : 'text-luxury-light-text/70'}`}>
                <Phone className="w-4 h-4" />
                <span>{footerSettings.phone}</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-luxury-dark-text/80' : 'text-luxury-light-text/70'}`}>
                <Mail className="w-4 h-4" />
                <span>{footerSettings.email}</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-luxury-dark-text/80' : 'text-luxury-light-text/70'}`}>
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
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'} flex items-center gap-2`}>
              🏖️
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/menu" className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors`}>
                  {t('menu')}
                </a>
              </li>
              <li>
                <a href={`tel:${footerSettings.phone.replace(/\s+/g, '')}`} className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors flex items-center gap-2`}>
                  <Phone className="w-4 h-4" />
                  {t('callUs')} - {t('reservations')}
                </a>
              </li>
              <li>
                <a href="/events" className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors`}>
                  {t('events')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'} flex items-center gap-2`}>
              ⚓
              {t('legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors`}>
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors`}>
                  {t('terms')}
                </a>
              </li>
              <li>
                <a href="/accessibility" className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors`}>
                  {t('accessibility')}
                </a>
              </li>
              <li>
                <a href="/careers" className={`${isDark ? 'text-luxury-dark-text/80 hover:text-luxury-dark-accent' : 'text-luxury-light-text/70 hover:text-luxury-light-accent'} transition-colors`}>
                  {t('careers')}
                </a>
              </li>
              <li className="mt-4">
                <InstallPWAButton 
                  className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-sky-500 hover:bg-sky-600'} text-white px-3 py-1 rounded text-sm transition-colors`}
                >
                  📱 Install App
                </InstallPWAButton>
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
