const { createClient } = require('@supabase/supabase-js')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}

async function verifyAuth(event, supabase) {
  const auth = event.headers['authorization']
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  const user = await verifyAuth(event, supabase)
  if (!user) return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'Unauthorized' }) }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) }

  return { statusCode: 200, headers: cors, body: JSON.stringify(data) }
}
