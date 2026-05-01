-- ─────────────────────────────────────────────────────────────────────────────
-- KOVA Events — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Events ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title              TEXT NOT NULL,
  description        TEXT,
  date               TIMESTAMPTZ NOT NULL,
  venue              TEXT NOT NULL,
  ticket_price       DECIMAL(10, 2) NOT NULL,
  tickets_available  INTEGER NOT NULL DEFAULT 0,
  tickets_sold       INTEGER NOT NULL DEFAULT 0,
  published          BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tickets ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id           UUID REFERENCES events(id) ON DELETE SET NULL,
  customer_name      TEXT,
  customer_email     TEXT NOT NULL,
  quantity           INTEGER NOT NULL DEFAULT 1,
  total_amount       DECIMAL(10, 2) NOT NULL,
  stripe_session_id  TEXT UNIQUE,
  status             TEXT NOT NULL DEFAULT 'pending',  -- pending | confirmed | refunded
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Public can read published events only
CREATE POLICY "Public read published events"
  ON events FOR SELECT
  USING (published = true);

-- Authenticated users (admins) can do everything with events
CREATE POLICY "Authenticated full access to events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read all tickets
CREATE POLICY "Authenticated read all tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (true);

-- Service role (used by functions) bypasses RLS automatically

-- ── Sample Data ───────────────────────────────────────────────────────────────
-- Uncomment to seed demo events (adjust dates as needed)

INSERT INTO events (title, description, date, venue, ticket_price, tickets_available, tickets_sold, published) VALUES

('ECLIPSE',
 E'An immersive night of electronic music and spatial audio, staged across two floors of a converted Victorian tunnel network beneath the city.\n\nHeadlining artists will perform unreleased sets alongside a curated supporting lineup. Expect deep house, experimental ambient, and live modular synthesis.\n\nCapacity is intentionally limited to preserve the intimacy of the experience.',
 '2026-06-06 22:00:00+00',
 'The Vaults, Waterloo, London',
 65.00,
 300,
 187,
 true),

('RESONANCE',
 E'Three rooms. Six hours. One night.\n\nResonance is KOVA''s flagship underground music event — a meticulously programmed evening of deep house and techno at one of London''s most respected club spaces.\n\nDoors open at 9pm. Last entry midnight.',
 '2026-06-21 21:00:00+00',
 'Fabric, Farringdon, London',
 45.00,
 500,
 62,
 true),

('SOLSTICE',
 E'Celebrate the longest day of the year with an outdoor gathering unlike any other.\n\nSolstice brings together music, art installations, and curated food and drink across the lawns of Victoria Park. A rare afternoon-to-dusk KOVA experience.\n\nGates open 3pm. Event closes 10pm.',
 '2026-06-22 15:00:00+00',
 'Victoria Park, Hackney, London',
 55.00,
 800,
 0,
 false);
