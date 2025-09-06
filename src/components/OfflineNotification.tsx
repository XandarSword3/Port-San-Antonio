'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { OfflineStorage } from '@/lib/offlineStorage'
import { Wifi, WifiOff, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineNotification() {
  const { isOnline, wasOffline } = useOnlineStatus()
  const hasCachedData = OfflineStorage.hasCachedData()
  const cacheAge = OfflineStorage.getCacheAge()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  You're offline
                </h3>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  {hasCachedData ? (
                    <>
                      <Clock className="w-3 h-3 inline mr-1" />
                      Showing cached menu (updated {cacheAge}h ago)
                    </>
                  ) : (
                    'No cached data available'
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          onAnimationComplete={() => {
            // Auto-hide after 3 seconds
            setTimeout(() => {
              // This will be handled by the parent component
            }, 3000)
          }}
          className="fixed top-16 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Back online!
                </h3>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Refreshing menu data...
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
