# KOVA Events — Deployment Setup

Get this live in ~20 minutes. You need accounts on: Supabase, Stripe, Resend, Netlify.

---

## Step 1 — Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Name it `kova-events`, pick a strong password, choose London (EU West) region
3. Once created, go to **SQL Editor → New Query**
4. Paste the entire contents of `supabase/schema.sql` and click Run
5. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public** key → `SUPABASE_ANON_KEY` (goes in `js/config.js`)
   - **service_role** key → `SUPABASE_SERVICE_KEY` (Netlify env var only — never put in frontend)
6. Go to **Authentication → Users → Add user** and create your admin account (email + password)

---

## Step 2 — Stripe (Test Mode)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) — make sure you're in **Test mode** (toggle top-right)
2. Go to **Developers → API Keys** and copy:
   - **Publishable key** (`pk_test_...`) → goes in `js/config.js`
   - **Secret key** (`sk_test_...`) → Netlify env var
3. Go to **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
   - Select event: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_...`) → Netlify env var

---

## Step 3 — Resend

1. Go to [resend.com](https://resend.com) → Create account
2. **API Keys → Create API Key** → copy it → `RESEND_API_KEY`
3. **Domains → Add Domain** → verify your domain (add DNS records)
   - OR use `onboarding@resend.dev` as the from address for initial testing (no domain needed)
4. Set `RESEND_FROM_EMAIL` to `tickets@yourdomain.com` (or `onboarding@resend.dev` for testing)

---

## Step 4 — Frontend config

Open `js/config.js` and fill in your values:

```js
window.KOVA_CONFIG = {
  SUPABASE_URL: 'https://xxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGci...',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_...'
}
```

---

## Step 5 — Netlify

1. Go to [netlify.com](https://netlify.com) → Add new site → **Deploy manually**
   - Drag and drop the entire `checkoutwebsite` folder onto the Netlify deploy dropzone
   - **OR** connect your GitHub repo for auto-deploys
2. Once deployed, go to **Site Configuration → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM_EMAIL` | `tickets@yourdomain.com` |
| `SITE_URL` | `https://your-site.netlify.app` |
| `ADMIN_EMAIL` | Your email for booking notifications |

3. **Trigger a redeploy** after adding env vars (Deploys → Trigger deploy)
4. **Update the Stripe webhook URL** with your real Netlify URL

---

## Step 6 — Test the full flow

1. Visit your site — events should load from Supabase
2. Click an event → buy a ticket using test card `4242 4242 4242 4242` (expiry `12/26`, CVC `424`)
3. Confirm you land on `/success.html`
4. Check your email for the customer confirmation
5. Check your admin email for the booking notification
6. Visit `/admin/index.html` → tickets sold count should have incremented

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Events not loading | Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `js/config.js` are correct |
| Checkout not loading | Check `STRIPE_PUBLISHABLE_KEY` in `js/config.js` |
| Webhook 400 error | Check `STRIPE_WEBHOOK_SECRET` matches the one in Stripe dashboard |
| Emails not sending | Check `RESEND_API_KEY` and that your from-domain is verified in Resend |
| Admin login fails | Ensure the user exists in Supabase Auth → Users |
| Functions returning 500 | Check Netlify function logs: Site → Functions → Click function → View log |
