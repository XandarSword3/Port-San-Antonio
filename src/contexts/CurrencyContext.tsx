'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    if (currency === 'LBP' && originalCurrency === 'USD') {
      const lbpPrice = Math.round(price * exchangeRate)
      return `${lbpPrice.toLocaleString()} LBP`
    }
    
    if (currency === 'USD' && originalCurrency === 'LBP') {
      const usdPrice = (price / exchangeRate).toFixed(2)
      return `$${usdPrice} USD`
    }

    // Same currency or USD display
    if (currency === 'USD') {
      return `$${price.toFixed(2)} USD`
    }
    
    return `${price.toLocaleString()} ${originalCurrency}`
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
