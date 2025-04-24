import { addMonths, format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'

const FREQUENCY_ENUM = {
  0: 'none',
  1: 'monthly',
  2: 'quarterly',
  3: 'semi-annual',
  4: 'annual',
  5: 'uneven',
}

const FREQUENCY_MAP = {
  'monthly': 12,
  'quarterly': 4,
  'semi-annual': 2,
  'annual': 1
}

const shownWarnings = new Set()

/**
 * Generate future payment dates
 */
export function generateFutureDates(startDate, frequency, count = 12) {
  const interval = 12 / (FREQUENCY_MAP[frequency] || 4) // fallback to quarterly intervals
  const dates = []

  const baseDate = parseISO(startDate);
  for (let i = 0; i < count; i++) {
    const d = addMonths(baseDate, i * interval)
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

    let rawFreq = sched.payment_frequency
    let freq = typeof rawFreq === 'string'
      ? rawFreq.toLowerCase()
      : FREQUENCY_ENUM[rawFreq]?.toLowerCase() || 'quarterly'

    if (!FREQUENCY_MAP[freq] && !shownWarnings.has(freq)) {
      toast.error(`⚠️ Unknown or unsupported dividend frequency: "${rawFreq}". Defaulting to quarterly.`)
      shownWarnings.add(freq)
      freq = 'quarterly'
    }

    const paymentsPerYear = FREQUENCY_MAP[freq];
    const dividendPerPayment = sched.dividend_per_share / paymentsPerYear

    const dates = generateFutureDates(
      sched.next_payment_date,
      freq,
      12
    )

    dates.forEach((date) => {
      result.push({
        date,
        asset: h.asset_name,
        amount: (h.shares * dividendPerPayment).toFixed(2),
        currency: sched.currency || 'EUR',
        accountType: h.account_type || 'Uknown',
      });
    });
  });

  return result;
}

export function getQuarterlyDividendMap(forecastedEvents) {
  const map = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

  forecastedEvents.forEach((e) => {
    const month = new Date(e.date).getMonth(); // 0 = Jan, 11 = Dec

    let quarter;
    if (month < 3) quarter = 'Q1';
    else if (month < 6) quarter = 'Q2';
    else if (month < 9) quarter = 'Q3';
    else quarter = 'Q4';

    map[quarter] += parseFloat(e.amount);
  });

  return map;
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
