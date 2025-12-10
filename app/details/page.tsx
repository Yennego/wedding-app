import sql from "@/lib/db"
import BridalPartySlider from "@/components/bridal-party-slider"

async function getWeddingDetails() {
  try {
    const result = await sql`SELECT * FROM weddings WHERE id = 1 LIMIT 1`
    return result?.[0] || null
  } catch (error) {
    console.error("[v0] Error fetching wedding details:", error)
    return null
  }
}

async function getPeople(weddingId: number) {
  try {
    const result = await sql`SELECT * FROM people WHERE wedding_id = ${weddingId} ORDER BY role, name`
    return result || []
  } catch (error) {
    console.error("[v0] Error fetching people:", error)
    return []
  }
}

export default async function DetailsPage() {
  const wedding = await getWeddingDetails()
  const people = wedding ? await getPeople(wedding.id) : []

  const groupedPeople = people.reduce((acc: any, person: any) => {
    if (!acc[person.role]) acc[person.role] = []
    acc[person.role].push(person)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-2">
          {wedding?.couple_name_1} & {wedding?.couple_name_2}
        </h1>
        <p className="text-center text-text-secondary mb-6">
          {wedding?.description || "Join us for our special celebration"}
        </p>

        <BridalPartySlider
          images={[
            '/JoWu/DSC_9786.jpg',
            'https://9j7ye4r1xonvafok.public.blob.vercel-storage.com/IMG_2873.jpeg',
            '/JoWu/bride2.jpeg',
            '/JoWu/bride3.jpeg',
            '/JoWu/groom1.jpeg',
            '/JoWu/groom2.jpeg',
          ]}
          heightClass="h-[260px] md:h-[360px]"
        />
        <div className="cream-divider mb-8" />
        {/* Bridal Party */}
        {groupedPeople["bridesmaid"] && (
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-primary mb-6">Bridesmaids</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPeople["bridesmaid"].map((person: any) => (
                <div key={person.id} className="bg-surface rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-primary">{person.name}</h3>
                  <p className="text-accent font-serif text-sm">{person.relationship}</p>
                  {person.bio && <p className="text-text-secondary text-sm mt-2">{person.bio}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Parents */}
        {groupedPeople["parent"] && (
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-primary mb-6">Parents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedPeople["parent"].map((person: any) => (
                <div key={person.id} className="bg-surface rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-semibold text-primary">{person.name}</h3>
                  <p className="text-text-secondary">{person.relationship}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chief Organizer */}
        {groupedPeople["organizer"] && (
          <section>
            <h2 className="text-3xl font-serif text-primary mb-6">Chief Organizer</h2>
            <div className="bg-surface rounded-lg p-6 border border-border border-accent/30">
              {groupedPeople["organizer"].map((person: any) => (
                <div key={person.id}>
                  <h3 className="text-lg font-semibold text-primary">{person.name}</h3>
                  {person.bio && <p className="text-text-secondary text-sm mt-2">{person.bio}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
