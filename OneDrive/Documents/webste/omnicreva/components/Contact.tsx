'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const projectTypes = [
  'Web Development',
  'Full-Stack App',
  'UI/UX Design',
  'AI Automation',
  'Data Analytics',
  'Digital Strategy',
  'Other',
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({ name: '', email: '', projectType: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  const inputClasses = (field: string) =>
    `w-full bg-transparent border rounded-sm px-4 py-3.5 text-white text-sm placeholder-gray-600 outline-none transition-all duration-300 ${
      focused === field
        ? 'border-neon/60 shadow-neon-sm'
        : 'border-dark-border hover:border-white/20'
    }`

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon/3 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="font-mono text-xs text-neon tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              // 06 Contact
            </span>
            <h2
              className="mt-4 text-4xl lg:text-5xl font-display text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
            >
              Let&apos;s Build
              <br />
              <span className="gradient-text-neon">Something</span>
              <br />
              <span className="gradient-text-purple">Exceptional.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg leading-relaxed max-w-md" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Ready to push the boundaries of what your digital presence can achieve?
              We&apos;re selective about our partnerships — and always looking for
              ambitious projects worth building.
            </p>

            {/* Contact details */}
            <div className="mt-10 space-y-4">
              {[
                { icon: '✉️', label: 'Email', value: 'stevezuluu@gmail.com' },
                { icon: '📍', label: 'Studio', value: 'South Africa · Tanzania · Singapore' },
                { icon: '⏱️', label: 'Response', value: 'Within 24 hours' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-dark-card border border-dark-border rounded-sm group hover:border-neon/20 transition-all duration-300">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs text-gray-600 font-mono uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-300 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Available status */}
            <div className="mt-8 flex items-center gap-3 p-4 border border-neon/20 rounded-sm bg-neon/5">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <span className="text-sm text-neon font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Currently accepting new projects for Q2 2025
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-12 bg-dark-card border border-neon/30 rounded-sm min-h-[500px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 border-2 border-neon rounded-full flex items-center justify-center mb-6 shadow-neon"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L19 7" stroke="#00FF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-display text-white mb-3" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                    Message Received!
                  </h3>
                  <p className="text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    We&apos;ll review your project and get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="relative p-8 rounded-sm overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Form glow */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

                  <div className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          className={inputClasses('name')}
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className={inputClasses('email')}
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        />
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Project Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {projectTypes.map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, projectType: type })}
                            className="px-3 py-1.5 text-xs font-mono rounded-sm border transition-all duration-200"
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              borderColor: formData.projectType === type ? '#00FF00' : 'rgba(255,255,255,0.1)',
                              color: formData.projectType === type ? '#00FF00' : '#666',
                              background: formData.projectType === type ? 'rgba(0,255,0,0.08)' : 'transparent',
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us about your project, goals, and timeline..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        className={`${inputClasses('message')} resize-none`}
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      className="relative w-full py-4 font-display font-semibold text-sm tracking-wide rounded-sm overflow-hidden transition-all duration-300"
                      style={{
                        fontFamily: 'Syne, sans-serif',
                        background: submitting ? 'rgba(0,255,0,0.3)' : '#00FF00',
                        color: '#000',
                      }}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,255,0,0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <motion.span
                            className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 8L14 2L8 14L7 9L2 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                  </div>

                  {/* Form bottom glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="section-divider mt-32" />
    </section>
  )
}
