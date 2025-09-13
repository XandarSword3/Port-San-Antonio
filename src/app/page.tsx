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
import { usePageView } from '@/hooks/useAnalytics';

export default function Home() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { isTransitioning, transitionType, navigateWithTransition } = useTransitionRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Analytics tracking
  usePageView('/');

  const handleCTAClick = () => {
    navigateWithTransition('/menu', 'menu');
  };

  // Enhanced feature data with thumbnail images
  const features = [
    { 
      icon: Utensils, 
      title: isDark ? t('lebaneseCuisine') : t('gourmetCuisine'), 
      desc: isDark ? t('authenticFlavors') : t('internationalFlavors'),
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      icon: MapPin, 
      title: isDark ? t('mediterraneanViews') : t('oceanViews'), 
      desc: isDark ? t('seafrontDining') : t('beachfrontDining'),
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      icon: Clock, 
      title: isDark ? t('beautifulSun') : t('tropicalVibes'), 
      desc: isDark ? t('relaxInNature') : t('islandAtmosphere'),
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      icon: Star, 
      title: isDark ? t('freshMediterranean') : t('freshSeafood'), 
      desc: isDark ? t('dailyCatches') : t('dailyCatches'),
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  return (
    <>
      <GlobalHeader />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`relative min-h-screen overflow-hidden ${
        isDark 
          ? 'bg-black' 
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
        
        {/* Hero Background Image - 2025 Luxury Style */}
        {isDark && (
          <div className="absolute inset-0 z-0">
            {/* Hero Image Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                filter: 'brightness(0.3) contrast(1.2)'
              }}
            />
            
            {/* Luxury Gold Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Subtle Gold Accent Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-900/5 to-amber-800/10" />
            
            {/* Floating Gold Particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400/60 rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
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
              <h1 className={`mb-6 mobile-title-primary font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-wider ${
                isDark ? 'text-luxury-dark-text' : 'text-gray-900'
              }`} style={{ textShadow: isDark ? '0 4px 20px rgba(0,0,0,0.8)' : 'none' }}>
                {t('welcomeTo')}
              </h1>
              <h2 className={`mb-8 mobile-title-secondary font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight bg-gradient-to-r ${
                isDark 
                  ? 'from-luxury-dark-accent via-yellow-400 to-luxury-dark-accent' 
                  : 'from-amber-600 via-amber-500 to-amber-700'
              } text-transparent bg-clip-text drop-shadow-lg`} style={{ 
                textShadow: isDark ? '0 0 30px rgba(212, 175, 55, 0.5)' : 'none',
                filter: isDark ? 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))' : 'none'
              }}>
                {t('siteTitle')}
              </h2>
              <p className={`mobile-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed ${
                isDark ? 'text-luxury-dark-text/90' : 'text-gray-700'
              }`} style={{ textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.6)' : 'none' }}>
                {t('experienceLuxury')}
              </p>
            </motion.div>

            {/* Enhanced CTA Button with cool animations */}
            <motion.button
              onClick={handleCTAClick}
              className={`group relative overflow-hidden rounded-full mobile-cta-button px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-semibold shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 ${
                isDark 
                  ? 'bg-gradient-to-r from-luxury-dark-accent to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
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
                filter: isDark ? 'drop-shadow(0 10px 25px rgba(212, 175, 55, 0.4))' : 'drop-shadow(0 10px 25px rgba(245, 158, 11, 0.3))',
                textShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.3)'
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
              
              {/* Enhanced Glow effect - only on hover */}
              <motion.div 
                className={`absolute inset-0 rounded-full blur-xl opacity-0 ${
                  isDark 
                    ? 'bg-gradient-to-r from-luxury-dark-accent/50 to-yellow-400/50' 
                    : 'bg-gradient-to-r from-amber-400/40 to-yellow-400/40'
                }`}
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

            {/* Quick Booking Widget */}
            <motion.div 
              className="absolute bottom-8 right-8 hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
                isDark 
                  ? 'bg-luxury-dark-card/80 border-luxury-dark-border/30' 
                  : 'bg-white/90 border-gray-200/50'
              } shadow-xl`}>
                <h4 className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-luxury-dark-text' : 'text-gray-900'
                }`}>Quick Reservation</h4>
                <div className="flex gap-2">
                  <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isDark 
                        ? 'bg-luxury-dark-accent text-black hover:bg-yellow-600' 
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Table
                  </motion.button>
                  <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      isDark 
                        ? 'border-luxury-dark-border/50 text-luxury-dark-text hover:bg-luxury-dark-card' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Call Now
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.div
                className={`flex flex-col items-center gap-2 ${
                  isDark ? 'text-luxury-dark-text/70' : 'text-gray-600'
                }`}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-sm font-light">Scroll to explore</span>
                <motion.div
                  className={`w-6 h-10 border-2 rounded-full flex justify-center ${
                    isDark ? 'border-luxury-dark-accent/50' : 'border-amber-500/50'
                  }`}
                >
                  <motion.div
                    className={`w-1 h-3 rounded-full mt-2 ${
                      isDark ? 'bg-luxury-dark-accent' : 'bg-amber-500'
                    }`}
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Feature Grid */}
          <motion.div 
            className="relative z-20 mx-auto w-full max-w-7xl mobile-container mobile-feature-grid px-6 sm:px-8 pb-16 sm:pb-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm mobile-feature-card transition-all duration-500 hover:scale-[1.05] border-2 ${
                    isDark 
                      ? 'bg-luxury-dark-card/80 hover:bg-luxury-dark-card border-luxury-dark-border/20 hover:border-luxury-dark-accent/40' 
                      : 'bg-white/90 hover:bg-white border-gray-200/50 hover:border-amber-300/50 shadow-xl hover:shadow-2xl'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + i * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDark 
                        ? 'from-black/60 via-transparent to-transparent' 
                        : 'from-black/40 via-transparent to-transparent'
                    }`} />
                    
                    {/* Icon Overlay */}
                    <div className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm ${
                      isDark 
                        ? 'bg-luxury-dark-accent/20 border border-luxury-dark-accent/30' 
                        : 'bg-white/80 border border-white/50'
                    }`}>
                      <feature.icon className={`h-5 w-5 ${
                        isDark ? 'text-luxury-dark-accent' : 'text-amber-600'
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`mobile-feature-title text-lg sm:text-xl font-bold mb-2 ${
                      isDark ? 'text-luxury-dark-text' : 'text-gray-900'
                    }`}>{feature.title}</h3>
                    <p className={`mobile-feature-desc text-sm sm:text-base leading-relaxed ${
                      isDark ? 'text-luxury-dark-text/80' : 'text-gray-600'
                    }`}>{feature.desc}</p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark 
                      ? 'bg-gradient-to-br from-luxury-dark-accent/5 via-transparent to-yellow-400/5' 
                      : 'bg-gradient-to-br from-amber-100/20 via-transparent to-yellow-100/20'
                  }`} />
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
