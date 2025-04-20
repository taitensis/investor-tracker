
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { SupabaseClient } from '@supabase/supabase-js'
import { useToast } from '../../components/toast/ToastProvider'

export default function PnLChart({ accountId = null }) {
  const [data, setData] = useState([])
  const toast = useToast()

  useEffect(() => {
    const loadData = async () => {
      toast.info('📈 Loading chart data...')
      const user = (await supabase.auth.getUser()).data.user

      let query = supabase
        .from('position_snapshot')
        .select('date, market_value, pnl')
        .eq('user_id', user.id)

      if (accountId) query = query.eq('account_id', accountId)

      const { data, error } = await query

      if (error) {
        toast.error('❌ Failed to load chart data')
        console.error("📉 Supabase error:", error)
        return
      }

      // Group by date and sum values
      const grouped = {}
      for (const row of data) {
        const date = row.date
        if (!grouped[date]) {
          grouped[date] = { date, market_value: 0, pnl: 0 }
        }
        grouped[date].market_value += parseFloat(row.market_value || 0)
        grouped[date].pnl += parseFloat(row.pnl || 0)
      }

      const sorted = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))
      console.log("✅ Chart data loaded:", sorted)
      setData(sorted)
    }

    loadData()
  }, [accountId])

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-2">📈 Portfolio Over Time</h3>
      {data.length === 0 && (
        <p className="text-sm text-gray-500 italic">No chart data available yet.</p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB')}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="market_value"
            stroke="#3b82f6"
            name="Market Value (€)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#16a34a"
            name="PnL (€)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
