import sql from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`SELECT * FROM events WHERE wedding_id = ${1} ORDER BY order_position`
    return Response.json(result || [])
  } catch (error) {
    console.error("Error fetching events:", error)
    return Response.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { eventName, startTime, endTime, location, description, orderPosition } = await request.json()

    const result = await sql`
      INSERT INTO events (wedding_id, event_name, start_time, end_time, location, description, order_position)
      VALUES (${1}, ${eventName}, ${startTime}, ${endTime}, ${location}, ${description}, ${orderPosition})
      RETURNING *
    `

    return Response.json(result?.[0], { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return Response.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, eventName, startTime, endTime, location, description, orderPosition } = await request.json()

    const result = await sql`
      UPDATE events SET event_name = ${eventName}, start_time = ${startTime}, end_time = ${endTime}, 
      location = ${location}, description = ${description}, order_position = ${orderPosition}, updated_at = NOW()
      WHERE id = ${id} AND wedding_id = ${1}
      RETURNING *
    `

    return Response.json(result?.[0])
  } catch (error) {
    console.error("Error updating event:", error)
    return Response.json({ error: "Failed to update event" }, { status: 500 })
  }
}
