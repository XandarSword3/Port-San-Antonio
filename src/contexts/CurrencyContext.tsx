'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLanguage } from './LanguageContext'

// Helper function to convert Western numerals to Eastern Arabic numerals
const convertToArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)])
}

export type Currency = 'USD' | 'LBP'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: number
  setExchangeRate: (rate: number) => void
  formatPrice: (price: number, originalCurrency?: string) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('LBP')
  const [exchangeRate, setExchangeRateState] = useState<number>(90000) // USD to LBP rate
  const { language } = useLanguage()

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('currency') as Currency | null
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'LBP')) {
      setCurrencyState(savedCurrency)
    } else {
      // Default to LBP for Lebanese resort context
      setCurrencyState('LBP')
    }

    // Load exchange rate from localStorage
    const savedRate = localStorage.getItem('exchangeRate')
    if (savedRate) {
      const rate = parseFloat(savedRate)
      if (!isNaN(rate) && rate > 0) {
        setExchangeRateState(rate)
      }
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const setExchangeRate = (rate: number) => {
    setExchangeRateState(rate)
    localStorage.setItem('exchangeRate', rate.toString())
  }

  const formatPrice = (price: number, originalCurrency: string = 'USD'): string => {
    let formattedPrice = ''
    
    if (currency === 'LBP' && originalCurrency === 'USD') {
      const lbpPrice = Math.round(price * exchangeRate)
      formattedPrice = `${lbpPrice.toLocaleString()} ل.ل.`
    } else if (currency === 'USD' && originalCurrency === 'LBP') {
      const usdPrice = (price / exchangeRate).toFixed(2)
      formattedPrice = `$${usdPrice}`
    } else if (currency === 'USD') {
      formattedPrice = `$${price.toFixed(2)}`
    } else {
      formattedPrice = `${price.toLocaleString()} ${originalCurrency}`
    }
    
    // Convert to Arabic numerals if language is Arabic
    if (language === 'ar') {
      formattedPrice = convertToArabicNumerals(formattedPrice)
    }
    
    return formattedPrice
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRate,
      setExchangeRate,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
