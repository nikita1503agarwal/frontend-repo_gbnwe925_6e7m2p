import { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Product() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/product`)
        const data = await res.json()
        setProduct(data)
      } catch (e) {
        setError('Failed to load product. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [])

  if (loading) return <div className="text-white text-center py-20">Loading product...</div>
  if (error) return <div className="text-red-300 text-center py-20">{error}</div>
  if (!product) return null

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/40">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-[420px] object-cover" />
        )}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {product.width_cm} cm wide • {product.height_cm} cm tall • {product.material}
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white mb-3">{product.name}</h1>
        <p className="text-blue-200/80 mb-4">{product.description}</p>
        <div className="text-3xl font-semibold text-white mb-6">${'{'}product.price_usd.toFixed(2){'}'}</div>
        <OrderForm unitPrice={product.price_usd} />
        <p className="mt-6 text-sm text-blue-200/70">Base nameplate is customizable up to 24 characters.</p>
      </div>
    </div>
  )
}

function OrderForm({ unitPrice }) {
  const [form, setForm] = useState({
    custom_name: '',
    quantity: 1,
    customer_name: '',
    customer_email: '',
    shipping_address: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const engravingFee = form.custom_name.trim() ? 4.0 : 0
  const shipping = 6.99
  const subtotal = unitPrice * form.quantity
  const total = (subtotal + engravingFee + shipping).toFixed(2)

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${BACKEND_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to place order')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Name on Base</label>
          <input
            className="w-full rounded-md bg-slate-900/70 border border-white/10 p-2 text-white"
            maxLength={24}
            value={form.custom_name}
            onChange={(e) => update('custom_name', e.target.value)}
            placeholder="e.g., Alex"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            max={10}
            className="w-full rounded-md bg-slate-900/70 border border-white/10 p-2 text-white"
            value={form.quantity}
            onChange={(e) => update('quantity', Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Full Name</label>
          <input className="w-full rounded-md bg-slate-900/70 border border-white/10 p-2 text-white" value={form.customer_name} onChange={(e)=>update('customer_name', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Email</label>
          <input type="email" className="w-full rounded-md bg-slate-900/70 border border-white/10 p-2 text-white" value={form.customer_email} onChange={(e)=>update('customer_email', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Shipping Address</label>
          <textarea className="w-full rounded-md bg-slate-900/70 border border-white/10 p-2 text-white" rows={3} value={form.shipping_address} onChange={(e)=>update('shipping_address', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Notes (optional)</label>
          <input className="w-full rounded-md bg-slate-900/70 border border-white/10 p-2 text-white" value={form.notes} onChange={(e)=>update('notes', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-blue-200">
        <div className="text-sm">
          Subtotal: ${'{'}subtotal.toFixed(2){'}'} • Engraving: ${'{'}engravingFee.toFixed(2){'}'} • Shipping: ${'{'}shipping.toFixed(2){'}'}
        </div>
        <div className="text-xl font-semibold text-white">Total: ${'{'}total{'}'}</div>
      </div>

      {error && <div className="mt-3 text-red-300 text-sm">{error}</div>}
      {result && (
        <div className="mt-3 text-green-300 text-sm">Order placed! ID: {result.order_id}. Charged ${'{'}result.total_usd.toFixed ? result.total_usd.toFixed(2) : result.total_usd{'}'}.</div>
      )}

      <button
        disabled={submitting}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition"
      >
        {submitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  )
}
