'use client'

import { useState, useEffect } from 'react'
import { isPWAInstallAvailable, showInstallPrompt } from '@/lib/pwa-handler'

interface InstallPWAButtonProps {
  className?: string
  children?: React.ReactNode
}

export default function InstallPWAButton({ 
  className = "bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors",
  children = "Install App"
}: InstallPWAButtonProps) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Check if PWA install is available
    const checkAvailability = () => {
      setIsAvailable(isPWAInstallAvailable())
    }
    
    checkAvailability()
    
    // Check periodically as the install prompt might become available after page load
    const interval = setInterval(checkAvailability, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleInstall = async () => {
    if (!isPWAInstallAvailable()) return
    
    setIsInstalling(true)
    try {
      await showInstallPrompt()
    } catch (error) {
      console.error('Failed to show install prompt:', error)
    } finally {
      setIsInstalling(false)
      // After attempting install, check availability again
      setIsAvailable(isPWAInstallAvailable())
    }
  }

  // Don't render if PWA install is not available
  if (!isAvailable) return null

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className={className}
    >
      {isInstalling ? 'Installing...' : children}
    </button>
  )
}
