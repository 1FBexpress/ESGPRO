
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ESG Pro Pricing - Professional ESG Compliance Services',
  description: 'Affordable ESG compliance solutions for businesses of all sizes. Choose from Small Business, Growing Business, or Established Business packages.',
  openGraph: {
    title: 'ESG Pro Pricing - Professional ESG Compliance Services',
    description: 'Affordable ESG compliance solutions for businesses of all sizes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
