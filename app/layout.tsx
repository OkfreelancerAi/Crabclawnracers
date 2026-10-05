import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crab Claw Racers | Real Earnings Dashboard',
  description: 'Verified USDC earnings and payouts on Base. No simulated data.',
  openGraph: {
    title: 'Crab Claw Racers',
    description: 'Real earnings → Real USDC → Real Base transactions',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}