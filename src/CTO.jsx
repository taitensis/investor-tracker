import { useEffect, useState } from 'react'
import TradeForm from './TradeForm'
import TradeList from './TradeList'
import { supabase } from './supabaseClient'

export default function CTO() {
  const [ctoAccount, setCtoAccount] = useState(null)
  const [assets, setAssets] = useState([])
  const [initialTrade, setInitialTrade] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadCTO = async () => {
      const user = (await supabase.auth.getUser()).data.user
      const { data: accounts } = await supabase
        .from('account')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'CTO')
        .limit(1)

      if (accounts?.length > 0) {
        setCtoAccount(accounts[0])
      }
    }

    const loadAssets = async () => {
      const { data } = await supabase.from('asset').select('*')
      if (data) setAssets(data)
    }

    loadCTO()
    loadAssets()
  }, [])

  if (!ctoAccount || !assets.length) return <p className="text-gray-600">Loading CTO account…</p>

  return (
    <div className="space-y-6 bg-gray-50 rounded-xl border shadow-lg">
      <h2 className="text-2xl font-bold">CTO</h2>

      <TradeForm
        accounts={[ctoAccount]}
        assets={assets}
        initialTrade={initialTrade}
        onCreated={() => {
          setInitialTrade(null)
          setRefreshKey(prev => prev + 1) // 🔁 trigger list reload
        }}
      />

      <TradeList
        accountId={ctoAccount.id}
        onEdit={setInitialTrade}
        refreshKey={refreshKey} // pass it down
      />
    </div>
  )
}
