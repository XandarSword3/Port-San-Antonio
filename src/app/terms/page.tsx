'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, AlertTriangle, Scale, CreditCard } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'
import { LegalPageContent } from '@/types'

export default function TermsPage() {
  const { t, language } = useLanguage()
  const [legalContent, setLegalContent] = useState<LegalPageContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLegalContent = async () => {
      try {
        // Load from Supabase API only - no fallback
        const res = await fetch('/api/legal', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          const termsPage = json.legalPages?.find((page: any) => page.type === 'terms')
          if (termsPage) {
            setLegalContent(termsPage)
          }
        }
      } catch (error) {
        console.error('Error loading legal content:', error)
      }
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
            {/* Render sections from database */}
            {legalContent?.sections?.map((section: any, index: number) => (
              <div key={section.id || index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            )) || (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 text-center">
                <p className="text-yellow-800 dark:text-yellow-200">
                  Terms of service content is not available. Please contact the administrator.
                </p>
              </div>
            )}
          </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
