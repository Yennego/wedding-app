import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.NEON_DATABASE_URL

// Create a safe sql client that doesn't crash the whole server at import time.
let sql: ReturnType<typeof neon>

if (databaseUrl && databaseUrl.trim().length > 0) {
  sql = neon(databaseUrl)
} else {
  // Stub that throws only when a query is attempted
  sql = ((..._args: any[]) => {
    throw new Error("NEON_DATABASE_URL is not set. Add it in your deployment environment and redeploy.")
  }) as unknown as ReturnType<typeof neon>
}

export default sql
