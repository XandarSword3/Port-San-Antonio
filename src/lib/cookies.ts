'use client'

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  timestamp: number
}

export interface CookieSettings {
  hasConsented: boolean
  consent: CookieConsent
}

// Cookie categories and their purposes
export const COOKIE_CATEGORIES = {
  necessary: {
    name: 'Necessary',
    description: 'Essential for the website to function properly. These cannot be disabled.',
    required: true,
    examples: ['Authentication tokens', 'Security preferences', 'Language settings']
  },
  analytics: {
    name: 'Analytics', 
    description: 'Help us understand how visitors use our website to improve your experience.',
    required: false,
    examples: ['Page views', 'User interactions', 'Performance metrics']
  },
  preferences: {
    name: 'Preferences',
    description: 'Remember your choices and personalize your experience.',
    required: false,
    examples: ['Theme preferences', 'Font size', 'Layout options']
  },
  marketing: {
    name: 'Marketing',
    description: 'Used to show you relevant content and advertisements.',
    required: false,
    examples: ['Targeted advertising', 'Social media integration', 'Promotional content']
  }
} as const

// Default consent (only necessary cookies)
const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: Date.now()
}

// Cookie utility functions
export class CookieManager {
  private static CONSENT_KEY = 'cookie_consent'
  
  // Set a cookie with proper attributes
  static setCookie(name: string, value: string, days: number = 365, category: keyof CookieConsent = 'necessary'): boolean {
    if (!this.hasConsent(category)) {
      console.log(`Cookie ${name} not set: no consent for ${category}`)
      return false
    }

    try {
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure=${location.protocol === 'https:'}`
      return true
    } catch (error) {
      console.error('Error setting cookie:', error)
      return false
    }
  }

  // Get a cookie value
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // Delete a cookie
  static deleteCookie(name: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }

  // Save consent preferences
  static saveConsent(consent: Partial<CookieConsent>): void {
    const fullConsent: CookieConsent = {
      ...DEFAULT_CONSENT,
      ...consent,
      necessary: true, // Always true
      timestamp: Date.now()
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(fullConsent))
      
      // Set a necessary cookie to remember consent across sessions
      this.setCookie('consent_status', 'given', 365, 'necessary')
      
      // Clear cookies for denied categories
      if (!fullConsent.analytics) {
        this.clearAnalyticsCookies()
      }
      if (!fullConsent.marketing) {
        this.clearMarketingCookies()
      }
      if (!fullConsent.preferences) {
        this.clearPreferencesCookies()
      }
    }
  }

  // Get current consent
  static getConsent(): CookieSettings {
    if (typeof window === 'undefined') {
      return { hasConsented: false, consent: DEFAULT_CONSENT }
    }

    try {
      const stored = localStorage.getItem(this.CONSENT_KEY)
      if (stored) {
        const consent = JSON.parse(stored) as CookieConsent
        return { hasConsented: true, consent }
      }
    } catch (error) {
      console.error('Error reading consent:', error)
    }

    return { hasConsented: false, consent: DEFAULT_CONSENT }
  }

  // Check if user has consented to a specific category
  static hasConsent(category: keyof CookieConsent): boolean {
    const { consent } = this.getConsent()
    return consent[category] === true
  }

  // Check if user needs to see consent banner
  static needsConsent(): boolean {
    return !this.getConsent().hasConsented
  }

  // Accept all cookies
  static acceptAll(): void {
    this.saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    })
  }

  // Accept only necessary cookies
  static acceptNecessaryOnly(): void {
    this.saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    })
  }

  // Clear category-specific cookies
  private static clearAnalyticsCookies(): void {
    // Add analytics cookie names as they're implemented
    const analyticsCookies = ['_ga', '_gid', '_gat', 'analytics_session']
    analyticsCookies.forEach(cookie => this.deleteCookie(cookie))
  }

  private static clearMarketingCookies(): void {
    // Add marketing cookie names as they're implemented
    const marketingCookies = ['_fbp', '_fbc', 'marketing_id', 'ad_preferences']
    marketingCookies.forEach(cookie => this.deleteCookie(cookie))
  }

  private static clearPreferencesCookies(): void {
    // Add preference cookie names as they're implemented
    const preferencesCookies = ['theme', 'language_pref', 'layout_pref']
    preferencesCookies.forEach(cookie => this.deleteCookie(cookie))
  }

  // Initialize Google Analytics (example)
  static initializeAnalytics(): void {
    if (!this.hasConsent('analytics')) return

    // Example GA4 initialization
    // gtag('config', 'GA_MEASUREMENT_ID')
    console.log('Analytics initialized with user consent')
  }

  // Initialize marketing tools (example)
  static initializeMarketing(): void {
    if (!this.hasConsent('marketing')) return

    // Example Facebook Pixel, Google Ads initialization
    console.log('Marketing tools initialized with user consent')
  }

  // Withdraw consent (reset everything)
  static withdrawConsent(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CONSENT_KEY)
      this.deleteCookie('consent_status')
      
      // Clear all non-necessary cookies
      this.clearAnalyticsCookies()
      this.clearMarketingCookies() 
      this.clearPreferencesCookies()
    }
  }
}

// Hook for components
export function useCookieConsent() {
  const settings = CookieManager.getConsent()
  const needsConsent = CookieManager.needsConsent()

  return {
    ...settings,
    needsConsent,
    acceptAll: () => CookieManager.acceptAll(),
    acceptNecessaryOnly: () => CookieManager.acceptNecessaryOnly(),
    saveConsent: (consent: Partial<CookieConsent>) => CookieManager.saveConsent(consent),
    withdrawConsent: () => CookieManager.withdrawConsent(),
    hasConsent: (category: keyof CookieConsent) => CookieManager.hasConsent(category)
  }
}
