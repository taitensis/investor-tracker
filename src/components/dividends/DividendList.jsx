// src/components/dividends/DividendList.jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient'

export default function DividendList() {
    const [dividends, setDividends] = useState([])

    useEffect(() => {
        const loadDividends = async () => {
            const user = (await supabase.auth.getUser()).data.user

            const { data, error } = await supabase
                .from('trade')
                .select(`
    id, date, quantity, price_per_unit, total,
    asset (name)
  `)
                .eq('user_id', user.id)
                .eq('action', 'dividend')
                .order('date', { ascending: false })

            if (error) console.error('Dividend fetch failed:', error)


            setDividends(data || [])
        }

        loadDividends()
    }, [])

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Asset</th>
                        <th className="p-2 text-left">Qty</th>
                        <th className="p-2 text-left">€/Share</th>
                        <th className="p-2 text-left">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {dividends.map((d) => (
                        <tr key={d.id}>
                            <td className="p-2">{d.date}</td>
                            <td className="p-2">{d.asset?.name || '-'}</td>
                            <td className="p-2">{d.quantity}</td>
                            <td className="p-2">€{d.price_per_unit?.toFixed(2)}</td>
                            <td className="p-2 font-medium text-green-600">€{d.total?.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
