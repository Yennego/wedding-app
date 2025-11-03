import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import sql from "@/lib/db";
import dynamic from "next/dynamic";

const Countdown = dynamic(() => import("../components/countdown"), { ssr: false });

export default async function Home() {
  // Fetch approved media for gallery teaser
  let media: any[] = []
  try {
    media = await sql`SELECT * FROM media WHERE wedding_id = ${1} AND approved = true ORDER BY uploaded_at DESC LIMIT 8`
  } catch (e) {
    media = []
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface">
      {/* Header/Navigation */}
      <header className="border-b border-border sticky top-0 bg-surface/90 backdrop-blur-sm z-40">
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 floral-bg opacity-[0.25]" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 text-center md:text-left space-y-6">
            <p className="text-accent text-sm font-serif tracking-widest uppercase">Together with their families</p>
            <h1 className="font-serif text-primary text-5xl md:text-6xl leading-tight">John &amp; Sabawu</h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Request the pleasure of your company at the ceremony of their wedding.
            </p>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
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

            {/* Countdown */}
            <div className="mt-6 glass-card inline-block">
              <Countdown targetDate="2025-12-19T13:30:00" />
            </div>
          </div>

          {/* Couple Image */}
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
              {/* Responsive aspect ratio container */}
              <div className="relative aspect-[4/3] sm:aspect-[3/2] md:aspect-[10/10]">
                <Image
                  src="/couple.jpg"
                  alt="The couple"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Info Card */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="mt-4 md:mt-10 bg-surface border border-border rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <p className="text-accent font-serif text-sm uppercase tracking-wider">Date</p>
              <p className="text-2xl font-serif text-primary">Friday, 19 December at 1:30 PM</p>
            </div>
            <div>
              <p className="text-accent font-serif text-sm uppercase tracking-wider">Location</p>
              <p className="text-lg text-text-primary">Lakpazee Community Church</p>
              <p className="text-text-secondary">Airfield, Sinkor</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary italic">Enter by invitation. Kids are not allowed.</p>
              <p className="text-sm font-semibold text-primary mt-2">
                Colors: White &amp; Cream are exclusively for the bridal party.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bridal Party Spotlight with Group Photo */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="section-heading">Bridal Party</h2>
        <div className="relative rounded-2xl overflow-hidden shadow-xl bridal-banner">
          <Image
            src="/bridal-party.jpg"
            alt="Groomsmen and Bridesmaids"
            width={1600}
            height={900}
            className="w-full h-[300px] md:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3">
            <span className="chip">Bridesmaids</span>
            <span className="chip">Groomsmen</span>
            <span className="chip">Family</span>
          </div>
        </div>
        <div className="cream-divider mt-10" />
      </section>

      {/* Gallery Teaser */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="section-heading">Gallery Highlights</h2>
        {media.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 border border-border text-center">
            <p className="text-text-secondary">Stay tuned—photos will appear here once approved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-border hover:scale-[1.02] transition">
                {item.media_type === "image" ? (
                  <img src={item.file_url} alt={item.caption || "Wedding moment"} className="w-full h-40 object-cover" />
                ) : (
                  <video src={item.file_url} className="w-full h-40 object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition"
          >
            Open Full Gallery
          </Link>
        </div>
      </section>
    </main>
  )
}
