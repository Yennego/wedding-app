// Top-level module
import sql from "@/lib/db"
import { del } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pending = searchParams.get("pending") === "true"

    let result
    if (pending) {
      result = await sql`SELECT * FROM media WHERE wedding_id = ${1} AND approved = false ORDER BY uploaded_at DESC`
    } else {
      result = await sql`SELECT * FROM media WHERE wedding_id = ${1} ORDER BY uploaded_at DESC`
    }

    return Response.json(result || [])
  } catch (error) {
    console.error("Error fetching media:", error)
    return Response.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, approved } = await request.json()

    const result = await sql`
      UPDATE media SET approved = ${approved}, updated_at = NOW() WHERE id = ${id} AND wedding_id = ${1} RETURNING *
    `

    return Response.json(result?.[0])
  } catch (error) {
    console.error("Error updating media:", error)
    return Response.json({ error: "Failed to update media" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    // Retrieve blob URL to delete
    const record = await sql`SELECT blob_url FROM media WHERE id = ${id} AND wedding_id = ${1} LIMIT 1`
    const blobUrl = record?.[0]?.blob_url

    if (blobUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN })
      } catch (blobErr) {
        console.error("Blob delete failed:", blobErr)
        // Continue to delete DB record even if blob fails
      }
    }

    await sql`DELETE FROM media WHERE id = ${id} AND wedding_id = ${1}`

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return Response.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
