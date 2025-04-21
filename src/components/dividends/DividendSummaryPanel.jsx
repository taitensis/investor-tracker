import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { getForecastedDividends } from '@utils/dividendForecast'
import { format } from 'date-fns'

export default function DividendSummaryPanel() {
    const [summary, setSummary] = useState(null)

    useEffect(() => {
        const loadDividendSummary = async () => {
            const user = (await supabase.auth.getUser()).data.user

            // Fetch trades (to get current holdings)
            const { data: trades } = await supabase
                .from('trade')
                .select(`
          action, quantity, asset_id, asset (id, name)
        `)
                .eq('user_id', user.id)

            const holdings = {}
            for (const t of trades) {
                const id = t.asset_id
                if (!holdings[id]) {
                    holdings[id] = {
                        asset_id: id,
                        asset_name: t.asset?.name || '',
                        shares: 0,
                    }
                }

                const qty = parseFloat(t.quantity)
                if (t.action === 'buy') holdings[id].shares += qty
                else if (t.action === 'sell') holdings[id].shares -= qty
            }

            const currentHoldings = Object.values(holdings).filter((h) => h.shares > 0)

            // Fetch dividend schedules
            const { data: schedules } = await supabase
                .from('dividend_schedule')
                .select('*')
                .eq('user_id', user.id)

            const forecast = getForecastedDividends({ holdings: currentHoldings, schedules })

            const total12moIncome = forecast.reduce((sum, d) => sum + (parseFloat(d.amount, 0) || 0), 0)

            // Next dividend
            const upcoming = forecast
                .filter((d) => new Date(d.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

            // Quarterly breakdown
            const byQuarter = {}
            forecast.forEach((d) => {
                const q = `Q${Math.floor((new Date(d.date).getMonth() + 3) / 3)}`
                byQuarter[q] = (byQuarter[q] || 0) + d.amount
            })

            setSummary({
                total: total12moIncome,
                next: upcoming,
                byQuarter,
            })
        }

        loadDividendSummary()
    }, [])

    if (!summary) return null

    return (
        <div className="bg-white p-4 rounded shadow space-y-4">
            <h3 className="text-lg font-semibold mb-2">📦 Dividend Summary</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <StatCard label="Estimated 12-mo Income" value={`€${Number(summary.total).toFixed(2)}`} />
                <StatCard
                    label="Next Payment"
                    value={
                        summary.next
                            ? `${format(new Date(summary.next.date), 'MMM d, yyyy')} (${summary.next.asset_name})`
                            : '-'
                    }
                />
                <StatCard
                    label="Quarterly Breakdown"
                    value={Object.entries(summary.byQuarter)
                        .map(([q, v]) => `${q}: €${Number(v || 0).toFixed(2)}`)
                        .join(' | ')}
                />
            </div>
        </div>
    )
}

function StatCard({ label, value }) {
    return (
        <div className="border rounded-lg p-3 bg-gray-50">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-base font-medium text-gray-800">{value}</div>
        </div>
    )
}
