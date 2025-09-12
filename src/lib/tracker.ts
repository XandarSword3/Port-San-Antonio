/**
 * Client-side visitor tracking library for Port San Antonio Resort
 * Features: UUID visitor cookies, event batching, beacon/fetch fallback
 */

interface TrackingEvent {
  visitorId: string
  eventName: string
  props?: Record<string, any>
  url?: string
  referrer?: string
  userAgent?: string
  ts: string
}

interface BatchPayload {
  events: TrackingEvent[]
}

class VisitorTracker {
  private visitorId: string | null = null
  private eventBatch: TrackingEvent[] = []
  private flushTimer: NodeJS.Timeout | null = null
  private isConsentGiven = false
  private pageStartTime = Date.now()
  private readonly BATCH_SIZE = 10
  private readonly FLUSH_INTERVAL = 5000 // 5 seconds
  private readonly MAX_PROPS_SIZE = 8192 // 8KB
  private readonly COOKIE_NAME = 'ps_visitor'
  private readonly CONSENT_KEY = 'ps_consent'

  constructor() {
    this.checkConsent()
    if (this.isConsentGiven) {
      this.initVisitorId()
      this.setupPageTracking()
    }
  }

  /**
   * Check if user has given consent for analytics
   */
  private checkConsent(): void {
    if (typeof window === 'undefined') return

    const consent = localStorage.getItem(this.CONSENT_KEY) || this.getCookie('ps_consent')
    this.isConsentGiven = consent === 'accept'
  }

  /**
   * Initialize or retrieve visitor ID from cookie
   */
  private initVisitorId(): void {
    if (typeof window === 'undefined') return

    this.visitorId = this.getCookie(this.COOKIE_NAME)
    
    if (!this.visitorId) {
      this.visitorId = this.generateUUID()
      this.setCookie(this.COOKIE_NAME, this.visitorId, {
        maxAge: 31536000, // 1 year
        sameSite: 'Lax',
        secure: window.location.protocol === 'https:',
        path: '/'
      })
    }
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  /**
   * Set cookie with options
   */
  private setCookie(name: string, value: string, options: {
    maxAge?: number
    sameSite?: 'Strict' | 'Lax' | 'None'
    secure?: boolean
    path?: string
  } = {}): void {
    if (typeof document === 'undefined') return

    let cookieString = `${name}=${encodeURIComponent(value)}`
    
    if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
    if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
    if (options.secure) cookieString += `; Secure`
    if (options.path) cookieString += `; Path=${options.path}`
    
    document.cookie = cookieString
  }

  /**
   * Get cookie value by name
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift()
      return cookieValue ? decodeURIComponent(cookieValue) : null
    }
    
    return null
  }

  /**
   * Setup automatic page tracking
   */
  private setupPageTracking(): void {
    if (typeof window === 'undefined') return

    // Track page visibility changes for time_on_page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Date.now() - this.pageStartTime
        this.track('time_on_page', { duration: Math.round(timeOnPage / 1000) })
      } else {
        this.pageStartTime = Date.now()
      }
    }

    // Track before page unload
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - this.pageStartTime
      this.track('time_on_page', { duration: Math.round(timeOnPage / 1000) })
      this.flush(true) // Force immediate flush
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  /**
   * Update consent status
   */
  public updateConsent(consent: boolean): void {
    this.isConsentGiven = consent
    const consentValue = consent ? 'accept' : 'reject'
    
    localStorage.setItem(this.CONSENT_KEY, consentValue)
    this.setCookie('ps_consent', consentValue, {
      maxAge: 31536000, // 1 year
      sameSite: 'Lax',
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      path: '/'
    })

    if (consent && !this.visitorId) {
      this.initVisitorId()
      this.setupPageTracking()
    } else if (!consent) {
      // Clear visitor cookie if consent is withdrawn
      this.setCookie(this.COOKIE_NAME, '', { maxAge: -1 })
      this.visitorId = null
      this.eventBatch = []
    }
  }

  /**
   * Track an event
   */
  public track(eventName: string, props?: Record<string, any>): void {
    if (!this.isConsentGiven || !this.visitorId || typeof window === 'undefined') {
      return
    }

    // Validate and sanitize props
    let sanitizedProps = props
    if (props) {
      const propsString = JSON.stringify(props)
      if (propsString.length > this.MAX_PROPS_SIZE) {
        console.warn(`Event props too large (${propsString.length} bytes), truncating`)
        sanitizedProps = { error: 'props_too_large' }
      }
    }

    const event: TrackingEvent = {
      visitorId: this.visitorId,
      eventName,
      props: sanitizedProps,
      url: window.location.href,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString()
    }

    this.eventBatch.push(event)

    // Flush if batch is full
    if (this.eventBatch.length >= this.BATCH_SIZE) {
      this.flush()
    } else if (!this.flushTimer) {
      // Set timer for next flush
      this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL)
    }
  }

  /**
   * Flush events to server
   */
  private async flush(immediate = false): Promise<void> {
    if (!this.isConsentGiven || this.eventBatch.length === 0) return

    const events = [...this.eventBatch]
    this.eventBatch = []

    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
      this.flushTimer = null
    }

    const payload: BatchPayload = { events }
    const payloadString = JSON.stringify(payload)

    try {
      // Use sendBeacon for better reliability, especially on page unload
      if (immediate && navigator.sendBeacon) {
        const blob = new Blob([payloadString], { type: 'application/json' })
        navigator.sendBeacon('/api/analytics/batch', blob)
      } else {
        // Use fetch with keepalive for better compatibility
        await fetch('/api/analytics/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payloadString,
          keepalive: true
        })
      }
    } catch (error) {
      console.warn('Failed to send analytics events:', error)
      // Could implement retry logic here
    }
  }

  /**
   * Get current consent status
   */
  public hasConsent(): boolean {
    return this.isConsentGiven
  }

  /**
   * Get visitor ID (if consent given)
   */
  public getVisitorId(): string | null {
    return this.isConsentGiven ? this.visitorId : null
  }
}

// Global tracker instance
let trackerInstance: VisitorTracker | null = null

/**
 * Initialize the tracker (called once in app layout)
 */
export function initTracker(): VisitorTracker {
  if (typeof window === 'undefined') {
    // Return a no-op tracker for SSR
    return {
      track: () => {},
      updateConsent: () => {},
      hasConsent: () => false,
      getVisitorId: () => null
    } as any
  }

  if (!trackerInstance) {
    trackerInstance = new VisitorTracker()
  }
  return trackerInstance
}

/**
 * Track an event (convenience function)
 */
export function track(eventName: string, props?: Record<string, any>): void {
  if (!trackerInstance) {
    trackerInstance = initTracker()
  }
  trackerInstance.track(eventName, props)
}

/**
 * Update consent status
 */
export function updateConsent(consent: boolean): void {
  if (!trackerInstance) {
    trackerInstance = initTracker()
  }
  trackerInstance.updateConsent(consent)
}

/**
 * Check if user has given consent
 */
export function hasConsent(): boolean {
  if (!trackerInstance) {
    trackerInstance = initTracker()
  }
  return trackerInstance.hasConsent()
}

/**
 * Get visitor ID if consent given
 */
export function getVisitorId(): string | null {
  if (!trackerInstance) {
    trackerInstance = initTracker()
  }
  return trackerInstance.getVisitorId()
}

// Export types for use in other modules
export type { TrackingEvent, BatchPayload }
