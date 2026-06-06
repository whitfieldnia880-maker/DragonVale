import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AuthContext } from '@/hooks/useAuth'

interface AuthScreenProps {
  auth: AuthContext
}

type Phase = 'input' | 'sending' | 'sent' | 'error'

export function AuthScreen({ auth }: AuthScreenProps) {
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState<Phase>('input')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setPhase('sending')
    const { error } = await auth.sendMagicLink(email.trim())
    if (error) {
      setErrorMsg(error)
      setPhase('error')
    } else {
      setPhase('sent')
    }
  }

  return (
    <div className="min-h-svh bg-slate-950 flex flex-col items-center justify-center px-6">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 55%, #e879f918 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm space-y-8"
      >
        {/* Logo */}
        <div className="text-center space-y-2">
          <p className="text-5xl">🎬</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Idle Talent Studios</h1>
          <p className="text-sm text-white/40">Sign in to save your story across devices.</p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3"
            >
              <p className="text-3xl">✉️</p>
              <p className="font-bold text-emerald-300">Check your email</p>
              <p className="text-sm text-white/50">
                We sent a magic link to <span className="text-white">{email}</span>. Click it to sign in.
              </p>
              <button
                onClick={() => { setPhase('input'); setEmail('') }}
                className="text-xs text-white/30 underline mt-2"
              >
                Use a different email
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs text-white/50 font-semibold uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  aria-label="Email address"
                  className="w-full bg-white/8 border border-white/15 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-white/25 outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all"
                />
              </div>

              {phase === 'error' && (
                <p className="text-xs text-rose-400 px-1">{errorMsg}</p>
              )}

              <motion.button
                type="submit"
                disabled={phase === 'sending' || !email.trim()}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #be185d, #7c3aed)',
                }}
                aria-label="Send magic link"
              >
                {phase === 'sending' ? 'Sending…' : 'Continue with Email →'}
              </motion.button>

              <p className="text-center text-xs text-white/25">
                No password needed — we email you a sign-in link.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
