import './globals.css'
import { Metadata } from 'next'
import TrackerProvider from '@/components/TrackerProvider'

export const metadata: Metadata = {
  title: 'Port Antonio Resort - Menu',
  description: 'Experience the finest dining at Port Antonio Resort with our curated menu of Lebanese and Mediterranean cuisine.',
  keywords: 'resort, dining, menu, port antonio, lebanon, luxury, cuisine, lebanese, mediterranean',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PSA Resort',
  },
  formatDetection: {
    telephone: false,
  },
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
        <TrackerProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </TrackerProvider>
      </body>
    </html>
  )
}
