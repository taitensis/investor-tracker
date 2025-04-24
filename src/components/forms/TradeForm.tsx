// // TradeForm.jsx - For logging buy/sell trades using trade_action_enum
// import { useEffect, useState } from 'react'
// import { supabase } from '@/supabaseClient'
// import toast from 'react-hot-toast'

// export default function TradeForm({ onSubmit }) {
//   const [assetId, setAssetId] = useState('')
//   const [accountId, setAccountId] = useState('')
//   const [action, setAction] = useState('buy')
//   const [quantity, setQuantity] = useState('')
//   const [price, setPrice] = useState('')
//   const [fees, setFees] = useState('')
//   const [total, setTotal] = useState('')
//   const [date, setDate] = useState('')
//   const [notes, setNotes] = useState('')
//   const [tag, setTag] = useState('')
//   const [assets, setAssets] = useState([])
//   const [accounts, setAccounts] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: assetData } = await supabase.from('asset').select('id, name')
//       const { data: accountData } = await supabase.from('account').select('id, name')
//       setAssets(assetData || [])
//       setAccounts(accountData || [])
//     }
//     fetchData()
//   }, [])

//   useEffect(() => {
//     const q = parseFloat(quantity)
//     const p = parseFloat(price)
//     const f = parseFloat(fees || '0')
//     if (!isNaN(q) && !isNaN(p)) {
//       setTotal((q * p + f).toFixed(2))
//     }
//   }, [quantity, price, fees])

//   const validateForm = () => {
//     if (!quantity || quantity <= 0) return 'Quantity must be > 0'
//     if (!price || price <= 0) return 'Price must be > 0'
//     if (!assetId || !accountId || !date) return 'Please complete all required fields'
//     return null
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     const error = validateForm()
//     if (error) {
//       toast.error(error)
//       setLoading(false)
//       return
//     }

//     const user = (await supabase.auth.getUser()).data.user
//     const { error: insertError } = await supabase.from('trade').insert([
//       {
//         user_id: user.id,
//         asset_id: assetId,
//         account_id: accountId,
//         action,
//         quantity: parseFloat(quantity),
//         price_per_unit: parseFloat(price),
//         fees: parseFloat(fees || '0'),
//         total: parseFloat(total),
//         date,
//         notes,
//         tag
//       }
//     ])

//     if (insertError) {
//       toast.error('Failed to log trade.')
//     } else {
//       toast.success('Trade logged successfully.')
//       setAssetId('')
//       setAccountId('')
//       setAction('buy')
//       setQuantity('')
//       setPrice('')
//       setFees('')
//       setTotal('')
//       setDate('')
//       setNotes('')
//       setTag('')
//       onSubmit?.()
//     }
//     setLoading(false)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-4 bg-white shadow rounded">
//       <div className="grid grid-cols-[auto,1fr] gap-y-4 gap-x-4 items-center">
//         <label htmlFor="select-asset">Asset</label>
//         <select id="select-asset" className="w-full border p-2 rounded" value={assetId} onChange={(e) => setAssetId(e.target.value)} required>
//           <option value="">Select Asset</option>
//           {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//         </select>

//         <label htmlFor="select-account">Account</label>
//         <select id="select-account" className="w-full border p-2 rounded" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
//           <option value="">Select Account</option>
//           {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
//         </select>

//         <label htmlFor="select-action">Action</label>
//         <select id="select-action" className="w-full border p-2 rounded" value={action} onChange={(e) => setAction(e.target.value)} required>
//           <option value="buy">Buy</option>
//           <option value="sell">Sell</option>
//           <option value="dividend">Dividend</option>
//           <option value="deposit">Deposit</option>
//           <option value="withdrawal">Withdrawal</option>
//         </select>

//         <label htmlFor="select-quantity">Quantity</label>
//         <input id="select-quantity" type="number" step="0.01" className="w-full border p-2 rounded" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

//         <label htmlFor="price-per-unit">Price per Unit</label>
//         <input id="price-per-unit" type="number" step="0.01" className="w-full border p-2 rounded" placeholder="Price per Unit" value={price} onChange={(e) => setPrice(e.target.value)} />

//         <label htmlFor="fees">Fees</label>
//         <input id="fees" type="number" step="0.01" className="w-full border p-2 rounded" placeholder="Fees (optional)" value={fees} onChange={(e) => setFees(e.target.value)} />

//         <label htmlFor="total">Total</label>
//         <input id="total" type="number" step="0.01" className="w-full border p-2 rounded" placeholder="Total (auto-calculated)" value={total} readOnly />

//         <label htmlFor="select-date">Date</label>
//         <input id="select-date" type="date" className="w-full border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />

//         <label htmlFor="tag">Tag</label>
//         <input id="tag" className="w-full border p-2 rounded" placeholder="Tag (e.g. DCA, Earnings)" value={tag} onChange={(e) => setTag(e.target.value)} />

//         <label htmlFor="note">Note</label>
//         <textarea id="note" className="w-full border p-2 rounded" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
//       </div>

//       <button type="submit" disabled={loading} className="w-full mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//         {loading ? 'Saving...' : 'Log Trade'}
//       </button>
//     </form>

//   )
// }

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Props = {
  onSubmit?: () => void;
};

type Asset = { id: string; name: string };
type Account = { id: string; name: string };

export default function TradeForm({ onSubmit }: Props) {
  const [assetId, setAssetId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [action, setAction] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [fees, setFees] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [tag, setTag] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: assetData } = await supabase.from('asset').select('id, name');
      const { data: accountData } = await supabase.from('account').select('id, name');
      setAssets(assetData || []);
      setAccounts(accountData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const q = parseFloat(quantity);
    const p = parseFloat(price);
    const f = parseFloat(fees || '0');
    if (!isNaN(q) && !isNaN(p)) {
      setTotal((q * p + f).toFixed(2));
    }
  }, [quantity, price, fees]);

  const validateForm = (): string | null => {
    if (!quantity || parseFloat(quantity) <= 0) return 'Quantity must be > 0';
    if (!price || parseFloat(price) <= 0) return 'Price must be > 0';
    if (!assetId || !accountId || !date) return 'Please complete all required fields';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const error = validateForm();
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    const { error: insertError } = await supabase.from('trade').insert([
      {
        user_id: user.id,
        asset_id: assetId,
        account_id: accountId,
        action,
        quantity: parseFloat(quantity),
        price_per_unit: parseFloat(price),
        fees: parseFloat(fees || '0'),
        total: parseFloat(total),
        date,
        notes,
        tag,
      },
    ]);

    if (insertError) {
      toast.error('Failed to log trade.');
    } else {
      toast.success('Trade logged successfully.');
      setAssetId('');
      setAccountId('');
      setAction('buy');
      setQuantity('');
      setPrice('');
      setFees('');
      setTotal('');
      setDate('');
      setNotes('');
      setTag('');
      onSubmit?.();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="asset">Asset</Label>
          <select id="asset" className="w-full p-2 border rounded" value={assetId} onChange={(e) => setAssetId(e.target.value)} required>
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="account">Account</Label>
          <select id="account" className="w-full p-2 border rounded" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="">Select Account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="action">Action</Label>
          <select id="action" className="w-full p-2 border rounded" value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="dividend">Dividend</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="price">Price per Unit</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="fees">Fees</Label>
          <Input id="fees" type="number" step="0.01" value={fees} onChange={(e) => setFees(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="total">Total</Label>
          <Input id="total" type="number" value={total} readOnly />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="tag">Tag</Label>
        <Input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Log Trade'}
      </Button>
    </form>
  );
}
