import sql from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin_session")
  if (!adminSession) {
    return Response.json({ media: [] }, { status: 200 })
  }

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
    if (dbError?.message?.includes("does not exist") || dbError?.message?.includes("relation")) {
      return Response.json({ error: "Database tables not initialized", media: [] }, { status: 503 })
    }
    throw dbError
  }

  return Response.json({ media: result || [] })
}
