"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin session exists
    const hasCookie = document.cookie.includes("admin_session")
    if (!hasCookie && !window.location.pathname.includes("/admin/login")) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  if (loading) return null
  if (!isAuthenticated && !window.location.pathname.includes("/admin/login")) return null

  return <>{children}</>
}
