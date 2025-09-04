'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({ onSearch, placeholder = "Search dishes, ingredients...", className = "" }: SearchInputProps) {
  const { t } = useLanguage()
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue])

  const handleClear = () => {
    setValue('')
    setDebouncedValue('')
    onSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || t('searchPlaceholder')}
        aria-label="Search dishes"
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-resort-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
