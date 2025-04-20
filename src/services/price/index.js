// services/price/index.js
import { getLsPrice } from './getLsPrice';
// import { getYahooPrice } from './yahooPrice.js.bak';

export async function fetchMarketPrice(asset) {
  try {
    return await getLsPrice(asset);
  } catch {
    return "error";
    // return await getYahooPrice(asset);
  }
}