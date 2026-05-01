const { createClient } = require('@supabase/supabase-js')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}

async function verifyAuth(event, supabase) {
  const auth = event.headers['authorization']
  if (!auth) return null
  const { data: { user }, error } = await supabase.auth.getUser(auth.replace('Bearer ', ''))
  if (error || !user) return null
  return user
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }
  if (event.httpMethod !== 'PUT') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  const user = await verifyAuth(event, supabase)
  if (!user) return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'Unauthorized' }) }

  let body
  try { body = JSON.parse(event.body) } catch { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { id, title, date, venue, ticket_price, tickets_available, description, published } = body
  if (!id) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Missing id' }) }

  const { data, error } = await supabase.from('events').update({
    title,
    date,
    venue,
    ticket_price,
    tickets_available,
    description: description || null,
    published
  }).eq('id', id).select().single()

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) }

  return { statusCode: 200, headers: cors, body: JSON.stringify(data) }
}
