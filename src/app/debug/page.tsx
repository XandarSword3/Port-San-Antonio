'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'

interface DataStatus {
  source: string
  error?: string
}

interface DebugData {
  serverStatus: any
  dataStatus: DataStatus
  logTail: string[]
  theme: string
  language: string
  filters: any
}

export default function DebugPage() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [debugData, setDebugData] = useState<DebugData>({
    serverStatus: null,
    dataStatus: { source: 'unknown' },
    logTail: [],
    theme: '',
    language: '',
    filters: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        // Get language from localStorage
        const savedLang = localStorage.getItem('language') || 'en'
        
        // Get filters from localStorage if available
        let filters = {}
        const savedFilters = localStorage.getItem('menuFilters')
        if (savedFilters) {
          try {
            filters = JSON.parse(savedFilters)
          } catch (e) {
            console.error('Error parsing saved filters:', e)
          }
        }
        
        // Check if data is loaded from API or fallback
        let dataStatus: DataStatus = { source: 'unknown' }
        try {
          const response = await fetch('/api/menu')
          dataStatus = { source: response.ok ? 'API' : 'Fallback JSON' }
        } catch (error) {
          dataStatus = { source: 'Fallback JSON', error: String(error) }
        }
        
        // Try to fetch server status if available
        let serverStatus = {}
        try {
          const healthRes = await fetch('/health')
          serverStatus = await healthRes.json()
        } catch (error) {
          serverStatus = { status: 'unavailable', error: String(error) }
        }
        
        setDebugData({
          serverStatus,
          dataStatus,
          logTail: ['Debug data loaded successfully'],
          theme,
          language: savedLang,
          filters
        })
      } catch (error) {
        setDebugData({
          serverStatus: { status: 'error' },
          dataStatus: { source: 'error' },
          logTail: [`Error: ${error}`],
          theme,
          language: localStorage.getItem('language') || 'en',
          filters: {}
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDebugData()
  }, [theme])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <BackButton />
            <h1 className="text-2xl font-bold ml-2 dark:text-white">{t('debugOverlay')}</h1>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <p className="dark:text-white">{t('loadingDebugInfo')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold ml-2 dark:text-white" data-testid="debug-title">{t('debugOverlay')}</h1>
        </div>
        
        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('systemInformation')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('theme')}</p>
              <p className="text-lg font-semibold dark:text-white">{debugData.theme || 'Not set'}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('language')}</p>
              <p className="text-lg font-semibold dark:text-white">{debugData.language || 'Not set'}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('browser')}</p>
              <p className="text-lg font-semibold dark:text-white">{typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side rendering'}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('screenSize')}</p>
              <p className="text-lg font-semibold dark:text-white">{typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Server-side rendering'}</p>
            </div>
          </div>
        </div>
        
        {/* Server Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('serverStatus')}</h2>
          <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm overflow-auto dark:text-gray-200">
            {JSON.stringify(debugData.serverStatus, null, 2)}
          </pre>
        </div>

        {/* Data Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('dataStatus')}</h2>
          <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm overflow-auto max-h-96 dark:text-gray-200">
            {JSON.stringify(debugData.dataStatus, null, 2)}
          </pre>
        </div>

        {/* Active Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('activeFilters')}</h2>
          <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm overflow-auto max-h-96 dark:text-gray-200">
            {JSON.stringify(debugData.filters, null, 2)}
          </pre>
        </div>

        {/* Log Tail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('recentLogs')}</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm font-mono dark:text-gray-200">
            {debugData.logTail.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('quickActions')}</h2>
          <div className="space-y-2">
            <a 
              href="/" 
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('goToHomePage')}
            </a>
            <a 
              href="/menu" 
              className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {t('goToMenuPage')}
            </a>
            <a 
              href="/admin" 
              className="block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {t('goToAdminPanel')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
