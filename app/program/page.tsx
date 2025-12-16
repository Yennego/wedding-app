import { CalendarDays, Clock, MapPin, Heart } from "lucide-react"
import FadeInSection from "@/components/FadeInSection"
import { Great_Vibes, Playfair_Display, Lora } from "next/font/google"

const scriptFont = Great_Vibes({ subsets: ["latin"], weight: "400" })
const displayFont = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] })
const bodyFont = Lora({ subsets: ["latin"], weight: ["400", "500"] })

export default async function ProgramPage() {
  const invitation = {
    couple: "John & Sabawu",
    date: "19 December 2025",
    time: "Friday at 02:00 PM",
    venue: "Lakpazee Community Church",
    address: "Airfield, Sinkor, Monrovia, Liberia",
    rsvp: "+231-770-329482",
  }

  const clergy = [
    "Rev. Amos McDonald Fagans — Senior Pastor, Lakpazee Community Church",
    "Rev. Janice F. Gonoe — Pastor-in-charge, St. Peter's Lutheran Church",
    "Pst. Torwon Sulonteh-Brown — Assistant Pastor, Lakpazee Community Church",
    "Rev. Amos F. Borvor Sr. — Associate Pastor, St. Peter's Lutheran Church",
    "Rev. Robert Rose — Pastor, Lakpazee Community Church",
    "Rev. Macdaniel Gaye Solo, Sr. — Pastor, Lakpazee Community Church",
  ]

  const orderOfProgram = [
    "Musical Prelude — Organist",
    "Bridal Procession — Bridal Party",
    "Invocation",
    "Praise & Worship",
    "Scripture Reading: Old Testament (Genesis 2:18–25) — The Clergy; New Testament (Ephesians 5:22–31) — The Clergy",
    "Selection — The Choir",
    "Exhortation — Rev. Amos M. Fagans, Senior Pastor, LCC",
    "Exchange of Marital Vows — Rev. Amos M. Fagans, Senior Pastor, LCC",
    "Signing of Registry",
    "Prayer for the Couple",
    "Benediction",
    "Announcement — The Bestman",
  ]

  const reception = [
    "Musical Prelude",
    "Invocation",
    "Welcome Remarks — Mrs. Ruth Yennego-Richards (Event Planner/Chief Organizer)",
    "Second Entrance — Mr. & Mrs. Lawor",
    "Remarks and Toast — The Groom's Family; The Bride's Family; The Bestman; The Groom",
    "Couple Dance — Mr. & Mrs. Lawor",
    "Cutting of the Cake — Mr. & Mrs. Lawor",
    "Dance — Bride & Groom Parents",
    "Presentation of Gifts — Guests",
    "Shoes Game — Bride & Groom",
    "Throwing of Bridal Bouquet — The Bride",
  ]

  const bridalParty = {
    maidOfHonor: "Kajiatu Yennego",
    bestman: "Joshua Gayflor",
    bridesmaids: ["Henriietta Somah", "Dawiena P. Quoie"],
    juniorBride: "Vonjie Yennego",
    brideAnnouncer: "Zubah K. Yennego, III",
    flowerGirl: "Naomi Lawor",
    ringBearer: "Darius A. Sumo",
  }

  const parents = {
    grooms: [
      "Mr. Peter S. Lawor — Father",
      "Ms Kemah L. Sackie — Mother",
    ],
    brides: [
      "Dea. Zubah K. Yennego, Sr. — Father",
      "Dea. Leah K. Yennego — Mother",
    ],
  }

  const vendors = [
    "Decorator — Divine Innovations & Events",
    "Caterer — Nancy Catering Service",
    "Wedding Cake — Reka Cakes",
    "Videos & Photos — Chris & Grace",
  ]

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center">
      <div className="fixed top-0 left-0 w-full h-32 z-0 pointer-events-none overflow-hidden opacity-20">
        <img className="w-full h-full object-cover object-top mask-image-gradient-b" alt="Top floral" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpAv1yp1Jsdm2h6m7JJo_vztnSbnJbkYlv64QhqDV4edBEEQXlgHPskota0_Lp7meLLUPryEUC5hYxqIRXf33V_59R1cKiNgTeIT7UNOrRYstF6IGRmyOoh1Qs4qdYYrFloyhnB73QEdwMEGX1WYue1zaIcDrqDWB9W-8Y9hwsk0b8XuRSkrKpBLa1Nh81WcGwAzRT0T-UfxS0xGOIzox8Nupg4I53icQ8ksjM7wXTr3f7oLAjJqMbjIWO1QhHCrQVNaJTfrZk8apR" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cream" />
      </div>
      <div className="relative z-10 w-full max-w-7xl pb-48 px-6 flex justify-center">
        <div className={`w-full max-w-2xl md:max-w-3xl lg:max-w-5xl rounded-3xl bg-white border border-border shadow-xl ${bodyFont.className}`}>
          <h1 className={`${displayFont.className} text-5xl md:text-6xl text-primary text-center pt-10`}>Wedding Program</h1>
          <header className="pt-8 pb-6 px-6 text-center">
            <h3 className={`${scriptFont.className} text-2xl md:text-3xl text-primary mb-2`}>Celebration of Holy Matrimony</h3>
            <h1 className={`${displayFont.className} text-5xl md:text-6xl font-bold text-text-primary leading-tight`}>
              John <br />
              <span className="text-primary text-4xl">&amp;</span> <br />
              Sabawu
            </h1>
          <div className="flex flex-col items-center gap-3 mt-6 text-sm font-medium tracking-wide text-text-secondary">
            <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full shadow-sm border">
              <CalendarDays className="text-primary" size={16} />
              <span>Friday, 19 December 2025</span>
            </div>
            <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full shadow-sm border">
              <Clock className="text-primary" size={16} />
              <span>02:00 PM</span>
            </div>
            <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full shadow-sm border">
              <MapPin className="text-primary" size={16} />
              <span>Lakpazee Community Church<br /><span className="text-xs">Airfield, Sinkor, Monrovia, Liberia</span></span>
            </div>
            <a href="tel:+231770329482" className="mt-1 text-primary font-bold text-xs uppercase tracking-widest">RSVP: +231-770-329482</a>
          </div>
        </header>

        <FadeInSection direction="up" distance={24} duration={700}>
          <section className="px-6 mb-10">
            <div className="bg-surface rounded-2xl p-6 shadow-lg border relative overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">Officiating Clergy</h2>
              <ul className="space-y-4 text-sm">
                {clergy.map((c, i) => {
                  const parts = c.split("—")
                  return (
                    <li key={i} className="flex flex-col items-center">
                      <span className="font-semibold text-text-primary">{parts[0]}</span>
                      <span className="text-primary italic text-xs">{parts[1]}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection direction="up" distance={24} duration={700}>
          <section className="px-4 mb-10">
            <h2 className="text-3xl font-script text-center text-primary mb-6">Order of Program</h2>
            <div className="relative space-y-4 max-w-5xl mx-auto">
              <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />
              {orderOfProgram.map((item, idx) => {
                const parts = item.split("—")
                return (
                  <div key={idx} className="relative flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-sm z-10">
                      {idx + 1}
                    </div>
                    <div className="bg-surface px-4 py-3 rounded-2xl shadow-sm border w-full md:w-3/4">
                      <h4 className="font-serif font-bold text-text-primary md:text-base text-sm">{parts[0]}</h4>
                      {parts[1] && <p className="text-xs text-text-secondary">{parts.slice(1).join("—")}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </FadeInSection>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px bg-border w-16" />
          <Heart className="text-primary" size={20} />
          <div className="h-px bg-border w-16" />
        </div>

        <FadeInSection direction="up" distance={24} duration={700}>
          <section className="px-6 mb-10">
            <h2 className="text-4xl font-script text-center text-primary mb-6">The Bridal Party</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Maid of Honor</span>
                <span className="font-serif text-text-primary">{bridalParty.maidOfHonor}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Bestman</span>
                <span className="font-serif text-text-primary">{bridalParty.bestman}</span>
              </div>
            </div>
            <div className="space-y-6 bg-surface p-6 rounded-2xl border mt-6 text-center">
              <div className="flex flex-col items-center">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-2 border-b border-border pb-2 w-full">Bridesmaids</span>
                {bridalParty.bridesmaids.map((b, i) => (
                  <span key={i} className="font-serif text-text-primary">{b}</span>
                ))}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-2 border-b border-border pb-2 w-full">Groomsmen</span>
                <span className="font-serif text-text-primary">Chris Lawor</span>
                <span className="font-serif text-text-primary">Flomo Massaquoi</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-2 mt-6 text-center">
              <div className="flex flex-col col-span-2 items-center">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Junior Bride</span>
                <span className="font-serif text-text-primary">{bridalParty.juniorBride}</span>
              </div>
              <div className="flex flex-col col-span-2 items-center">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Bride Announcer</span>
                <span className="font-serif text-text-primary">{bridalParty.brideAnnouncer}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Flower Girl</span>
                <span className="font-serif text-text-primary">{bridalParty.flowerGirl}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Ring Bearer</span>
                <span className="font-serif text-text-primary">{bridalParty.ringBearer}</span>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection direction="up" distance={24} duration={700}>
          <section className="px-6 mb-10">
            <div className="space-y-8 text-center">
              <div>
                <h3 className="text-3xl font-script text-primary mb-3">Groom's Parents</h3>
                <div className="bg-surface p-4 rounded-xl border space-y-2">
                  <div className="flex justify-between items-end border-b border-dashed border-border pb-1">
                    <span className="font-serif text-text-primary">Mr. Peter S. Lawor</span>
                    <span className="text-xs text-primary font-bold uppercase tracking-widest">Father</span>
                  </div>
                  <div className="flex justify-between items-end pt-1">
                    <span className="font-serif text-text-primary">Ms Kemah L. Sackie</span>
                    <span className="text-xs text-primary font-bold uppercase tracking-widest">Mother</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-script text-primary mb-3">Bride's Parents</h3>
                <div className="bg-surface p-4 rounded-xl border space-y-2">
                  <div className="flex justify-between items-end border-b border-dashed border-border pb-1">
                    <span className="font-serif text-text-primary">Dea. Zubah K. Yennego, Sr.</span>
                    <span className="text-xs text-primary font-bold uppercase tracking-widest">Father</span>
                  </div>
                  <div className="flex justify-between items-end pt-1">
                    <span className="font-serif text-text-primary">Dea. Leah K. Yennego</span>
                    <span className="text-xs text-primary font-bold uppercase tracking-widest">Mother</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection direction="up" distance={24} duration={700}>
          <section className="px-6 pb-12">
            <h3 className="text-3xl font-script text-primary mb-4 text-center">Wedding Vendors</h3>
            <div className="bg-surface rounded-2xl p-6 text-center text-sm space-y-3 border">
              <p>
                <span className="text-primary font-bold uppercase tracking-widest text-xs block mb-1">Decorator</span>
                <span className="text-text-secondary">Divine Innovations & Events</span>
              </p>
              <p>
                <span className="text-primary font-bold uppercase tracking-widest text-xs block mb-1">Caterer</span>
                <span className="text-text-secondary">Nancy Catering Service</span>
              </p>
              <p>
                <span className="text-primary font-bold uppercase tracking-widest text-xs block mb-1">Wedding Cake</span>
                <span className="text-text-secondary">Reka Cakes</span>
              </p>
              <p>
                <span className="text-primary font-bold uppercase tracking-widest text-xs block mb-1">Videos & Photos</span>
                <span className="text-text-secondary">Chris & Grace</span>
              </p>
            </div>
          </section>
        </FadeInSection>

        <footer className="bg-primary/10 py-8 text-center border-t border-border rounded-b-3xl">
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">Reception</h2>
          <p className="text-text-secondary text-sm mb-4">To follow immediately after service.</p>
          <div className="flex justify-center gap-2">
            <Heart className="text-primary" size={18} />
            <Heart className="text-accent" size={18} />
            <Heart className="text-primary" size={18} />
          </div>
          <p className="font-script text-2xl mt-3 text-primary">Thank you for celebrating with us!</p>
        </footer>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-full h-48 z-0 pointer-events-none opacity-30 translate-y-12">
        <img className="w-full h-full object-cover object-bottom rotate-180 mask-image-gradient-t" alt="Bottom floral" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOT8xgRjJXWxDwIXXtTV_MB5r1QG-FgMfL5_PJVzdKPfm1g3NtbmU89A5auphU2XLl5yegm_rB7CO9nkGXGbpjEjXs3m97e07Z8eOF3F2ga7sGRgX1tmLJTNB-u5kQs_AOtsuD_V2ej57_H_8z6fF0rICQ41f8l66YMFXyyZqX8ACitVFC7IwJ-w5kC13RXZPkFaO5yrD4dejDYX9Wz9sBC-pIXWBng2RVVWPyZUcecC3AFxj2EhcbCgEQ7FlaUp05F4nKVCrHJsws" />
      </div>
    </main>
  )
}
