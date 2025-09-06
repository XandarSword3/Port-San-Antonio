/**
 * Client-side authentication utilities
 */

export interface AdminUser {
  username: string
  role: string
}

/**
 * Check if user is authenticated on the client side
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const isAuth = sessionStorage.getItem('adminAuthenticated')
  return isAuth === 'true'
}

/**
 * Get current admin user from session storage
 */
export function getCurrentUser(): AdminUser | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = sessionStorage.getItem('adminUser')
    if (!userStr) return null
    
    return JSON.parse(userStr) as AdminUser
  } catch {
    return null
  }
}

/**
 * Logout user and clear session
 */
export async function logout(): Promise<void> {
  try {
    // Call server logout endpoint
    await fetch('/api/auth/login', {
      method: 'DELETE',
      credentials: 'include'
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear client storage regardless
    sessionStorage.removeItem('adminAuthenticated')
    sessionStorage.removeItem('adminUser')
    
    // Redirect to login
    window.location.reload()
  }
}

/**
 * Verify authentication with server
 */
export async function verifyAuthentication(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include'
    })
    
    return response.ok
  } catch {
    return false
  }
}
