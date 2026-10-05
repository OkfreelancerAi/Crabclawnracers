import { createPublicClient, http, parseAbi, formatUnits, type Hash, type Address } from 'viem'
import { base } from 'viem/chains'

// Official USDC on Base
export const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address

// Recipient wallet – CHANGE THIS to your real payout address
export const RECIPIENT_WALLET = (process.env.NEXT_PUBLIC_RECIPIENT_WALLET ||
  '0x0000000000000000000000000000000000000000') as Address

export const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
})

const erc20Abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
])

/**
 * Get real USDC balance of the recipient wallet on Base.
 * Returns null if the address is not set or invalid.
 */
export async function getRealUsdcBalance(): Promise<string | null> {
  if (!RECIPIENT_WALLET || RECIPIENT_WALLET === '0x0000000000000000000000000000000000000000') {
    return null
  }

  try {
    const [balance, decimals] = await Promise.all([
      publicClient.readContract({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [RECIPIENT_WALLET],
      }),
      publicClient.readContract({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
    ])

    return formatUnits(balance, decimals)
  } catch (err) {
    console.error('Failed to fetch USDC balance:', err)
    return null
  }
}

/**
 * Verify a transaction hash exists on Base and is successful.
 * Returns true only if the tx is confirmed and status = 1.
 */
export async function isConfirmedOnBase(txHash: string): Promise<boolean> {
  if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
    return false
  }

  try {
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as Hash,
    })

    // status === 'success' means the transaction was successful
    return receipt.status === 'success'
  } catch {
    return false
  }
}

/**
 * Get basic transaction info for display (only if confirmed).
 */
export async function getConfirmedTxInfo(txHash: string) {
  const confirmed = await isConfirmedOnBase(txHash)
  if (!confirmed) return null

  try {
    const [receipt, tx] = await Promise.all([
      publicClient.getTransactionReceipt({ hash: txHash as Hash }),
      publicClient.getTransaction({ hash: txHash as Hash }),
    ])

    return {
      hash: txHash,
      blockNumber: Number(receipt.blockNumber),
      from: tx.from,
      to: tx.to,
      status: 'confirmed' as const,
      explorerUrl: `https://basescan.org/tx/${txHash}`,
    }
  } catch {
    return null
  }
}