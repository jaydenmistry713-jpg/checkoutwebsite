const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { eventId, quantity = 1 } = body
  if (!eventId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Missing eventId' }) }
  if (quantity < 1 || quantity > 10) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid quantity' }) }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  const { data: ev, error: evErr } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('published', true)
    .single()

  if (evErr || !ev) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'Event not found' }) }

  const available = ev.tickets_available - (ev.tickets_sold || 0)
  if (available < quantity) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Not enough tickets available' }) }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
  const siteUrl = process.env.SITE_URL || 'http://localhost:8888'

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(parseFloat(ev.ticket_price) * 100),
          product_data: {
            name: `KOVA: ${ev.title} — General Admission`,
            description: `${new Date(ev.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${ev.venue}`,
            metadata: { event_id: eventId }
          }
        },
        quantity
      }
    ],
    return_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    metadata: { event_id: eventId, quantity: String(quantity) }
  })

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({ clientSecret: session.client_secret })
  }
}
