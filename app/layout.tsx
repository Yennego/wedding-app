import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Use exported className directly
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
