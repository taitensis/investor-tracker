import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { getLsPrice } from './lsPrice'

export default function PositionList() {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    const loadPositions = async () => {
      const user = (await supabase.auth.getUser()).data.user

      const { data: trades } = await supabase
        .from('trade')
        .select(`
          action,
          quantity,
          price_per_unit,
          asset (id, isin, name, type, ls_path),
          account (name, type)
        `)
        .eq('user_id', user.id)

      const map = {}

      for (const trade of trades) {
        const key = `${trade.account.name}-${trade.asset.id}`
        if (!map[key]) {
          map[key] = {
            asset: trade.asset,
            account: trade.account,
            quantity: 0,
            totalCost: 0
          }
        }

        const qty = parseFloat(trade.quantity)
        const price = parseFloat(trade.price_per_unit)

        if (trade.action === 'buy') {
          map[key].quantity += qty
          map[key].totalCost += qty * price
        } else {
          map[key].quantity -= qty
          map[key].totalCost -= qty * price
        }
      }

      const results = await Promise.all(
        Object.values(map).map(async (pos) => {
          let marketPrice = null
          let currency = 'EUR'

          try {
            marketPrice = await getLsPrice(pos.asset)
          } catch (e) {
            console.warn(`Failed LS price fetch for ${pos.asset.name}`)
          }

          const marketValue = marketPrice ? (pos.quantity * marketPrice).toFixed(2) : '-'
          const pnl = marketPrice ? (marketValue - pos.totalCost).toFixed(2) : '-'

          return {
            ...pos,
            averageCost: pos.quantity > 0 ? (pos.totalCost / pos.quantity).toFixed(2) : '-',
            marketPrice,
            currency,
            marketValue,
            pnl
          }
        })
      )

      setPositions(results)
    }

    loadPositions()
  }, [])

  return (
    


    <div className="p-4 max-w-4xl mx-auto mt-6">
      <h3 className="text-xl font-bold mb-4">Current Positions</h3>
      {positions.length === 0 ? (
        <p>No holdings yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Account</th>
              <th className="p-2">Asset</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Avg Cost</th>
              <th className="p-2">Price</th>
              <th className="p-2">Value</th>
              <th className="p-2">P&L</th>
              <th className="p-2">LS Link</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{pos.account.name}</td>
                <td className="p-2">{pos.asset.isin} – {pos.asset.name}</td>
                <td className="p-2">{pos.quantity.toFixed(2)}</td>
                <td className="p-2">€{pos.averageCost}</td>
                <td className="p-2">{pos.marketPrice ? `€${pos.marketPrice}` : '-'}</td>
                <td className="p-2">{pos.marketValue !== '-' ? `€${pos.marketValue}` : '-'}</td>
                <td className="p-2">{pos.pnl !== '-' ? `€${pos.pnl}` : '-'}</td>
                <td className="p-2">
                  {pos.asset.ls_path ? (
                    <a
                      href={`https://www.ls-tc.de/de/${pos.asset.type === 'ETF' ? 'etf' : 'aktie'}/${pos.asset.ls_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
