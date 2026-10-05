import { NextResponse } from 'next/server'
import { getRealUsdcBalance, getConfirmedTxInfo, RECIPIENT_WALLET } from '@/lib/base'

/**
 * GET /api/earnings
 * Returns ONLY real data:
 * - Live USDC balance of the configured recipient wallet on Base
 * - List of confirmed payout TX hashes (from env or future DB)
 * Never returns simulated / demo numbers.
 */
export async function GET() {
  try {
    const balance = await getRealUsdcBalance()

    // Confirmed payout hashes come from environment (or later a real DB).
    // Format: comma-separated list of 0x... hashes
    const rawHashes = process.env.CONFIRMED_PAYOUT_TXS || ''
    const hashes = rawHashes
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.startsWith('0x') && h.length === 66)

    const confirmedPayouts = []
    for (const hash of hashes) {
      const info = await getConfirmedTxInfo(hash)
      if (info) {
        confirmedPayouts.push(info)
      }
    }

    return NextResponse.json({
      success: true,
      network: 'base',
      usdcContract: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      recipientWallet: RECIPIENT_WALLET,
      realUsdcBalance: balance, // null if wallet not configured
      confirmedPayouts, // only real, confirmed txs
      timestamp: new Date().toISOString(),
      note: 'This endpoint never returns simulated earnings.',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch real on-chain data' },
      { status: 500 }
    )
  }
}