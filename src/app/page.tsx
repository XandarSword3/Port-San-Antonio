'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { EASING, DURATION, TRANSITIONS } from '@/lib/animation'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleCTAClick = () => {
    // Fade out animation before navigation
    router.push('/menu')
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Header />
      {/* Hero Image with Ken Burns Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.03, filter: 'blur(8px)' }}
        animate={{ scale: 1, filter: 'blur(0px)' }}
        transition={TRANSITIONS.hero}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-resort-300/20 via-transparent to-sand-100/10" />
                 <img
           src="/seed/resort-hero.jpg"
           alt="Port San Antonio Resort"
           className="h-full w-full object-cover"
         />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        {/* Welcome Text */}
        <motion.div
          className="mb-8 max-w-4xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...TRANSITIONS.text, delay: 1.6 }}
        >
          <h1 className="mb-4 text-5xl font-light tracking-wide md:text-7xl lg:text-8xl">
            {t('welcomeTo')}
          </h1>
          <h2 className="mb-6 text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">
            {t('siteTitle')}
          </h2>
          <p className="text-xl font-light leading-relaxed md:text-2xl lg:text-3xl">
            {t('experienceLuxury')}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={handleCTAClick}
          className="group relative overflow-hidden rounded-full bg-white/20 px-8 py-4 text-lg font-medium text-white backdrop-blur-md border border-white/30 shadow-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95 z-50 pointer-events-auto"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...TRANSITIONS.cta, delay: 2.32 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('exploreMenu')}
          data-testid="cta-explore-menu"
        >
          <span className="flex items-center gap-3">
            {t('exploreMenu')}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </motion.button>
      </div>

      {/* Subtle Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
