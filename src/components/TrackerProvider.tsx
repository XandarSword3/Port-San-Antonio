'use client'

import React, { useEffect } from 'react'
import { initTracker, track } from '@/lib/tracker'

interface TrackerProviderProps {
  children: React.ReactNode
}

/**
 * TrackerProvider initializes the visitor tracking system and handles automatic page_view events
 */
export default function TrackerProvider({ children }: TrackerProviderProps) {
  useEffect(() => {
    // Initialize tracker on client-side only
    const tracker = initTracker()
    
    // Track initial page view
    track('page_view', {
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    })

    // Track route changes in Next.js
    const handleRouteChange = () => {
      // Small delay to ensure URL has updated
      setTimeout(() => {
        track('page_view', {
          path: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        })
      }, 100)
    }

    // Listen for Next.js route changes (popstate for back/forward navigation)
    window.addEventListener('popstate', handleRouteChange)
    
    // Listen for programmatic navigation (pushState/replaceState)
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      handleRouteChange()
    }

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      handleRouteChange()
    }

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  return <>{children}</>
}
