# 🦀 Crab Claw Racers

**Production dashboard for real USDC earnings and verified payouts on Base.**

No simulated numbers. No demo $312.80. Only live on-chain data.

---

## What this does

- Shows the **real USDC balance** of your configured recipient wallet on Base
- Lists **only confirmed** transaction hashes (status = success on Base)
- Never displays a payout unless it has been verified on-chain
- Ready for Vercel one-click deploy
- Includes Farcaster Mini App / Frame manifest template

---

## Quick Start (Vercel)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this repository: `OkfreelancerAi/Crabclawnracers`
3. Add these **Environment Variables** in the Vercel project settings:

| Name | Required | Description |
|------|----------|-------------|
| `NEXT_PUBLIC_RECIPIENT_WALLET` | Yes | Your real Base wallet that receives USDC |
| `CONFIRMED_PAYOUT_TXS` | No | Comma-separated list of real TX hashes (e.g. `0xabc...,0xdef...`) |
| `NEXT_PUBLIC_BASE_RPC` | No | Custom Base RPC (defaults to public endpoint) |

4. Deploy.

After deploy the dashboard will show live data only.

---

## Local Development

```bash
git clone https://github.com/OkfreelancerAi/Crabclawnracers.git
cd Crabclawnracers
cp .env.example .env.local
# Edit .env.local with your real wallet
npm install
npm run dev
```

Open http://localhost:3000

---

## Architecture

- **Frontend**: Next.js 14 (App Router) + Tailwind
- **On-chain**: viem + Base mainnet
- **USDC Contract (Base)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **API**: `/api/earnings` returns only real balance + confirmed TXs

### Safety rules baked in

1. No hardcoded earnings numbers anywhere
2. Balance is fetched live from the USDC contract
3. A payout only appears after `getTransactionReceipt` returns `status === 'success'`
4. Invalid or unconfirmed hashes are silently dropped

---

## Mini App / Farcaster

Template located at:

```
public/.well-known/farcaster.json
```

Update the URLs with your real Vercel domain after deployment.

---

## License

MIT
