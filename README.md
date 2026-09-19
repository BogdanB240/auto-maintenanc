# 🚗 Auto Maintenance Tracker

Personal car maintenance tracker PWA built with Next.js, React, Tailwind CSS, and Supabase.

Track your service history, parts replacements, costs, and more with a beautiful timeline view and powerful search.

## Features

- ✅ **Add maintenance records** with retroactive dating
- ✅ **Track parts replaced** at each service
- ✅ **Search functionality** by parts, service type, description
- ✅ **Timeline view** organized by year and month
- ✅ **Statistics** - total services, costs, frequency of parts
- ✅ **Mobile-first responsive design**
- ✅ **Real-time sync** with Supabase
- ✅ **Secure authentication** with Google login

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel (frontend), Supabase (backend)
- **Icons**: Lucide React
- **Utilities**: date-fns

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/auto-maintenance.git
cd auto-maintenance
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to your project's SQL Editor
3. Copy the entire content from `SQL_SETUP.sql` in this repo
4. Paste it into the SQL Editor and execute
5. Go to **Project Settings** → **API**
6. Copy your project URL and anon key

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Set Up Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. In Supabase, go to **Authentication** → **Providers**
6. Enable Google and paste your Client ID and Secret

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment on Vercel

### Option 1: Automatic (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and connect your GitHub
3. Import the repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Option 2: Manual

```bash
npm install -g vercel
vercel
# Follow prompts and add environment variables
```

## Usage

### Adding a Service Record

1. Click "Adaugă Service" button
2. Select the date (can be in the past)
3. Choose service type from dropdown or add custom
4. Add parts (select from suggestions or type new)
5. Optional: add mileage, cost, description, notes
6. Save

### Searching

1. Click the "Căutare" tab
2. Type to search by:
   - Part names
   - Service type
   - Description
   - Notes
3. Results highlight matching parts

### Timeline View

- Organized by year and month
- Collapsible sections for easy navigation
- Shows date, service type, parts, mileage, cost
- Sorted newest first

## Database Schema

```sql
maintenance_logs:
- id (UUID, primary key)
- user_id (UUID, foreign key)
- service_date (DATE)
- parts (TEXT array)
- service_type (VARCHAR)
- description (TEXT)
- mileage (INTEGER)
- cost (DECIMAL)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## File Structure

```
auto-maintenance/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard/main page
│   └── globals.css         # Global styles
├── components/
│   ├── Auth.tsx            # Authentication UI
│   ├── AddMaintenanceForm.tsx # Form modal
│   ├── TimelineView.tsx    # Timeline display
│   ├── SearchLogs.tsx      # Search functionality
│   └── Stats.tsx           # Statistics cards
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript types
│   └── ro-locale.ts        # Romanian locale for dates
├── .env.example            # Environment template
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
├── package.json
└── SQL_SETUP.sql           # Database setup script
```

## Troubleshooting

### "Database error" when adding a service

1. Make sure you've run the SQL setup script
2. Check that Row Level Security policies are enabled
3. Verify your user is authenticated

### Google login not working

1. Check OAuth credentials in Supabase
2. Verify authorized redirect URIs include your domain
3. Check browser console for errors

### Styles not loading

```bash
npm install
npm run dev
# Kill and restart dev server
```

## Future Enhancements

- [ ] Multiple cars support
- [ ] Maintenance reminders/alerts
- [ ] Service history export (PDF/CSV)
- [ ] Recurring maintenance schedules
- [ ] Photo attachments
- [ ] Integration with fuel consumption tracking
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync

## License

MIT

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include browser console errors

---

Made with ❤️ for car enthusiasts and meticulous owners.
