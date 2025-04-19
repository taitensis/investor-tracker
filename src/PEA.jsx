import { useEffect, useState } from 'react'
import TradeForm from './TradeForm'
import TradeList from './TradeList'
import { supabase } from './supabaseClient'

export default function PEA() {
  const [peaAccount, setPeaAccount] = useState(null)
  const [assets, setAssets] = useState([])
  const [initialTrade, setInitialTrade] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadPEA = async () => {
      const user = (await supabase.auth.getUser()).data.user
      const { data: accounts } = await supabase
        .from('account')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'PEA')
        .limit(1)

      if (accounts?.length > 0) {
        setPeaAccount(accounts[0])
      }
    }

    const loadAssets = async () => {
      const { data } = await supabase.from('asset').select('*')
      if (data) setAssets(data)
    }

    loadPEA()
    loadAssets()
  }, [])

  if (!peaAccount || !assets.length) return <p className="text-gray-600">Loading PEA account…</p>

  return (
    <div className="space-y-6 bg-gray-50 rounded-xl border shadow-lg">
      <h2 className="text-2xl font-bold">PEA</h2>

      <TradeForm
        accounts={[peaAccount]}
        assets={assets}
        initialTrade={initialTrade}
        onCreated={() => {
          setInitialTrade(null)
          setRefreshKey(prev => prev + 1) // 🔁 trigger list reload
        }}
      />

      <TradeList
        accountId={peaAccount.id}
        onEdit={setInitialTrade}
        refreshKey={refreshKey} // pass it down
      />
    </div>
  )
}
