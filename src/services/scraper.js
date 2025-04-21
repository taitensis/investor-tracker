import axios from 'axios'
import fs from 'fs'
const cheerio = await import('cheerio')

const scrapers = {
  ariva: {
    url: () => `https://www.ariva.de/aktien/apple-inc-aktie`,
    dataTypes: ['full-html'],
    parse: async (html, asset) => {
      return { fullHtml: html }
    },
  },
}

export async function scrapeAsset(asset) {
  const scraper = scrapers[asset.source]
  if (!scraper)
    throw new Error(`No scraper defined for source: ${asset.source}`)

  const url = scraper.url(asset)
  console.log(`🔎 Scraping [${asset.name}] from ${url}...`)

  try {
    const { data: html } = await axios.get(url)
    const result = await scraper.parse(html, asset)

    console.log(`✅ Success for ${asset.name}.`)

    if (result.fullHtml) {
      const filename =
        asset.name.toLowerCase().replace(/\s+/g, '_') + '-full.html'
      fs.writeFileSync(filename, result.fullHtml)
      console.log(`📄 Full HTML saved to ${filename}`)
    }

    return result
  } catch (error) {
    console.error(`❌ Error scraping ${asset.name}:`, error.message)
  }
}
