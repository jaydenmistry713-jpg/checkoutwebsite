# KOVA Events — Content Creation Guide
## Claude Prompt for Screenshot Direction

---

Copy everything below this line and paste it into a new Claude conversation to get precise screenshot and content instructions for your KOVA Events website.

---

```
I've built a colourful event ticketing website called KOVA Events. It's a vibrant,
modern site where people can browse and buy tickets to London events.
I need you to act as my content director and tell me exactly what to screenshot on both
desktop and mobile to create:
  1. Instagram posts (1:1, 1080×1080)
  2. Instagram stories (9:16, 1080×1920)
  3. A 60-second screen-record for a product demo reel

Here is the website structure:

PAGES:
- / (homepage) — light lavender background (#F7F6FF) with a full-screen Unsplash
  concert/festival photo as the hero, dark overlay with a bold "LIVE YOUR / BEST NIGHT."
  headline in Poppins 800 weight. Gradient text on the second line (purple to pink to
  orange). Two pill-shaped buttons: white "Browse Events" and a frosted-glass "Admin
  Portal". Below the hero is a grid of event cards — each card has a real Unsplash
  concert/nightlife photo, image zoom on hover, bold Poppins event name, date, venue,
  purple price, and a purple pill "Get Tickets" button.
- /event.html?id=... (event detail) — full-width Unsplash concert photo banner with dark
  gradient overlay, event title in bold white Poppins. Two-column layout below: left has
  description, details card with purple icon chips (date/time/venue/availability), and
  "What to Expect" panel with purple check dots. Right column is a sticky white panel with
  24px rounded corners, purple gradient header, circular +/− quantity buttons, a price
  breakdown on a lavender background, and a purple pill "Proceed to Checkout" button.
  After clicking, the embedded Stripe checkout appears inline (no page redirect).
- /success.html (confirmation) — lavender background with floating coloured dots (purple,
  pink, amber, green), purple checkmark ring, bold "You're on the list!" heading, white
  rounded order summary card, numbered steps with purple circle badges, pill buttons.
- /admin/login.html — lavender bg, white rounded card, purple gradient card header,
  purple KOVA logo, clean form with rounded inputs and a purple pill sign-in button.
- /admin/index.html — deep indigo sidebar (#1E1B4B) with purple "KOVA" branding and
  white nav text, light lavender main area, 4 stat cards each with a coloured icon
  (purple for events, green for published, amber for tickets, pink for revenue), events
  table with coloured progress bars, purple toggle switches, and a rounded modal.

BRAND: Light lavender background (#F7F6FF), purple primary (#7C3AED), rose secondary
(#F43F5E), Poppins bold + Inter. Colourful, bubbly, modern feel. Real event photography.

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
The colourful purple aesthetic with real event photography screenshots very well on
Instagram — factor that into your framing suggestions. Hero shots with the concert photo
visible behind the headline text work especially well for stories.
```

---

## Quick Reference — Best Screenshot Moments

| Page | Best moment | Key visual |
|------|------------|------------|
| Homepage hero | Full concert photo visible | Bold gradient headline on dark overlay |
| Homepage grid | Events grid fully loaded | 3 photo cards with purple prices |
| Homepage mobile | Hero photo + headline visible | "LIVE YOUR / BEST NIGHT." in bold |
| Event detail | Ticket panel visible, qty = 2 | Purple £130 total, checkout button |
| Event detail | Banner photo loaded | White bold event title over dark photo |
| Event detail mobile | Scrolled to ticket panel | Rounded white panel with purple CTA |
| Stripe checkout | Stripe form loaded inline | Clean form inside rounded panel |
| Success page | Checkmark + "You're on the list!" | Purple ring, coloured floating dots |
| Admin dashboard | Stats row + ECLIPSE progress bar | Indigo sidebar, coloured stat icons |
| Admin — create modal | Modal open, form partially filled | Rounded modal over light dashboard |
| Admin — tickets view | At least 1 ticket row visible | Purple revenue figures |

## Tips for Best Screenshots

- **Chrome DevTools** for mobile: F12 → device icon → iPhone 14 (390×844)
- **Test card** for Stripe: `4242 4242 4242 4242`, exp `12/26`, CVC `424`
- **Admin login**: Use your Supabase admin account
- **Keep browser zoom at 100%** for desktop screenshots
- **Light mode OS preferred** — the lavender background theme looks best with a white OS frame
- **No personal data in admin screenshots** — create a demo account with a generic email
- The **ECLIPSE card** (concert lights photo) tends to photograph best for square posts
- The **homepage hero** with the full concert photo is the strongest story content
