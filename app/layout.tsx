import type React from "react"
import type { Metadata } from "next"
import "./globals.css";
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link"
import ScrollProgress from "@/components/scroll-progress"
import ScrollEffects from "@/components/scroll-effects"


export const metadata: Metadata = {
  title: "Wedding Celebration",
  description: "Join us to celebrate our special day",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-background text-foreground antialiased`}>
        <ScrollProgress />
        <header className="border-b border-border sticky top-0 bg-surface/90 backdrop-blur-sm z-40">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-lg sm:text-2xl font-serif font-bold text-primary whitespace-nowrap">
              Our Wedding: Jowu-2025
            </div>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="text-text-secondary hover:text-primary transition">
                Home
              </Link>
              <Link href="/program" className="text-text-secondary hover:text-primary transition">
                Program
              </Link>
              <Link href="/vows" className="text-text-secondary hover:text-primary transition">
                Vows
              </Link>
              <Link href="/gallery" className="text-text-secondary hover:text-primary transition">
                Gallery
              </Link>
              <Link href="/admin/login" className="text-accent hover:text-accent-light transition font-semibold">
                Admin
              </Link>
            </div>
          </nav>
          <div className="md:hidden border-t border-border bg-surface/90">
            <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
              <div className="max-w-6xl mx-auto flex gap-3 py-2">
                <Link href="/" className="px-3 py-1 rounded-full border text-sm text-text-secondary hover:text-primary">
                  Home
                </Link>
                <Link href="/program" className="px-3 py-1 rounded-full border text-sm text-text-secondary hover:text-primary">
                  Program
                </Link>
                <Link href="/vows" className="px-3 py-1 rounded-full border text-sm text-text-secondary hover:text-primary">
                  Vows
                </Link>
                <Link href="/gallery" className="px-3 py-1 rounded-full border text-sm text-text-secondary hover:text-primary">
                  Gallery
                </Link>
                <Link href="/admin/login" className="px-3 py-1 rounded-full border text-sm text-accent hover:text-accent-light">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </header>
        <ScrollEffects />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
