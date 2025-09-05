'use client'

import { motion } from 'framer-motion'
import { Utensils, Star, Clock, MapPin } from 'lucide-react'

interface Feature {
  icon: any
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Utensils,
    title: 'Gourmet Cuisine',
    description: 'International flavors'
  },
  {
    icon: Star,
    title: 'Premium Service',
    description: '5-star experience'
  },
  {
    icon: Clock,
    title: 'Always Open',
    description: '24/7 dining'
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    description: 'Beachfront dining'
  }
]

export default function FeatureGrid() {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto px-6 mt-12"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white/20"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.8 + i * 0.1 }}
        >
          <feature.icon className="h-8 w-8 text-amber-400 mb-4" />
          <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
          <p className="text-gray-300">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
