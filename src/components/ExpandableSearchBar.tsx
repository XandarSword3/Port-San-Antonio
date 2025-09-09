'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import SearchInput from './SearchInput'
import { useLanguage } from '@/contexts/LanguageContext'

interface ExpandableSearchBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onFilterClick: () => void
  placeholder?: string
  hasActiveFilters?: boolean
  filterCount?: number
}

export default function ExpandableSearchBar({
  searchValue,
  onSearchChange,
  onFilterClick,
  placeholder,
  hasActiveFilters = false,
  filterCount = 0
}: ExpandableSearchBarProps) {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Auto-expand if there's a search value
  useEffect(() => {
    if (searchValue) {
      setIsExpanded(true)
    }
  }, [searchValue])

  const handleExpand = () => {
    setIsExpanded(true)
    // Focus the search input after animation
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 200)
  }

  const handleCollapse = () => {
    if (!searchValue) {
      setIsExpanded(false)
    }
  }

  const handleClearSearch = () => {
    onSearchChange('')
    setIsExpanded(false)
  }

  return (
    <div className="flex gap-2 sm:gap-3 items-center">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - just the search icon
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleExpand}
            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            aria-label="Expand search"
          >
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.button>
        ) : (
          // Expanded state - full search bar
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 min-w-0 relative"
          >
            <div className="relative">
              <SearchInput
                ref={searchInputRef}
                value={searchValue}
                onChange={onSearchChange}
                placeholder={placeholder || t('searchMenu')}
                onBlur={handleCollapse}
                className="pr-10"
              />
              {searchValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Button */}
      <motion.button
        onClick={onFilterClick}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-sm text-sm sm:text-base shrink-0"
        data-testid="filter-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter className="w-4 h-4" />
        {hasActiveFilters && filterCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white text-primary-500 text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium"
          >
            {filterCount}
          </motion.span>
        )}
        <span className="hidden sm:inline">{t('filters')}</span>
      </motion.button>
    </div>
  )
}
