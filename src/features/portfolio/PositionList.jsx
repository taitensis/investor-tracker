import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { fetchMarketPrice } from '@/services/price'
import { Card } from '../../components/ui/Card'
import {
  buildPositionsFromTrades,
  buildLsLink,
} from '../../utils/portfolioUtils'
import { fetchTradesByUser } from '../../utils/supabaseQueries'

export default function PositionList() {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    const loadPositions = async () => {
      const user = (await supabase.auth.getUser()).data.user
      const trades = await fetchTradesByUser(user.id)
      const results = await buildPositionsFromTrades(trades, fetchMarketPrice)
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
        <div className="grid gap-4">
          {positions.map((pos, i) => (
            <Card key={i} className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {/* <div className="text-sm text-gray-500">{pos.account.name}</div> */}
                <div className="font-medium">
                  {/* {pos.asset.isin} – */}{pos.asset.name}
                </div>
                <div>{pos.marketValue !== '-' ? `€${pos.marketValue}` : '-'}</div>
                {/* <div className="text-sm text-gray-500 capitalize">{pos.asset.type}</div> */}
              </div>

              <div className="text-sm space-y-1">
                {/* <div>Qty: <strong>{pos.quantity.toFixed(2)}</strong></div> */}
                {/* <div>Avg Cost: <strong>€{pos.averageCost}</strong></div> */}
                {/* <div>Price: <strong>{pos.marketPrice ? `€${pos.marketPrice}` : '-'}</strong></div> */}
                {/* <div>Value: <strong>{pos.marketValue !== '-' ? `€${pos.marketValue}` : '-'}</strong></div> */}
                <div>
                  P&amp;L:{" "}
                  {pos.percentChange !== null ? (
                    <strong className={parseFloat(pos.pnl) < 0 ? "text-red-600" : "text-green-600"}>
                      {pos.percentChange}%
                    </strong>
                  ) : (
                    "-"
                  )}
                </div>
                {/* <div>
                  LS Link:{" "}
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
                    "-"
                  )}
                </div> */}
              </div>
            </Card>
          ))}
        </div>
      )
      }
    </div >
  )
}
