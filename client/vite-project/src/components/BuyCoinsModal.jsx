import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PiCoin, PiCoinsFill } from 'react-icons/pi'
import { IoClose, IoSparkles } from 'react-icons/io5'
import { FiZap } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../redux/userSlice'
import { ServerURL } from '../App'

const PLANS = [
  {
    id: 'plan_100',
    price: 100,
    coins: 300,
    label: 'Starter',
    badge: 'Popular',
    color: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    features: ['300 interview credits', 'Valid forever', 'All interview types'],
  },
  {
    id: 'plan_200',
    price: 200,
    coins: 700,
    label: 'Pro',
    badge: 'Best Value',
    color: 'from-emerald-500 to-green-600',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    features: ['700 interview credits', 'Valid forever', 'All interview types', 'Priority AI models'],
  },
]

export default function BuyCoinsModal({ onClose }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(null)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handleBuy = async (plan) => {
    setLoading(plan.id)
    setError(null)

    const loaded = await loadRazorpayScript()
    if (!loaded) {
      setError('Failed to load payment gateway. Check your internet connection.')
      setLoading(null)
      return
    }

    try {
      // 1. Create order on backend
      const res = await fetch(ServerURL + '/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId: plan.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'InterviewIQ.AI',
        description: `${plan.coins} Interview Credits`,
        order_id: data.order.id,
        theme: { color: '#10b981' },
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            const verifyRes = await fetch(ServerURL + '/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.message)

            // 4. Update Redux with new user (credits refreshed)
            dispatch(setCurrentUser(verifyData.user))
            setSuccess(`🎉 ${plan.coins} coins added successfully!`)
          } catch (e) {
            setError(e.message || 'Payment verification failed.')
          } finally {
            setLoading(null)
          }
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      setLoading(null)
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header gradient strip */}
          <div
            className="h-2 w-full"
            style={{ background: 'linear-gradient(90deg, #8b5cf6, #10b981, #3b82f6)' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition rounded-full p-1 hover:bg-gray-100"
          >
            <IoClose size={22} />
          </button>

          <div className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 mb-4">
                <PiCoinsFill size={32} className="text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Buy Interview Credits</h2>
              <p className="text-gray-500 text-sm">
                Credits are used to start AI-powered mock interviews. They never expire.
              </p>
            </div>

            {/* Success / Error */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 font-medium"
                >
                  <MdVerified size={20} />
                  {success}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -4, boxShadow: `0 20px 40px ${plan.glowColor}` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl border-2 border-gray-100 p-6 cursor-pointer overflow-hidden"
                  style={{ background: '#fafafa' }}
                >
                  {/* Badge */}
                  <div
                    className={`absolute top-4 right-4 text-xs font-bold text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${plan.color}`}
                  >
                    {plan.badge}
                  </div>

                  {/* Plan label */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {plan.label}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-400 text-sm">/ one-time</span>
                  </div>

                  {/* Coins */}
                  <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${plan.color} text-white text-sm font-semibold px-3 py-1 rounded-full mb-5`}>
                    <PiCoin size={16} />
                    {plan.coins} coins
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <IoSparkles size={14} className="text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleBuy(plan)}
                    disabled={loading !== null}
                    className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {loading === plan.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing…
                      </>
                    ) : (
                      <>
                        <FiZap size={16} />
                        Pay ₹{plan.price}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
              <MdVerified size={13} className="text-green-500" />
              Secured by Razorpay · UPI, Cards, NetBanking accepted
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
