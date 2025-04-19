import { scrapeAsset } from './scraper.js'

const assets = [
  {
    name: 'Apple Inc',
    type: 'stock',
    source: 'ariva',
    path: ''
  }
]

;(async () => {
  for (const asset of assets) {
    await scrapeAsset(asset)
  }
})()
