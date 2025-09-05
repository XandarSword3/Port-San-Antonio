'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, ChevronUp } from 'lucide-react'
import { Ad } from '@/types'

interface MobileBannerProps {
  ads: Ad[]
}

export default function MobileBanner({ ads }: MobileBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, 10000) // Rotate every 10 seconds

    return () => clearInterval(interval)
  }, [ads.length])

  if (ads.length === 0 || !isVisible) return null

  const currentAd = ads[currentAdIndex]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 inset-inline-0 z-50 lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
        >
          {/* Banner */}
          <div className="relative mx-4 mb-4 overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 end-2 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
              aria-label="Close advertisement"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-2 start-2 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronUp 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Ad Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Compact View */}
                <div className={`flex items-center gap-3 p-3 ${isExpanded ? 'hidden' : 'block'}`}>
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={currentAd.image}
                      alt={currentAd.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {currentAd.title}
                    </h3>
                    <p className="text-xs text-gray-500">Tap to learn more</p>
                  </div>

                  <button
                    onClick={() => window.open(currentAd.url, '_blank')}
                    className="flex-shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    View
                  </button>
                </div>

                {/* Expanded View */}
                <div className={`${isExpanded ? 'block' : 'hidden'}`}>
                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={currentAd.image}
                      alt={currentAd.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {currentAd.title}
                    </h3>
                    
                    {/* Ad Indicator */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Advertisement
                      </span>
                      {ads.length > 1 && (
                        <div className="flex gap-1">
                          {ads.map((_, index) => (
                            <div
                              key={index}
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <a
                      href={currentAd.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                      Learn More
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
