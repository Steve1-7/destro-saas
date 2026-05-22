import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OmniCreva — Building the Future of Digital Innovation',
  description: 'OmniCreva is a premium digital technology company specializing in web development, AI automation, UI/UX design, data analytics, and digital strategy.',
  keywords: ['digital agency', 'web development', 'AI automation', 'UI/UX design', 'data analytics', 'digital strategy', 'OmniCreva'],
  authors: [{ name: 'OmniCreva' }],
  creator: 'OmniCreva',
  openGraph: {
    title: 'OmniCreva — Building the Future of Digital Innovation',
    description: 'Premium digital technology company pushing the boundaries of what is possible.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OmniCreva',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniCreva — Building the Future of Digital Innovation',
    description: 'Premium digital technology company pushing the boundaries of what is possible.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: 'var(--font-body)',
        }}
      >
        {children}
      </body>
    </html>
  )
}
