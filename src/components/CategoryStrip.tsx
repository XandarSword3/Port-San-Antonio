'use client'

import { motion } from 'framer-motion'
import { Category } from '@/types'
import { cn } from '@/lib/utils'
import { EASING, DURATION } from '@/lib/animation'

interface CategoryStripProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export default function CategoryStrip({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryStripProps) {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="relative" data-testid="category-strip">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Categories Option */}
        <motion.button
          onClick={() => onCategorySelect(null)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            selectedCategory === null
              ? "bg-resort-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.fast, ease: EASING.soft, delay: 0.1 }}
          data-testid="category-chip"
        >
          All Dishes
        </motion.button>

        {/* Category Chips */}
        {sortedCategories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              selectedCategory === category.id
                ? "bg-resort-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.fast, ease: EASING.soft, delay: 0.1 + index * 0.06 }}
            data-testid="category-chip"
          >
            {category.name}
          </motion.button>
        ))}
      </div>
      
      {/* Gradient Fade on Edge - uses logical property to work in both LTR and RTL */}
      <div className="pointer-events-none absolute end-0 top-0 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent" />
    </div>
  )
}
