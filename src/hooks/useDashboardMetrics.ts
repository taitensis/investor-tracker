// hooks/useDashboardMetrics.js
import { useMemo } from 'react'

export function useDashboardMetrics(positions = []) {
  return useMemo(() => {
    const totalValue = positions.reduce(
      (sum, p) => sum + parseFloat(p.marketValue || 0),
      0
    )
    const totalGain = positions.reduce(
      (sum, p) => sum + parseFloat(p.pnl || 0),
      0
    )
    const gainPercent =
      totalValue > 0 ? ((totalGain / totalValue) * 100).toFixed(2) : 0

    return {
      totalValue: totalValue.toFixed(2),
      totalGain: totalGain.toFixed(2),
      gainPercent,
    }
  }, [positions])
}
