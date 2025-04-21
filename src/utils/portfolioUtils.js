// utils/portfolioUtils.js

export function calculatePosition(trades = [], marketPrice = null) {
  let quantity = 0
  let totalCost = 0

  for (const trade of trades) {
    const qty = parseFloat(trade.quantity)
    const price = parseFloat(trade.price_per_unit)

    if (trade.action === 'buy') {
      quantity += qty
      totalCost += qty * price
    } else {
      quantity -= qty
      totalCost -= qty * price
    }
  }

  const marketValue = marketPrice ? quantity * marketPrice : null
  const pnl = marketValue !== null ? marketValue - totalCost : null
  const percentChange =
    pnl !== null && totalCost > 0 ? ((pnl / totalCost) * 100).toFixed(2) : null

  return {
    quantity,
    totalCost,
    averageCost: quantity > 0 ? (totalCost / quantity).toFixed(2) : '-',
    marketValue: marketValue?.toFixed(2) ?? '-',
    pnl: pnl?.toFixed(2) ?? '-',
    percentChange,
  }
}

export function groupTradesByAsset(trades = []) {
  const map = {}

  for (const trade of trades) {
    const key = `${trade.account.name}-${trade.asset.id}`
    if (!map[key]) {
      map[key] = []
    }
    map[key].push(trade)
  }

  return map // { 'PEA-assetId123': [trade1, trade2, ...], ... }
}

export function calculatePnl(marketValue, totalCost) {
  if (marketValue == null || totalCost === 0) return null
  return (marketValue - totalCost).toFixed(2)
}

export function calculatePercentChange(pnl, totalCost) {
  if (pnl == null || totalCost <= 0) return null
  return ((pnl / totalCost) * 100).toFixed(2)
}

export function convertToEUR(value, rate) {
  if (!value || !rate) return null
  return (value * rate).toFixed(2)
}

export function buildPositionSnapshot(pos, marketPrice) {
  const { quantity, totalCost, averageCost, marketValue, pnl, percentChange } =
    calculatePosition(pos.trades, marketPrice)

  return {
    asset_id: pos.asset.id,
    account_id: pos.account.id,
    date: new Date().toISOString().split('T')[0],
    quantity,
    average_cost: averageCost,
    market_price: marketPrice,
    market_value: marketValue,
    pnl,
  }
}

export async function buildPositionsFromTrades(trades = [], priceFetcher) {
  const grouped = groupTradesByAsset(trades)

  const results = await Promise.all(
    Object.entries(grouped).map(async ([key, tradeList]) => {
      const sample = tradeList[0]

      let marketPrice = null
      try {
        marketPrice = await priceFetcher(sample.asset)
      } catch (e) {
        console.warn(`Failed to fetch market price for ${sample.asset.name}`)
      }

      const position = calculatePosition(tradeList, marketPrice)

      return {
        asset: sample.asset,
        account: sample.account,
        marketPrice,
        currency: 'EUR',
        ...position,
      }
    })
  )

  return results
}

export function buildLsLink(asset) {
  if (!asset?.ls_path) return null
  const typePath = asset.type === 'ETF' ? 'etf' : 'aktie'
  return `https://www.ls-tc.de/de/${typePath}/${asset.ls_path}`
}
