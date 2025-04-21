// hooks/useAuth.js
import { useState, useEffect } from 'react'
import { supabase } from '@/supabaseClient'

export default function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            listener?.subscription?.unsubscribe()
        }
    }, [])

    return { user, loading }
}
