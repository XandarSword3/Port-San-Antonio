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
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <Header />
      
      {/* Video Background */}
      <VideoBackground />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-white">
          <div className="max-w-4xl animate-fadeIn flex flex-col items-center">
            {isDark ? (
              // Dark mode: Black and gold Lebanese theme
              <>
                <h1 className="mb-6 font-serif text-5xl sm:text-6xl font-light tracking-wider md:text-7xl lg:text-8xl animate-fadeInSlideUp text-white drop-shadow-lg">
                  Welcome to Port San Antonio's
                </h1>
                <h2 className="mb-8 font-serif text-6xl sm:text-7xl font-bold tracking-tight md:text-8xl lg:text-9xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-[size:200%] animate-shimmer text-transparent bg-clip-text animate-fadeInSlideUp drop-shadow-lg">
                  Lebanese Luxury
                </h2>
                <p className="mb-8 text-lg sm:text-xl font-light leading-relaxed md:text-2xl lg:text-3xl text-white/90 max-w-3xl animate-fadeInSlideUp drop-shadow-md">
                  Experience Mediterranean elegance • Authentic Lebanese cuisine • Contact: info@portsanantonio.com
                </p>
              </>
            ) : (
              // Light mode: Mediterranean theme
              <>
                <h1 className="mb-6 font-serif text-5xl sm:text-6xl font-light tracking-wider md:text-7xl lg:text-8xl animate-fadeInSlideUp text-white drop-shadow-lg">
                  Welcome to Port San Antonio's
                </h1>
                <h2 className="mb-8 font-serif text-6xl sm:text-7xl font-bold tracking-tight md:text-8xl lg:text-9xl bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 bg-[size:200%] animate-shimmer text-transparent bg-clip-text animate-fadeInSlideUp drop-shadow-lg">
                  Mediterranean Resort
                </h2>
                <p className="mb-8 text-lg sm:text-xl font-light leading-relaxed md:text-2xl lg:text-3xl text-white/90 max-w-3xl animate-fadeInSlideUp drop-shadow-md">
                  Discover Lebanese hospitality • Mediterranean sea views • And have a great time!
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
              className="group relative overflow-hidden rounded-2xl btn-beach btn-wave px-12 py-6 text-xl font-semibold shadow-2xl transition-all duration-300 hover:shadow-yellow-500/25 hover:shadow-2xl hover:scale-105 active:scale-95 opacity-0 animate-fadeInSlideUp [animation-delay:2.3s] [animation-fill-mode:forwards]"
              aria-label={t('viewMenu')}
              data-testid="home-view-menu-button"
            >
              <span className="flex items-center gap-4">
                <Utensils className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">{t('viewMenu')}</span>
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </motion.button>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[
              { icon: Utensils, title: "Lebanese Cuisine", desc: "Authentic flavors", delay: 1.5 },
              { icon: Waves, title: "Mediterranean Views", desc: "Sea-front dining", delay: 1.7 },
              { icon: Sun, title: "Beautifull Sun", desc: "Relax in nature,and get a tan!", delay: 1.9 },
              { icon: Shell, title: "Fresh Mediterranean", desc: "Daily catches", delay: 2.1 }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 transition-all duration-500 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10 opacity-0 animate-fadeInSlideUp`}
                style={{ animationDelay: `${feature.delay}s`, animationFillMode: 'forwards' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <feature.icon className="h-8 w-8 text-amber-400 transition-transform duration-500 group-hover:scale-110 group-hover:text-amber-300" />
                <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-amber-200 transition-colors duration-300">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
