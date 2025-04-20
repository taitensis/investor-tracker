// utils/supabaseQueries.js
import { supabase } from '../supabaseClient'

/**
 * Fetches all trades for a given user.
 * Includes joined asset and account info.
 */
export async function fetchTradesByUser(userId) {
  const { data, error } = await supabase
    .from('trade')
    .select(`
      action,
      quantity,
      price_per_unit,
      asset (id, isin, name, type, ls_path),
      account (name, type)
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data
}
