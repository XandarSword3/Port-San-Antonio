'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { Ad } from '@/types'

interface SideRailProps {
  ads: Ad[]
}

export default function SideRail({ ads }: SideRailProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, 8000) // Rotate every 8 seconds

    return () => clearInterval(interval)
  }, [ads.length])

  if (ads.length === 0 || !isVisible) return null

  const currentAd = ads[currentAdIndex]

  return (
    <div className="sticky top-24">
      <motion.div
        className="relative overflow-hidden rounded-xl bg-white shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 end-3 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
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
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden">
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
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Additional Info */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-900">Resort Services</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• Spa & Wellness</li>
          <li>• Pool & Beach Access</li>
          <li>• Wine Tasting</li>
          <li>• Concierge Service</li>
        </ul>
      </div>
    </div>
  )
}
