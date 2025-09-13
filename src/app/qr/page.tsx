'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { QrCode, Utensils, Star, Clock, ArrowRight, CheckCircle, Smartphone } from 'lucide-react'
import { track } from '@/lib/tracker'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'

interface QRPageContentProps {}

const QRPageContent: React.FC<QRPageContentProps> = () => {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const [isTracked, setIsTracked] = useState(false)
  const [tableNumber, setTableNumber] = useState<string | null>(null)

  useEffect(() => {
    const table = searchParams.get('table')
    const token = searchParams.get('token')
    
    setTableNumber(table)

    // Track QR scan event
    if (table && !isTracked) {
      track('qr_scan', {
        table: table,
        token: token || undefined,
        timestamp: new Date().toISOString(),
        source: 'qr_code'
      })
      setIsTracked(true)
    }
  }, [searchParams, isTracked])

  const qrTexts = {
    en: {
      welcome: 'Welcome to Port Antonio Resort',
      tableScanned: 'Table #{table} Successfully Scanned',
      description: 'You have successfully scanned the QR code for your table. Explore our authentic Lebanese Mediterranean menu and place your order directly from your device.',
      features: [
        'Browse our complete menu',
        'View detailed dish descriptions',
        'Place orders directly from your table',
        'Track your order status'
      ],
      cta: {
        menu: 'View Our Menu',
        loyalty: 'Join Our Loyalty Program',
        download: 'Download Our App'
      },
      benefits: {
        title: 'Exclusive Table Benefits',
        items: [
          'Skip the wait with mobile ordering',
          'Get notified when your food is ready',
          'Earn loyalty points with every order',
          'Access exclusive table-only specials'
        ]
      }
    },
    ar: {
      welcome: 'أهلاً بكم في منتجع بورت سان أنطونيو',
      tableScanned: 'تم مسح الطاولة رقم #{table} بنجاح',
      description: 'لقد نجحت في مسح رمز الاستجابة السريعة للطاولة الخاصة بك. استكشف قائمة الطعام اللبناني المتوسطي الأصيلة واطلب مباشرة من جهازك.',
      features: [
        'تصفح قائمة الطعام الكاملة',
        'عرض أوصاف الأطباق التفصيلية',
        'اطلب مباشرة من طاولتك',
        'تتبع حالة طلبك'
      ],
      cta: {
        menu: 'عرض قائمة الطعام',
        loyalty: 'انضم لبرنامج الولاء',
        download: 'تحميل تطبيقنا'
      },
      benefits: {
        title: 'مزايا الطاولة الحصرية',
        items: [
          'تخطي الانتظار مع الطلب عبر الهاتف',
          'احصل على إشعار عندما يكون طعامك جاهز',
          'اكسب نقاط الولاء مع كل طلب',
          'احصل على عروض حصرية للطاولة'
        ]
      }
    },
    fr: {
      welcome: 'Bienvenue au Resort Port Antonio',
      tableScanned: 'Table #{table} Scannée avec Succès',
      description: 'Vous avez scanné avec succès le code QR de votre table. Explorez notre menu méditerranéen libanais authentique et passez commande directement depuis votre appareil.',
      features: [
        'Parcourez notre menu complet',
        'Consultez les descriptions détaillées',
        'Commandez directement depuis votre table',
        'Suivez le statut de votre commande'
      ],
      cta: {
        menu: 'Voir Notre Menu',
        loyalty: 'Rejoindre le Programme Fidélité',
        download: 'Télécharger Notre App'
      },
      benefits: {
        title: 'Avantages Exclusifs de Table',
        items: [
          'Évitez l\'attente avec les commandes mobiles',
          'Soyez notifié quand votre repas est prêt',
          'Gagnez des points de fidélité à chaque commande',
          'Accédez aux offres spéciales de table'
        ]
      }
    }
  }

  const texts = qrTexts.en // Default to English, can be enhanced with full language support

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-white to-amber-50'
    } relative overflow-hidden`}>
      
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        {!isDark && (
          <>
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          </>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {texts.welcome}
            </h1>
            
            {tableNumber && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                isDark 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                <QrCode className="w-4 h-4" />
                <span className="font-medium">
                  {texts.tableScanned.replace('{table}', tableNumber)}
                </span>
              </div>
            )}
            
            <p className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {texts.description}
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {texts.features.map((feature, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-gray-200' 
                    : 'bg-white/80 border-gray-200 text-gray-700'
                } backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/menu"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
              }`}
            >
              <Utensils className="w-5 h-5" />
              {texts.cta.menu}
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <button
              onClick={() => {
                track('loyalty_signup_click', { source: 'qr_page', table: tableNumber })
                // Could navigate to loyalty signup page
              }}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                isDark 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25'
              }`}
            >
              <Star className="w-5 h-5" />
              {texts.cta.loyalty}
            </button>
          </motion.div>

          {/* Benefits section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`p-6 sm:p-8 rounded-2xl border ${
              isDark 
                ? 'bg-gray-800/30 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-sm`}
          >
            <h2 className={`text-2xl font-bold text-center mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {texts.benefits.title}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {texts.benefits.items.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Having trouble? Ask any of our staff members for assistance.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function QRPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Loading QR information...</p>
        </div>
      </div>
    }>
      <QRPageContent />
    </Suspense>
  )
}
