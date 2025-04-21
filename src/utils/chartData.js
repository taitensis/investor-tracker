// utils/chartData.js

export function getLineChartData(trades = []) {
  const dailyMap = {}

  for (const t of trades) {
    const date = t.date.split('T')[0]
    if (!dailyMap[date]) {
      dailyMap[date] = { date, market_value: 0, pnl: 0 }
    }

    const qty = parseFloat(t.quantity)
    const price = parseFloat(t.price_per_unit)
    const value = qty * price

    if (t.action === 'buy') {
      dailyMap[date].market_value += value
      dailyMap[date].pnl -= value
    } else {
      dailyMap[date].market_value -= value
      dailyMap[date].pnl += value
    }
  }

  return Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date))
}

export function getDonutChartData(positions = []) {
  const typeTotals = {}

  for (const pos of positions) {
    if (pos.marketValue === '-' || pos.marketValue === null) continue

    const type = pos.asset?.type || 'unknown'
    const value = parseFloat(pos.marketValue)

    if (!typeTotals[type]) typeTotals[type] = 0
    typeTotals[type] += value
  }

  return Object.entries(typeTotals).map(([type, value]) => ({
    name: type,
    value: parseFloat(value.toFixed(2)),
  }))
}
