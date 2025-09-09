'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Filter } from 'lucide-react'
import SearchInput from './SearchInput'
import BackButton from './BackButton'
import { useLanguage } from '@/contexts/LanguageContext'

interface ExpandableMenuHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onFilterClick: () => void
  hasActiveFilters?: boolean
  filterCount?: number
  isAdmin?: boolean
  usingAdminData?: boolean
  onResetAdminData?: () => void
}

export default function ExpandableMenuHeader({
  searchValue,
  onSearchChange,
  onFilterClick,
  hasActiveFilters = false,
  filterCount = 0,
  isAdmin = false,
  usingAdminData = false,
  onResetAdminData
}: ExpandableMenuHeaderProps) {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isCollapsing, setIsCollapsing] = useState(false)

  // Auto-expand if there's a search value
  useEffect(() => {
    if (searchValue) {
      setIsExpanded(true)
    }
  }, [searchValue])

  const handleToggle = () => {
    if (isExpanded) {
      setIsCollapsing(true)
      setTimeout(() => {
        setIsExpanded(false)
        setIsCollapsing(false)
      }, 300)
    } else {
      setIsExpanded(true)
    }
  }

  return (
    <div className="sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - minimal header with expand button
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-3 sm:px-4 py-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {t('menu')}
                </h1>
                {hasActiveFilters && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {filterCount}
                  </span>
                )}
              </div>
              <button
                onClick={handleToggle}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Expand header"
              >
                <span className="hidden sm:inline">{t('expand')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          // Expanded state - full header
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-3 sm:px-4 py-3 sm:py-4"
          >
            {/* Title Row */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <BackButton />
              <div className="text-center flex-1 px-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {t('menu')}
                </h1>
                {isAdmin && usingAdminData && (
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium flex items-center justify-center gap-2">
                    <span className="hidden sm:inline">⚠️ Showing admin changes (localStorage)</span>
                    <span className="sm:hidden">⚠️ Admin mode</span>
                    {onResetAdminData && (
                      <button
                        onClick={onResetAdminData}
                        className="text-blue-600 hover:text-blue-800 underline"
                        title="Clear admin changes and reload original data"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleToggle}
                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Collapse header"
              >
                <span className="hidden sm:inline">{t('collapse')}</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Filter Row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex gap-2 sm:gap-3 items-center"
            >
              <div className="flex-1 min-w-0">
                <SearchInput
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder={t('searchMenu')}
                />
              </div>
              <button
                onClick={onFilterClick}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-sm text-sm sm:text-base shrink-0"
                data-testid="filter-button"
              >
                <Filter className="w-4 h-4" />
                {hasActiveFilters && filterCount > 0 && (
                  <span className="bg-white text-primary-500 text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                    {filterCount}
                  </span>
                )}
                <span className="hidden sm:inline">{t('filters')}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
