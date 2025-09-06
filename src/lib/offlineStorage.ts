export interface OfflineMenuData {
  dishes: any[]
  categories: any[]
  ads: any[]
  lastUpdated: number
}

const STORAGE_KEY = 'psa-offline-menu'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export class OfflineStorage {
  // Save menu data for offline use
  static saveMenuData(data: Omit<OfflineMenuData, 'lastUpdated'>) {
    try {
      const offlineData: OfflineMenuData = {
        ...data,
        lastUpdated: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineData))
      console.log('Menu data cached for offline use')
    } catch (error) {
      console.error('Failed to cache menu data:', error)
    }
  }

  // Get cached menu data
  static getMenuData(): OfflineMenuData | null {
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (!cached) return null

      const data: OfflineMenuData = JSON.parse(cached)
      
      // Check if cache is still valid
      if (Date.now() - data.lastUpdated > CACHE_DURATION) {
        console.log('Cached menu data expired')
        this.clearMenuData()
        return null
      }

      return data
    } catch (error) {
      console.error('Failed to retrieve cached menu data:', error)
      return null
    }
  }

  // Clear cached data
  static clearMenuData() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear cached menu data:', error)
    }
  }

  // Check if we have valid cached data
  static hasCachedData(): boolean {
    return this.getMenuData() !== null
  }

  // Get cache age in hours
  static getCacheAge(): number {
    const data = this.getMenuData()
    if (!data) return 0
    return Math.floor((Date.now() - data.lastUpdated) / (60 * 60 * 1000))
  }
}
