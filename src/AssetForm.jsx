import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useToast } from './ToastProvider'

export default function AssetForm( { onSubmit }) {
  const [isin, setIsin] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [lsSymbol, setLsSymbol] = useState('')
  const [types, setTypes] = useState([])

  const toast = useToast()

  // Fetch asset types from lookup table
  useEffect(() => {
    const fetchAssetTypes = async () => {
      const { data, error } = await supabase.from('asset_type').select('id')
      if (error) {
        toast.error('❌ Failed to fetch asset types.')
      } else {
        setTypes(data)
      }
    }

    fetchAssetTypes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isin || !name || !type) {
      toast.warn('⚠️ ISIN, name, and type are required.')
      return
    }

    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      toast.error('❌ You must be logged in to add assets.')
      return
    }

    const payload = {
      user_id: user.id,
      isin,
      name,
      type,
      currency,
      ls_path: lsSymbol,
    }

    console.log('Payload being sent:', payload)

    try {
      const { error } = await supabase.from('asset').insert([payload])
      if (error) {
        toast.error(`❌ Failed to add asset: ${error.message}`)
      } else {
        toast.success('✅ Asset added successfully.')
        setIsin('')
        setName('')
        setType('')
        setCurrency('EUR')
        setLsSymbol('')
        onSubmit?.()
      }
    } catch (err) {
      toast.error('❌ Unexpected error.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded bg-white shadow space-y-2 max-w-md">
      <h3 className="text-lg font-semibold">Add Asset</h3>

      <input className="w-full border p-2 rounded" placeholder="ISIN" value={isin} onChange={(e) => setIsin(e.target.value)} required />
      <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />

      <select className="w-full border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="" disabled>Select asset type</option>
        {types.map(({ id }) => (
          <option key={id} value={id}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </option>
        ))}
      </select>

      <input className="w-full border p-2 rounded" placeholder="Currency (e.g. EUR)" value={currency} onChange={(e) => setCurrency(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="LS Symbol (optional)" value={lsSymbol} onChange={(e) => setLsSymbol(e.target.value)} />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Add Asset
      </button>
    </form>
  )
}
