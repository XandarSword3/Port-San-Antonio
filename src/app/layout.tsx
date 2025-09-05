import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Port San Antonio Resort - Menu',
  description: 'Experience the finest dining at Port San Antonio Resort with our curated menu of local and international cuisine.',
  keywords: 'resort, dining, menu, port san antonio, luxury, cuisine',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

import ClientLayout from '@/components/ClientLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
