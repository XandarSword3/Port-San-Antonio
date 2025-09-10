'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, Cookie, Database, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'
import { LegalPageContent } from '@/types'

export default function PrivacyPage() {
  const { t, language } = useLanguage()
  const [legalContent, setLegalContent] = useState<LegalPageContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLegalContent = async () => {
      try {
        // First try to load from Supabase API
        const res = await fetch('/api/legal', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          const privacyPage = json.legalPages?.find((page: any) => page.type === 'privacy')
          if (privacyPage) {
            setLegalContent(privacyPage)
            setLoading(false)
            return
          }
        }
      } catch (error) {
        console.log('Error loading from API, using default content')
      }

      // Fallback to default content
      setLegalContent({
        id: 'default-privacy',
        type: 'privacy',
        title: 'Privacy Policy',
        sections: [
          {
            id: 'intro',
            title: 'Agreement to Terms',
            content: 'By using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Port Antonio Resort reserves the right to update these terms at any time.',
            order: 1
          }
        ],
        lastUpdated: new Date(),
        updatedBy: 'system'
      })
      setLoading(false)
    }
    
    loadLegalContent()
  }, [])

  const lastUpdated = legalContent?.lastUpdated ? new Date(legalContent.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "September 2025"

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  {t('privacy')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At Port Antonio Resort, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and contact information for reservations</li>
                    <li>Email address for newsletters and updates</li>
                    <li>Phone number for booking confirmations</li>
                    <li>Payment information for transactions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP address and browser information</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Device information and screen resolution</li>
                    <li>Referral source and search terms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                How We Use Your Information
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Process reservations and provide our services</li>
                  <li>Send booking confirmations and important updates</li>
                  <li>Improve our website and user experience</li>
                  <li>Send promotional offers and newsletters (with your consent)</li>
                  <li>Comply with legal obligations and prevent fraud</li>
                  <li>Analyze website usage and optimize our services</li>
                </ul>
              </div>
            </div>

            {/* Cookies and Local Storage */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Cookie className="w-6 h-6 text-blue-600" />
                Cookies & Data Storage
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  We use both cookies and local storage to enhance your browsing experience. <strong>All cookies are completely optional</strong> and you can use our website fully without accepting any cookies beyond the essential ones.
                </p>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cookie Categories:</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Essential Cookies (Required)</h4>
                      <p className="text-sm">Necessary for the website to function properly. These include authentication tokens and security preferences.</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Analytics Cookies (Optional)</h4>
                      <p className="text-sm">Help us understand how visitors use our website to improve your experience. Examples: page views, user interactions.</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Preference Cookies (Optional)</h4>
                      <p className="text-sm">Remember your choices like theme, language, and layout preferences for a personalized experience.</p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Marketing Cookies (Optional)</h4>
                      <p className="text-sm">Used to show you relevant content and advertisements. Only set if you provide explicit consent.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Local Storage:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Settings:</strong> Theme, language, currency, and accessibility preferences</li>
                    <li><strong>Session Data:</strong> Admin authentication and temporary user preferences</li>
                    <li><strong>Content:</strong> Menu data and configuration for offline access</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Your Control</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• You can change your cookie preferences at any time</li>
                    <li>• You can use our website fully without optional cookies</li>
                    <li>• Clear your browser data to remove all stored information</li>
                    <li>• We respect your privacy choices completely</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access your personal data we hold</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>Email:</strong> privacy@portantonio.com</p>
                <p><strong>Phone:</strong> +1 (876) 555-0123</p>
                <p><strong>Address:</strong> Port Antonio, Mastita, Lebanon</p>
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
