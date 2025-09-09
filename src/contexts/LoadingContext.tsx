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
  // Always start with loading true to avoid hydration mismatch
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [hasCheckedVisit, setHasCheckedVisit] = useState(false)

  useEffect(() => {
    // Check if user has visited before - client-side only
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (hasVisited) {
      // User has visited before, skip loading animation
      setIsInitialLoading(false)
    } else {
      // First visit, mark as visited
      sessionStorage.setItem('hasVisited', 'true')
    }
    setHasCheckedVisit(true)
  }, [])

  const setInitialLoadingComplete = () => {
    setIsInitialLoading(false)
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
