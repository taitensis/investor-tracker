import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { useToast } from './ToastProvider'

export default function TradeForm({
  accounts = [],
  assets = [],
  onCreated,
  initialTrade = null,
}) {
  const [accountId, setAccountId] = useState('')
  const [assetId, setAssetId] = useState('')
  const [date, setDate] = useState('')
  const [action, setAction] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [fees, setFees] = useState('')
  const [total, setTotal] = useState('')
  const [notes, setNotes] = useState('')
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [formReady, setFormReady] = useState(!initialTrade)

  const toast = useToast()

  useEffect(() => {
    if (initialTrade && accounts.length && assets.length) {
      setAccountId(String(initialTrade.account_id || ''))
      setAssetId(String(initialTrade.asset_id || ''))
      setDate(initialTrade.date || '')
      setAction(initialTrade.action || 'buy')
      setQuantity(String(initialTrade.quantity || ''))
      setPricePerUnit(String(initialTrade.price_per_unit || ''))
      setFees(String(initialTrade.fees || ''))
      setTotal(String(initialTrade.total || ''))
      setNotes(initialTrade.notes || '')
      setTag(initialTrade.tag || '')
      setFormReady(true)
    }
  }, [initialTrade, accounts, assets])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const user = (await supabase.auth.getUser()).data.user
    const payload = {
      user_id: user.id,
      account_id: accountId,
      asset_id: assetId,
      date,
      action,
      quantity: parseFloat(quantity),
      price_per_unit: parseFloat(pricePerUnit),
      fees: parseFloat(fees) || 0,
      total:
        parseFloat(total) || parseFloat(quantity) * parseFloat(pricePerUnit),
      notes,
      tag,
    }

    let error
    if (initialTrade) {
      const { error: updateError } = await supabase
        .from('trade')
        .update(payload)
        .eq('id', initialTrade.id)

      error = updateError
      if (!error) toast.success('Trade updated successfully.')
    } else {
      const { error: insertError } = await supabase
        .from('trade')
        .insert([payload])
      error = insertError
      if (!error) toast.success('Trade added successfully.')
    }

    if (!error) {
      setAccountId('')
      setAssetId('')
      setDate('')
      setAction('buy')
      setQuantity('')
      setPricePerUnit('')
      setFees('')
      setTotal('')
      setNotes('')
      setTag('')
      onCreated?.()
    } else {
      toast.error('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  if (!accounts.length || !assets.length || (initialTrade && !formReady)) {
    return <p className="text-center p-4 text-gray-500">Loading form data…</p>
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded space-y-2 bg-white shadow max-w-md mx-auto mt-6"
    >
      <h3 className="text-lg font-semibold">
        {initialTrade ? 'Edit Trade' : 'Log Trade'}
      </h3>

      <select
        className="w-full border p-2 rounded"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
      >
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={String(acc.id)}>
            {acc.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={assetId}
        onChange={(e) => setAssetId(e.target.value)}
        required
      >
        <option value="">Select Asset</option>
        {assets.map((a) => (
          <option key={a.id} value={String(a.id)}>
            {a.isin} – {a.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <select
        className="w-full border p-2 rounded"
        value={action}
        onChange={(e) => setAction(e.target.value)}
      >
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>

      <input
        type="number"
        step="0.01"
        className="w-full border p-2 rounded"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input
        type="number"
        step="0.01"
        className="w-full border p-2 rounded"
        placeholder="Price per Unit"
        value={pricePerUnit}
        onChange={(e) => setPricePerUnit(e.target.value)}
        required
      />
      <input
        type="number"
        step="0.01"
        className="w-full border p-2 rounded"
        placeholder="Fees"
        value={fees}
        onChange={(e) => setFees(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        className="w-full border p-2 rounded"
        placeholder="Total (optional)"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Tag (e.g. swing, long)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {loading ? 'Saving…' : initialTrade ? 'Save Changes' : 'Log Trade'}
      </button>
    </form>
  )
}
