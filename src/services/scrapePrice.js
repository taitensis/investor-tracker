import axios from 'axios'
import fs from 'fs'

const cheerio = await import('cheerio')

// Define your asset object (from DB or hardcoded for now)
const asset = {
  name: 'Apple Inc',
  type: 'stock', // or 'ETF'
  ls_path: 'apple-aktie', // stored in your asset table
}

// Build the URL dynamically
const buildLsUrl = (asset) =>
  `https://www.ls-tc.de/de/${asset.type === 'ETF' ? 'etf' : 'aktie'}/${asset.ls_path}`

const url = buildLsUrl(asset)
let lastPrice = null

async function scrapeStaticPrice() {
  try {
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)

    const rawPrice = $('span[source="lightstreamer"][field="mid"]')
      .first()
      .text()
      .trim()
    const price = parseFloat(rawPrice.replace(',', '.'))

    if (isNaN(price)) {
      console.warn(
        `[${new Date().toLocaleTimeString()}] Could not parse price from: "${rawPrice}"`
      )
      return
    }

    if (price !== lastPrice) {
      console.log(
        `[${new Date().toLocaleTimeString()}] Price updated: €${price}`
      )
      lastPrice = price
      fs.appendFileSync(
        'price-log.csv',
        `${new Date().toISOString()},${asset.name},${price}\n`
      )
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] No change: €${price}`)
    }
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message)
  }
}

scrapeStaticPrice()
setInterval(scrapeStaticPrice, 30 * 1000)
