import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import AssetForm from './AssetForm'
import TradeForm from './TradeForm'
import TradeList from './TradeList'
import PositionList from './PositionList'

export default function Dashboard({ user }) {
    const [accounts, setAccounts] = useState([])
  
    const loadAccounts = async () => {
      const { data, error } = await supabase
        .from('account')
        .select('*')
        .eq('user_id', user.id)
      if (!error) setAccounts(data)
    }
  
    useEffect(() => {
      loadAccounts()
    }, [])
  
    return (
      <div className="p-4">
        <h1 className="text-xl mb-4">Welcome</h1>
        <button
  onClick={async () => {
    const price = await getPriceFromGettex('US0378331005')
    alert(`Current price: €${price ?? 'Unavailable'}`)
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
>
  Test Gettex Price (Apple)
</button>

        <button onClick={() => supabase.auth.signOut()} className="mb-4 text-red-600">Log Out</button>
  
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Your Accounts</h2>
          <ul className="space-y-2 mt-2">
            {accounts.map(acc => (
              <li key={acc.id} className="p-2 border rounded">
                {acc.name}
              </li>
            ))}
          </ul>
        </div>
        <AssetForm />
        <TradeForm />
        <TradeList />
        <PositionList />
      </div>
    )
  }