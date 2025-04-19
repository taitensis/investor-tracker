import axios from 'axios';
import fs from 'fs';

const cheerio = await import('cheerio');
const url = 'https://www.ls-tc.de/de/aktie/apple-aktie';
let lastPrice = null;

async function scrapeStaticPrice() {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const rawPrice = $('span[source="lightstreamer"][field="mid"]').first().text().trim();
    const price = parseFloat(rawPrice.replace(',', '.'));

    if (isNaN(price)) {
      console.warn(`[${new Date().toLocaleTimeString()}] Could not parse price from: "${rawPrice}"`);
      return;
    }

    if (price !== lastPrice) {
      console.log(`[${new Date().toLocaleTimeString()}] Price updated: €${price}`);
      lastPrice = price;

      // Optional: Save to log
      fs.appendFileSync('price-log.csv', `${new Date().toISOString()},${price}\n`);
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] No change: €${price}`);
    }
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
  }
}

scrapeStaticPrice();
setInterval(scrapeStaticPrice, 30 * 1000);
