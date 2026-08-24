# Control Panel — Dashboard Starter

A starter admin/control dashboard for a platform, built with Next.js (App
Router), TypeScript, and Tailwind CSS. It's meant to be extended: swap the
mock data for real API calls and keep adding pages under `app/dashboard/`.

## Structure

```
app/
  page.tsx                 → redirects to /dashboard
  dashboard/
    layout.tsx              → sidebar + shell shared by every dashboard page
    page.tsx                → Overview: stat cards, module status, activity feed
    modules/page.tsx         → Modules table
    users/page.tsx           → Users page (empty state, ready for real data)
    settings/page.tsx        → Settings form
components/
  Sidebar.tsx, Topbar.tsx, StatCard.tsx, StatusPulse.tsx
lib/
  data.ts                   → all mock data lives here, shaped like a real API response
```

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects straight to `/dashboard`.

## Connecting a real backend

Everything the dashboard shows comes from three functions in `lib/data.ts`:
`getMetricSummaries`, `getPlatformModules`, `getRecentActivity`. Replace the
body of each with a `fetch()` call to your API (or a database query) that
returns the same shape, and every page that uses it updates automatically —
no other files need to change.

To add a new section (e.g. "Billing"):
1. Add a folder `app/dashboard/billing/page.tsx`.
2. Add a nav entry in `components/Sidebar.tsx`.
3. Add a data function in `lib/data.ts` if it needs its own data.

## Fonts

This starter ships with a system-font stack so it works offline out of the
box. If you want the original type pairing (Space Grotesk / Inter / JetBrains
Mono) once you have a normal internet connection, swap `app/layout.tsx` back
to `next/font/google` — it's a 5-line change and Vercel will fetch and
self-host the fonts at build time.

## Deploy with HTTPS

1. Push this folder to a GitHub repo.
2. Go to vercel.com, sign in with GitHub, "Add New Project", import the repo.
3. Click Deploy. You'll get a `https://your-app.vercel.app` URL with HTTPS
   already set up — no certificate configuration needed.
