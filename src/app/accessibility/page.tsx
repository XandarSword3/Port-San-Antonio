'use client'

import { motion } from 'framer-motion'
import { Accessibility, Eye, Ear, Keyboard, Smartphone, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'

export default function AccessibilityPage() {
  const { t, language } = useLanguage()

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
                  <Accessibility className="w-8 h-8 text-blue-600" />
                  {t('accessibility')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Our commitment to making Port Antonio Resort accessible to everyone
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
            {/* Our Commitment */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Our Commitment
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At Port Antonio Resort, we believe that everyone should be able to enjoy exceptional dining experiences. We are committed to ensuring that our website and physical facilities are accessible to people with disabilities and conform to accessibility standards.
              </p>
            </div>

            {/* Website Accessibility */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
                Website Accessibility Features
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-green-600" />
                      Visual Accessibility
                    </h3>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-6">
                      <li>• High contrast colors for better readability</li>
                      <li>• Large, clear fonts and scalable text</li>
                      <li>• Alternative text for all images</li>
                      <li>• Screen reader compatibility</li>
                      <li>• Dark mode support for reduced eye strain</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Keyboard className="w-5 h-5 text-purple-600" />
                      Navigation Accessibility
                    </h3>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-6">
                      <li>• Full keyboard navigation support</li>
                      <li>• Skip links for main content</li>
                      <li>• Logical tab order and focus indicators</li>
                      <li>• ARIA labels for screen readers</li>
                      <li>• Reduced motion options</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Physical Location Accessibility
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  For information about physical accessibility features at our resort location, please contact us directly. We're happy to discuss specific accommodation needs and provide detailed information about our facilities.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact for Accessibility Information</h3>
                  <ul className="space-y-1 text-sm">
                    <li>📞 Phone: Contact us for specific accessibility details</li>
                    <li>📧 Email: accessibility@portsanantonio.com</li>
                    <li>💬 In-person: Speak with our staff about your needs</li>
                  </ul>
                </div>
                
                <p className="text-sm">
                  We are committed to providing equal access to all guests and continuously work to improve our accessibility features. Please let us know how we can best accommodate your visit.
                </p>
              </div>
            </div>

            {/* Language Support */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Multi-Language Support
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  Our website is available in multiple languages to serve our diverse community:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">English</h3>
                    <p className="text-sm">Full website support</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">العربية</h3>
                    <p className="text-sm">Right-to-left layout</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Français</h3>
                    <p className="text-sm">Complete translation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standards Compliance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Standards Compliance
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  We strive to meet or exceed the following accessibility standards:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
                  <li><strong>ADA Compliance:</strong> Americans with Disabilities Act standards</li>
                  <li><strong>Section 508:</strong> Federal accessibility requirements</li>
                  <li><strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act</li>
                </ul>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Feedback Matters
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  We are continuously working to improve accessibility at Port Antonio Resort. If you encounter any barriers or have suggestions for improvement, please let us know.
                </p>
                <div className="space-y-2">
                  <p><strong>Accessibility Coordinator:</strong></p>
                  <p><strong>Email:</strong> accessibility@portantonio.com</p>
                  <p><strong>Phone:</strong> +1 (876) 555-0123</p>
                  <p><strong>Address:</strong> Port Antonio, Mastita, Lebanon</p>
                </div>
                <p className="text-sm">
                  We will respond to accessibility feedback within 48 hours and work to address any issues as quickly as possible.
                </p>
              </div>
            </div>

            {/* Third-Party Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Recommended Accessibility Tools
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  While our website is designed to be accessible, you may find these tools helpful:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Screen Readers:</strong> NVDA, JAWS, VoiceOver</li>
                  <li><strong>Browser Extensions:</strong> High contrast, zoom tools</li>
                  <li><strong>Voice Recognition:</strong> Dragon NaturallySpeaking</li>
                  <li><strong>Keyboard Navigation:</strong> Built-in browser shortcuts</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
