import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creative Studio',
  description: 'Local-first photo editor for Story, Post and A3 designs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
