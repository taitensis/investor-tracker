// utils/__tests__/portfolioUtils.test.js
import { calculatePosition } from '../portfolioUtils'

describe('calculatePosition()', () => {
  const sampleTrades = [
    { action: 'buy', quantity: 2, price_per_unit: 100 },
    { action: 'buy', quantity: 1, price_per_unit: 110 },
    { action: 'sell', quantity: 1, price_per_unit: 120 },
  ]

  it('calculates quantity, cost, and P&L correctly', () => {
    const result = calculatePosition(sampleTrades, 130)

    expect(result.quantity).toBe(2)
    expect(result.totalCost).toBeCloseTo(210)
    expect(result.averageCost).toBe('105.00')
    expect(result.marketValue).toBe('260.00')
    expect(result.pnl).toBe('50.00')
    expect(result.percentChange).toBe('23.81')
  })
})