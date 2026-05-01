# KOVA Events — Claude Context

## What this project is

A colourful event ticketing website for a fake business called **KOVA Events**. Built primarily for **content creation** — Instagram posts, stories, and a 60-second screen-record demo. Visual quality and screenshot-readiness come first.

Customers browse events, purchase tickets via Stripe embedded checkout, and receive email confirmations. The business owner gets an automated notification email on every sale. An admin CMS lets the owner create and manage events.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML + Tailwind CDN (no build step) |
| Fonts | Poppins (display/headings, bold) + Inter (body) |
| Images | Unsplash (hero background + event card photos, direct URL embed) |
| Backend | Netlify Functions (Node.js, CommonJS) |
| Database | Supabase (Postgres + Auth + RLS) |
| Payments | Stripe embedded checkout (`ui_mode: 'embedded'`) in **test mode** |
| Email | Resend (customer confirmation + admin notification) |
| Hosting | Netlify (GitHub auto-deploy) |

**No build step.** No framework. No bundler. Every HTML file is self-contained with inline `<style>` blocks.

---

## Design system

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F7F6FF` | Page background (light lavender) |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#F0EDFF` | Card headers, input backgrounds |
| `--border` | `#E0DAFF` | All borders |
| `--border-light` | `#ECEAFF` | Subtle dividers |
| `--primary` | `#7C3AED` | Purple — buttons, prices, accents |
| `--primary-hover` | `#6D28D9` | Button hover state |
| `--primary-light` | `#A78BFA` | Light purple for gradients/logo |
| `--primary-soft` | `#EDE9FE` | Purple tint backgrounds |
| `--secondary` | `#F43F5E` | Rose/coral — badge highlights |
| `--amber` | `#F59E0B` | Amber — "Few Left" badges |
| `--text` | `#1E1B4B` | Primary text (deep indigo) |
| `--text-2` | `#5B4F99` | Secondary text |
| `--text-muted` | `#9B8FCC` | Labels, placeholders |
| `--success` | `#10B981` | Green — confirmed tickets |

Admin sidebar background: `#1E1B4B` (deep indigo) with white/purple text.

Buttons are **pill-shaped** (`border-radius: 50px`). Cards use `border-radius: 20px`. Checkout panel uses `border-radius: 24px`.

Colored box shadows use `rgba(124,58,237,...)` (purple-tinted) rather than neutral gray.

---

## Images (Unsplash)

Event card images cycle through this array (index % length):
```js
const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&q=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&q=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=700&q=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=700&q=80&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700&q=80&fit=crop&auto=format',
]
```

Hero background (index.html): `photo-1533174072545-7a4b6ad7a6c3` at 1920px wide.

Event banner (event.html): cycles through the first 4 of the same set at 1200px, selected by `eventId.charCodeAt(0) % BANNER_IMAGES.length`.

---

## File map

```
/
├── index.html              — Public events listing (hero + card grid)
├── event.html              — Event detail + embedded Stripe checkout
├── success.html            — Order confirmation page
├── admin/
│   ├── login.html          — Supabase email/password login
│   └── index.html          — CMS dashboard (stats, events table, create/edit modal)
├── netlify/functions/
│   ├── get-events.js           — GET published events (public)
│   ├── get-event.js            — GET single event by id (public)
│   ├── create-checkout.js      — POST create Stripe session → returns clientSecret
│   ├── stripe-webhook.js       — POST handle checkout.session.completed
│   ├── get-session.js          — GET session details for success page
│   ├── admin-get-events.js     — GET all events (auth required)
│   ├── admin-create-event.js   — POST create event (auth required)
│   ├── admin-update-event.js   — PUT update event (auth required)
│   ├── admin-delete-event.js   — DELETE event (auth required)
│   ├── admin-get-tickets.js    — GET all ticket sales (auth required)
│   └── admin-toggle-publish.js — PATCH toggle published (auth required)
├── js/config.js            — PUBLIC frontend keys (Supabase URL/anon + Stripe PK)
├── supabase/schema.sql     — DB schema + RLS policies + seed data
├── netlify.toml            — Netlify build config
├── package.json            — Node deps for functions
├── .env.example            — Template for Netlify env vars
├── SETUP.md                — Step-by-step deployment guide
├── CONTENT_GUIDE.md        — Claude prompt for screenshot direction
└── VIDEO_GUIDE.md          — 60-second demo video script
```

---

## Environment variables

Set in **Netlify Dashboard → Environment Variables** (never in `js/config.js`):

```
SUPABASE_URL
SUPABASE_SERVICE_KEY     ← service role, server-side only
STRIPE_SECRET_KEY        ← sk_test_...
STRIPE_WEBHOOK_SECRET    ← whsec_...
RESEND_API_KEY
RESEND_FROM_EMAIL
SITE_URL                 ← https://your-site.netlify.app
ADMIN_EMAIL
```

Frontend public keys go in `js/config.js` (safe to expose in browser):
```js
window.KOVA_CONFIG = {
  SUPABASE_URL: '...',
  SUPABASE_ANON_KEY: '...',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_...'
}
```

---

## Database schema

```sql
events  (id, title, description, date, venue, ticket_price,
         tickets_available, tickets_sold, published, created_at, updated_at)

tickets (id, event_id, customer_name, customer_email, quantity,
         total_amount, stripe_session_id, status, created_at)
```

RLS: public SELECT on `events` where `published = true`. All other ops require authenticated (service role bypasses RLS for functions).

---

## Auth pattern

- **Admin frontend**: Supabase `signInWithPassword()` → JWT stored in browser
- **Admin functions**: Each function calls `supabase.auth.getUser(jwt)` to verify the `Authorization: Bearer <jwt>` header before doing anything
- **Public functions**: No auth; use service key server-side

---

## Payment flow

1. User picks quantity on `event.html` → clicks "Proceed to Checkout"
2. `create-checkout.js` creates a Stripe session with `ui_mode: 'embedded'`
3. Frontend calls `stripe.initEmbeddedCheckout({ clientSecret })` and mounts inline
4. Stripe redirects to `success.html?session_id=...` on completion
5. `stripe-webhook.js` fires on `checkout.session.completed`:
   - Upserts a ticket row in Supabase
   - Increments `tickets_sold` on the event
   - Sends customer confirmation email via Resend
   - Sends admin notification email via Resend

---

## Key conventions

- All Netlify functions use **CommonJS** (`require` / `exports.handler`)
- CORS headers are set on every function response (`Access-Control-Allow-Origin: *`)
- Every function handles `OPTIONS` preflight first
- No TypeScript, no linting, no tests — this is a demo project
- Comments are only added when behaviour would be non-obvious
- Do not add a build step or bundler — keep it plain HTML

---

## Demo data (seeded in schema.sql)

| Event | Date | Venue | Price | Sold | Published |
|-------|------|-------|-------|------|-----------|
| ECLIPSE | 6 Jun 2026 22:00 | The Vaults, Waterloo | £65 | 187/300 | ✅ |
| RESONANCE | 21 Jun 2026 21:00 | Fabric, Farringdon | £45 | 62/500 | ✅ |
| SOLSTICE | 22 Jun 2026 15:00 | Victoria Park, Hackney | £55 | 0/800 | ❌ draft |
