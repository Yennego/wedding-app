// Top-level module
import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "NEON_DATABASE_URL environment variable is not set. Please configure Neon integration in your Vercel project.",
  )
}

const sql = neon(databaseUrl)

export default sql
