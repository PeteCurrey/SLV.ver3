# SLVC — Storforth Lane Valeting Centre Website

Built by Avorria · Next.js 14 · TypeScript · Tailwind CSS

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to GitHub Pages

1. Push to GitHub repository
2. In `next.config.js`, add your repo name as `basePath` if deploying to a sub-path:
   ```js
   basePath: '/your-repo-name',  // only if not a custom domain
   ```
3. Run `npm run build` — this generates the `out/` folder (static export)
4. In GitHub repo Settings → Pages → set source to `GitHub Actions` or deploy the `out/` folder

Or use **Vercel** (recommended — zero config):
- Connect GitHub repo to Vercel
- Auto-deploys on every push

## Admin Panel

Access via the small gold button in the bottom-right corner of the site.

- **Dashboard** — Live summary of enquiries, conversions and service breakdown
- **Leads** — Full table with status management (New → Contacted → Booked → Completed)
- **Analytics** — 6-month enquiry chart + guidance on connecting Google Analytics 4

Leads are stored in the browser's localStorage. For persistent server-side storage, integrate with a backend (Supabase, Firebase, or a simple API route).

## Connecting Analytics

Add GA4 tracking to `app/layout.tsx`:
```tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

## Replacing Placeholder Images

Replace Unsplash URLs in `app/page.tsx` (`IMAGES` object at the top) with your own hosted images. Recommended: upload to `/public/images/` and reference as `/images/hero.jpg`.

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- Google Fonts (Cormorant Garamond + Outfit)
- No external UI libraries
