'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-base/90 backdrop-blur-xl border-b border-dark-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

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

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                active={activeItem === item.label}
                onClick={() => setActiveItem(item.label)}
              />
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-neon text-black text-sm font-semibold rounded-sm hover:shadow-neon transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Start a Project
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-white"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-white"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-white"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-card/95 backdrop-blur-xl border-t border-dark-border"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block text-lg text-gray-300 hover:text-neon transition-colors duration-200 py-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="#contact"
                className="mt-2 px-5 py-3 bg-neon text-black text-center font-semibold rounded-sm"
                onClick={() => setMobileOpen(false)}
              >
                Start a Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { label: string; href: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="relative group text-sm text-gray-400 hover:text-white transition-colors duration-200"
      style={{ fontFamily: 'Syne, sans-serif', fontWeight: 500 }}
    >
      {item.label}
      <motion.span
        className="absolute -bottom-1 left-0 h-px bg-neon"
        initial={{ width: active ? '100%' : '0%' }}
        animate={{ width: active ? '100%' : '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.2 }}
      />
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-px bg-neon"
        />
      )}
    </Link>
  )
}
