'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Currency = 'USD' | 'LBP' | 'JMD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: number
  setExchangeRate: (rate: number) => void
  jmdRate: number
  setJmdRate: (rate: number) => void
  formatPrice: (price: number, originalCurrency?: string) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('LBP')
  const [exchangeRate, setExchangeRateState] = useState<number>(90000) // USD to LBP rate
  const [jmdRate, setJmdRateState] = useState<number>(155) // USD to JMD rate (approx)

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('currency') as Currency | null
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'LBP' || savedCurrency === 'JMD')) {
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

    const savedJmd = localStorage.getItem('jmdRate')
    if (savedJmd) {
      const rate = parseFloat(savedJmd)
      if (!isNaN(rate) && rate > 0) {
        setJmdRateState(rate)
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

  const setJmdRate = (rate: number) => {
    setJmdRateState(rate)
    localStorage.setItem('jmdRate', rate.toString())
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

    if (currency === 'JMD' && originalCurrency === 'USD') {
      const jmd = Math.round(price * jmdRate)
      return `${jmd.toLocaleString()} JMD`
    }

    if (currency === 'USD' && originalCurrency === 'JMD') {
      const usd = (price / jmdRate).toFixed(2)
      return `$${usd} USD`
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
      jmdRate,
      setJmdRate,
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
