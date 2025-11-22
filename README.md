# Daily Report App

A simple daily reporting tool for employees.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize database:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Login
- **Username**: `admin`
- **Password**: `password123`

## Deployment
> [!WARNING]
> This application uses SQLite (`dev.db`). If you deploy this to a serverless platform like **Vercel** or **Netlify**, your database **will be reset** every time the app redeploys or restarts.
>
> For production deployment on Vercel, switch to a cloud database like **Vercel Postgres** or **Supabase**.

### Vercel Setup
If you are deploying to Vercel, you must add the following **Environment Variables** in your Vercel Project Settings:

- `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
- `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://your-app.vercel.app`) or `http://localhost:3000` for development.
- `DATABASE_URL`: `file:./dev.db` (This allows the app to build, but data will not persist).
