import sql from "@/lib/db"

async function getVows() {
  try {
    const result = await sql`SELECT * FROM vows WHERE wedding_id = 1 ORDER BY created_at DESC`
    return result || []
  } catch (error) {
    console.error("[v0] Error fetching vows:", error)
    return []
  }
}

export default async function VowsPage() {
  const vows = await getVows()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-4">Our Vows</h1>
        <p className="text-center text-text-secondary mb-12">The promises we made to each other</p>

        {vows.length === 0 ? (
          <div className="bg-surface rounded-lg p-12 text-center border border-border">
            <p className="text-text-secondary">Vows will be shared soon. Check back later.</p>
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
