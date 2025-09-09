'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoadingProvider, useLoading } from '@/contexts/LoadingContext'
import GlobalHeader from '@/components/GlobalHeader'
import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import OceanDecor from '@/components/OceanDecor'
import SeaweedDecor from '@/components/SeaweedDecor'
import LebaneseDecor from '@/components/LebaneseDecor'
import ClickFeedback, { useClickFeedback } from '@/components/ClickFeedback'
import FloatingBeachElements from '@/components/FloatingBeachElements'
import EnhancedWaveAnimation from '@/components/EnhancedWaveAnimation'
import SandParticles from '@/components/SandParticles'
import SubtlePageTransition from '@/components/SubtlePageTransition'
import WaveLoader from '@/components/WaveLoader'
import OfflineNotification from '@/components/OfflineNotification'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import { useAnalyticsInit } from '@/hooks/useAnalytics'

const ClientLayoutContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { clickFeedback, addClickFeedback, clearClickFeedback } = useClickFeedback()
  const { isInitialLoading, setInitialLoadingComplete } = useLoading()
  
  // Initialize analytics system
  useAnalyticsInit()

  const handleClick = (event: React.MouseEvent) => {
    addClickFeedback(event)
  }

  if (isInitialLoading) {
    return <WaveLoader onComplete={setInitialLoadingComplete} />
  }

  return (
    <>
      <GlobalHeader />
      <OfflineNotification />
      <FloatingBeachElements />
      <SandParticles />
      <SubtlePageTransition>
        <main className="pt-16 min-h-screen relative" onClick={handleClick}>
          <LebaneseDecor />
          <div className="pointer-events-auto relative z-10">
            {children}
          </div>
          <SeaweedDecor />
          <div className="absolute inset-x-0 bottom-0 z-0">
            <OceanDecor />
          </div>
          <EnhancedWaveAnimation />
          <BackToTop />
        </main>
      </SubtlePageTransition>
      <Footer />
      <CookieConsentBanner />
      {clickFeedback && (
        <ClickFeedback
          x={clickFeedback.x}
          y={clickFeedback.y}
          onComplete={clearClickFeedback}
        />
      )}
    </>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <AuthProvider>
              <LoadingProvider>
                <ClientLayoutContent>
                  {children}
                </ClientLayoutContent>
              </LoadingProvider>
            </AuthProvider>
          </CartProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}