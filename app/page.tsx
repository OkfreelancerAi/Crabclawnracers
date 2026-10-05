'use client'

import { useEffect, useState } from 'react'
import { Wallet, CheckCircle2, ExternalLink, AlertTriangle, RefreshCw, Shield } from 'lucide-react'

interface ConfirmedPayout {
  hash: string
  blockNumber: number
  from: string
  to: string | null
  status: 'confirmed'
  explorerUrl: string
}

interface EarningsData {
  success: boolean
  network: string
  usdcContract: string
  recipientWallet: string
  realUsdcBalance: string | null
  confirmedPayouts: ConfirmedPayout[]
  timestamp: string
  note: string
}

export default function Dashboard() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEarnings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/earnings')
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to load')
      setData(json)
    } catch (e: any) {
      setError(e.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEarnings()
    // Refresh every 30s for live balance
    const interval = setInterval(fetchEarnings, 30000)
    return () => clearInterval(interval)
  }, [])

  const isWalletConfigured =
    data?.recipientWallet &&
    data.recipientWallet !== '0x0000000000000000000000000000000000000000'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
              🦀
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Crab Claw Racers</h1>
              <p className="text-xs text-slate-400">Real earnings only</p>
            </div>
          </div>
          <button
            onClick={fetchEarnings}
            disabled={loading}
            className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Status Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
          <Shield className="text-emerald-400 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-emerald-300">Production mode active</p>
            <p className="text-sm text-emerald-200/80 mt-1">
              This dashboard never displays simulated earnings. Only real USDC balances and confirmed Base transactions are shown.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Real Balance Card */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Wallet size={16} />
              Live USDC Balance (Base)
            </div>

            {loading && !data ? (
              <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
            ) : !isWalletConfigured ? (
              <div>
                <p className="text-3xl font-bold text-amber-400">Not configured</p>
                <p className="text-sm text-slate-400 mt-2">
                  Set <code className="bg-black/40 px-1.5 py-0.5 rounded">NEXT_PUBLIC_RECIPIENT_WALLET</code> in Vercel env vars
                </p>
              </div>
            ) : (
              <div>
                <p className="text-4xl font-bold tracking-tight">
                  {data?.realUsdcBalance !== null
                    ? `${Number(data.realUsdcBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })} USDC`
                    : '—'}
                </p>
                <p className="text-sm text-slate-400 mt-2 font-mono break-all">
                  {data?.recipientWallet}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <CheckCircle2 size={16} />
              Confirmed Payouts
            </div>
            <p className="text-4xl font-bold">
              {data?.confirmedPayouts?.length ?? 0}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Only transactions verified on Base are counted
            </p>
          </div>
        </section>

        {/* Confirmed Payouts List */}
        <section className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold">Verified On-Chain Payouts</h2>
            <span className="text-xs text-slate-400">Base Mainnet</span>
          </div>

          {!data || data.confirmedPayouts.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <p className="mb-2">No confirmed payouts yet</p>
              <p className="text-sm">
                Add real transaction hashes to the <code className="bg-black/40 px-1 rounded">CONFIRMED_PAYOUT_TXS</code> env var.
                Only hashes that are confirmed on Base will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.confirmedPayouts.map((payout) => (
                <li key={payout.hash} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span className="font-mono text-sm truncate">{payout.hash}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Block {payout.blockNumber.toLocaleString()} · From {payout.from.slice(0, 6)}…{payout.from.slice(-4)}
                    </p>
                  </div>
                  <a
                    href={payout.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 shrink-0"
                  >
                    Basescan <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Technical Info */}
        <section className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-slate-400 space-y-1">
          <p><span className="text-slate-300">Network:</span> Base Mainnet</p>
          <p><span className="text-slate-300">USDC Contract:</span> <span className="font-mono">0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</span></p>
          <p><span className="text-slate-300">Last updated:</span> {data?.timestamp ? new Date(data.timestamp).toLocaleString() : '—'}</p>
          <p className="pt-2 text-emerald-400/80">{data?.note}</p>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Crab Claw Racers · Production dashboard · No simulated earnings
      </footer>
    </div>
  )
}