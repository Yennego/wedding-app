const crypto = require("crypto")

// Usage: node scripts/03-password-generator.js "your-password"
const password = process.argv[2]

if (!password) {
  console.error("Please provide a password as argument")
  console.error('Usage: node scripts/03-password-generator.js "your-password"')
  process.exit(1)
}

const hash = crypto.createHash("sha256").update(password).digest("hex")
console.log("\n=== Password Hash ===")
console.log("Password:", password)
console.log("Hash:", hash)
console.log("\nUpdate admin_users table with:")
console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE id = 1;`)
