import * as cheerio from 'cheerio'

export async function getPriceFromGettex(isin) {
  const res = await fetch('https://gggnrmwishakhoxjbvdp.functions.supabase.co/gettex-price', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isin })
  })

  const data = await res.json()

  if (!data.html) {
    console.warn('No HTML returned from Edge Function:', data)
    return null
  }

  const $ = cheerio.load(data.html)
  const priceText = $('.v-tick-flash.less').first().text().replace(',', '.')
  const price = parseFloat(priceText)

  return isNaN(price) ? null : price
}
