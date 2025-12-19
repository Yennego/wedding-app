import sql from "@/lib/db"
import Image from "next/image"
import FadeInSection from "@/components/FadeInSection"

type VowRow = {
  id: number
  person_name: string
  vow_text: string
}

function asRows<T>(result: any): T[] {
  if (!result) return []
  if (Array.isArray(result)) return result as T[]
  if (Array.isArray(result?.rows)) return result.rows as T[]
  return []
}

async function getVows() {
  try {
    const result = await sql`SELECT id, person_name, vow_text FROM vows WHERE wedding_id = ${1} ORDER BY created_at DESC`
    return asRows<VowRow>(result)
  } catch (error) {
    console.error("[v0] Error fetching vows:", error)
    return []
  }
}

export default async function VowsPage() {
  const vows = await getVows()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-4">Our Vows</h1>
        <p className="text-center text-text-secondary mb-12">The promises we made to each other</p>

        <FadeInSection direction="up" distance={24} duration={700}>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                  <Image src="/JoWu/Groom_Bride.jpg" alt="Groom" fill className="rounded-full object-cover ring-2 ring-primary/20" sizes="64px" />
                </div>
                <div>
                  <p className="text-accent font-serif text-sm uppercase tracking-wider">John • Groom</p>
                  <p className="text-xs text-text-secondary">From the Groom</p>
                </div>
              </div>
              <div className="space-y-4 text-text-primary leading-relaxed">
                <p>Bawu as I affectionally call you, From the moment I encounter you, I knew that you were someone special. in spite of my many flaws, you always made me felt different. You walked into my life when I was at my lowest and filled me up with light and purpose, I didn't know I was missing. Your kindness, your strength, and your infectious laughter inspire me every day to be a better person.</p>
                <p>I love the way you make every situation seems settle and with you all problems seem to be solved. You make me laugh no matter how stressed I am. Your calmness has made me look at every situation differently. Your kind words, your built-up moment and your faith in me has also strengthen my faith.</p>
                <p>Life will always have it ups and downs but doing life with you is one of the best decisions I have ever made, you make us stronger in spite of the storm we might have or will face. I cherish the countless memories we've already built over the years.</p>
                <p>I am positive that From this day forward, your joy is my joy, your problems are my problems, your heart is my heart, your dreams are my dreams, your life, my life until death do us part. I promise to love you unconditionally, striving to be devoted to you above all others with the help of God.</p>
                <p>We are built to last. My Jowu you are and will always be. I love you.</p>
                <p className="font-serif font-semibold text-primary">Your Babe, John</p>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                  <Image src="/JoWu/Groom_Bride.jpg" alt="Bride" fill className="rounded-full object-cover ring-2 ring-accent/30" sizes="64px" />
                </div>
                <div>
                  <p className="text-accent font-serif text-sm uppercase tracking-wider">Sabawu • Bride</p>
                  <p className="text-xs text-text-secondary">From the Bride</p>
                </div>
              </div>
              <div className="space-y-4 text-text-primary leading-relaxed">
                <p>My J❤️❤️ From the moment our paths crossed, you have filled my life with love, laughter, and unwavering support. Today, I stand before you, ready to join my life with yours, promising to cherish and honor you every day.</p>
                <p>I vow to be your partner in all things, to celebrate your joys and comfort you in times of sorrow. I promise to listen with an open heart, to speak with kindness, and to grow alongside you through all of life’s adventures.</p>
                <p>I will support your dreams and respect our differences, knowing that together we are stronger. I pledge to build a home filled with warmth, honesty, and laughter, where love is the foundation and trust the cornerstone.</p>
                <p>With all that I am, and all that I have, I give you my hand, my heart, and my soul, from this day forward, in this life and whatever comes after.</p>
                <p>I love you forever.</p>
                <p className="font-serif font-semibold text-primary">Your Jowu❤️</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {vows.length === 0 ? (
          <div className="bg-surface rounded-lg p-12 text-center border border-border">
            <p className="text-text-secondary">💖💖💖💖💖💖</p>
          </div>
        ) : (
          <div className="space-y-8">
            {vows.map((vow: any, index: number) => (
              <div key={vow.id} className="bg-surface rounded-lg p-8 border-l-4 border-l-accent">
                <p className="text-accent font-serif text-sm uppercase tracking-wider mb-2">{vow.person_name}</p>
                <p className="text-lg text-text-primary leading-relaxed italic">"{vow.vow_text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
