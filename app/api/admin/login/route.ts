import sql from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return Response.json({ error: "Password required" }, { status: 400 })
    }

    const adminResult = await sql`SELECT id, password_hash FROM admin_users WHERE wedding_id = ${1} LIMIT 1`

    if (!adminResult || adminResult.length === 0) {
      return Response.json({ error: "Admin not configured" }, { status: 500 })
    }

    const admin = adminResult[0]
    const passwordHash = hashPassword(password)

    if (passwordHash !== admin.password_hash) {
      return Response.json({ error: "Invalid password" }, { status: 401 })
    }

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", JSON.stringify({ weddingId: 1, adminId: admin.id }), {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Login error:", error instanceof Error ? error.message : String(error))
    return Response.json(
      { error: "Login failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
