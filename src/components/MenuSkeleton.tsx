'use client'

import { motion } from 'framer-motion'
import { EASING, DURATION } from '@/lib/animation'

export default function MenuSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            
            {/* Search Bar Skeleton */}
            <div className="flex-1 max-w-md mx-8">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Filter Button Skeleton */}
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Category Strip Skeleton */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                                 <motion.div
                   key={i}
                   className="flex-shrink-0 h-10 w-24 bg-gray-200 rounded-full animate-pulse"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: DURATION.fast, ease: EASING.soft, delay: i * 0.1 }}
                 />
              ))}
            </div>

            {/* Dishes Grid Skeleton */}
            <div className="mt-8">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  {/* Category Title Skeleton */}
                                     <motion.div
                     className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: DURATION.fast, ease: EASING.soft, delay: categoryIndex * 0.2 }}
                   />
                  
                  {/* Dish Cards Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, dishIndex) => (
                                             <motion.div
                         key={dishIndex}
                         className="bg-white rounded-lg shadow-sm overflow-hidden"
                         initial={{ opacity: 0, y: 12 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ 
                           duration: DURATION.medium, 
                           ease: EASING.soft,
                           delay: categoryIndex * 0.2 + dishIndex * 0.06 
                         }}
                       >
                        {/* Image Skeleton */}
                        <div className="relative h-48 bg-gray-200 animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                        </div>
                        
                        {/* Content Skeleton */}
                        <div className="p-4">
                          {/* Title Skeleton */}
                          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
                          
                          {/* Description Skeleton */}
                          <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
                          <div className="h-4 w-2/3 bg-gray-200 rounded mb-3 animate-pulse" />
                          
                          {/* Price Skeleton */}
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Rail Skeleton */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                                 <motion.div
                   key={i}
                   className="bg-white rounded-lg shadow-sm p-4"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: DURATION.fast, ease: EASING.soft, delay: i * 0.1 }}
                 >
                  <div className="h-32 bg-gray-200 rounded mb-3 animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
