# KOVA Events — 60-Second Video Script
## Screen Record + Voice Overlay Guide

---

## Setup Before Recording

- **Browser**: Chrome, window maximised, zoom at 100%
- **Screen size**: 1920×1080 (or 1440×900)
- **Pre-load**: Have the site open, logged into admin
- **Demo data**: Ensure ECLIPSE and RESONANCE are published, SOLSTICE is in draft
- **Stripe test mode**: Confirm Stripe is in test mode (banner at top of Stripe dashboard)
- **Recording tool**: OBS / Loom / QuickTime
- **Mic**: Clip-on or headset recommended. Record voice live or overdub in editing.

---

## Script — 60 Seconds

> Each section has a timestamp, screen action, and exact words to say.
> Aim for calm, confident delivery — think premium product demo, not sales pitch.

---

### [0:00 – 0:06] — Homepage Hero

**Screen action:** Open `https://your-site.netlify.app` and let it load. The full-screen concert photo hero with "LIVE YOUR / BEST NIGHT." headline should be visible.

**Narration:**
> *"This is KOVA — a simple, beautiful way for event businesses to sell tickets online, no code required."*

---

### [0:06 – 0:14] — Events Grid

**Screen action:** Slowly scroll down to reveal the events grid. Hover over the ECLIPSE card — the photo zooms in on hover and the card lifts with a purple shadow.

**Narration:**
> *"Your upcoming events appear here automatically — each one with availability, pricing, and a clear call to action."*

---

### [0:14 – 0:22] — Event Detail Page

**Screen action:** Click on the ECLIPSE event card. Wait for the page to load — the concert photo banner with "ECLIPSE" in bold white fills the top. Let the camera settle on the two-column layout below.

**Narration:**
> *"Each event gets its own page with full details. On the right — a live ticket panel that updates in real time."*

---

### [0:22 – 0:32] — Ticket Purchase Flow

**Screen action:**
1. Click the `+` button to change quantity to 2
2. Watch the total update to £130
3. Click "Proceed to Checkout"
4. Wait for Stripe embedded checkout to appear inline

**Narration:**
> *"Customers choose their quantity and go straight into checkout — no redirects, no friction. Stripe handles all payments securely, right here on the page."*

---

### [0:32 – 0:38] — Confirmation Page

**Screen action:** Cut to the `success.html` page (pre-loaded with a test session). Show the purple checkmark ring, "You're on the list!" headline, and the floating coloured dots in the background.

**Narration:**
> *"Once payment goes through, they land here. An order confirmation email fires automatically."*

---

### [0:38 – 0:48] — Admin Dashboard

**Screen action:**
1. Navigate to `/admin/index.html`
2. Let the stats cards load — show Total Events (purple icon), Tickets Sold (amber icon), Revenue (pink icon)
3. Scroll down to the events table showing ECLIPSE with its progress bar and the deep indigo sidebar visible on the left

**Narration:**
> *"Behind the scenes — a clean admin dashboard. You can see ticket sales at a glance, revenue, and capacity."*

---

### [0:48 – 0:56] — Create Event

**Screen action:**
1. Click "Create Event" button
2. Modal slides in — type "SOLSTICE" in the title field, set a date
3. Toggle "Publish immediately" on

**Narration:**
> *"Creating a new event takes 30 seconds. Fill in the details, hit publish — it's live instantly."*

---

### [0:56 – 1:00] — Closing

**Screen action:** Fade back to the homepage hero.

**Narration:**
> *"KOVA — event ticketing, done beautifully."*

---

## Editing Notes

- Add smooth cuts between sections (0.3s cross-fade)
- Consider a subtle music bed (low-key ambient/electronic, ~-20dB under voice)
- Optionally add on-screen text callouts for key features:
  - `"Real-time availability"` on the event detail page
  - `"Powered by Stripe"` during checkout
  - `"Automated email confirmations"` on the success page
  - `"Live revenue tracking"` on the admin dashboard
- Target export: 1080×1920 (story/reel vertical crop of key moments) + 1920×1080 (standard)
- Thumbnail: Homepage hero at the 0:05 mark — concert photo with gradient headline visible

---

## Stripe Test Card (for live demo)

Use these in the Stripe embedded checkout during your recording:

| Field | Value |
|-------|-------|
| Card number | `4242 4242 4242 4242` |
| Expiry | `12 / 26` |
| CVC | `424` |
| Name | Any name |
| Email | Your email (to demo the confirmation) |

> Tip: Complete a real test purchase before recording so you have a clean success.html example to cut to.

---

## Reels / TikTok Adaptation (30 seconds)

If cutting to 30 seconds, keep:
- **0–5s**: Homepage hero
- **5–15s**: Event page + checkout
- **15–22s**: Success screen
- **22–30s**: Admin dashboard stats

Drop the create event section — hit the key customer journey only.
