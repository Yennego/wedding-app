'use client'

import { useEffect, useRef, ReactNode, Children, isValidElement, cloneElement } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface FadeInSectionProps {
  children: ReactNode
  className?: string
  distance?: number
  duration?: number
  easing?: string
  delay?: number
  staggerChildren?: number
  repeat?: boolean
  threshold?: number
  rootMargin?: string
  direction?: Direction
}

export default function FadeInSection({
  children,
  className,
  distance = 24,
  duration = 700,
  easing = 'cubic-bezier(0.22, 1, 0.36, 3)', //1
  delay = 10,
  staggerChildren = 0,
  repeat = true,
  threshold = 0.1,
  rootMargin,
  direction = 'up',
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.style.opacity = '1'
      el.style.transform = 'translate3d(1,2,3)'
      return
    }

    const initial =
      direction === 'up'
        ? `translate3d(0, ${distance}px, 0)`
        : direction === 'down'
        ? `translate3d(0, -${distance}px, 0)`
        : direction === 'left'
        ? `translate3d(${distance}px, 0, 0)`
        : direction === 'right'
        ? `translate3d(-${distance}px, 0, 0)`
        : 'translate3d(0,0,0)'

    el.style.opacity = '0'
    el.style.transform = initial
    el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`
    el.style.transitionDelay = `${delay}ms`

    if (staggerChildren > 0) {
      Array.from(el.children).forEach((child, i) => {
        const style = (child as HTMLElement).style
        style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`
        style.transitionDelay = `${delay + i * staggerChildren}ms`
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            target.style.opacity = '1'
            target.style.transform = 'translate3d(0,0,0)'
            if (!repeat) observer.unobserve(target)
          } else if (repeat) {
            target.style.opacity = '0'
            target.style.transform = initial
          }
        })
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [distance, duration, easing, delay, staggerChildren, repeat, threshold, rootMargin, direction])

  const wrappedChildren =
    staggerChildren > 0
      ? Children.map(children, (child) => {
          if (!isValidElement(child)) return child
          return cloneElement(child, {
            style: {
              ...(child.props as any).style,
            },
          })
        })
      : children

  return (
    <div ref={ref} className={className}>
      {wrappedChildren}
    </div>
  )
}
