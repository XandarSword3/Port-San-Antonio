'use client'

import { CookieManager } from './cookies'

export interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  lastActivity: number
  pageViews: string[]
  interactions: AnalyticsEvent[]
}

export interface AnalyticsEvent {
  id: string
  sessionId: string
  timestamp: number
  type: 'view' | 'click' | 'long_press' | 'add_to_cart' | 'purchase_attempt' | 'page_view' | 'search'
  itemId?: string
  itemName?: string
  duration?: number // for view events
  position?: { x: number, y: number }
  metadata?: Record<string, any>
}

export interface ItemAnalytics {
  itemId: string
  itemName: string
  totalViews: number
  totalClicks: number
  totalLongPresses: number
  totalAddToCarts: number
  totalPurchaseAttempts: number
  averageViewDuration: number
  averageClicksPerSession: number
  conversionRate: number // cart adds / views
  purchaseConversionRate: number // purchases / cart adds
  popularityScore: number
  lastUpdated: Date
}

export class AnalyticsManager {
  private static SESSION_KEY = 'analytics_session'
  private static EVENTS_KEY = 'analytics_events'
  private static ANALYTICS_KEY = 'item_analytics'
  private static SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

  private static currentSession: UserSession | null = null
  private static viewStartTimes: Map<string, number> = new Map()
  private static longPressTimers: Map<string, NodeJS.Timeout> = new Map()

  // Initialize analytics system
  static initialize(): void {
    if (!this.hasAnalyticsConsent()) {
      console.log('Analytics disabled: no user consent')
      return
    }

    this.initializeSession()
    this.setupEventListeners()
    this.startSessionTracking()
  }

  // Check if user has consented to analytics
  static hasAnalyticsConsent(): boolean {
    return CookieManager.hasConsent('analytics')
  }

  // Initialize or resume user session
  private static initializeSession(): void {
    try {
      const savedSession = CookieManager.getCookie('analytics_session')
      const now = Date.now()

      if (savedSession) {
        const session: UserSession = JSON.parse(savedSession)
        if (now - session.lastActivity < this.SESSION_TIMEOUT) {
          // Resume existing session
          this.currentSession = session
          this.currentSession.lastActivity = now
          this.saveSession()
          return
        }
      }

      // Create new session
      this.currentSession = {
        sessionId: this.generateSessionId(),
        startTime: now,
        lastActivity: now,
        pageViews: [],
        interactions: []
      }
      this.saveSession()
    } catch (error) {
      console.error('Error initializing analytics session:', error)
    }
  }

  // Save current session
  private static saveSession(): void {
    if (!this.currentSession || !this.hasAnalyticsConsent()) return
    
    CookieManager.setCookie('analytics_session', JSON.stringify(this.currentSession), 1, 'analytics')
  }

