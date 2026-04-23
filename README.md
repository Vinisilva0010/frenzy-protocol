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
##  Adevar Labs Hackathon Track: Security & Architecture

This section is dedicated to the Adevar Labs bounty judges. It outlines our security-first approach, architectural decisions, and the technical documentation of the FRENZY Protocol.

### Project Description (Security Context)
FRENZY Protocol is a DeFi application that transforms social feeds (X/Twitter) into direct execution layers using Solana Actions (Blinks). User deposits are automatically routed into a 50/50 split strategy: Deep Safety (Jito Liquid Staking) and Max Alpha (High-frequency exposure). Because FRENZY bridges retail social traffic directly to institutional yield strategies, we treat security not as a feature, but as the core product.

### Security Statement
In the DeFi and RWA space, systemic failure usually stems from monolithic architectures. FRENZY was built on an "Isolated Vaults Model". We do not use global liquidity honeypots. Every user state is isolated in its own PDA (Program Derived Address). A compromise in one vector cannot cascade into a systemic protocol drain.

We are applying for the Adevar Labs audit bounty because our roadmap includes bridging real institutional capital and Brazilian Fixed Income assets into the Solana ecosystem. While our internal adversarial testing and CI/CD pipelines are robust, handling real-world institutional capital demands the analytical rigor that only Adevar Labs provides. We need your team to challenge our mitigations against low-level reentrancy, validate our PDA constraint logic, and ensure our Liquid Staking bridge is mathematically unbreakable.

### Core Security Implementations

* **Continuous Auditor (CI/CD Pipeline):** We do not push code blindly. Our repository is guarded by an automated GitHub Actions pipeline. Every commit triggers a clean-room environment that downloads the Solana SBF Platform Tools, runs strict Rust static analysis (`Clippy` with memory safety enforcements), and executes our adversarial test suite via `anchor build` and `anchor test`. Vulnerable code is programmatically blocked from reaching mainnet.
* **Anti-Bank Run & Withdrawal Cooldown:** Liquidity is the protocol's oxygen. To mitigate flash-loan attacks and panic-induced bank runs, we implemented a cryptographic time-lock. The contract natively queries the Solana cluster clock (`Clock::get()`) to enforce a strict 24-hour cooling-off window between withdrawals. Any premature attempt is summarily reverted by the SVM (`WithdrawalCooldownActive`).
* **PDA Hijack Prevention:** All withdrawal and state-transition operations carry strict Anchor constraints (`has_one = authority`). It is mathematically impossible to hijack transactions or manipulate accounts in our CPI constructions.
* **Math Overflow Immunity:** 100% of state transitions utilize safe math libraries (`checked_math`), eliminating integer underflow/overflow attacks and precision manipulation vectors.
* **API Shielding & Strict CORS:** Since our onboarding relies on Blinks, our endpoints are shielded against Layer 7 DDoS attacks. We enforce strict CORS validation compliant with the `@solana/actions` specification and implement dynamic rate limiting to protect our RPC nodes from malicious spam.


---

## Contributing & Feedback

We are actively looking for technical feedback from Rust, Anchor, and Solana developers.

DM on X: [@frenzy_protocol](https://x.com/frenzy_protocol)

<<<<<<< HEAD
Colosseum Frontier Hackathon participant — Submission May 11, 2026.
=======
Colosseum Frontier Hackathon participant — Submission May 9, 2026.
>>>>>>> d15c54afc095f239df3643d90c1c239b098f154a

---

**Built with brutal execution. No hype. Infrastructure only.**
