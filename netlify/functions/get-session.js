const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  const sessionId = event.queryStringParameters?.session_id
  if (!sessionId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Missing session_id' }) }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Payment not completed' }) }
    }

    const eventId = session.metadata?.event_id
    const { data: ev } = await supabase.from('events').select('*').eq('id', eventId).single()
    const { data: ticket } = await supabase.from('tickets').select('*').eq('stripe_session_id', sessionId).single()

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ event: ev, ticket, session: { id: session.id, status: session.payment_status } })
    }
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) }
  }
}
