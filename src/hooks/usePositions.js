// hooks/usePositions.js
import { useEffect, useState } from 'react'
import { fetchTradesByUser } from '../utils/supabaseQueries'
import { buildPositionsFromTrades } from '../utils/portfolioUtils'
import { getLsPrice } from '../services/price/getLsPrice'
import { supabase } from '../supabaseClient'

export function usePositions() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const user = (await supabase.auth.getUser()).data.user
      const trades = await fetchTradesByUser(user.id)
      const results = await buildPositionsFromTrades(trades, getLsPrice)
      setPositions(results)
      setLoading(false)
    }
    load()
  }, [])

  return { positions, loading }
}