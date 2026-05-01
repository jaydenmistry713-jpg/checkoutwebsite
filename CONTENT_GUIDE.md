# KOVA Events — Content Creation Guide
## Claude Prompt for Screenshot Direction

---

Copy everything below this line and paste it into a new Claude conversation to get precise screenshot and content instructions for your KOVA Events website.

---

```
I've built a premium event ticketing website called KOVA Events. It's a warm light-themed,
luxury-aesthetic site where people can browse and buy tickets to exclusive events.
I need you to act as my content director and tell me exactly what to screenshot on both
desktop and mobile to create:
  1. Instagram posts (1:1, 1080×1080)
  2. Instagram stories (9:16, 1080×1920)
  3. A 60-second screen-record for a product demo reel

Here is the website structure:

PAGES:
- / (homepage) — warm cream background (#FDFAF6) with large "CURATED / EXPERIENCES" in
  charcoal and gold serif typography. Decorative circular rings in background. Below the
  hero is a grid of 3 event cards — each card has a soft pastel gradient header (lavender,
  rose, or sage), white card body, event name in large serif, date, venue, gold price,
  and a "Secure Your Place →" CTA. Hover state lifts the card with a gold border.
- /event.html?id=... (event detail) — soft pastel banner (e.g. soft lavender gradient) 
  spanning full width with event title in large charcoal serif. Two-column layout below:
  left column has event description, details card (date/time/venue/availability), and
  "what to expect" panel. Right column is a sticky white ticket panel with quantity
  selector, gold price display, total, and "Proceed to Checkout" button in charcoal.
  After clicking, the embedded Stripe checkout appears inline (no page redirect).
- /success.html (confirmation) — warm cream background, animated gold checkmark ring at
  top, "You're on the list." headline in italic serif, white order summary card, white
  next-steps card, "Add to Calendar" button.
- /admin/login.html — warm cream bg, white card with soft shadow, KOVA gold logo, 
  clean form with warm-tinted input fields
- /admin/index.html — light sidebar (#FDFAF6 with border), warm gray main area,
  4 stat cards (Total Events in charcoal, Published in gold, Tickets Sold in charcoal,
  Revenue in green), events table with pastel progress bars, green/gold toggle switches,
  and a modal form for creating events.

BRAND: Warm cream background (#FDFAF6), gold accent (#C8A96E / text gold #9A7B30),
Cormorant Garamond serif + Inter sans-serif. Light, editorial, luxury feel.

DEMO DATA (already in the database):
- ECLIPSE — Fri 6 Jun 2026 · The Vaults, London · £65 · 187/300 sold (lavender card)
- RESONANCE — Sat 21 Jun 2026 · Fabric, London · £45 · 62/500 sold (rose card)
- SOLSTICE — Sun 22 Jun 2026 · Victoria Park · £55 · Not yet published (draft, sage card)

---

Please give me a detailed shoot list with:

1. DESKTOP SCREENSHOTS (for square posts)
   - Exact page URL / state to be in
   - Browser window size to use (suggest 1440px wide)
   - What to have open / populated in the UI
   - What caption / post copy to write for each

2. MOBILE SCREENSHOTS (for stories)
   - Exact page and scroll position
   - Device frame to use (suggest iPhone 14 in browser devtools)
   - Portrait orientation
   - Story text overlay suggestions (what to write on the story)

3. SCREEN RECORD SEQUENCE
   - Step by step script for a 60-second video
   - What to narrate at each step
   - What to click / interact with

4. POST COPY
   - For each desktop screenshot: suggested Instagram caption
   - Hashtag suggestions

Be very specific. Tell me exactly what state each page should be in.
The warm cream and gold aesthetic screenshots very well on Instagram — factor that into
your framing suggestions.
```

---

## Quick Reference — Best Screenshot Moments

| Page | Best moment | Key visual |
|------|------------|------------|
| Homepage | Events grid fully loaded | 3 pastel cards with gold prices |
| Homepage mobile | Hero text visible in top half | "CURATED / EXPERIENCES" in serif |
| Event detail | Ticket panel visible, qty = 2 | Gold £130 total, checkout button |
| Event detail mobile | Scrolled to ticket panel | White sticky panel |
| Stripe checkout | Stripe form loaded inline | Clean white form on cream bg |
| Success page | Checkmark + "You're on the list." | Gold ring, italic serif |
| Admin dashboard | Stats row + ECLIPSE progress bar | Green revenue stat, gold accent |
| Admin — create modal | Modal open, form partially filled | White modal over light dashboard |
| Admin — tickets view | At least 1 ticket row visible | Revenue column in gold |

## Tips for Best Screenshots

- **Chrome DevTools** for mobile: F12 → device icon → iPhone 14 (390×844)
- **Test card** for Stripe: `4242 4242 4242 4242`, exp `12/26`, CVC `424`
- **Admin login**: Use your Supabase admin account
- **Keep browser zoom at 100%** for desktop screenshots
- **Light mode OS preferred** — the warm cream theme looks best with a white OS frame
- **No personal data in admin screenshots** — create a demo account with a generic email
- The **lavender event card** (ECLIPSE) tends to photograph best for square posts
