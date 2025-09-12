// PWA Install Prompt Handler
// This handles the PWA install prompt in a less intrusive way

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

export const initializePWAHandler = () => {
  // Only run on client side
  if (typeof window === 'undefined') return

  // Prevent the mini-infobar from appearing on mobile
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt = e as BeforeInstallPromptEvent
    
    // Optionally, send analytics event that PWA install promo was shown
    console.log('PWA install prompt available, but deferred')
  })

  // Handle app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    deferredPrompt = null
  })
}

export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log('No install prompt available')
    return false
  }

  // Show the install prompt
  deferredPrompt.prompt()
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
    return true
  } else {
    console.log('User dismissed the install prompt')
    return false
  }
}

export const isPWAInstallAvailable = (): boolean => {
  return deferredPrompt !== null
}
