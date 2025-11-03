"use client"

import { useEffect, useState } from "react"

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 45,
    h: 22,
    m: 33,
    s: 0,
  })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const now = Date.now()
      const diff = Math.max(target - now, 0)
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setRemaining({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="flex items-center gap-6 px-6 py-4 rounded-xl bg-surface/70 border border-border shadow-sm">
      <TimeBox label="Days" value={remaining.d} />
      <TimeBox label="Hours" value={remaining.h} />
      <TimeBox label="Minutes" value={remaining.m} />
      <TimeBox label="Seconds" value={remaining.s} />
    </div>
  )
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-serif text-primary leading-none">{value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </div>
  )
}