import { useState, useEffect } from 'react'
import { supabase } from '@/supabaseClient'
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion'

const steps = ['Core Info', 'Dividends', 'Details', 'Diversification', 'Review']

export default function MultiStepAssetForm({ onSubmit }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [assetTypes, setAssetTypes] = useState([])
  const [availableSectors, setAvailableSectors] = useState([])
  const [availableRegions, setAvailableRegions] = useState([])

  useEffect(() => {
    const fetchTypesAndTags = async () => {
      const { data: types } = await supabase.from('asset_type').select('id')
      const { data: sectors } = await supabase.from('available_sectors').select('name')
      const { data: regions } = await supabase.from('available_regions').select('name')

      setAssetTypes(types?.map(d => d.id) || [])
      setAvailableSectors(sectors?.map(s => s.name) || [])
      setAvailableRegions(regions?.map(r => r.name) || [])
    }
    fetchTypesAndTags()
  }, [])

  const [form, setForm] = useState({
    name: '',
    type: '',
    currency: 'EUR',
    paysDividends: false,
    dividendPerShare: '',
    paymentFrequency: '',
    nextPaymentDate: '',
    isin: '',
    ticker: '',
    apiRef: '',
    urlHint: '',
    lsSymbol: '',
    region: '',
    sector: '',
    category: ''
  })

  const updateForm = (field, value) => setForm({ ...form, [field]: value })
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('You must be logged in.')

      // Log new sector if not exists
      if (form.sector && !availableSectors.includes(form.sector)) {
        await supabase.from('available_sectors').insert([{ name: form.sector }])
      }
      // Log new region if not exists
      if (form.region && !availableRegions.includes(form.region)) {
        await supabase.from('available_regions').insert([{ name: form.region }])
      }

      let dividendId = null
      if (form.paysDividends) {
        const { data, error } = await supabase.from('dividend_forecast')
          .insert([{
            dividend_per_share: parseFloat(form.dividendPerShare),
            payment_frequency: form.paymentFrequency,
            next_payment_date: form.nextPaymentDate,
            currency: form.currency
          }]).select().single()
        if (error) throw new Error('Failed to insert dividend data.')
        dividendId = data.id
      }

      const { data: details, error: detErr } = await supabase.from('asset_details')
        .insert([{
          isin: form.isin,
          ticker: form.ticker,
          api_ref: form.apiRef,
          url_hint: form.urlHint,
          ls_symbol: form.lsSymbol
        }]).select().single()
      if (detErr) throw new Error('Failed to insert details.')

      const { data: diversification, error: divErr } = await supabase.from('diversification')
        .insert([{
          region: form.region,
          sector: form.sector,
          category: form.category
        }]).select().single()
      if (divErr) throw new Error('Failed to insert diversification.')

      const { error: assetErr } = await supabase.from('asset')
        .insert([{
          user_id: user.id,
          name: form.name,
          type: form.type,
          currency: form.currency,
          pays_dividends: form.paysDividends,
          dividends_id: dividendId,
          details_id: details.id,
          diversification_id: diversification.id
        }])
      if (assetErr) throw new Error(assetErr.message)

      toast.success('✅ Asset added successfully.')
      onSubmit?.()
    } catch (err) {
      toast.error(err.message || '❌ Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const motionDiv = (children) => (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.1 }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  )

  const StepContent = () => {
    switch (step) {
      case 0:
        return motionDiv(<>
          <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
          <select className="w-full border p-2 rounded" value={form.type} onChange={(e) => updateForm('type', e.target.value)} required>
            <option value="">Select type</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
          <input className="w-full border p-2 rounded" placeholder="Currency (e.g. EUR)" value={form.currency} onChange={(e) => updateForm('currency', e.target.value)} />
        </>)
      case 1:
        return motionDiv(<>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={form.paysDividends} onChange={(e) => updateForm('paysDividends', e.target.checked)} />
            <span>Pays Dividends</span>
          </label>
          {form.paysDividends && (
            <div className="space-y-2">
              <input className="w-full border p-2 rounded" placeholder="Dividend per share" value={form.dividendPerShare} onChange={(e) => updateForm('dividendPerShare', e.target.value)} />
              <select
                className="w-full border p-2 rounded"
                value={form.paymentFrequency}
                onChange={(e) => updateForm('paymentFrequency', e.target.value)}
                required
              >
                <option value="">Select frequency</option>
                <option value="1">Monthly</option>
                <option value="2">Quarterly</option>
                <option value="3">Semiannual</option>
                <option value="4">Yearly</option>
                <option value="5">Uneven</option>
              </select>
              <input className="w-full border p-2 rounded" type="date" value={form.nextPaymentDate} onChange={(e) => updateForm('nextPaymentDate', e.target.value)} />
            </div>
          )}
        </>)
      case 2:
        return motionDiv(<>
          <input className="w-full border p-2 rounded" placeholder="ISIN" value={form.isin} onChange={(e) => updateForm('isin', e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Ticker" value={form.ticker} onChange={(e) => updateForm('ticker', e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="API Ref" value={form.apiRef} onChange={(e) => updateForm('apiRef', e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="URL Hint" value={form.urlHint} onChange={(e) => updateForm('urlHint', e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="LS Symbol (optional)" value={form.lsSymbol} onChange={(e) => updateForm('lsSymbol', e.target.value)} />
        </>)
      case 3:
        return motionDiv(<>
          <input list="region-options" className="w-full border p-2 rounded" placeholder="Region (e.g. Europe, World)" value={form.region} onChange={(e) => updateForm('region', e.target.value)} />
          <datalist id="region-options">
            {availableRegions.map(region => <option key={region} value={region} />)}
          </datalist>

          <input list="sector-options" className="w-full border p-2 rounded" placeholder="Sector (e.g. Real Estate, IT)" value={form.sector} onChange={(e) => updateForm('sector', e.target.value)} />
          <datalist id="sector-options">
            {availableSectors.map(sector => <option key={sector} value={sector} />)}
          </datalist>

          <input className="w-full border p-2 rounded" placeholder="Category (e.g. Growth, Value)" value={form.category} onChange={(e) => updateForm('category', e.target.value)} />
        </>)
      case 4:
        return motionDiv(<div className="space-y-1 text-sm text-gray-800">
          {Object.entries(form).map(([k, v]) => (
            <div key={k}><strong>{k}:</strong> {v?.toString() || '-'}</div>
          ))}
        </div>)
      default:
        return null
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); step === steps.length - 1 ? handleSubmit() : nextStep() }} className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-xl space-y-6">
      <h2 className="text-xl font-semibold">Add New Asset</h2>
      <AnimatePresence mode="wait">{StepContent()}</AnimatePresence>
      <div className="flex justify-between pt-4">
        <button type="button" onClick={prevStep} disabled={step === 0} className="text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Back</button>
        <button type="submit" disabled={loading} className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? 'Submitting...' : step === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  )
}
