'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslation, shouldTranslate } from '@/lib/translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Initialize language from localStorage
    const savedLang = localStorage.getItem('language') as Language | null
    if (savedLang && (savedLang === 'en' || savedLang === 'ar' || savedLang === 'fr')) {
      setLanguageState(savedLang)
      updateDocumentAttributes(savedLang)
    } else {
      updateDocumentAttributes('en')
    }
  }, [])

  const updateDocumentAttributes = (lang: Language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      
      // Add or remove RTL class for better styling
      if (lang === 'ar') {
        document.body.classList.add('rtl')
      } else {
        document.body.classList.remove('rtl')
      }
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    updateDocumentAttributes(lang)
  }

  // Translation function
  const t = (key: string) => {
    try {
      // Always translate UI elements
      return getTranslation(language, key as any) || key
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}