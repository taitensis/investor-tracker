import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
const cheerio = await import('cheerio')

// 🔐 Supabase credentials
const supabase = createClient(
  'https://gggnrmwishakhoxjbvdp.co',
  '' // not the anon public one
)

async function getLsPrice(asset) {
  if (!asset.ls_path) return null

  const url = `https://www.ls-tc.de/de/${asset.type === 'ETF' ? 'etf' : 'aktie'}/${asset.ls_path}`

  try {
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)
    const raw = $('span[source="lightstreamer"][field="mid"]').first().text().trim()
    const price = parseFloat(raw.replace(',', '.'))
    return isNaN(price) ? null : price
  } catch (e) {
    console.warn(`❌ Failed to get price for ${asset.name}: ${e.message}`)
    return null
  }
}

async function main() {
  const { data: assets, error } = await supabase
    .from('asset')
    .select('id, name, isin, type, ls_path')

  if (error) {
    console.error('🔴 Supabase error:', error.message)
    return
  }

  for (const asset of assets) {
    const price = await getLsPrice(asset)
    if (price !== null) {
      console.log(`✅ ${asset.name} (${asset.isin}): €${price}`)
    }
  }
}

main()
