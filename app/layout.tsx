// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import PWAInstallButton from '@/components/PWAInstallButton';
import './globals.css';

export const metadata: Metadata = {
  title: 'SYNTRA — Content Distribution Dashboard',
  description: 'Distribute content across YouTube, TikTok, LinkedIn and Facebook with AI-powered caption adaptation.',
  manifest: '/manifest.webmanifest',
  applicationName: 'SYNTRA',
  appleWebApp: {
    capable: true,
    title: 'SYNTRA',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080b12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text antialiased">
        {children}
        <PWAInstallButton />
      </body>
    </html>
  );
}
