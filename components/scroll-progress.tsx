'use client'

import { useEffect, useRef, useState } from 'react'
import { Progress } from '@/components/ui/progress'

export default function ScrollProgress() {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function update() {
      const el = document.scrollingElement || document.documentElement
      const scrollTop = el.scrollTop
      const scrollMax = (el.scrollHeight || 0) - window.innerHeight
      const pct = scrollMax > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollMax) * 100)) : 0
      setValue(pct)
      rafRef.current = null
    }

    function onScroll() {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-none">
        <Progress value={value} className="h-1 rounded-none" />
      </div>
    </div>
  )
}
