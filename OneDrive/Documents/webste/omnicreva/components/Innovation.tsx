'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingGeometry() {
  const group = useRef<THREE.Group>(null)
  const torus1 = useRef<THREE.Mesh>(null)
  const torus2 = useRef<THREE.Mesh>(null)
  const ico = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = t * 0.15
    }
    if (torus1.current) {
      torus1.current.rotation.x = t * 0.5
      torus1.current.rotation.y = t * 0.3
    }
    if (torus2.current) {
      torus2.current.rotation.x = -t * 0.3
      torus2.current.rotation.z = t * 0.4
    }
    if (ico.current) {
      ico.current.rotation.x = t * 0.4
      ico.current.rotation.y = t * 0.6
      const s = 1 + Math.sin(t * 2) * 0.08
      ico.current.scale.set(s, s, s)
    }
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 3, 3]} color="#00FF00" intensity={3} />
      <pointLight position={[-3, -3, -3]} color="#7B2FBE" intensity={2} />
      <pointLight position={[0, 0, 4]} color="#ffffff" intensity={0.5} />

      {/* Icosahedron center */}
      <mesh ref={ico}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#0A0A0A"
          wireframe={false}
          emissive="#001100"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={ico}>
        <icosahedronGeometry args={[1.22, 1]} />
        <meshBasicMaterial color="#00FF00" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Torus rings */}
      <mesh ref={torus1}>
        <torusGeometry args={[2, 0.02, 2, 100]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.4} />
      </mesh>
      <mesh ref={torus2} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 2, 100]} />
        <meshBasicMaterial color="#7B2FBE" transparent opacity={0.3} />
      </mesh>

      {/* Orbiting spheres */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 2, Math.sin(angle) * 0.5, Math.sin(angle) * 2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00FF00' : '#7B2FBE'} />
          </mesh>
        )
      })}
    </group>
  )
}

const techStack = [
  { name: 'React', category: 'Frontend', level: 98 },
  { name: 'Next.js', category: 'Framework', level: 96 },
  { name: 'Python', category: 'Backend', level: 94 },
  { name: 'TensorFlow', category: 'AI/ML', level: 88 },
  { name: 'Three.js', category: '3D/WebGL', level: 85 },
  { name: 'AWS', category: 'Cloud', level: 92 },
  { name: 'PostgreSQL', category: 'Database', level: 90 },
  { name: 'Docker', category: 'DevOps', level: 93 },
]

export default function Innovation() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section id="innovation" className="relative py-32 overflow-hidden bg-dark-surface">
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-neon/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-prime/3 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-xs text-neon tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            // 04 Innovation Lab
          </span>
          <h2
            className="mt-4 text-4xl lg:text-5xl font-display text-white"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
          >
            Powered by
            <br />
            <span className="gradient-text-mixed">Cutting-Edge Tech.</span>
          </h2>
          <p className="mt-6 text-gray-400 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            We don&apos;t just use the latest technology — we push it to its limits,
            constantly exploring what&apos;s next on the frontier of digital possibility.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y }}
            className="relative h-[500px]"
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ background: 'transparent' }}>
              <FloatingGeometry />
            </Canvas>

            {/* Overlay labels */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { label: 'AI', x: '15%', y: '20%' },
                { label: 'Web3', x: '75%', y: '15%' },
                { label: 'Cloud', x: '80%', y: '70%' },
                { label: 'ML', x: '10%', y: '75%' },
              ].map(item => (
                <motion.div
                  key={item.label}
                  className="absolute text-xs font-mono text-neon/50 tracking-widest"
                  style={{ left: item.x, top: item.y, fontFamily: 'JetBrains Mono, monospace' }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() }}
                >
                  [{item.label}]
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3
              className="text-2xl font-display text-white mb-8"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
            >
              Our Technology Stack
            </h3>

            <div className="space-y-5">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-white font-semibold text-sm"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                      >
                        {tech.name}
                      </span>
                      <span
                        className="px-2 py-0.5 text-xs font-mono text-gray-600 border border-dark-border rounded-sm"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {tech.category}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neon" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {tech.level}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: i % 3 === 0
                          ? 'linear-gradient(90deg, #00FF00, #00CC00)'
                          : i % 3 === 1
                          ? 'linear-gradient(90deg, #7B2FBE, #9D4EDD)'
                          : 'linear-gradient(90deg, #9D4EDD, #C77DFF)',
                        boxShadow: i % 3 === 0 ? '0 0 8px rgba(0,255,0,0.5)' : '0 0 8px rgba(123,47,190,0.5)',
                      }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${tech.level}%` } : { width: 0 }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.07, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature highlights */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: 'Real-time Processing', icon: '⚡' },
                { label: 'Edge Computing', icon: '🌐' },
                { label: 'Zero-downtime Deploy', icon: '🔄' },
                { label: 'AI-First Architecture', icon: '🧠' },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 bg-dark-card border border-dark-border rounded-sm text-sm text-gray-400 hover:text-white hover:border-neon/20 transition-all duration-200"
                >
                  <span className="text-base">{item.icon}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-divider mt-32" />
    </section>
  )
}
