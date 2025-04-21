// get-ls-price/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers })

  try {
    const { type, ls_path } = await req.json()
    if (!ls_path || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing ls_path or type' }),
        { status: 400, headers }
      )
    }

    const url = `https://www.ls-tc.de/de/${type === 'ETF' ? 'etf' : 'aktie'}/${ls_path}`
    const res = await fetch(url)
    const html = await res.text()

    const $ = cheerio.load(html)
    const raw = $('span[source="lightstreamer"][field="mid"]')
      .first()
      .text()
      .trim()
    const price = parseFloat(raw.replace(',', '.'))

    if (isNaN(price)) throw new Error('Could not parse price')

    return new Response(JSON.stringify({ price }), { headers })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    })
  }
})
