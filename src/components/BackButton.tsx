'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface BackButtonProps {
  label?: string
  className?: string
}

export default function BackButton({ label, className = '' }: BackButtonProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const buttonLabel = label || t('back')

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // If no history, go to home page
      router.push('/')
    }
    
    console.log('BackButton clicked')
  }

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-resort-500 dark:hover:text-resort-300 transition-colors ${className}`}
      aria-label={t('goBack')}
      data-testid="back-button"
    >
      <ArrowLeft className="w-4 h-4" />
      {buttonLabel}
    </button>
  )
}