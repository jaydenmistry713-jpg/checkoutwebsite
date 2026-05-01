/**
 * KOVA Events — Frontend Configuration
 *
 * These are PUBLIC keys only (safe to expose in browser).
 * Secret keys belong in Netlify environment variables, never here.
 *
 * How to fill this in:
 *  SUPABASE_URL       → Supabase Dashboard → Project Settings → API → Project URL
 *  SUPABASE_ANON_KEY  → Supabase Dashboard → Project Settings → API → anon / public
 *  STRIPE_PK          → Stripe Dashboard → Developers → API Keys → Publishable key
 */
window.KOVA_CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_PROJECT_URL',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY'
}
