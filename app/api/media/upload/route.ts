import { put } from "@vercel/blob"
import sql from "@/lib/db"
import { UPLOAD_LIMITS } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploaderName = formData.get("uploaderName") as string
    const caption = formData.get("caption") as string

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }
    if (!uploaderName) {
      return Response.json({ error: "Uploader name required" }, { status: 400 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json({ error: "Blob token missing. Set BLOB_READ_WRITE_TOKEN." }, { status: 500 })
    }

    const isVideo = file.type.startsWith("video")
    const mediaType = isVideo ? "video" : "image"

    if (
      (!isVideo && !UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) ||
      (isVideo && !UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES.includes(file.type))
    ) {
      return Response.json({ error: "Unsupported file type" }, { status: 400 })
    }
    if (
      (!isVideo && file.size > UPLOAD_LIMITS.MAX_IMAGE_SIZE) ||
      (isVideo && file.size > UPLOAD_LIMITS.MAX_VIDEO_SIZE)
    ) {
      return Response.json({ error: "File too large" }, { status: 413 })
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const result = await sql`
      INSERT INTO media (wedding_id, uploader_name, media_type, file_url, blob_url, file_name, caption, approved)
      VALUES (${1}, ${uploaderName}, ${mediaType}, ${blob.url}, ${blob.url}, ${file.name}, ${caption}, ${false})
      RETURNING *
    `

    return Response.json(result?.[0], { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}
