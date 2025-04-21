import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import LineChart from '@components/ui/LineChart'
import {
    getForecastedDividends,
    getMonthlyDividendMap,
} from '@utils/dividendForecast'

export default function DividendForecastPanel() {
    const [data, setData] = useState({ forecast: [], monthlyMap: {} })

    useEffect(() => {
        const fetchData = async () => {
            const user = (await supabase.auth.getUser()).data.user

            // Fetch all trades to get current holdings
            const { data: trades } = await supabase
                .from('trade')
                .select(`
          action, quantity, asset_id, asset (id, name)
        `)
                .eq('user_id', user.id)

            // Aggregate holdings
            const map = {}
            for (const t of trades) {
                if (!map[t.asset_id]) {
                    map[t.asset_id] = {
                        asset_id: t.asset_id,
                        asset_name: t.asset.name,
                        shares: 0,
                    }
                }

                const qty = parseFloat(t.quantity)
                if (t.action === 'buy') map[t.asset_id].shares += qty
                else if (t.action === 'sell') map[t.asset_id].shares -= qty
            }

            const holdings = Object.values(map).filter((h) => h.shares > 0)

            // Fetch dividend schedule
            const { data: schedules } = await supabase
                .from('dividend_schedule')
                .select('*')
                .eq('user_id', user.id)

            const forecast = getForecastedDividends({ holdings, schedules })
            const monthlyMap = getMonthlyDividendMap(forecast)

            setData({ forecast, monthlyMap })
        }

        fetchData()
    }, [])

    const chartData = Object.entries(data.monthlyMap).map(([month, amount]) => ({
        date: month,
        amount: amount.toFixed(2),
    }))

    return (
        <div className="bg-white p-4 rounded shadow mt-6">
            <h3 className="text-lg font-semibold mb-2">Projected Dividends (Next 12 Months)</h3>
            {chartData.length > 0 ? (
                <LineChart
                    title=""
                    data={chartData}
                    lines={[{ key: 'amount', label: 'Income (€)' }]}
                />
            ) : (
                <p className="text-sm text-gray-500">No forecast data available.</p>
            )}
        </div>
    )
}
