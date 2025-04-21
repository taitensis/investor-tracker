import PerformanceSummary from '@components/dashboard/PerformanceSummary'
import LineChart from '@components/ui/LineChart'
import { supabase } from '@/supabaseClient'
import { getLineChartData } from '@utils/chartData'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [trades, setTrades] = useState([])

  useEffect(() => {
    const fetchTrades = async () => {
      const user = (await supabase.auth.getUser()).data.user

      const { data: tradeData } = await supabase
        .from('trade')
        .select('*')
        .eq('user_id', user.id)

      setTrades(tradeData || [])
    }

    fetchTrades()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold"> Dashboard</h2>
      <PerformanceSummary />
      {trades.length > 0 ? (
        <LineChart
          title="Portfolio Performance"
          data={getLineChartData(trades)}
          lines={[
            {
              key: 'market_value',
              color: '#3b82f6',
              label: 'Market Value (€)',
            },
            { key: 'pnl', color: '#16a64a', label: 'PnL (€)' },
          ]}
        />
      ) : (
        <p className="text-gray-500">Loading performance data...</p>
      )}
    </div>
  )
}
