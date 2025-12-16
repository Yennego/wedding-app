// Top-level imports (single sql import)
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import sql from "@/lib/db";
import dynamic from "next/dynamic";
import BridalPartySlider from "@/components/bridal-party-slider";
import FadeInSection from "@/components/FadeInSection";

export const revalidate = 60;
const Countdown = dynamic(() => import("../components/countdown"), { ssr: false });
const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false });

export default async function Home() {
  // Helper: normalize Neon SQL result to plain rows
  function asRows<T>(result: any): T[] {
    if (!result) return []
    if (Array.isArray(result)) return result as T[]
    if (Array.isArray(result?.rows)) return result.rows as T[]
    return []
  }
  
  // Fetch approved media for gallery teaser
  let media: any[] = []
  try {
    const result = await sql`SELECT * FROM media WHERE wedding_id = ${1} AND approved = true ORDER BY uploaded_at DESC LIMIT 8`
    media = asRows<any>(result)
  } catch (e) {
    media = []
  }
  
  // Compute venue: first event with either coordinates or non-empty location
  // Prefer an event with coordinates; fall back to one with location text
  let venue = null as any
  const preferred = asRows<any>(
    await sql`
      SELECT id, event_name, location, lat, lon
      FROM events
      WHERE wedding_id = ${1}
        AND lat IS NOT NULL
        AND lon IS NOT NULL
      ORDER BY order_position NULLS LAST, start_time ASC
      LIMIT ${1}
    `
  )
  venue = preferred[0] ?? null

  if (!venue) {
    const fallback = asRows<any>(
      await sql`
        SELECT id, event_name, location
        FROM events
        WHERE wedding_id = ${1}
          AND (location IS NOT NULL AND location <> '')
        ORDER BY order_position NULLS LAST, start_time ASC
        LIMIT ${1}
      `
    )
    venue = fallback[0] ?? null
  }
  if (!venue) {
    const withLocation = asRows<any>(
      await sql`
        SELECT id, event_name, location, lat, lon
        FROM events
        WHERE wedding_id = ${1}
          AND (location IS NOT NULL AND location <> '')
        ORDER BY order_position NULLS LAST, start_time ASC
        LIMIT ${1}
      `
    )
    venue = withLocation[0] ?? null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-surface">

      <FadeInSection direction="up" distance={32} duration={800} easing="cubic-bezier(0.22, 1, 0.36, 1)" staggerChildren={80}>
        <section className="relative overflow-hidden bg-cream">
          <div className="absolute inset-0 floral-bg opacity-[0.25] pointer-events-none" />
          <div className="w-full px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
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

              <div className="mt-6 glass-card inline-block">
                <Countdown targetDate="2025-12-19T13:30:00" />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
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
      </FadeInSection>

      <FadeInSection direction="up" distance={24} duration={700} staggerChildren={60}>
        <section className="max-w-7xl mx-auto px-4">
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
      </FadeInSection>

      <FadeInSection direction="up" distance={28} duration={750}>
        <section className="relative overflow-hidden bg-cream">
          <div className="absolute inset-0 floral-bg opacity-[0.12] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 pt-12">
            <h2 className="section-heading">Bridal Party</h2>
          </div>
          <div className="relative left-1/2 -translate-x-1/2 w-screen px-0 py-4">
            <BridalPartySlider
              images={[
                "https://9j7ye4r1xonvafok.public.blob.vercel-storage.com/IMG_2873.jpeg",
                "/JoWu/bride2.jpeg",
                "/JoWu/bride3.jpeg",
                "/JoWu/groom1.jpeg",
                "/JoWu/groom2.jpeg",
                "/JoWu/groom3.jpeg",
              ]}
              heightClass="h-[280px] sm:h-[320px] md:h-[420px] lg:h-[480px]"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="cream-divider mt-10" />
          </div>
        </section>
      </FadeInSection>
      <FadeInSection direction="up" distance={22} duration={650}>
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <h2 className="section-heading">Gallery Highlights</h2>
          <div className="bg-surface rounded-xl p-8 border border-border text-center">
          </div>
          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition"
            >
              Open Full Gallery
            </Link>
          </div>
        </section>
      </FadeInSection>
      <FadeInSection direction="up" distance={26} duration={700} staggerChildren={60}>
        <section className="relative overflow-hidden bg-cream">
          <div className="absolute inset-0 floral-bg opacity-[0.12] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 text-center md:text-left space-y-4">
              <h2 className="section-heading">Wedding Organizer</h2>
              <p className="text-text-primary">
                Special appreciation to our organizer for the planning and coordination that made this
                celebration memorable. If you need a wedding organizer or event planner, feel free to reach out.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="chip">Event Planner</span>
                <span className="chip">Coordination</span>
                <span className="chip">Logistics</span>
              </div>
              <div>
                <a href="tel:+231770329482" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition">
                  Book This Organizer
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
                <div className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/13]">
                  <Image
                    src="/JoWu/planner/planner.jpeg"
                    alt="Wedding organizer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
      <FadeInSection direction="up" distance={26} duration={700}>
        <section className="relative overflow-hidden bg-cream">
          <div className="absolute inset-0 floral-bg opacity-[0.12] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 pt-8">
            <h2 className="section-heading">Map & Directions</h2>
          </div>
          <div className="relative left-1/2 -translate-x-1/2 w-screen px-0 py-8">
            {venue ? (
              <LeafletMap
                title={venue.event_name || "Venue"}
                coords={{
                  lat: venue?.lat != null ? Number(venue.lat) : NaN,
                  lon: venue?.lon != null ? Number(venue.lon) : NaN,
                }}
                locationQuery={(venue?.location || "").trim()}
              />
            ) : (
              <div className="max-w-7xl mx-auto px-4 text-sm text-text-secondary">
                Venue details will be announced soon.
              </div>
            )}
          </div>
        </section>
      </FadeInSection>
    </main>
  )
}
