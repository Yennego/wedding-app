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
  const { eventName, startTime, endTime, location, description, orderPosition, lat, lon } = await request.json()
  const norm = (n: any, min: number, max: number) =>
    n == null ? null : Math.max(min, Math.min(max, Number(n)))
  const latNorm = norm(lat, -90, 90)
  const lonNorm = norm(lon, -180, 180)

  const result = await sql`
    INSERT INTO events (wedding_id, event_name, start_time, end_time, location, description, order_position, lat, lon)
    VALUES (${1}, ${eventName}, ${startTime}, ${endTime}, ${location}, ${description}, ${orderPosition}, ${latNorm}, ${lonNorm})
    RETURNING *
  `
  return Response.json(result?.[0], { status: 201 })
}

export async function PUT(request: Request) {
  const { id, eventName, startTime, endTime, location, description, orderPosition, lat, lon } = await request.json()
  const norm = (n: any, min: number, max: number) =>
    n == null ? null : Math.max(min, Math.min(max, Number(n)))
  const latNorm = norm(lat, -90, 90)
  const lonNorm = norm(lon, -180, 180)

  const result = await sql`
    UPDATE events SET event_name = ${eventName}, start_time = ${startTime}, end_time = ${endTime},
    location = ${location}, description = ${description}, order_position = ${orderPosition},
    lat = ${latNorm}, lon = ${lonNorm}, updated_at = NOW()
    WHERE id = ${id} AND wedding_id = ${1}
    RETURNING *
  `
  return Response.json(result?.[0])
}
