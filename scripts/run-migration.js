// Top-level script
const { neon } = require("@neondatabase/serverless")

const databaseUrl = process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  console.error("[v0] Error: NEON_DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(databaseUrl)

const schema = `
CREATE TABLE IF NOT EXISTS weddings (
  id SERIAL PRIMARY KEY,
  couple_name_1 VARCHAR(150) NOT NULL,
  couple_name_2 VARCHAR(150) NOT NULL,
  wedding_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  address TEXT,
  description TEXT,
  theme_color VARCHAR(20) DEFAULT '#1e40af',
  accent_color VARCHAR(20) DEFAULT '#d4af37',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  wedding_id INT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  event_name VARCHAR(150) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  location VARCHAR(255),
  description TEXT,
  order_position INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  wedding_id INT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(50) NOT NULL,
  relationship VARCHAR(100),
  bio TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vows (
  id SERIAL PRIMARY KEY,
  wedding_id INT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  person_name VARCHAR(100) NOT NULL,
  vow_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  wedding_id INT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  uploader_name VARCHAR(150),
  uploader_email VARCHAR(150),
  media_type VARCHAR(20) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  blob_url VARCHAR(500),
  file_name VARCHAR(255),
  caption TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  wedding_id INT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_wedding_id ON events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_people_wedding_id ON people(wedding_id);
CREATE INDEX IF NOT EXISTS idx_vows_wedding_id ON vows(wedding_id);
CREATE INDEX IF NOT EXISTS idx_media_wedding_id ON media(wedding_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_wedding_id ON admin_users(wedding_id);
`

async function runMigration() {
  try {
    console.log("[v0] Starting database migration...")

    // Execute schema creation
    await sql(schema)

    console.log("[v0] ✓ Database tables created successfully!")

    // Seed initial wedding data
    await sql`
      INSERT INTO weddings (couple_name_1, couple_name_2, wedding_date, location, address, description)
      VALUES ('John', 'Sabawu', '2024-12-19 13:30:00', 'Lakpazee Community Church', 'Airfield, Sinkor', 'Our wedding celebration')
      ON CONFLICT DO NOTHING
    `

    console.log("[v0] ✓ Wedding data seeded successfully!")
    console.log("[v0] Migration complete!")
  } catch (error) {
    console.error("[v0] Migration error:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

runMigration()