  // Track page view
  static trackPageView(pagePath: string): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'page_view',
      metadata: { pagePath }
    }

    this.currentSession.pageViews.push(pagePath)
    this.currentSession.lastActivity = Date.now()
    this.recordEvent(event)
    this.saveSession()
  }

  // Track when user starts viewing an item
  static trackItemView(itemId: string, itemName: string): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const startTime = Date.now()
    this.viewStartTimes.set(itemId, startTime)

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: startTime,
      type: 'view',
      itemId,
      itemName
    }

    this.recordEvent(event)
  }

  // Track when user stops viewing an item
  static trackItemViewEnd(itemId: string, itemName: string): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const startTime = this.viewStartTimes.get(itemId)
    if (!startTime) return

    const duration = Date.now() - startTime
    this.viewStartTimes.delete(itemId)

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'view',
      itemId,
      itemName,
      duration
    }

    this.recordEvent(event)
    this.updateItemAnalytics(itemId, itemName, 'view', { duration })
  }

  // Track item click
  static trackItemClick(itemId: string, itemName: string, position?: { x: number, y: number }): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'click',
      itemId,
      itemName,
      position
    }

    this.recordEvent(event)
    this.updateItemAnalytics(itemId, itemName, 'click')
  }

  // Track long press start
  static trackLongPressStart(itemId: string, itemName: string): void {
    if (!this.hasAnalyticsConsent()) return

    // Clear existing timer
    const existingTimer = this.longPressTimers.get(itemId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new timer for long press detection (500ms)
    const timer = setTimeout(() => {
      this.trackLongPress(itemId, itemName)
    }, 500)

    this.longPressTimers.set(itemId, timer)
  }

  // Track long press end
  static trackLongPressEnd(itemId: string): void {
    const timer = this.longPressTimers.get(itemId)
    if (timer) {
      clearTimeout(timer)
      this.longPressTimers.delete(itemId)
    }
  }

  // Track confirmed long press
  private static trackLongPress(itemId: string, itemName: string): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'long_press',
      itemId,
      itemName
    }

    this.recordEvent(event)
    this.updateItemAnalytics(itemId, itemName, 'long_press')
    this.longPressTimers.delete(itemId)
  }

  // Track add to cart
  static trackAddToCart(itemId: string, itemName: string, quantity: number = 1): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'add_to_cart',
      itemId,
      itemName,
      metadata: { quantity }
    }

    this.recordEvent(event)
    this.updateItemAnalytics(itemId, itemName, 'add_to_cart')
  }

  // Track purchase attempt
  static trackPurchaseAttempt(itemId: string, itemName: string, success: boolean): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'purchase_attempt',
      itemId,
      itemName,
      metadata: { success }
    }

    this.recordEvent(event)
    this.updateItemAnalytics(itemId, itemName, 'purchase_attempt', { success })
  }

  // Track search
  static trackSearch(searchTerm: string, resultsCount: number): void {
    if (!this.hasAnalyticsConsent() || !this.currentSession) return

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      timestamp: Date.now(),
      type: 'search',
      metadata: { searchTerm, resultsCount }
    }

    this.recordEvent(event)
  }

  // Record event to storage
  private static recordEvent(event: AnalyticsEvent): void {
    try {
      const events = this.getStoredEvents()
      events.push(event)
      
      // Keep only last 1000 events to prevent storage bloat
      if (events.length > 1000) {
        events.splice(0, events.length - 1000)
      }

      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events))
    } catch (error) {
      console.error('Error recording analytics event:', error)
    }
  }

  // Get stored events
  static getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem(this.EVENTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading stored events:', error)
      return []
    }
  }

  // Update item analytics
  private static updateItemAnalytics(itemId: string, itemName: string, eventType: string, metadata?: any): void {
    try {
      const analytics = this.getItemAnalytics()
      let itemAnalytics = analytics.find(a => a.itemId === itemId)

      if (!itemAnalytics) {
        itemAnalytics = {
          itemId,
          itemName,
          totalViews: 0,
          totalClicks: 0,
          totalLongPresses: 0,
          totalAddToCarts: 0,
          totalPurchaseAttempts: 0,
          averageViewDuration: 0,
          averageClicksPerSession: 0,
          conversionRate: 0,
          purchaseConversionRate: 0,
          popularityScore: 0,
          lastUpdated: new Date()
        }
        analytics.push(itemAnalytics)
      }

      // Update metrics based on event type
      switch (eventType) {
        case 'view':
          itemAnalytics.totalViews++
          if (metadata?.duration) {
            const totalDuration = itemAnalytics.averageViewDuration * (itemAnalytics.totalViews - 1) + metadata.duration
            itemAnalytics.averageViewDuration = totalDuration / itemAnalytics.totalViews
          }
          break
        case 'click':
          itemAnalytics.totalClicks++
          break
        case 'long_press':
          itemAnalytics.totalLongPresses++
          break
        case 'add_to_cart':
          itemAnalytics.totalAddToCarts++
          break
        case 'purchase_attempt':
          if (metadata?.success) {
            itemAnalytics.totalPurchaseAttempts++
          }
          break
      }

      // Calculate derived metrics
      itemAnalytics.conversionRate = itemAnalytics.totalViews > 0 
        ? (itemAnalytics.totalAddToCarts / itemAnalytics.totalViews) * 100 
        : 0

      itemAnalytics.purchaseConversionRate = itemAnalytics.totalAddToCarts > 0
        ? (itemAnalytics.totalPurchaseAttempts / itemAnalytics.totalAddToCarts) * 100
        : 0

      // Calculate popularity score (weighted algorithm)
      itemAnalytics.popularityScore = (
        (itemAnalytics.totalViews * 1) +
        (itemAnalytics.totalClicks * 2) +
        (itemAnalytics.totalLongPresses * 3) +
        (itemAnalytics.totalAddToCarts * 5) +
        (itemAnalytics.totalPurchaseAttempts * 10)
      )

      itemAnalytics.lastUpdated = new Date()

      // Save updated analytics
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics))
    } catch (error) {
      console.error('Error updating item analytics:', error)
    }
  }

  // Get item analytics
  static getItemAnalytics(): ItemAnalytics[] {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading item analytics:', error)
      return []
    }
  }

  // Get analytics for specific item
  static getItemAnalyticsById(itemId: string): ItemAnalytics | null {
    const analytics = this.getItemAnalytics()
    return analytics.find(a => a.itemId === itemId) || null
  }

  // Setup event listeners for automatic tracking
  private static setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page became hidden, end all active view tracking
        this.viewStartTimes.forEach((startTime, itemId) => {
          // We don't have item name here, so we'll use a placeholder
          this.trackItemViewEnd(itemId, 'Unknown Item')
        })
      }
    })

    // Track beforeunload to save final session state
    window.addEventListener('beforeunload', () => {
      this.saveSession()
    })
  }

  // Start session activity tracking
  private static startSessionTracking(): void {
    setInterval(() => {
      if (this.currentSession) {
        this.currentSession.lastActivity = Date.now()
        this.saveSession()
      }
    }, 60000) // Update every minute
  }

  // Generate unique session ID
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Generate unique event ID
  private static generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Clear all analytics data (for privacy compliance)
  static clearAllData(): void {
    localStorage.removeItem(this.EVENTS_KEY)
    localStorage.removeItem(this.ANALYTICS_KEY)
    CookieManager.deleteCookie('analytics_session')
    this.currentSession = null
    this.viewStartTimes.clear()
    this.longPressTimers.forEach(timer => clearTimeout(timer))
    this.longPressTimers.clear()
  }

  // Export analytics data for admin
  static exportAnalyticsData(): {
    events: AnalyticsEvent[]
    itemAnalytics: ItemAnalytics[]
    currentSession: UserSession | null
  } {
    return {
      events: this.getStoredEvents(),
      itemAnalytics: this.getItemAnalytics(),
      currentSession: this.currentSession
    }
  }
}
