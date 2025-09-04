'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import GlobalHeader from '@/components/GlobalHeader'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GlobalHeader />
        <main className="pt-16">
          {children}
        </main>
      </LanguageProvider>
    </ThemeProvider>
  )
}