
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useToast } from './ToastProvider'

export default function BackfillSnapshots() {
  const toast = useToast()
  const [ran, setRan] = useState(false)

  useEffect(() => {
    const backfill = async () => {
      toast.info('📦 Starting backfill (deep date debug)...')

      const userResponse = await supabase.auth.getUser()
      const user = userResponse?.data?.user
      if (!user) {
        toast.error('❌ User not authenticated.')
        return
      }

      const { data: trades, error: tradeError } = await supabase
        .from('trade')
        .select('*, asset(*)')
        .eq('user_id', user.id)

      if (tradeError || !trades?.length) {
        toast.error('❌ Failed to load trades.')
        console.error(tradeError)
        return
      }

      console.log("📦 Raw trade dates:")
      trades.forEach((t) => console.log(t.date))

      const { data: prices, error: priceError } = await supabase
        .from('historical_price')
        .select('*')

      if (priceError || !prices?.length) {
        toast.error('❌ Failed to load historical prices.')
        console.error("❌ priceError:", priceError)
        return
      }

      const priceMap = {}
      for (const row of prices) {
        const key = row.date + '|' + row.isin
        priceMap[key] = parseFloat(row.price)
      }

      const allDates = Array.from(new Set(prices.map(p => p.date))).sort()

      const tradeDates = trades
        .map(t => {
          try {
            const parsed = new Date(t.date)
            const iso = parsed.toISOString()
            console.log("🔍 Parsed trade date:", t.date, "→", iso)
            return iso.slice(0, 10)
          } catch (err) {
            console.error("❌ Failed to parse trade date:", t.date, err)
            return null
          }
        })
        .filter(Boolean)
        .sort()

      const firstTradeDate = tradeDates[0] || null

      console.log("📅 All trade dates (parsed):", tradeDates)
      console.log("📅 First trade date:", firstTradeDate)

      if (!firstTradeDate) {
        toast.error("⚠️ No valid trade dates to backfill.")
        return
      }

      const filteredDates = allDates.filter(d => d >= firstTradeDate)
      const snapshots = []

      for (const date of filteredDates) {
        console.log("\n📅 Evaluating date:", date)

        const tradesUpToDate = trades.filter(t => {
          const d = t.date ? new Date(t.date).toISOString().slice(0, 10) : null
          return d && d <= date && d <= new Date().toISOString().slice(0, 10)
        })
        console.log("🧾 Trades considered:", tradesUpToDate.length)

        const grouped = {}
        for (const trade of tradesUpToDate) {
          const accId = trade.account_id
          const assetId = trade.asset_id
          const isin = trade.asset?.isin
          if (!isin) continue

          if (!grouped[accId]) grouped[accId] = {}
          if (!grouped[accId][assetId]) grouped[accId][assetId] = []
          grouped[accId][assetId].push(trade)
        }

        for (const account_id in grouped) {
          let totalCost = 0
          let totalValue = 0

          for (const asset_id in grouped[account_id]) {
            const assetTrades = grouped[account_id][asset_id]
            const asset = assetTrades[0].asset
            const isin = asset?.isin
            const price = priceMap[date + '|' + isin]

            if (!price) {
              console.log("❌ Missing price for", isin, "on", date)
              continue
            }

            let qty = 0
            let cost = 0

            for (const trade of assetTrades) {
              const q = trade.action === 'buy' ? trade.quantity : -trade.quantity
              qty += q
              cost += q * trade.price_per_unit
            }

            console.log("📦 ISIN:", isin, "Qty:", qty, "Price:", price, "Cost:", cost)

            if (qty <= 0) {
              console.log("⚠️ Skipping asset with 0 qty:", isin)
              continue
            }

            totalCost += cost
            totalValue += qty * price
          }

          if (totalValue > 0 || totalCost > 0) {
            snapshots.push({
              user_id: user.id,
              account_id,
              date,
              market_value: totalValue,
              average_cost: totalCost,
              pnl: totalValue - totalCost
            })
            console.log("✅ Snapshot prepared for account", account_id, "on", date)
          } else {
            console.log("⏭️ Skipped snapshot for account", account_id, "on", date)
          }
        }
      }

      console.log("📤 Snapshot payload:", snapshots)

      if (!snapshots.length) {
        toast.error('⚠️ No snapshots to insert.')
        return
      }

      const { error: insertError } = await supabase
        .from('position_snapshot')
        .insert(snapshots)

      if (insertError) {
        console.error('❌ Failed to insert snapshots:', insertError)
        toast.error('❌ Error saving snapshots.')
      } else {
        toast.success(`✅ Backfilled ${snapshots.length} snapshots!`)
      }
    }

    if (!ran) {
      backfill()
      setRan(true)
    }
  }, [ran])

  return null
}
