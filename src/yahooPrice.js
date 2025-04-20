// yahooPrice.js
import yahooFinance from 'yahoo-finance2'

export async function getYahooPrice(assetName) {
  try {
    const result = await yahooFinance.search(assetName)

    if (!result.quotes || result.quotes.length === 0) {
      throw new Error('No quotes found')
    }

    // Try to prioritize EU exchanges: .F (Frankfurt), .PA (Paris), .DE (Germany)
    const match = result.quotes.find(
      q => q.symbol.endsWith('.F') || q.symbol.endsWith('.PA') || q.exchange.includes('Frankfurt')
    ) || result.quotes[0] // fallback to first match

    const quote = await yahooFinance.quote(match.symbol)

    return {
      symbol: match.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
      exchange: quote.exchange
    }
  } catch (e) {
    console.warn(`Yahoo price lookup failed for "${assetName}":`, e.message)
    return null
  }
}
