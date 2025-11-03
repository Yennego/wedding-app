import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const weddingId = searchParams.get("weddingId") || "1"
    const approved = searchParams.get("approved") === "true"

    let result
    try {
      if (approved) {
        result =
          await sql`SELECT * FROM media WHERE wedding_id = ${weddingId} AND approved = true ORDER BY uploaded_at DESC`
      } else {
        result = await sql`SELECT * FROM media WHERE wedding_id = ${weddingId} ORDER BY uploaded_at DESC`
      }
    } catch (dbError: any) {
      console.error("[v0] Database query error:", dbError?.message || dbError)
      // Return helpful error message for missing tables
      if (dbError?.message?.includes("does not exist") || dbError?.message?.includes("relation")) {
        console.error(
          "[v0] Wedding tables not created. Run scripts/01-wedding-schema.sql in your Neon dashboard first.",
        )
        return Response.json({ error: "Database tables not initialized", media: [] }, { status: 503 })
      }
      throw dbError
    }

    return Response.json({ media: result || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching media:", error?.message || error)
    return Response.json({ error: error?.message || "Failed to fetch media", media: [] }, { status: 500 })
  }
}
