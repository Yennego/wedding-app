'use client'

import { useEffect } from 'react'

export default function ScrollEffects() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('.floral-bg'))
    let rafId: number | null = null
    const onScroll = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop
        parallaxEls.forEach((el) => {
          const attr = el.getAttribute('data-parallax-speed')
          const factor = attr ? Number(attr) || 0.1 : 0.1
          el.style.transform = `translate3d(0, ${scrollY * factor}px, 0)`
        })
        rafId = null
      })
    }
    if (!prefersReduced) {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    return () => {
      if (!prefersReduced) {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  return null
}
