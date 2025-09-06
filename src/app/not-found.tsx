'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-8"
        >
          <MapPin className="w-16 h-16 text-white" />
        </motion.div>

        {/* Error Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-6xl font-bold text-gray-900 dark:text-white mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
        >
          Looks like you've followed a broken link or entered a URL that doesn't exist on our resort website.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            View Menu
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Port Antonio Resort</p>
          <p>Experience luxury dining and hospitality</p>
        </motion.div>
      </motion.div>
    </div>
  )
}