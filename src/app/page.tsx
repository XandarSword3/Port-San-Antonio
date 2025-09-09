'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Star, Clock, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import GlobalHeader from '@/components/GlobalHeader';
import Sidebar from '@/components/Sidebar';
import { useTransitionRouter } from '@/hooks/useTransitionRouter';
import { TransitionOverlay } from '@/components/PageTransition';

export default function Home() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { isTransitioning, transitionType, navigateWithTransition } = useTransitionRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCTAClick = () => {
    navigateWithTransition('/menu', 'menu');
  };

  // Feature data that matches your screenshots
  const features = [
    { 
      icon: Utensils, 
      title: isDark ? t('lebaneseCuisine') : t('gourmetCuisine'), 
      desc: isDark ? t('authenticFlavors') : t('internationalFlavors') 
    },
    { 
      icon: MapPin, 
      title: isDark ? t('mediterraneanViews') : t('oceanViews'), 
      desc: isDark ? t('seafrontDining') : t('beachfrontDining') 
    },
    { 
      icon: Clock, 
      title: isDark ? t('beautifulSun') : t('tropicalVibes'), 
      desc: isDark ? t('relaxInNature') : t('islandAtmosphere') 
    },
    { 
      icon: Star, 
      title: isDark ? t('freshMediterranean') : t('freshSeafood'), 
      desc: isDark ? t('dailyCatches') : t('dailyCatches') 
    }
  ];

  return (
    <>
      <GlobalHeader />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`relative min-h-screen overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
      }`}>
        
        {/* Light mode decorative elements */}
        {!isDark && (
          <div className="absolute inset-0 z-0">
            {/* Floating geometric shapes */}
            <div className="absolute top-20 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-20 w-16 sm:w-24 h-16 sm:h-24 bg-amber-200/40 rounded-full blur-2xl animate-pulse mobile-hide-decorative" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-40 left-20 w-24 sm:w-40 h-24 sm:h-40 bg-purple-200/20 rounded-full blur-3xl animate-pulse mobile-hide-decorative" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-20 right-40 w-18 sm:w-28 h-18 sm:h-28 bg-teal-200/30 rounded-full blur-2xl animate-pulse mobile-hide-decorative" style={{ animationDelay: '3s' }} />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"none\\" fill-rule=\\"evenodd\\"%3E%3Cg fill=\\"%234f46e5\\" fill-opacity=\\"0.1\\"%3E%3Cpath d=\\"m30 60 30-30-30-30L0 30z\\"%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} />
          </div>
        )}
        
        {/* Dark mode effects */}
        {isDark && (
          <div className="absolute inset-0 z-0">
            {/* Starfield effect */}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-purple-950/30" />
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-screen mobile-hero flex-col">
          {/* Main Content */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 mobile-container text-center">
            <motion.div 
              className="mb-12 max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className={`mb-4 mobile-title-primary font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-wider ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('welcomeTo')}
              </h1>
              <h2 className={`mb-8 mobile-title-secondary font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight bg-gradient-to-r ${
                isDark 
                  ? 'from-amber-200 via-amber-300 to-amber-400' 
                  : 'from-amber-600 via-amber-500 to-amber-700'
              } text-transparent bg-clip-text drop-shadow-lg`}>
                {t('siteTitle')}
              </h2>
              <p className={`mobile-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed ${
                isDark ? 'text-gray-100' : 'text-gray-700'
              }`}>
                {t('experienceLuxury')}
              </p>
            </motion.div>

            {/* Enhanced CTA Button with cool animations */}
            <motion.button
              onClick={handleCTAClick}
              className={`group relative overflow-hidden rounded-full mobile-cta-button px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-medium text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 ${
                isDark 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
              }`}
              aria-label={t('exploreMenu')}
              data-testid="home-cta-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ 
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(245, 158, 11, 0.3))',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              <span className="flex items-center gap-3 relative z-10">
                <motion.div
                  animate={{ rotate: [0, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 0 }}
                  whileHover={{ 
                    rotate: -15,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Utensils className="h-5 w-5" />
                </motion.div>
                {t('viewMenu')}
                <motion.div
                  whileHover={{ 
                    x: 8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <ArrowRight className="h-6 w-6" />
                </motion.div>
              </span>
              
              {/* Glow effect - only on hover */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 to-yellow-400/40 blur-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Ripple effect on click */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                initial={{ scale: 0, opacity: 1 }}
                whileTap={{ 
                  scale: 1.5, 
                  opacity: 0,
                  transition: { duration: 0.4 }
                }}
              />
            </motion.button>
          </div>

          {/* Feature Grid */}
          <motion.div 
            className="relative z-20 mx-auto w-full max-w-7xl mobile-container mobile-feature-grid px-4 sm:px-6 pb-12 sm:pb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl backdrop-blur-sm mobile-feature-card p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] border ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' 
                      : 'bg-white/80 hover:bg-white/90 border-gray-200 shadow-lg hover:shadow-xl'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <feature.icon className={`mobile-feature-icon h-6 sm:h-8 w-6 sm:w-8 mb-3 sm:mb-4 ${
                    isDark ? 'text-amber-400' : 'text-amber-500'
                  }`} />
                  <h3 className={`mobile-feature-title mt-3 sm:mt-4 text-base sm:text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{feature.title}</h3>
                  <p className={`mobile-feature-desc mt-1 sm:mt-2 text-xs sm:text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transition Overlay */}
      {isTransitioning && <TransitionOverlay type={transitionType} />}
    </>
  );
}
