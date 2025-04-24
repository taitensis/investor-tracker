import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { format } from 'date-fns'
import DividendScheduleForm from '@components/forms/DividendScheduleForm'
import DividendForecastPanel from '../forms/DividendScheduleForm'

export default function DividendScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [editing, setEditing] = useState(null)

  const loadSchedules = async () => {
    const user = (await supabase.auth.getUser()).data.user

    const { data, error } = await supabase
      .from('dividend_schedule')
      .select(
        `
        *,
        asset:asset_id ( name )
      `
      )
      .eq('user_id', user.id)

    if (!error) {
      setSchedules(data)
    } else {
      console.error('Failed to fetch schedules:', error)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('dividend_schedule')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting schedule:', error)
    else await loadSchedules()
  }

  useEffect(() => {
    loadSchedules()
  }, [])

  return (
    <div className="space-y-6">
      <DividendScheduleForm
        initialData={editing}
        onSave={() => {
          setEditing(null)
          loadSchedules()
        }}
      />

      <div className="text-lg font-semibold">Your Dividend Schedules</div>

      {schedules.length === 0 ? (
        <p className="text-gray-500 text-sm">No dividend schedules found.</p>
      ) : (
        <table className="w-full text-sm border rounded shadow bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Asset</th>
              <th className="p-2">Dividend</th>
              <th className="p-2">Frequency</th>
              <th className="p-2">Next Payment</th>
              <th className="p-2">Currency</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2">
                  {row.asset?.name || 'Unknown'} ({row.asset?.symbol})
                </td>
                <td className="p-2">{row.dividend_per_share}</td>
                <td className="p-2 capitalize">{row.payment_frequency}</td>
                <td className="p-2">
                  {format(new Date(row.next_payment_date), 'MMM d, yyyy')}
                </td>
                <td className="p-2">{row.currency}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-blue-600 text-xs underline"
                    onClick={() => setEditing(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 text-xs underline"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
