'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    id: '01',
    title: 'Web Development',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="4" width="28" height="20" rx="2" stroke="#00FF00" strokeWidth="1.5" />
        <path d="M2 9H30" stroke="#00FF00" strokeWidth="1.5" />
        <circle cx="6" cy="6.5" r="1" fill="#00FF00" />
        <circle cx="10" cy="6.5" r="1" fill="#00FF00" opacity="0.6" />
        <circle cx="14" cy="6.5" r="1" fill="#00FF00" opacity="0.3" />
        <path d="M10 14L14 18L10 22" stroke="#00FF00" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 14L22 18L18 22" stroke="#7B2FBE" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 28H24" stroke="#00FF00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    description: 'Blazing-fast, conversion-optimized websites built with modern frameworks that scale with your ambitions.',
    tags: ['React', 'Next.js', 'TypeScript'],
    color: '#00FF00',
  },
  {
    id: '02',
    title: 'Full-Stack Development',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="#7B2FBE" strokeWidth="1.5" />
        <path d="M16 4V28M4 10L28 10M4 22L28 22" stroke="#7B2FBE" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        <circle cx="16" cy="16" r="3" fill="#7B2FBE" opacity="0.8" />
      </svg>
    ),
    description: 'End-to-end application development with robust APIs, microservices, and scalable cloud infrastructure.',
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
    color: '#7B2FBE',
  },
  {
    id: '03',
    title: 'UI/UX Design',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#9D4EDD" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" fill="#9D4EDD" opacity="0.6" />
        <path d="M16 4V8M16 24V28M4 16H8M24 16H28" stroke="#9D4EDD" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.76 7.76L10.59 10.59M21.41 21.41L24.24 24.24M24.24 7.76L21.41 10.59M10.59 21.41L7.76 24.24" stroke="#9D4EDD" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    description: 'Human-centred design systems that balance aesthetic beauty with intuitive, delightful user experiences.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
    color: '#9D4EDD',
  },
  {
    id: '04',
    title: 'AI Automation',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="8" y="8" width="16" height="12" rx="2" stroke="#00FF00" strokeWidth="1.5" />
        <path d="M11 14H21M13 11H19M13 17H17" stroke="#00FF00" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 20L10 24H22L20 20" stroke="#00FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="8" r="4" fill="#7B2FBE" />
        <path d="M22.5 8L24 9.5L26 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Intelligent automation solutions powered by LLMs and custom ML models that transform how your business operates.',
    tags: ['GPT-4', 'LangChain', 'Python'],
    color: '#00FF00',
  },
  {
    id: '05',
    title: 'Data Analytics',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 26L4 18M10 26V14M16 26V8M22 26V12M28 26V6" stroke="#C77DFF" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 18L10 14L16 8L22 12L28 6" stroke="#C77DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2" opacity="0.5" />
        <circle cx="28" cy="6" r="2" fill="#C77DFF" />
        <circle cx="22" cy="12" r="2" fill="#C77DFF" opacity="0.7" />
        <circle cx="16" cy="8" r="2" fill="#C77DFF" opacity="0.7" />
      </svg>
    ),
    description: 'Real-time data intelligence platforms that convert raw data into actionable insights driving growth.',
    tags: ['Python', 'Tableau', 'BigQuery'],
    color: '#C77DFF',
  },
  {
    id: '06',
    title: 'Digital Strategy',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#00CC00" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="8" stroke="#00CC00" strokeWidth="1" opacity="0.5" />
        <circle cx="16" cy="16" r="4" stroke="#00CC00" strokeWidth="1" opacity="0.3" />
        <circle cx="16" cy="16" r="1.5" fill="#00CC00" />
        <path d="M16 4V6M16 26V28M4 16H6M26 16H28" stroke="#00CC00" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M19 13L22 10" stroke="#00CC00" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="23" cy="9" r="2" fill="#00CC00" />
      </svg>
    ),
    description: 'Comprehensive go-to-market strategies backed by data, competitive analysis, and proven growth frameworks.',
    tags: ['Strategy', 'Growth', 'Analytics'],
    color: '#00CC00',
  },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <span className="font-mono text-xs text-neon tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              // 02 Services
            </span>
            <h2
              className="mt-4 text-4xl lg:text-5xl font-display text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
            >
              What We Do
              <br />
              <span className="gradient-text-purple">Best.</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md leading-relaxed lg:text-right" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Six core capabilities. One unified vision: to create digital products
            that lead markets and captivate audiences.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group p-8 bg-dark-card border border-dark-border rounded-sm cursor-default overflow-hidden transition-all duration-500"
              style={{
                borderColor: hoveredId === service.id ? `${service.color}40` : undefined,
                boxShadow: hoveredId === service.id
                  ? `0 0 30px ${service.color}15, 0 0 60px ${service.color}05, inset 0 0 30px ${service.color}05`
                  : undefined,
                transform: hoveredId === service.id ? 'translateY(-6px)' : undefined,
              }}
            >
              {/* Glow corner */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ background: service.color }}
              />

              {/* Number */}
              <span
                className="absolute top-6 right-6 text-6xl font-display opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: service.color }}
              >
                {service.id}
              </span>

              {/* Icon */}
              <div className="mb-6 w-14 h-14 flex items-center justify-center border border-dark-border rounded-sm group-hover:border-opacity-50 transition-all duration-300"
                style={{ borderColor: `${service.color}30` }}>
                {service.icon}
              </div>

              {/* Title */}
              <h3
                className="text-xl font-display text-white mb-3 group-hover:text-white transition-colors"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono rounded-sm border transition-all duration-300"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      borderColor: `${service.color}30`,
                      color: `${service.color}80`,
                      background: `${service.color}08`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div
                className="mt-6 flex items-center gap-2 text-xs font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0"
                style={{ fontFamily: 'Syne, sans-serif', color: service.color }}
              >
                Learn More
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Bottom border glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${service.color}60, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-32" />
    </section>
  )
}
