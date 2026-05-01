const { createClient } = require('@supabase/supabase-js')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, date, venue, ticket_price, tickets_available, tickets_sold, published')
    .eq('published', true)
    .order('date', { ascending: true })

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) }

  return { statusCode: 200, headers: cors, body: JSON.stringify(data) }
}
