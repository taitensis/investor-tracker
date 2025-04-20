import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useToast } from './ToastProvider'
import { TrashIcon } from '@heroicons/react/24/solid'

export default function PEA() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    setLoading(true)
    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      toast.error('❌ You must be logged in.')
      return
    }

    const { data, error } = await supabase
      .from('asset')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'pea')

    if (error) {
      toast.error('❌ Failed to fetch PEA assets.')
    } else {
      setAssets(data)
    }

    setLoading(false)
  }

  const handleDelete = async (asset) => {
    setAssets((prev) => prev.filter((a) => a.id !== asset.id))

    toast(`🗑️ Deleted "${asset.name}"`, {
      type: 'error',
      onUndo: async () => {
        const { error } = await supabase.from('asset').insert([asset])
        if (!error) {
          toast.success('Undo complete.')
          fetchAssets()
        }
      },
    })

    await supabase.from('asset').delete().eq('id', asset.id)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (assets.length === 0) return <p className="text-gray-500">No PEA assets found.</p>

  return (
    <table className="w-full text-sm text-left border-separate border-spacing-y-2">
      <thead>
        <tr className="text-gray-600 dark:text-gray-300">
          <th className="px-2">ISIN</th>
          <th className="px-2">Name</th>
          <th className="px-2">Currency</th>
          <th className="px-2">Symbol</th>
          <th className="px-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr
            key={asset.id}
            className="bg-gray-100 dark:bg-gray-800 rounded shadow-sm"
          >
            <td className="px-2 py-1">{asset.isin}</td>
            <td className="px-2 py-1">{asset.name}</td>
            <td className="px-2 py-1">{asset.currency}</td>
            <td className="px-2 py-1">{asset.ls_path || '-'}</td>
            <td className="px-2 py-1 text-right">
              <button
                onClick={() => handleDelete(asset)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4 inline-block" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
