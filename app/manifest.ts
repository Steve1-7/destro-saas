import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SYNTRA — Content Distribution Dashboard',
    short_name: 'SYNTRA',
    description: 'Distribute content across social platforms with AI-powered caption adaptation.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#080b12',
    theme_color: '#080b12',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
