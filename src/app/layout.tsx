import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://bisp-mocha.vercel.app'),
  title: 'TutorLink - Find Your Perfect Tutor',
  description: 'Connect with local tutors for personalized learning experiences',
  openGraph: {
    title: 'TutorLink - Find Your Perfect Tutor',
    description: 'Connect with local tutors for personalized learning experiences',
    url: 'https://bisp-mocha.vercel.app',
    siteName: 'TutorLink',
    images: [
      {
        url: 'https://bisp-mocha.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TutorLink - Find Your Perfect Tutor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TutorLink - Find Your Perfect Tutor',
    description: 'Connect with local tutors for personalized learning experiences',
    images: ['https://bisp-mocha.vercel.app/og-image.png'],
    creator: '@tutorlink',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
} 