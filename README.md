# FRENZY Protocol

**Autonomous Hybrid Risk Management Vault on Solana**

An open-source vault that mathematically splits investor capital 50/50:  
**50% Shield** — Predictable yield + capital protection  
**50% High-Performance Engine** — Exponential opportunity capture  

Built for users who refuse the "all-or-nothing" approach in DeFi.

---

## Core Architecture

### The 50% Shield (Protection Pillar)
- Automatically stakes SOL with top-tier validators (Jito & Sanctum) via liquid staking
- Targets historical 7-9% APY with daily yield accrual
- Full on-chain liquidity — withdraw anytime without permission
- Future roadmap: expansion into RWAs (tokenized T-Bills and Brazilian fixed income via Selic/Ibovespa)

### The 50% High-Performance Engine (Aggressive Pillar)
- Provides liquidity to major Solana DEX pools (Raydium & Orca)
- Captures trading fees in real-time
- Designed for exponential yields during bullish or high-volatility cycles (100%–300%+ in strong market phases)
- Risk-isolated: only 50% of capital exposed

### splitDeposit Instruction
The core on-chain logic. Executes mathematical capital separation at bytecode level in a single transaction. No manual intervention. No emotional decisions.

### Security-First Design
- Isolated vault per user (PDA-based Smart Wallet Architecture)
- No global honeypots — single compromise has zero systemic risk
- Full checked math to prevent overflows
- Strict authority validation (`has_one = authority`)
- Autonomous `triggerKillSwitch` for instant lockdown during extreme market anomalies or cascading liquidations

---

## Technical Stack

- **On-chain**: Rust + Anchor Framework (Solana)
- **Backend**: Pure Rust + Tokio (async runtime)
- **Low-latency Oracle**: Groq LPU hardware acceleration (< 50ms market context)
- **Frontend & UX**: Next.js 16 + Turbopack + Solana Blinks
- **Transaction Flow**: Base64-packed `splitDeposit` executed directly from X feed via Phantom wallet (zero friction)

---

## How It Works

1. User clicks "Enter Vault" via Blink on X
2. `splitDeposit` instruction splits capital 50/50 on-chain
3. Shield portion → Liquid staking (Jito/Sanctum)
4. Aggressive portion → Liquidity provision (Raydium/Orca)
5. Backend continuously monitors risk and triggers `killSwitch` if needed
6. All actions fully automated and permissionless

---

## Current Status (Hackathon Stage)

- Core smart contracts functional (VaultState + splitDeposit + killSwitch)
- Backend oracle operational
- Blink integration live
- Frontend in final polishing
- Full audit planned post-Colosseum submission

**Live Site**: [https://frenzy-protocol.vercel.app](https://frenzy-protocol.vercel.app)

---

## Roadmap

- **v1** — Liquid staking + DEX LP hybrid vault (current)
- **v2** — RWA integration (T-Bills + Brazilian fixed income exposure)
- **v3** — Cross-border capital bridge (global → Brazilian economy via RWAs)

---

## Security & Audits

- Built with institutional-grade security practices
- PDA isolation, checked math, strict CPI validation
- Audit by Adevar Labs planned after hackathon submission

---

## Contributing & Feedback

We are actively looking for technical feedback from Rust, Anchor, and Solana developers.

DM on X: [@frenzy_protocol](https://x.com/frenzy_protocol)

Colosseum Frontier Hackathon participant — Submission May 11, 2026.

---

**Built with brutal execution. No hype. Infrastructure only.**
