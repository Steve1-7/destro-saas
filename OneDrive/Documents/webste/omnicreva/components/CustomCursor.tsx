'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      rafId = requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      if (!dot || !ring) return
      dot.style.width = '12px'
      dot.style.height = '12px'
      ring.style.width = '54px'
      ring.style.height = '54px'
      ring.style.borderColor = 'rgba(0,255,0,0.8)'
    }

    const onMouseLeaveLink = () => {
      if (!dot || !ring) return
      dot.style.width = '8px'
      dot.style.height = '8px'
      ring.style.width = '36px'
      ring.style.height = '36px'
      ring.style.borderColor = 'rgba(0,255,0,0.4)'
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)

    const links = document.querySelectorAll('a, button, [data-cursor="pointer"]')
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink)
      link.addEventListener('mouseleave', onMouseLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}
