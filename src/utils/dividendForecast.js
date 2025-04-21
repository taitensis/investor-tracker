import { addMonths, format, parseISO } from 'date-fns'

const FREQUENCY_MAP = {
  monthly: 1,
  quarterly: 3,
  'semi-annual': 6,
  annual: 12,
}

/**
 * Generate future payment dates
 */
export function generateFutureDates(startDate, frequency, count = 12) {
  const interval = FREQUENCY_MAP[frequency] || 3 // default to quarterly
  const dates = []

  for (let i = 0; i < count; i++) {
    const d = addMonths(parseISO(startDate), i * interval)
    dates.push(format(d, 'yyyy-MM-dd'))
  }

  return dates
}

/**
 * Get forecasted dividend events (flat list)
 */
export function getForecastedDividends({ holdings, schedules }) {
  const result = []
  if (!schedules || !Array.isArray(schedules)) return []

  holdings.forEach((h) => {
    const sched = schedules.find((s) => s.asset_id === h.asset_id)
    if (!sched || !sched.dividend_per_share || !sched.next_payment_date) return

    const dates = generateFutureDates(
      sched.next_payment_date,
      sched.payment_frequency,
      12
    )

    dates.forEach((date) => {
      result.push({
        date,
        asset: h.asset_name,
        amount: (h.shares * sched.dividend_per_share).toFixed(2),
        currency: sched.currency || 'EUR',
      })
    })
  })

  return result
}

/**
 * Summarize forecasted income per month
 */
export function getMonthlyDividendMap(forecastedEvents) {
  const map = {}

  forecastedEvents.forEach((e) => {
    const monthKey = e.date.slice(0, 7) // yyyy-mm
    if (!map[monthKey]) map[monthKey] = 0
    map[monthKey] += parseFloat(e.amount)
  })

  return map
}
