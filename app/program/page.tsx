import sql from "@/lib/db"

async function getEvents() {
  try {
    const result = await sql`SELECT * FROM events WHERE wedding_id = 1 ORDER BY order_position`
    return result || []
  } catch (error) {
    console.error("[v0] Error fetching events:", error)
    return []
  }
}

export default async function ProgramPage() {
  const events = await getEvents()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-primary text-center mb-12">Wedding Program</h1>

        {events.length === 0 ? (
          <div className="bg-surface rounded-lg p-8 text-center border border-border">
            <p className="text-text-secondary">Program details coming soon. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event: any, index: number) => (
              <div key={event.id} className="bg-surface rounded-lg p-6 border-l-4 border-l-accent">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{event.event_name}</h3>
                    {event.location && <p className="text-text-secondary text-sm mt-1">📍 {event.location}</p>}
                    {event.description && <p className="text-text-secondary text-sm mt-2">{event.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-serif text-accent">
                      {new Date(event.start_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-xs text-text-secondary">{new Date(event.start_time).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
