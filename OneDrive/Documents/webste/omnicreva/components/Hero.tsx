'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, animate } from 'framer-motion'
import Link from 'next/link'

const words = [
  'Web Development',
  'AI & Automation',
  'Branding & Design',
  'Data & Analytics',
  'Digital Innovation',
]

function CSSCube() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
      {/* Outer orbit rings */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 420, height: 420, borderColor: 'rgba(0,255,0,0.12)' }}
        animate={{ rotateX: 70, rotateZ: 360 }}
        transition={{ rotateZ: { duration: 18, repeat: Infinity, ease: 'linear' }, rotateX: { duration: 0 } }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 340, height: 340, borderColor: 'rgba(123,47,190,0.15)' }}
        animate={{ rotateX: 50, rotateZ: -360 }}
        transition={{ rotateZ: { duration: 24, repeat: Infinity, ease: 'linear' }, rotateX: { duration: 0 } }}
      />

      {/* 3D CSS Cube */}
      <motion.div
        style={{ width: 160, height: 160, transformStyle: 'preserve-3d', position: 'relative' }}
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', width: 160, height: 160,
          transform: 'translateZ(80px)',
          background: 'rgba(0,255,0,0.04)',
          border: '1px solid rgba(0,255,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(0,255,0,0.7)', letterSpacing: '0.1em',
        }}>WEB DEV</div>
        {/* Back */}
        <div style={{
          position: 'absolute', width: 160, height: 160,
          transform: 'translateZ(-80px) rotateY(180deg)',
          background: 'rgba(123,47,190,0.04)',
          border: '1px solid rgba(123,47,190,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(157,78,221,0.7)', letterSpacing: '0.1em',
        }}>AI & ML</div>
        {/* Left */}
        <div style={{
          position: 'absolute', width: 160, height: 160,
          transform: 'rotateY(-90deg) translateZ(80px)',
          background: 'rgba(0,204,0,0.04)',
          border: '1px solid rgba(0,204,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(0,204,0,0.7)', letterSpacing: '0.1em',
        }}>DESIGN</div>
        {/* Right */}
        <div style={{
          position: 'absolute', width: 160, height: 160,
          transform: 'rotateY(90deg) translateZ(80px)',
          background: 'rgba(199,125,255,0.04)',
          border: '1px solid rgba(199,125,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(199,125,255,0.7)', letterSpacing: '0.1em',
        }}>DATA</div>
        {/* Top */}
        <div style={{
          position: 'absolute', width: 160, height: 160,
          transform: 'rotateX(90deg) translateZ(80px)',
          background: 'rgba(0,255,0,0.03)',
          border: '1px solid rgba(0,255,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(0,255,0,0.5)', letterSpacing: '0.1em',
        }}>CLOUD</div>
        {/* Bottom */}
        <div style={{
          position: 'absolute', width: 160, height: 160,
          transform: 'rotateX(-90deg) translateZ(80px)',
          background: 'rgba(123,47,190,0.03)',
          border: '1px solid rgba(123,47,190,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(123,47,190,0.5)', letterSpacing: '0.1em',
        }}>STRATEGY</div>
      </motion.div>

      {/* Orbiting dots */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#00FF00' : '#7B2FBE',
            boxShadow: i % 2 === 0 ? '0 0 8px #00FF00' : '0 0 8px #7B2FBE',
          }}
          animate={{
            x: Math.cos((i / 5) * Math.PI * 2) * 200,
            y: Math.sin((i / 5) * Math.PI * 2) * 80,
          }}
          transition={{
            duration: 0,
          }}
        >
          <motion.div
            style={{ width: 8, height: 8, borderRadius: '50%', background: 'inherit' }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.5,
            }}
          />
        </motion.div>
      ))}

      {/* Corner labels */}
      {[
        { label: 'Web Dev', x: -210, y: -140 },
        { label: 'AI & ML', x: 130, y: -140 },
        { label: 'Branding', x: -230, y: 130 },
        { label: 'Analytics', x: 130, y: 130 },
        { label: 'Strategy', x: -50, y: -195 },
      ].map(({ label, x, y }) => (
        <motion.div
          key={label}
          className="absolute text-xs font-mono pointer-events-none"
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            fontFamily: 'JetBrains Mono, monospace',
            color: 'rgba(0,255,0,0.45)',
            letterSpacing: '0.12em',
            fontSize: 10,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: Math.abs(x) / 200 }}
        >
          {label}
        </motion.div>
      ))}
    </div>
  )
}

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 150])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const speed = isDeleting ? 60 : 90
    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setCharIndex(c => c + 1)
      } else if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 1800)
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(c => c - 1)
      } else {
        setIsDeleting(false)
        setWordIndex(i => (i + 1) % words.length)
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ background: 'rgba(0,255,0,0.05)', animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ background: 'rgba(123,47,190,0.05)', animationDuration: '6s' }} />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-screen py-32">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="flex items-center gap-2 px-4 py-1.5 border rounded-full text-xs font-mono tracking-widest uppercase w-fit" style={{ borderColor: 'rgba(0,255,0,0.3)', color: '#00FF00', fontFamily: 'JetBrains Mono, monospace' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" style={{ background: '#00FF00' }} />
                Digital Technology Company
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display leading-tight" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                <span style={{ color: 'white' }}>Building the </span><br />
                <span style={{ background: 'linear-gradient(135deg,#00FF00,#00CC00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Future</span>
                <span style={{ color: 'white' }}> of </span><br />
                <span style={{ color: 'white' }}>Digital </span>
                <span style={{ background: 'linear-gradient(135deg,#7B2FBE,#C77DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Innovation.</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center gap-3">
              <span className="text-gray-400 text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>Specializing in</span>
              <span className="text-lg font-mono min-w-[220px]" style={{ color: '#00FF00', fontFamily: 'JetBrains Mono, monospace' }}>
                {words[wordIndex].slice(0, charIndex)}
                <span className="inline-block w-0.5 h-5 ml-0.5 animate-pulse" style={{ background: '#00FF00', verticalAlign: 'middle' }} />
              </span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-gray-400 text-lg leading-relaxed max-w-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              We craft premium digital experiences that push boundaries — from intelligent AI systems to immersive web platforms that redefine what technology can achieve.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-4">
              <Link href="#contact" className="group relative px-8 py-4 font-semibold text-sm tracking-wide rounded-sm overflow-hidden transition-all duration-300"
                style={{ fontFamily: 'Syne, sans-serif', background: '#00FF00', color: '#000' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,255,0,0.4)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                Start a Project
              </Link>
              <Link href="#projects" className="group px-8 py-4 border font-semibold text-sm tracking-wide rounded-sm transition-all duration-300"
                style={{ fontFamily: 'Syne, sans-serif', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(0,255,0,0.6)'; el.style.color = '#00FF00' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.2)'; el.style.color = 'white' }}>
                Explore Our Work →
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex gap-8 pt-4" style={{ borderTop: '1px solid #1A1A1A' }}>
              {[{ num: '200+', label: 'Projects' }, { num: '150+', label: 'Clients' }, { num: '8+', label: 'Years' }].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-display" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#00FF00' }}>{stat.num}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — CSS 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[500px] lg:h-[600px]"
            style={{ perspective: '1000px' }}
          >
            <CSSCube />
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs text-gray-600 uppercase tracking-widest font-mono">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-12" style={{ background: 'linear-gradient(to bottom, rgba(0,255,0,0.6), transparent)' }} />
      </motion.div>
    </section>
  )
}
