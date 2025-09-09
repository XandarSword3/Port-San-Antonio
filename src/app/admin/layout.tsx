import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Port Antonio Resort',
  description: 'Administrative interface for Port Antonio Resort management',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
