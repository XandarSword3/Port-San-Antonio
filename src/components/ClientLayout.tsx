'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { CartProvider } from '@/contexts/CartContext'
import GlobalHeader from '@/components/GlobalHeader'
import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import OceanDecor from '@/components/OceanDecor'
import SeaweedDecor from '@/components/SeaweedDecor'
import LebaneseDecor from '@/components/LebaneseDecor'
import BeachAmbience from '@/components/BeachAmbience'
import ReducedMotionToggle from '@/components/ReducedMotionToggle'
import ClickFeedback, { useClickFeedback } from '@/components/ClickFeedback'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { clickFeedback, addClickFeedback, clearClickFeedback } = useClickFeedback()

  const handleClick = (event: React.MouseEvent) => {
    addClickFeedback(event)
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <GlobalHeader />
            <main className="pt-16 min-h-screen relative" onClick={handleClick}>
              <LebaneseDecor />
              <div className="pointer-events-auto relative z-10">
                {children}
              </div>
              <SeaweedDecor />
              <div className="absolute inset-x-0 bottom-0 z-0">
                <OceanDecor />
              </div>
              <BackToTop />
            </main>
            <Footer />
            <BeachAmbience />
            <ReducedMotionToggle />
            {clickFeedback && (
              <ClickFeedback
                x={clickFeedback.x}
                y={clickFeedback.y}
                onComplete={clearClickFeedback}
              />
            )}
          </CartProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}