import sql from "@/lib/db"
import JSZip from "jszip"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("admin_session")
    if (!adminSession) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ids = [] } = await request.json()

    const records =
      ids && ids.length > 0
        ? await sql`SELECT * FROM media WHERE wedding_id = ${1} AND id = ANY(${ids}) ORDER BY uploaded_at DESC`
        : await sql`SELECT * FROM media WHERE wedding_id = ${1} AND approved = true ORDER BY uploaded_at DESC`

    if (!records || records.length === 0) {
      return Response.json({ error: "No media found" }, { status: 404 })
    }

    const zip = new JSZip()
    await Promise.all(
      records.map(async (item: any) => {
        const resp = await fetch(item.file_url)
        if (!resp.ok) return
        const buffer = await resp.arrayBuffer()
        const defaultExt = item.media_type === "video" ? "mp4" : "jpg"
        const filename = item.file_name || `${item.id}-${item.uploader_name || "media"}.${defaultExt}`
        zip.file(filename, buffer)
      }),
    )

    const content = await zip.generateAsync({ type: "uint8array" })
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="wedding-media-${new Date().toISOString().slice(0, 10)}.zip"`,
      },
    })
  } catch (error) {
    console.error("[zip] error:", error)
    return Response.json({ error: "Failed to create zip" }, { status: 500 })
  }
}