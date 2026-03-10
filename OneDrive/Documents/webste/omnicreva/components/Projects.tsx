// @ts-nocheck
/* eslint-disable */
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── DATA ──────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: 1,
    title: 'Steve Portfolio',
    category: 'Portfolio',
    description: 'Personal brand showcase with immersive UI and live project demos.',
    url: 'https://steve-portfolio-flame.vercel.app/',
    color: '#00FF00',
    accent: '#001800',
    year: '2025',
    tags: ['React', 'Vercel', 'Brand'],
  },
  {
    id: 2,
    title: 'Saseka Holdings',
    category: 'Corporate Web',
    description: 'Premium corporate identity platform for an emerging investment firm.',
    url: 'https://tory-cyan-2kxwuiasql.edgeone.app',
    color: '#C77DFF',
    accent: '#0E0018',
    year: '2024',
    tags: ['Next.js', 'EdgeOne', 'Finance'],
  },
  {
    id: 3,
    title: "Patient's Dashboard",
    category: 'Health Tech',
    description: 'Clinical dashboard for patient data, appointments and health metrics.',
    url: 'https://patient-dashboard.tiiny.site/',
    color: '#38BDF8',
    accent: '#00101A',
    year: '2024',
    tags: ['Dashboard', 'HealthTech', 'UI'],
  },
  {
    id: 4,
    title: 'Kings Barber',
    category: 'Local Business',
    description: 'Sleek barbershop brand site with booking and service showcase.',
    url: 'http://stevemediaco.unaux.com',
    color: '#FFB347',
    accent: '#1A0E00',
    year: '2024',
    tags: ['Branding', 'Booking', 'Web'],
  },
  {
    id: 5,
    title: 'Steve Media Co.',
    category: 'Agency',
    description: 'Full-service digital agency landing page with portfolio integration.',
    url: 'https://stevemediaco.zya.me',
    color: '#FF6B6B',
    accent: '#1A0000',
    year: '2024',
    tags: ['Agency', 'Media', 'Creative'],
  },
  {
    id: 6,
    title: 'C4 DesignHub',
    category: 'Design Platform',
    description: 'Collaborative design hub for creatives — tools, assets, and community.',
    url: 'http://c4desighub.gt.tc/',
    color: '#F9CA24',
    accent: '#1A1400',
    year: '2023',
    tags: ['Design', 'Community', 'Platform'],
  },
  {
    id: 7,
    title: 'Portfolio Classic',
    category: 'Portfolio',
    description: 'Original developer portfolio with case studies and creative work.',
    url: 'http://steveportfolio.ct.ws',
    color: '#A8FF78',
    accent: '#0A1A00',
    year: '2023',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
]

// Gallery images — Logos & 3D only
const galleryData = {
  logos: [
    { src: 'img/chinake.jpg',  label: 'Chinake' },
    { src: 'img/saseka.jpg',   label: 'Saseka' },
    { src: 'img/media.png',    label: 'Media Co.' },
    { src: 'img/theo.jpg',     label: 'Theo' },
    { src: 'img/Omni.png',     label: 'Omni' },
    { src: 'img/hytkk.jpg',    label: 'Hytk' },
    { src: 'img/lux.png',      label: 'Lux' },
  ],
  d3: [
    { src: 'img/3d1.jpg',      label: '3D Render I' },
    { src: 'img/3d2.jpg',      label: '3D Render II' },
    { src: 'img/3d1 (1).jpg',  label: '3D Render III' },
    { src: 'img/ball2.jpg',    label: 'Orb' },
    { src: 'img/2_05am.png',   label: '2:05 AM' },
    { src: 'img/ggnn.jpg',     label: 'Abstract I' },
    { src: 'img/ghgn.jpg',     label: 'Abstract II' },
    { src: 'img/ice1.jpg',     label: 'Ice' },
    { src: 'img/gonn.jpg',     label: 'Gonn' },
    { src: 'img/cookis.png',   label: 'Cookies' },
  
  ],
}

