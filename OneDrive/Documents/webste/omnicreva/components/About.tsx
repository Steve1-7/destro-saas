'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="counter-number">
      {count}{suffix}
    </span>
  )
}

const timeline = [
  { year: '2016', title: 'Foundation', desc: 'OmniCreva was born from a vision to redefine digital excellence.' },
  { year: '2018', title: 'AI Integration', desc: 'First AI-powered product launched, serving 30+ enterprise clients.' },
  { year: '2020', title: 'Global Expansion', desc: 'Expanded to 12 countries with 5,000+ successful digital transformations.' },
  { year: '2022', title: 'Platform Launch', desc: 'Launched proprietary analytics and automation platform.' },
  { year: '2024', title: 'Innovation Era', desc: 'Pioneering next-gen digital experiences with immersive AI technology.' },
]

const stats = [
  { number: 200, suffix: '+', label: 'Projects Delivered', icon: '🚀' },
  { number: 150, suffix: '+', label: 'Happy Clients', icon: '⭐' },
  { number: 15, suffix: '+', label: 'Technologies', icon: '⚡' },
  { number: 8, suffix: '+', label: 'Years of Excellence', icon: '🏆' },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-neon/0 to-neon/40" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <span className="font-mono text-xs text-neon tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            // 01 About Us
          </span>
          <h2
            className="mt-4 text-4xl lg:text-5xl font-display text-white"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
          >
            We Don&apos;t Just Build —
            <br />
            <span className="gradient-text-mixed">We Innovate.</span>
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            OmniCreva is a premium digital technology company at the intersection of
            creativity and engineering. We help forward-thinking businesses transform
            through technology that doesn&apos;t just work — it inspires.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-6 lg:p-8 bg-dark-card border border-dark-border rounded-sm hover:border-neon/30 transition-all duration-300 group overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="shimmer absolute inset-0" />
              </div>

              <div className="text-3xl mb-2">{stat.icon}</div>
              <div
                className="text-4xl lg:text-5xl font-display text-neon mb-2"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
              >
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">
                {stat.label}
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-neon/20 rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Two columns: story + timeline */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3
              className="text-2xl font-display text-white mb-6"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
            >
              Our Story
            </h3>
            <div className="space-y-4 text-gray-400 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <p>
                Founded in 2016 by a collective of engineers, designers, and strategists
                who believed the digital world deserved better — OmniCreva emerged as
                a response to mediocre digital experiences.
              </p>
              <p>
                We&apos;ve grown into a powerhouse studio that bridges the gap between
                visionary ideas and technological reality. From Fortune 500 brands to
                disruptive startups, our work reshapes how people interact with technology.
              </p>
              <p>
                Every pixel, every algorithm, every user journey we craft is infused
                with purpose and precision — because we believe exceptional technology
                is the most powerful business lever available.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-neon text-black text-sm font-semibold rounded-sm hover:shadow-neon transition-all duration-300"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Work With Us
              </a>
              <a
                href="#projects"
                className="px-6 py-3 border border-white/20 text-white text-sm font-semibold rounded-sm hover:border-neon/60 hover:text-neon transition-all duration-300"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                View Portfolio
              </a>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <h3
              className="text-2xl font-display text-white mb-8"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
            >
              Timeline of Innovation
            </h3>

            {/* Vertical line */}
            <div className="absolute left-[60px] top-[72px] bottom-0 w-px bg-gradient-to-b from-neon/40 via-purple-prime/40 to-transparent" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-6 group"
                >
                  {/* Year badge */}
                  <div className="flex flex-col items-center gap-2 w-14 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-neon shadow-neon-sm flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span
                      className="text-xs text-neon font-mono"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <h4
                      className="text-white font-semibold mb-1 group-hover:text-neon transition-colors"
                      style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-divider mt-32" />
    </section>
  )
}
