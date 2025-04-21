import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useToast } from './ToastProvider'

export default function TradeList({ accountId, onEdit, refreshKey }) {
  const [trades, setTrades] = useState([])
  const toast = useToast()

  useEffect(() => {
    const loadTrades = async () => {
      const user = (await supabase.auth.getUser()).data.user
      const { data } = await supabase
        .from('trade')
        .select('*, asset(*)')
        .eq('user_id', user.id)
        .eq('account_id', accountId)
        .order('date', { ascending: false })

      if (data) setTrades(data)
    }

    if (accountId) loadTrades()
  }, [accountId, refreshKey])

  const handleDelete = async (id) => {
    // Optimistic UI: remove first
    const updated = trades.filter((t) => t.id !== id)
    setTrades(updated)

    const { error } = await supabase.from('trade').delete().eq('id', id)

    if (error) {
      toast.error('❌ Failed to delete trade.')
      // Rollback
      setTrades(trades)
    } else {
      toast.success('✅ Trade deleted.')
    }
  }

  if (!trades.length) return <p className="text-gray-600">No trades yet.</p>

  return (
    <div className="space-y-2">
      {trades.map((trade) => (
        <div key={trade.id} className="p-3 border rounded bg-white shadow-sm flex justify-between items-center">
          <div>
            <div className="font-semibold">{trade.asset?.isin} - {trade.asset?.name || 'Unknown Asset'}</div>
            <div className="text-sm text-gray-600">
              {trade.action} {trade.quantity} @ {trade.price_per_unit} on {trade.date}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(trade)}
                className="text-sm text-blue-600 underline"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(trade.id)}
              className="text-sm text-red-600 underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}