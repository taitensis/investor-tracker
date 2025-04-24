// src/components/forms/DividendForm.jsx
import { useState, useEffect } from 'react'
import { supabase } from '@/supabaseClient'
import { Button, buttonVariants } from '@/components/ui/button'

export default function DividendForm() {
  const [assets, setAssets] = useState([])
  const [assetId, setAssetId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [date, setDate] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = (await supabase.auth.getUser()).data.user

    await supabase.from('trade').insert([
      {
        user_id: user.id,
        asset_id: assetId,
        action: 'dividend',
        quantity: parseFloat(quantity),
        price_per_unit: parseFloat(pricePerUnit),
        total: parseFloat(quantity) * parseFloat(pricePerUnit),
        date,
      },
    ])

    setAssetId('')
    setQuantity('')
    setPricePerUnit('')
    setDate('')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Asset</label>
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="w-full border rounded p-2"
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
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">€/Share</label>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
      </div>
      <Button type="submit">Save Dividend</Button>
    </form>
  )
}
