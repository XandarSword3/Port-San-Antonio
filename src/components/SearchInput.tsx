'use client'

import { useState, useEffect, useRef, useMemo, forwardRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, X, ChevronDown } from 'lucide-react'

interface SearchInputProps {
  value?: string
  onChange: (query: string) => void
  placeholder?: string
  className?: string
  suggestions?: string[]
  onBlur?: () => void
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ value = '', onChange, placeholder = "Search dishes, ingredients...", className = "", suggestions = [], onBlur }: SearchInputProps, ref) => {
  const { t } = useLanguage()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const actualRef = ref || inputRef
  
  // Memoize filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (!value || !suggestions.length) return []
    return suggestions
      .filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5)
  }, [value, suggestions])
  
  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, onChange])

  // Update visibility of suggestions dropdown
  useEffect(() => {
    const shouldShow = value !== '' && filteredSuggestions.length > 0
    if (showSuggestions !== shouldShow) {
      setShowSuggestions(shouldShow)
    }
  }, [value, filteredSuggestions.length, showSuggestions])

  const handleClear = () => {
    onChange('')
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    if (actualRef && 'current' in actualRef) {
      actualRef.current?.focus()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        ref={actualRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value && setShowSuggestions(true)}
        onBlur={(e) => {
          onBlur?.()
          setTimeout(() => setShowSuggestions(false), 200)
        }}
        placeholder={placeholder || t('searchPlaceholder') || "Search menu items, ingredients..."}
        aria-label="Search dishes"
        className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-resort-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Clear search"
        >
                  <X className="w-4 h-4" />
      </button>
    )}

    {/* Autocomplete Suggestions */}
    {showSuggestions && filteredSuggestions.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        {filteredSuggestions.map((suggestion: string, index: number) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full px-4 py-3 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <span>{suggestion}</span>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
  )
})

SearchInput.displayName = 'SearchInput'
export default SearchInput
