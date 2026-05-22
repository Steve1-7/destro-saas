'use client'

import dynamic from 'next/dynamic'

// Dynamically import ALL components with ssr:false to prevent
// Three.js / canvas / browser-API SSR crashes and compile hangs
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const ParticleField = dynamic(() => import('@/components/ParticleField'), { ssr: false })
const Navbar       = dynamic(() => import('@/components/Navbar'),        { ssr: false })
const Hero         = dynamic(() => import('@/components/Hero'),          { ssr: false })
const About        = dynamic(() => import('@/components/About'),         { ssr: false })
const Services     = dynamic(() => import('@/components/Services'),      { ssr: false })
const Projects     = dynamic(() => import('@/components/Projects'),      { ssr: false })
const Innovation   = dynamic(() => import('@/components/Innovation'),    { ssr: false })
const Insights     = dynamic(() => import('@/components/Insights'),      { ssr: false })
const Contact      = dynamic(() => import('@/components/Contact'),       { ssr: false })
const Footer       = dynamic(() => import('@/components/Footer'),        { ssr: false })

export default function Home() {
  return (
    <main className="relative bg-dark-base overflow-hidden">
      <CustomCursor />
      <ParticleField />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Innovation />
      <Insights />
      <Contact />
      <Footer />
    </main>
  )
}
