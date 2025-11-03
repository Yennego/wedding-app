# Wedding Celebration App

A complete digital wedding platform built with Next.js, featuring guest information, event program, media gallery, and secure admin panel.

## Features

- **Landing Page** - Beautiful welcome page with wedding details
- **Wedding Details** - Bridal party, parents, and chief organizer information
- **Program Sheet** - Tentative and final wedding event schedule
- **Vows** - Share the couple's vows with guests
- **Media Gallery** - Guests can upload photos and videos during/after the wedding
- **Admin Panel** - Manage events, approve media uploads, and control what guests see
- **Secure Storage** - Media hosted on Vercel Blob with approval workflow

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Vercel account for Blob storage
- Neon PostgreSQL database

### Setup

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd wedding-app
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
Create a `.env.local` file with your configuration:
\`\`\`
NEON_DATABASE_URL=postgresql://user:password@host/database
BLOB_READ_WRITE_TOKEN=your-blob-token
\`\`\`

4. **Run database migrations**
Execute the SQL scripts from `scripts/` in your Neon dashboard:
- First: `01-wedding-schema.sql` - Creates all tables
- Second: `02-seed-wedding-data.sql` - Adds sample data

5. **Start the development server**
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your wedding app!

## Default Admin Password

The seeded admin password hash is for: **wedding123**

⚠️ **IMPORTANT**: Change this immediately after first login!

To set a new admin password:
1. Hash your password using: `crypto.createHash('sha256').update('yourpassword').digest('hex')`
2. Update the `admin_users` table in your database with the new hash

## Pages

- `/` - Landing page
- `/details` - Wedding party and attendees
- `/program` - Event schedule
- `/vows` - Couple's vows
- `/gallery` - Photo/video gallery
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin panel for managing content
- `/admin/media/download` - Download all approved media

## Admin Features

- Review and approve guest uploads
- Manage event schedule
- View all gallery submissions
- Download all media as batch

## Downloading All Media

After the wedding:

1. Go to `/admin/dashboard`
2. Navigate to Media tab
3. Click "Download Media" to access the download page
4. Select all or specific media
5. Browser will download selected files

For large batches, consider using browser dev tools or a download manager.

## Customization

### Change Wedding Colors

Edit `app/globals.css` to modify the color scheme:
\`\`\`css
--color-primary: #1e40af;      /* Blue */
--color-accent: #d4af37;       /* Gold */
\`\`\`

### Update Wedding Information

Edit `scripts/02-seed-wedding-data.sql` with actual wedding details, then re-run the seeds, or use the admin panel.

### Add Bridal Party

Insert into the `people` table:
\`\`\`sql
INSERT INTO people (wedding_id, name, role, relationship, bio)
VALUES (1, 'Name', 'bridesmaid', 'Sister', 'Bio text');
\`\`\`

## Security Notes

- Admin passwords are hashed with SHA-256
- Media uploads require manual approval before publishing
- Use HTTPS in production
- Set secure cookie flags for authentication
- Regularly update your admin password

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

The app can be deployed to any platform supporting Node.js 18+:
- Render.com
- Railway.app
- Fly.io
- DigitalOcean App Platform

Ensure environment variables are set in your deployment platform's dashboard.

## Database Backup

Before the wedding, backup your Neon database:

\`\`\`sql
-- In Neon dashboard SQL editor
pg_dump -Fc DATABASE_NAME > backup.dump
\`\`\`

After the wedding, export media using the admin download panel.

## Support

For issues or questions, check your setup:

1. Verify `DATABASE_URL` is set correctly
2. Check that database migrations ran successfully
3. Ensure `BLOB_READ_WRITE_TOKEN` is valid
4. Clear browser cache if seeing stale content

## License

This project is for personal use. Feel free to modify and share with family!

---

Made with for John & Sabanu's wedding celebration.
