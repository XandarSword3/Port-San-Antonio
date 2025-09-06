'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LoadingContextType {
  isInitialLoading: boolean
  setInitialLoadingComplete: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Always show loading animation on homepage visit - no sessionStorage check
  useEffect(() => {
    // Always start with loading true for homepage
    setIsInitialLoading(true)
  }, [])

  const setInitialLoadingComplete = () => {
    setIsInitialLoading(false)
    // Removed sessionStorage persistence so it shows every time
  }

  return (
    <LoadingContext.Provider value={{
      isInitialLoading,
      setInitialLoadingComplete
    }}>
      {children}
    </LoadingContext.Provider>
  )
}
