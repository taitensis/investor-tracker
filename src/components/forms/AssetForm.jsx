import { useState, useEffect } from 'react'
import { supabase } from '@supabase/auth-ui-shared'
import { useToast } from '../toast/ToastProvider'

export default function AssetForm({ onSubmit }) {
  const [isin, setIsin] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [lsSymbol, setLsSymbol] = useState('')
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(false)

  const toast = useToast()

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

    setLoading(true)
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
        onSubmit?.() // 🔥 call parent handler
      }
    } catch (err) {
      toast.error('❌ Unexpected error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
      <input
        className="w-full border p-2 rounded"
        placeholder="ISIN"
        value={isin}
        onChange={(e) => setIsin(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        className="w-full border p-2 rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      >
        <option value="" disabled>Select asset type</option>
        {types.map(({ id }) => (
          <option key={id} value={id}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </option>
        ))}
      </select>

      <input
        className="w-full border p-2 rounded"
        placeholder="Currency (e.g. EUR)"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="LS Symbol (optional)"
        value={lsSymbol}
        onChange={(e) => setLsSymbol(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {loading ? 'Adding...' : 'Add Asset'}
      </button>
    </form>
  )
}
