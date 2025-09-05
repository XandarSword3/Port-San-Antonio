'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Utensils, Shell, Waves, Sun, Coffee, Wine, Fish, IceCream, TreePine, Mountain, Olive } from 'lucide-react'
import { Category, Dish } from '@/types'
import { translateCategory } from '@/lib/dishTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import DishCard from './DishCard'

interface CategoryAccordionProps {
  category: Category
  dishes: Dish[]
  onQuickOrder?: (dish: Dish) => void
  onLongPress?: (dish: Dish) => void
}

export default function CategoryAccordion({ 
  category, 
  dishes, 
  onQuickOrder, 
  onLongPress 
}: CategoryAccordionProps) {
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(true)
  
  const translatedCategory = translateCategory(category, language)
  const categoryDishes = dishes.filter(dish => dish.categoryId === category.id)

  // Get Lebanese-themed icon for each category
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'starters': Olive,
      'salads-pasta': Waves,
      'pizzas': Sun,
      'sandwiches-burgers': Utensils,
      'platters': TreePine,
      'soft-drinks-juices': Coffee,
      'beers': Wine,
      'prosecco-couvent': Wine,
      'wine': Wine,
      'signature-cocktails': IceCream,
      'spa': Mountain
    }
    return iconMap[categoryId] || Utensils
  }

  const CategoryIcon = getCategoryIcon(category.id)

  if (categoryDishes.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden wave-ripple">
      {/* Lebanese Gold Divider */}
      <div className="h-1 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 opacity-60"></div>
      
      {/* Category Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gradient-to-r hover:from-amber-50 hover:to-blue-50 dark:hover:from-amber-900/20 dark:hover:to-blue-900/20 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-600 dark:text-amber-400 shadow-sm">
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-serif">
              {translatedCategory.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {categoryDishes.length} {categoryDishes.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-amber-500" />
        </motion.div>
      </motion.button>

      {/* Category Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              {translatedCategory.description && (
                <div className="mb-4 pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {translatedCategory.description}
                  </p>
                  {/* Lebanese gold divider */}
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
                </div>
              )}
              
              <div className="grid grid-responsive gap-4">
                {categoryDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onQuickOrder={onQuickOrder}
                    onLongPress={onLongPress}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
