import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface">
      {/* Header/Navigation */}
      <header className="border-b border-border sticky top-0 bg-surface/95 backdrop-blur-sm">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-primary">Our Wedding</div>
          <div className="flex gap-6">
            <Link href="/details" className="text-text-secondary hover:text-primary transition">
              Details
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
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="space-y-6">
          <p className="text-accent text-sm font-serif tracking-widest uppercase">Join us as we celebrate</p>
          <h1 className="font-serif text-primary text-balance">John & Sabawu</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Together with their families, request the pleasure of your company at the ceremony of their wedding
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <Link
              href="/details"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition flex items-center justify-center gap-2"
            >
              Wedding Details <ArrowRight size={20} />
            </Link>
            <Link
              href="/program"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
            >
              View Program
            </Link>
          </div>
        </div>

        {/* Wedding Info Card */}
        <div className="mt-16 bg-surface border border-border rounded-lg p-8 shadow-lg">
          <div className="space-y-4">
            <div>
              <p className="text-accent font-serif text-sm uppercase tracking-wider">Date</p>
              <p className="text-2xl font-serif text-primary">Friday, 19 December at 1:30 PM</p>
            </div>
            <div>
              <p className="text-accent font-serif text-sm uppercase tracking-wider">Location</p>
              <p className="text-lg text-text-primary">Lakpazee Community Church</p>
              <p className="text-text-secondary">Airfield, Sinkor</p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-text-secondary italic">Enter by invitation. Kids are not allowed.</p>
              <p className="text-sm font-semibold text-primary mt-2">
                Colors: White & Cream are exclusively for the bridal party.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
