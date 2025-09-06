import './globals.css'
import { Metadata } from 'next'

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
    <html className="h-full">
      <body className="h-full overflow-x-hidden font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
