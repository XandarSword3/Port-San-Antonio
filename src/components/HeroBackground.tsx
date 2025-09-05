'use client'

import { motion } from 'framer-motion'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img
          src="/seed/resort-hero.jpg"
          alt="Port San Antonio Resort"
          className="h-full w-full object-cover"
          style={{ transform: 'scale(1.1)' }}
        />
      </motion.div>
    </div>
  )
}
