'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is on admin page or has admin session
  useEffect(() => {
    const checkAdminStatus = () => {
      const currentPath = window.location.pathname
      const adminSession = sessionStorage.getItem('adminAuthenticated')
      
      if (currentPath === '/admin' && adminSession === 'true') {
        setIsAdmin(true)
      } else if (currentPath !== '/admin') {
        setIsAdmin(false)
      }
    }

    checkAdminStatus()
    
    // Listen for navigation changes
    const handleNavigation = () => {
      setTimeout(checkAdminStatus, 100)
    }
    
    window.addEventListener('popstate', handleNavigation)
    return () => window.removeEventListener('popstate', handleNavigation)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
