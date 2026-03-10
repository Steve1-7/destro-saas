'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const articles = [
  {
    id: 1,
    category: 'AI & Technology',
    title: 'The Agentic Future: How LLM Agents Are Rewriting Business Automation',
    excerpt: 'Beyond chatbots — a deep-dive into how autonomous AI agents are revolutionizing enterprise workflows and what it means for your business in 2025.',
    readTime: '8 min read',
    date: 'Jan 15, 2025',
    color: '#00FF00',
    featured: true,
  },
  {
    id: 2,
    category: 'Design',
    title: 'Motion Design in 2025: The Art of Purposeful Animation',
    excerpt: 'Why micro-interactions have graduated from delightful extras to core conversion drivers — and how to implement them without sacrificing performance.',
    readTime: '6 min read',
    date: 'Jan 8, 2025',
    color: '#9D4EDD',
    featured: false,
  },
  {
    id: 3,
    category: 'Strategy',
    title: 'Digital Transformation Is Dead. Long Live Digital Obsession.',
    excerpt: 'The companies winning in 2025 aren\'t transforming — they\'re building cultures where digital excellence is a survival instinct, not a project.',
    readTime: '5 min read',
    date: 'Dec 28, 2024',
    color: '#C77DFF',
    featured: false,
  },
  {
    id: 4,
    category: 'Web Development',
    title: 'Why Next.js 15 Changes Everything for Enterprise Web Apps',
    excerpt: 'From Partial Prerendering to enhanced streaming — a practical breakdown of the features that will define web performance for the next decade.',
    readTime: '7 min read',
    date: 'Dec 20, 2024',
    color: '#00CC00',
    featured: false,
  },
]

export default function Insights() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const [featured, ...rest] = articles

  return (
    <section id="insights" className="relative py-32 overflow-hidden">
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
              // 05 Insights
            </span>
            <h2
              className="mt-4 text-4xl lg:text-5xl font-display text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
            >
              Thinking About
              <br />
              <span className="gradient-text-purple">What&apos;s Next.</span>
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon transition-colors group"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            All Articles
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

        {/* Grid layout */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Featured article - large */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 group relative bg-dark-card border border-dark-border rounded-sm overflow-hidden cursor-pointer hover:border-neon/30 transition-all duration-500"
            whileHover={{ y: -6 }}
          >
            {/* Visual header */}
            <div className="relative h-48 bg-gradient-to-br from-dark-base via-dark-surface to-dark-card flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-50" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,255,0,0.08), transparent 70%)' }}
              />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 border border-neon/30 rounded-sm flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="space-y-2">
                  {[80, 60, 70, 50].map((w, i) => (
                    <div key={i} className="h-1 bg-neon/20 rounded-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className="px-3 py-1 text-xs font-mono rounded-sm border border-neon/30 text-neon"
                  style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,255,0,0.05)' }}
                >
                  {featured.category}
                </span>
                <span className="text-xs text-gray-600 font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {featured.date}
                </span>
              </div>

              <h3
                className="text-2xl font-display text-white mb-4 leading-snug group-hover:text-neon transition-colors duration-300"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
              >
                {featured.title}
              </h3>

              <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {featured.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-600" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {featured.readTime}
                </span>
                <div className="flex items-center gap-2 text-sm text-neon opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Read Article
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#00FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.article>

          {/* Smaller articles */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="group relative bg-dark-card border border-dark-border rounded-sm overflow-hidden cursor-pointer flex-1 hover:border-opacity-50 transition-all duration-400"
                style={{ '--hover-color': article.color } as React.CSSProperties}
                whileHover={{ y: -4 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-2.5 py-0.5 text-xs font-mono rounded-sm border"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        borderColor: `${article.color}40`,
                        color: `${article.color}90`,
                        background: `${article.color}08`,
                      }}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-600 font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {article.readTime}
                    </span>
                  </div>

                  <h3
                    className="text-base font-display text-white mb-2 leading-snug group-hover:text-white transition-colors"
                    style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600 }}
                  >
                    {article.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-600 font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {article.date}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className="text-gray-600 group-hover:text-neon transition-colors translate-x-0 group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${article.color}40, transparent)` }}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <div className="section-divider mt-32" />
    </section>
  )
}
