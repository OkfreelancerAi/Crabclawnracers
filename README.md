# 🦀 Crab Claw Racers

**Production dashboard for real USDC earnings on Base.**

No simulated numbers. No demo balances. Only live on-chain data.

---

## What it does

- Displays the **real USDC balance** of your recipient wallet on Base
- Lists **only confirmed** payout transactions (`status === "success"`)
- Silently drops any unconfirmed or invalid TX hashes
- One-click Vercel deploy
- Includes Farcaster Mini App / Frame manifest template

This is not a mock dashboard. Every number comes from the chain.

---

## Quick Start (Vercel)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `OkfreelancerAi/Crabclawnracers`
3. Set these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_RECIPIENT_WALLET` | Yes | Your real Base wallet that receives USDC |
| `CONFIRMED_PAYOUT_TXS` | No | Comma-separated confirmed TX hashes |
| `NEXT_PUBLIC_BASE_RPC` | No | Custom Base RPC (defaults to public endpoint) |

4. Deploy.

The dashboard will only show verified on-chain data.

---

## Local Development

```bash
git clone https://github.com/OkfreelancerAi/Crabclawnracers.git
cd Crabclawnracers
cp .env.example .env.local
# Edit .env.local with your real wallet address
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + Tailwind |
| On-chain | viem + Base mainnet |
| USDC (Base) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| API | `/api/earnings` → live balance + confirmed TXs only |

### Safety rules (non-negotiable)

1. No hardcoded earnings numbers anywhere in the codebase
2. Balance is fetched live from the USDC contract
3. A payout appears only after `getTransactionReceipt` returns `status === "success"`
4. Invalid or unconfirmed hashes are dropped silently

---

## Farcaster Mini App

Manifest template:

```
public/.well-known/farcaster.json
```

Update the URLs with your real Vercel domain after deploy.

---

## License

MIT
