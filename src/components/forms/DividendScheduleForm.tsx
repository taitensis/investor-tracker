import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'
import { Button, buttonVariants } from '@/components/ui/button'

const frequencies = ['monthly', 'quarterly', 'semi-annual', 'annual']

export default function DividendScheduleForm({ initialData = null, onSave }) {
  const [assets, setAssets] = useState([])
  const [assetId, setAssetId] = useState('')
  const [dividend, setDividend] = useState('')
  const [frequency, setFrequency] = useState('quarterly')
  const [nextDate, setNextDate] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchAssets = async () => {
      const user = (await supabase.auth.getUser()).data.user
      const { data } = await supabase
        .from('asset')
        .select('*')
        .eq('user_id', user.id)
      setAssets(data || [])
    }

    fetchAssets()
  }, [])

  useEffect(() => {
    if (initialData) {
      setAssetId(initialData.asset_id)
      setDividend(initialData.dividend_per_share)
      setFrequency(initialData.payment_frequency)
      setNextDate(initialData.next_payment_date)
      setCurrency(initialData.currency)
      setIsEditing(true)
    } else {
      resetForm()
    }
  }, [initialData])

  const resetForm = () => {
    setAssetId('')
    setDividend('')
    setFrequency('quarterly')
    setNextDate('')
    setCurrency('EUR')
    setIsEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = (await supabase.auth.getUser()).data.user

    let result
    if (isEditing) {
      result = await supabase
        .from('dividend_schedule')
        .update({
          dividend_per_share: parseFloat(dividend),
          payment_frequency: frequency,
          next_payment_date: nextDate,
          currency,
        })
        .eq('id', initialData.id)
        .eq('user_id', user.id)
    } else {
      result = await supabase.from('dividend_schedule').insert([
        {
          user_id: user.id,
          asset_id: assetId,
          dividend_per_share: parseFloat(dividend),
          payment_frequency: frequency,
          next_payment_date: nextDate,
          currency,
        },
      ])
    }

    if (result.error) {
      console.error('Error saving dividend schedule:', result.error)
    } else {
      resetForm()
      if (onSave) onSave() // Notify parent to refresh
    }
  }

  return (
    <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
      <div className="text-lg font-semibold">
        {isEditing ? 'Edit Dividend Schedule' : 'Add Dividend Schedule'}
      </div>

      <div>
        <label className="block text-sm font-medium">Asset</label>
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="w-full border rounded p-2"
          disabled={isEditing}
          required
        >
          <option value="">Select asset</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">
            Dividend per share
          </label>
          <input
            type="number"
            step="0.01"
            value={dividend}
            onChange={(e) => setDividend(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border rounded p-2"
          >
            {frequencies.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Next Payment Date</label>
          <input
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded p-2"
          >
            {['EUR', 'USD', 'GBP'].map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit">
          {isEditing ? 'Update Schedule' : 'Save Schedule'}
        </Button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded border text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
