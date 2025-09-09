'use client'

import { useEffect, useRef, useCallback } from 'react'
import { AnalyticsManager } from '../lib/analytics'

// Hook for tracking page views
export const usePageView = (pagePath: string) => {
  useEffect(() => {
    AnalyticsManager.trackPageView(pagePath)
  }, [pagePath])
}

// Hook for tracking item views with intersection observer
export const useItemView = (itemId: string, itemName: string, threshold: number = 0.5) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return

    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            AnalyticsManager.trackItemView(itemId, itemName)
          } else {
            AnalyticsManager.trackItemViewEnd(itemId, itemName)
          }
        })
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      AnalyticsManager.trackItemViewEnd(itemId, itemName)
    }
  }, [itemId, itemName, threshold])

  return elementRef
}

// Hook for tracking clicks
export const useClickTracking = () => {
  const trackClick = useCallback((itemId: string, itemName: string, event?: MouseEvent) => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return

    const position = event ? { x: event.clientX, y: event.clientY } : undefined
    AnalyticsManager.trackItemClick(itemId, itemName, position)
  }, [])

  return trackClick
}

// Hook for tracking long press
export const useLongPress = (
  onLongPress: () => void,
  itemId: string,
  itemName: string,
  ms: number = 500
) => {
  const timerRef = useRef<NodeJS.Timeout>()

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return

    // Start analytics long press tracking
    AnalyticsManager.trackLongPressStart(itemId, itemName)

    // Start local timer for callback
    timerRef.current = setTimeout(() => {
      onLongPress()
    }, ms)
  }, [onLongPress, itemId, itemName, ms])

  const stop = useCallback(() => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return

    // Stop analytics long press tracking
    AnalyticsManager.trackLongPressEnd(itemId)

    // Clear local timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }, [itemId])

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  }
}

// Hook for tracking cart actions
export const useCartTracking = () => {
  const trackAddToCart = useCallback((itemId: string, itemName: string, quantity: number = 1) => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return
    AnalyticsManager.trackAddToCart(itemId, itemName, quantity)
  }, [])

  const trackPurchaseAttempt = useCallback((itemId: string, itemName: string, success: boolean) => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return
    AnalyticsManager.trackPurchaseAttempt(itemId, itemName, success)
  }, [])

  return { trackAddToCart, trackPurchaseAttempt }
}

// Hook for tracking search
export const useSearchTracking = () => {
  const trackSearch = useCallback((searchTerm: string, resultsCount: number) => {
    if (!AnalyticsManager.hasAnalyticsConsent()) return
    AnalyticsManager.trackSearch(searchTerm, resultsCount)
  }, [])

  return trackSearch
}

// Hook for initializing analytics on app start
export const useAnalyticsInit = () => {
  useEffect(() => {
    AnalyticsManager.initialize()
  }, [])
}

// Hook for getting item analytics (for admin components)
export const useItemAnalytics = (itemId?: string) => {
  const getAnalytics = useCallback(() => {
    if (itemId) {
      return AnalyticsManager.getItemAnalyticsById(itemId)
    }
    return AnalyticsManager.getItemAnalytics()
  }, [itemId])

  return getAnalytics
}
