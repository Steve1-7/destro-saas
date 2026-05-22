'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const socials = [
  {
    name: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M10.77 7.63L17.1 0.5H15.6L10.1 6.72L5.73 0.5H0.5L7.15 9.96L0.5 17.5H2L7.82 10.9L12.45 17.5H17.68L10.77 7.63ZM8.54 10.04L7.89 9.11L2.54 1.6H5L9.13 7.57L9.78 8.5L15.41 16.4H12.87L8.54 10.04Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15.33 0.5H2.67C1.47 0.5 0.5 1.47 0.5 2.67V15.33C0.5 16.53 1.47 17.5 2.67 17.5H15.33C16.53 17.5 17.5 16.53 17.5 15.33V2.67C17.5 1.47 16.53 0.5 15.33 0.5ZM6 14H3.5V7H6V14ZM4.75 5.9C3.98 5.9 3.35 5.27 3.35 4.5C3.35 3.73 3.98 3.1 4.75 3.1C5.52 3.1 6.15 3.73 6.15 4.5C6.15 5.27 5.52 5.9 4.75 5.9ZM14.5 14H12V10.5C12 9.4 11.6 9 10.75 9C9.9 9 9.5 9.4 9.5 10.5V14H7V7H9.5V8C9.9 7.2 10.7 6.75 11.75 6.75C13.3 6.75 14.5 7.7 14.5 9.75V14Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M9 0.5C4.3 0.5 0.5 4.3 0.5 9C0.5 12.75 2.9 15.95 6.28 17.08C6.68 17.15 6.83 16.91 6.83 16.7C6.83 16.51 6.82 15.93 6.82 15.27C4.5 15.74 4.03 14.24 4.03 14.24C3.67 13.26 3.14 12.99 3.14 12.99C2.41 12.5 3.19 12.51 3.19 12.51C3.99 12.57 4.41 13.33 4.41 13.33C5.13 14.6 6.37 14.23 6.86 14.01C6.93 13.49 7.14 13.14 7.37 12.94C5.46 12.74 3.45 12.01 3.45 8.73C3.45 7.8 3.78 7.03 4.43 6.43C4.34 6.22 4.05 5.33 4.52 4.15C4.52 4.15 5.18 3.92 6.82 5.03C7.51 4.84 8.26 4.75 9 4.74C9.74 4.75 10.49 4.84 11.18 5.03C12.82 3.92 13.48 4.15 13.48 4.15C13.95 5.33 13.66 6.22 13.57 6.43C14.22 7.03 14.55 7.8 14.55 8.73C14.55 12.01 12.54 12.74 10.62 12.94C10.92 13.19 11.18 13.68 11.18 14.43C11.18 15.5 11.17 16.36 11.17 16.7C11.17 16.91 11.32 17.15 11.72 17.08C15.1 15.95 17.5 12.75 17.5 9C17.5 4.3 13.7 0.5 9 0.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Dribbble',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.5" stroke="currentColor" strokeWidth="1" />
        <path d="M0.5 9H17.5M9 0.5C9 0.5 12 5 12 9C12 13 9 17.5 9 17.5M9 0.5C9 0.5 6 5 6 9C6 13 9 17.5 9 17.5M1.4 5.5C1.4 5.5 4.5 7 9 7C13.5 7 16.6 5.5 16.6 5.5M1.4 12.5C1.4 12.5 4.5 11 9 11C13.5 11 16.6 12.5 16.6 12.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
]

const footerLinks = {
  Services: ['Web Development', 'Full-Stack Dev', 'UI/UX Design', 'AI Automation', 'Data Analytics', 'Strategy'],
  Company: ['About Us', 'Our Work', 'Innovation Lab', 'Insights', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-dark-base border-t border-dark-border overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 via-50% via-purple-prime/20 to-transparent" />

      {/* Glow blobs */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-prime/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
                      <Link href="#home" className="group">
            <Image
              src="/img/Omni.png"
              alt="Omni Creva"
              width={140}
              height={140}
              className="hover:opacity-80 transition-opacity duration-300"
            />
          </Link>

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              We build premium digital products at the intersection of technology,
              design, and intelligence. Crafting the future, one pixel at a time.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-9 h-9 flex items-center justify-center border border-dark-border rounded-sm text-gray-500 hover:text-neon hover:border-neon/40 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-white text-sm font-semibold mb-4"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 text-sm hover:text-neon transition-colors duration-200"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div className="py-8 border-t border-dark-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h4 className="text-white text-sm font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              Stay ahead of the curve
            </h4>
            <p className="text-gray-600 text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Weekly insights on digital innovation, AI, and product excellence.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 bg-dark-card border border-dark-border rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-neon/40 transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            <button
              className="px-5 py-2.5 bg-neon text-black text-xs font-semibold rounded-sm hover:shadow-neon transition-all duration-300 whitespace-nowrap"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            © {year} OmniCreva. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 font-mono flex items-center gap-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
              All systems operational
            </span>
            <span className="text-xs text-gray-700 font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              v2025.1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
