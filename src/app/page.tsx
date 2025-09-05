'use client'

import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { ArrowRight, Utensils, Star, Clock, MapPin, Waves, Shell, Anchor, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import VideoBackground from '@/components/VideoBackground'

export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const containerRef = useRef(null)

  const handleCTAClick = () => {
    router.push('/menu')
  }

  return (
    <div ref={containerRef} className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-black' : 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900'}`}>
      <Header />
      
      {/* Video Background */}
      {!isDark && <VideoBackground />}

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-white">
          <div className="max-w-4xl animate-fadeIn flex flex-col items-center">
            {isDark ? (
              // Dark mode: Black and gold Lebanese theme
              <>
                <h1 className="mb-6 font-serif text-4xl sm:text-5xl font-light tracking-wider md:text-6xl lg:text-7xl animate-fadeInSlideUp text-gray-200 drop-shadow-lg">
                  {t('welcomeTo')}
                </h1>
                <h2 className="mb-8 font-serif text-5xl sm:text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 bg-[size:200%] animate-shimmer text-transparent bg-clip-text animate-fadeInSlideUp drop-shadow-lg">
                  {t('siteTitle')}
                </h2>
                <p className="mb-8 text-lg sm:text-xl font-light leading-relaxed md:text-2xl lg:text-2xl text-gray-300 max-w-3xl animate-fadeInSlideUp drop-shadow-md">
                  {t('experienceLuxury')}
                </p>
              </>
            ) : (
              // Light mode: Mediterranean theme
              <>
                <h1 className="mb-6 font-serif text-4xl sm:text-5xl font-light tracking-wider md:text-6xl lg:text-7xl animate-fadeInSlideUp text-white drop-shadow-lg">
                  {t('welcomeTo')}
                </h1>
                <h2 className="mb-8 font-serif text-5xl sm:text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 bg-[size:200%] animate-shimmer text-transparent bg-clip-text animate-fadeInSlideUp drop-shadow-lg">
                  {t('siteTitle')}
                </h2>
                <p className="mb-8 text-lg sm:text-xl font-light leading-relaxed md:text-2xl lg:text-2xl text-white/90 max-w-3xl animate-fadeInSlideUp drop-shadow-md">
                  {t('experienceLuxury')}
                </p>
              </>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCTAClick}
            className={`group relative overflow-hidden rounded-full bg-[size:200%] animate-shimmer px-10 py-5 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 opacity-0 animate-fadeInSlideUp [animation-delay:1.2s] [animation-fill-mode:forwards] ${
              isDark 
                ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:shadow-yellow-500/25' 
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:shadow-amber-500/25'
            }`}
            aria-label={t('exploreMenu')}
            data-testid="home-cta-button"
          >
            <span className="flex items-center gap-3">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">{t('exploreMenu')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Additional CTA Section */}
        <div className="relative z-20 mx-auto w-full max-w-4xl px-6 py-12 wave-separator">
          <div className="text-center">
            <motion.button
              onClick={handleCTAClick}
              className={`group relative overflow-hidden rounded-2xl px-12 py-6 text-xl font-semibold shadow-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 opacity-0 animate-fadeInSlideUp [animation-delay:2.3s] [animation-fill-mode:forwards] ${
                isDark 
                  ? 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black hover:shadow-yellow-500/25' 
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-white hover:shadow-amber-500/25'
              }`}
              aria-label={t('viewMenu')}
              data-testid="home-view-menu-button"
            >
              <span className="flex items-center gap-4">
                <Utensils className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                <span className={`relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 group-hover:after:w-full ${isDark ? 'after:bg-black' : 'after:bg-white'}`}>{t('viewMenu')}</span>
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </motion.button>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[
              { icon: Utensils, title: isDark ? "Gourmet Cuisine" : "Lebanese Cuisine", desc: isDark ? "International flavors" : "Authentic flavors", delay: 1.5 },
              { icon: Waves, title: isDark ? "Ocean Views" : "Mediterranean Views", desc: isDark ? "Beachfront dining" : "Sea-front dining", delay: 1.7 },
              { icon: Sun, title: isDark ? "Tropical Vibes" : "Beautiful Sun", desc: isDark ? "Island atmosphere" : "Relax in nature, and get a tan!", delay: 1.9 },
              { icon: Shell, title: isDark ? "Fresh Seafood" : "Fresh Mediterranean", desc: isDark ? "Daily catches" : "Daily catches", delay: 2.1 }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-3xl backdrop-blur-md p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl opacity-0 animate-fadeInSlideUp ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/20 hover:bg-gray-800/60 hover:shadow-yellow-500/10' 
                    : 'bg-gradient-to-br from-white/10 to-white/5 hover:bg-white/20 hover:shadow-amber-500/10'
                }`}
                style={{ animationDelay: `${feature.delay}s`, animationFillMode: 'forwards' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                  isDark ? 'from-yellow-500/10 to-transparent' : 'from-amber-500/10 to-transparent'
                }`} />
                <feature.icon className={`h-8 w-8 transition-transform duration-500 group-hover:scale-110 ${
                  isDark ? 'text-yellow-400 group-hover:text-yellow-300' : 'text-amber-400 group-hover:text-amber-300'
                }`} />
                <h3 className={`mt-4 text-xl font-semibold transition-colors duration-300 ${
                  isDark ? 'text-white group-hover:text-yellow-200' : 'text-white group-hover:text-amber-200'
                }`}>{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
