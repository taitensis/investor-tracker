import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useToast } from '../../components/toast/ToastProvider'

export default function AutoSnapshot() {
  const toast = useToast()
  const [ran, setRan] = useState(false)

  useEffect(() => {
    const runSnapshot = async () => {
      console.log('🟡 AutoSnapshot is running...')

      const today = new Date().toISOString().split('T')[0]
      const userResponse = await supabase.auth.getUser()
      const user = userResponse?.data?.user

      if (!user) {
        console.error('❌ No user found.')
        return
      }

      const { data: existing, error: existingError } = await supabase
        .from('position_snapshot')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .limit(1)

      if (existingError) {
        console.error('❌ Error checking snapshot existence:', existingError)
        return
      }

      if (existing?.length) {
        console.log('✅ Snapshot already exists. Exiting.')
        return
      }

      toast.info('📸 Auto-saving snapshot…')

      const { data: trades, error: tradeError } = await supabase
        .from('trade')
        .select('*, asset(*)')
        .eq('user_id', user.id)

      if (tradeError || !trades) {
        console.error('❌ Could not load trades.', tradeError)
        toast.error('❌ Could not load trades.')
        return
      }

      const grouped = {}
      for (const trade of trades) {
        const accId = trade.account_id
        const asset = trade.asset
        if (!asset || !asset.ls_symbol) continue
        if (!grouped[accId]) grouped[accId] = []
        grouped[accId].push(trade)
      }

      const fetchPrice = async (ls_symbol) => {
        try {
          const res = await fetch('/functions/v1/get-ls-price', {
            method: 'POST',
            body: JSON.stringify({ ls_symbol }),
            headers: { 'Content-Type': 'application/json' },
          })
          const json = await res.json()
          return json?.price ?? null
        } catch (e) {
          console.error('❌ Failed to fetch price for', ls_symbol, e)
          return null
        }
      }

      const snapshots = []

      for (const account_id in grouped) {
        let totalCost = 0
        let totalValue = 0

        for (const trade of grouped[account_id]) {
          const qty = trade.quantity
          const avg = trade.price_per_unit
          const ls_symbol = trade.asset?.ls_symbol

          const price = await fetchPrice(ls_symbol)
          if (!price) continue

          totalCost += qty * avg
          totalValue += qty * price
        }

        snapshots.push({
          user_id: user.id,
          account_id,
          date: today,
          average_cost: totalCost,
          market_value: totalValue,
          pnl: totalValue - totalCost,
        })
      }

      console.log('📤 Snapshot payload:', snapshots)

      const { error: insertError } = await supabase
        .from('position_snapshot')
        .insert(snapshots)

      if (insertError) {
        console.error('❌ Failed to insert snapshot:', insertError)
        toast.error('❌ Failed to save snapshot.')
      } else {
        toast.success('✅ Snapshot auto-saved!')
      }
    }

    if (!ran) {
      runSnapshot()
      setRan(true)
    }
  }, [ran, toast])

  return null
}
