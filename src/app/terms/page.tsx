'use client'

import { motion } from 'framer-motion'
import { FileText, AlertTriangle, Scale, CreditCard } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'

export default function TermsPage() {
  const { t, language } = useLanguage()

  const lastUpdated = "September 2025"

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
                  <FileText className="w-8 h-8 text-blue-600" />
                  {t('terms')}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Agreement to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Port Antonio Resort reserves the right to update these terms at any time.
              </p>
            </div>

            {/* Use of Services */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Use of Our Services
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Permitted Use</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Browse our menu and make reservations</li>
                    <li>Access information about our services</li>
                    <li>Use our website for legitimate business purposes</li>
                    <li>Contact us for inquiries and support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prohibited Use</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Impersonate another person or entity</li>
                    <li>Interfere with or disrupt our services</li>
                    <li>Use our services for spam or unauthorized marketing</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reservations and Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Reservations and Payments
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Booking Policy</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All reservations are subject to availability</li>
                    <li>We reserve the right to refuse service to anyone</li>
                    <li>Large group bookings may require advance deposit</li>
                    <li>Special dietary requirements must be communicated in advance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cancellation Policy</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Standard reservations can be canceled up to 2 hours before</li>
                    <li>Large group bookings require 24-hour cancellation notice</li>
                    <li>No-shows may be subject to cancellation fees</li>
                    <li>Weather-related cancellations will be handled case by case</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We accept major credit cards and cash</li>
                    <li>Payment is due upon service completion</li>
                    <li>Gratuity is optional but appreciated</li>
                    <li>Disputed charges must be reported within 30 days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Liability */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                Limitation of Liability
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  Port Antonio Resort shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our services. Our total liability shall not exceed the amount paid for services.
                </p>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Food Safety</h3>
                  <p>
                    While we maintain the highest standards of food safety and preparation, we cannot guarantee that our food is free from allergens. Please inform us of any allergies or dietary restrictions.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Intellectual Property
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  All content on this website, including text, graphics, logos, images, and software, is the property of Port Antonio Resort and is protected by copyright and trademark laws.
                </p>
                <p>
                  You may not reproduce, distribute, or create derivative works from our content without express written permission.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after changes indicates your acceptance of the new terms.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Questions About These Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>Email:</strong> legal@portantonio.com</p>
                <p><strong>Phone:</strong> +1 (876) 555-0123</p>
                <p><strong>Address:</strong> Port Antonio, Mastita, Lebanon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
