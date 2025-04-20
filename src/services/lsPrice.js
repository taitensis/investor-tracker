import { supabase } from '../supabaseClient'

export async function getLsPrice(asset) {
  try {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token

    if (!token) {
      console.warn('No user token found, not authenticated.')
      return null
    }

    const res = await fetch('https://gggnrmwishakhoxjbvdp.functions.supabase.co/get-ls-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ls_path: asset.ls_path,
        type: asset.type
      })
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Unknown error')

    return json.price ?? null
  } catch (e) {
    console.warn(`LS price fetch failed for ${asset.name}:`, e.message)
    return null
  }
}
