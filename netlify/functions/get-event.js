const { createClient } = require('@supabase/supabase-js')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  const id = event.queryStringParameters?.id
  if (!id) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Missing id' }) }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !data) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'Event not found' }) }

  return { statusCode: 200, headers: cors, body: JSON.stringify(data) }
}