// ─── PROJECT MODAL ─────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl rounded-sm overflow-hidden"
        style={{
          background: '#0A0A0A',
          border: `1px solid ${project.color}30`,
          boxShadow: `0 0 80px ${project.color}15, 0 40px 120px rgba(0,0,0,0.8)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }} />

        {/* Iframe preview */}
        <div className="relative" style={{ height: 340, background: project.accent, overflow: 'hidden' }}>
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none z-10"
            style={{
              backgroundImage: `linear-gradient(${project.color}20 1px, transparent 1px), linear-gradient(90deg, ${project.color}20 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Skeleton loader */}
          {!loaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: `${project.color}60`, borderTopColor: 'transparent' }}
                />
                <span className="text-xs font-mono" style={{ color: `${project.color}60`, fontFamily: 'JetBrains Mono, monospace' }}>
                  Loading preview…
                </span>
              </div>
            </div>
          )}

          <iframe
            src={project.url}
            title={project.title}
            loading="lazy"
            className="w-full h-full border-0 pointer-events-none"
            style={{
              transform: 'scale(0.75)',
              transformOrigin: 'top left',
              width: '133.33%',
              height: '133.33%',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
            onLoad={() => setLoaded(true)}
          />

          {/* Gradient fade bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-sm text-gray-400 hover:text-white transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            ×
          </button>
        </div>

        {/* Info */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {project.category} · {project.year}
              </span>
              <h3 className="text-2xl font-display text-white mt-1" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                {project.title}
              </h3>
            </div>
            <div
              className="text-4xl font-display opacity-20"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, color: project.color }}
            >
              {String(project.id).padStart(2, '0')}
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono rounded-sm border"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  borderColor: `${project.color}30`,
                  color: `${project.color}90`,
                  background: `${project.color}08`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold rounded-sm transition-all duration-300"
            style={{
              fontFamily: 'Syne, sans-serif',
              background: project.color,
              color: '#000',
              boxShadow: `0 0 30px ${project.color}30`,
            }}
          >
            Open Live Website
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── GALLERY LIGHTBOX ──────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  const img = images[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

      {/* Counter */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-500 z-10"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {index + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-sm text-gray-400 hover:text-white transition-all z-10"
        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
      >
        ×
      </button>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-sm text-gray-400 hover:text-white transition-all z-10"
        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.6)' }}
      >
        ←
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-sm text-gray-400 hover:text-white transition-all z-10"
        style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.6)' }}
      >
        →
      </button>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.label}
          className="max-h-[70vh] max-w-[85vw] object-contain rounded-sm"
          style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
        />
        <span className="text-xs font-mono text-gray-500 tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {img.label}
        </span>
      </motion.div>
    </motion.div>
  )
}

// ─── GALLERY SECTION ───────────────────────────────────────────────────────────

function GallerySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [tab, setTab] = useState('logos')
  const [lightbox, setLightbox] = useState(null) // { images, index }

  const tabs = [
    { key: 'logos', label: 'Logos', count: galleryData.logos.length },
    { key: 'd3',    label: '3D Works', count: galleryData.d3.length },
  ]

  const images = galleryData[tab]

  const openLightbox = (index) => setLightbox({ images, index })
  const closeLightbox = () => setLightbox(null)
  const prevImage = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }))
  const nextImage = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }))

  return (
    <section id="gallery" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(199,125,255,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <span className="font-mono text-xs text-neon tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                // 04 Creative Gallery
              </span>
              <h2 className="mt-4 text-4xl lg:text-5xl font-display text-white" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                Visual
                <br />
                <span className="gradient-text-neon">Archive.</span>
              </h2>
            </div>

            {/* Tab switcher */}
            <div
              className="flex p-1 rounded-sm gap-1"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
            >
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="relative px-5 py-2.5 text-xs font-mono rounded-sm transition-all duration-300 flex items-center gap-2"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    color: tab === t.key ? '#000' : '#666',
                    background: tab === t.key ? '#C77DFF' : 'transparent',
                    boxShadow: tab === t.key ? '0 0 20px rgba(199,125,255,0.4)' : 'none',
                  }}
                >
                  {t.label}
                  <span
                    className="text-xs rounded-sm px-1.5 py-0.5"
                    style={{
                      background: tab === t.key ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.06)',
                      color: tab === t.key ? '#000' : '#444',
                    }}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="mt-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(199,125,255,0.4), rgba(0,255,0,0.2), transparent)' }} />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            }}
          >
            {images.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
                style={{
                  aspectRatio: tab === 'd3' ? '4/3' : '1/1',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: '#0D0D0D',
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Image */}
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
                >
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H7M13 3V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Label on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                  <span className="text-xs font-mono text-white/80 tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {img.label}
                  </span>
                </div>

                {/* Corner decoration */}
                <div
                  className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    borderTop: '1px solid #C77DFF',
                    borderRight: '1px solid #C77DFF',
                  }}
                />
                <div
                  className="absolute bottom-2 left-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    borderBottom: '1px solid #00FF00',
                    borderLeft: '1px solid #00FF00',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08))' }} />
          <span className="text-xs font-mono text-gray-600 tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {images.length} works · {tab === 'logos' ? 'Brand Identity' : '3D Visualization'}
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.08))' }} />
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            index={lightbox.index}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── PROJECTS SECTION ──────────────────────────────────────────────────────────

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <>
      <section id="projects" className="relative py-32 overflow-hidden">
        {/* Ambient blobs */}
        <div
          className="absolute top-20 -left-40 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,255,0,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-20 -right-40 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(199,125,255,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-neon tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              // 03 Digital Products
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-display text-white" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
              Live
              <br />
              <span className="gradient-text-neon">Platforms.</span>
            </h2>

            {/* Separator with label */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(0,255,0,0.4), transparent)' }} />
              <span className="text-xs font-mono text-gray-600 tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {projects.length} live sites
              </span>
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative rounded-sm overflow-hidden cursor-pointer transition-all duration-500"
                style={{
                  background: '#0C0C0C',
                  border: `1px solid ${hoveredId === project.id ? project.color + '40' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: hoveredId === project.id ? `0 20px 60px ${project.color}10` : 'none',
                  transform: hoveredId === project.id ? 'translateY(-6px)' : 'translateY(0)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="h-px transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                    opacity: hoveredId === project.id ? 1 : 0,
                  }}
                />

                {/* Live iframe preview */}
                <div className="relative overflow-hidden" style={{ height: 180, background: project.accent }}>
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(${project.color}20 1px, transparent 1px), linear-gradient(90deg, ${project.color}20 1px, transparent 1px)`,
                      backgroundSize: '30px 30px',
                    }}
                  />

                  {/* iframe scaled down */}
                  <iframe
                    src={project.url}
                    title={project.title}
                    loading="lazy"
                    className="border-0 pointer-events-none absolute top-0 left-0"
                    style={{
                      width: '200%',
                      height: '200%',
                      transform: 'scale(0.5)',
                      transformOrigin: 'top left',
                    }}
                  />

                  {/* Gradient fade bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, #0C0C0C)' }}
                  />

                  {/* Hover arrow */}
                  <div
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-300"
                    style={{
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      opacity: hoveredId === project.id ? 1 : 0,
                      transform: hoveredId === project.id ? 'translateX(0)' : 'translateX(8px)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* ID stamp */}
                  <div
                    className="absolute bottom-3 left-3 text-3xl font-display transition-opacity duration-300"
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 900,
                      color: project.color,
                      opacity: hoveredId === project.id ? 0.3 : 0.12,
                    }}
                  >
                    {String(project.id).padStart(2, '0')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-xs font-mono text-gray-600 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {project.category}
                  </span>
                  <h3 className="text-base font-display text-white mt-1 mb-2" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2 py-0.5 rounded-sm"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          color: `${project.color}70`,
                          background: `${project.color}10`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom glow */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${project.color}50, transparent)`,
                    opacity: hoveredId === project.id ? 1 : 0,
                  }}
                />

                {/* Corner accents */}
                <div
                  className="absolute bottom-3 right-3 w-5 h-5 transition-opacity duration-300"
                  style={{
                    borderBottom: `1px solid ${project.color}40`,
                    borderRight: `1px solid ${project.color}40`,
                    opacity: hoveredId === project.id ? 1 : 0,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>

        <div className="section-divider mt-32" />
      </section>

      {/* Gallery */}
      <GallerySection />
    </>
  )
}