/**
 * Unified auto-commit utility for all admin content changes
 */

export interface CommitData {
  type: 'menu' | 'footer' | 'jobs' | 'legal' | 'content'
  data: any
  message?: string
}

export class AutoCommitService {
  private static getAuthToken(): string | null {
    return localStorage.getItem('adminToken')
  }

  /**
   * Commit any type of content changes to GitHub
   */
  static async commitToGitHub(commitData: CommitData): Promise<any> {
    try {
      console.log(`🔄 Starting auto-commit process for ${commitData.type}...`)
      
      const authToken = this.getAuthToken()
      console.log('🔐 Auth token available:', !!authToken)
      
      if (!authToken) {
        throw new Error('No authentication token available')
      }

      const response = await fetch('/api/auto-commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          commitData,
          lastUpdated: new Date().toISOString()
        })
      })

      console.log('📡 Auto-commit response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Auto-commit failed:', errorData)
        throw new Error(`Auto-commit failed: ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('✅ Auto-commit successful:', result)
      
      return result
    } catch (error: any) {
      console.error('❌ Auto-commit error:', error)
      throw error
    }
  }

  /**
   * Commit menu data (existing functionality)
   */
  static async commitMenuData(dishes: any[], categories: any[]): Promise<any> {
    const menuData = {
      dishes,
      categories,
      lastUpdated: new Date().toISOString()
    }

    return this.commitToGitHub({
      type: 'menu',
      data: menuData,
      message: 'Update menu items via admin panel'
    })
  }

  /**
   * Commit footer settings
   */
  static async commitFooterSettings(footerSettings: any): Promise<any> {
    return this.commitToGitHub({
      type: 'footer',
      data: footerSettings,
      message: 'Update footer settings via admin panel'
    })
  }

  /**
   * Commit job positions
   */
  static async commitJobPositions(jobPositions: any[]): Promise<any> {
    return this.commitToGitHub({
      type: 'jobs',
      data: jobPositions,
      message: 'Update job positions via admin panel'
    })
  }

  /**
   * Commit legal pages
   */
  static async commitLegalPages(legalPages: any[]): Promise<any> {
    return this.commitToGitHub({
      type: 'legal',
      data: legalPages,
      message: 'Update legal pages via admin panel'
    })
  }

  /**
   * Commit general content
   */
  static async commitGeneralContent(content: any): Promise<any> {
    return this.commitToGitHub({
      type: 'content',
      data: content,
      message: 'Update content via admin panel'
    })
  }

  /**
   * Show success notification
   */
  static showSuccessNotification(result: any, contentType: string): void {
    setTimeout(() => {
      alert(`🚀 ${contentType} changes committed to GitHub successfully! Vercel will rebuild automatically.\n\nCommit: ${result.commitUrl || 'View on GitHub'}`)
    }, 1000)
  }

  /**
   * Show error notification
   */
  static showErrorNotification(error: any, contentType: string): void {
    alert(`⚠️ ${contentType} changes saved locally but auto-commit failed: ${error.message}\n\nYou may need to check your GitHub token configuration.`)
  }
}
