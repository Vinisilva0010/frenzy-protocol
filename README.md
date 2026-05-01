# STRATA Protocol

> A Solana vault that routes onchain capital into Brazilian structured credit — with institutional-grade tranche isolation built directly into the smart contract.

-  **Live demo:** [https://strata.zanvexis.com](https://strata.zanvexis.com)
-  **Devnet program:** `BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx`
-  **Submission video:** `[INSERT LOOM LINK]`

---

## The Problem

Brazilian structured credit (FIDCs, receivables, corporate invoices) offers real yield backed by real economic activity. CDI-linked returns with credit spread have historically outperformed most DeFi farming strategies — without the speculative risk.

The problem is access. These instruments are locked inside regulated vehicles that require minimum tickets, local banking relationships, and months of onboarding. Onchain capital cannot reach them. Brazilian retail and global DeFi participants are excluded from one of the most consistent yield sources in emerging markets.

---

## What STRATA Does

STRATA is a Solana-native vault that implements the senior/subordinated tranche structure used in Brazilian FIDC funds — directly on-chain, enforced by Anchor smart contracts, with no off-chain intermediary able to alter the accounting logic.

Users deposit USDC or SOL. Capital is split deterministically:

- **90% → Senior Tranche** — capital-preservation layer, first priority on withdrawals and yield, protected by the subordinated buffer.
- **10% → Junior Tranche** — first-loss layer that absorbs defaults in exchange for all excess yield above the senior target.

The split is immutable. No admin can override it. No parameter can be tuned at runtime to favor one side. The waterfall logic lives in the bytecode.

In production, vault liquidity is routed through regulated Brazilian credit vehicles into receivables, card flows and corporate invoices — seeking returns aligned with CDI plus credit spread. For the Frontier hackathon, all off-chain flows are simulated via a privileged Yield Admin on devnet. The on-chain logic, tranche accounting and default waterfall are real and fully executable.

---

## Why This Market

Brazil runs the largest FIDC market in Latin America. As of 2024, total FIDC net equity exceeded **R$ 830 billion**. The underlying assets — receivables, payroll credit, agribusiness contracts — generate consistent yield regardless of crypto market conditions.

No Solana protocol currently offers direct structured exposure to this market. STRATA is the entry point.

The immediate target users are: onchain capital allocators seeking uncorrelated yield, and Brazilian investors already familiar with FIDC structures who want programmable, self-custody exposure without traditional fund minimums.

---

## Architecture

### Isolated Vault Model

Each vault is a separate Program Derived Address (PDA). There is no global liquidity pool. A failure or misconfiguration in one vault cannot cascade into the rest of the protocol.

### Tranche Engine

Within each vault, the contract maintains a strict internal accounting of senior shares and junior shares. On profit injection, the senior side is credited first up to its target. All excess goes to junior. On loss events, junior absorbs first. Senior is only impacted after junior is fully depleted. This mirrors the waterfall mechanic in institutional FIDC structures.

### Withdrawal Discipline

The contract reads the Solana cluster clock and enforces a minimum **24-hour cooldown** between withdrawals per vault. This prevents flash-loan-amplified bank run patterns and aligns onchain liquidity discipline with the D+30/D+60 redemption windows common in real-world credit funds.

### RBAC and Kill Switch

Operations are segmented by role. The **Yield Admin** can inject profit and loss events for simulation. A separate **Emergency Admin** holds the global kill switch to freeze protocol operations in case of anomalies. No single key has simultaneous control over both yield reporting and emergency response.

### Blinks Integration

Deposit actions are exposed as Solana Actions (Blinks), rendering directly inside X (Twitter) posts. Users can deposit into either tranche by signing a single Phantom transaction without leaving their social feed. This removes the friction that keeps retail users away from structured yield products.

---

## Security Design

Security is not a feature layer on top of this protocol. It is the core design constraint. An institutional yield product that fails on isolation, withdrawal discipline or oracle integrity is not a yield product — it is a liability.

**Key mechanisms:**

- All tranche math uses **Rust checked operations**. Overflow or underflow on any balance, share or yield calculation reverts the transaction at the SVM level.
- **PDA constraints via Anchor** (`has_one`, seed derivation) prevent account substitution attacks and unauthorized state writes.
- **CPI calls** are structured and bounded to prevent re-entrancy patterns.
- The **CI/CD pipeline** runs Clippy strict lints, adversarial test scenarios and full anchor test suite on every push. No untested code reaches the devnet deployment.
- The **Adevar Labs security review** covers the tranche accounting invariants, PDA boundary testing, Yield Admin abuse scenarios and withdrawal cooldown gaps.

---

## Current State — Frontier Hackathon Submission

- ✅ Smart contract deployed and functional on Solana devnet
- ✅ Vault creation, deposit, yield injection and default simulation all execute real on-chain transactions
- ✅ Frontend live at [https://strata.zanvexis.com](https://strata.zanvexis.com) with global analytics dashboard (TVL, active vaults, tranche breakdown, recent transactions)
- ✅ Blink endpoint functional for X-native deposit flow
- ⚠️ Off-chain credit flows simulated — no real capital at risk

---

## Roadmap to Production

### Phase 1 — Devnet Proof of Concept *(current)*
On-chain logic, tranche accounting, Blinks integration, adversarial test coverage.

### Phase 2 — Mainnet Bridge with Regulated Partners
Replace simulated Yield Admin with multisig controlled by custodians and auditors. Integrate with a regulated Brazilian FIDC or tokenization platform operating under CVM rules. Begin KYC/AML compliance layer for institutional depositors.

### Phase 3 — Oracle-Based Yield Reporting
Migrate from multisig yield injection to oracle-based signed statements from credit platforms, eliminating trusted human input from the yield reporting path.

### Phase 4 — Full Product Launch
Public vault creation, secondary market for tranche shares, mobile-native Blinks experience, expansion to other LatAm credit markets.

---

## Team

- **[YOUR NAME]** — Founder and lead engineer. Solana / Anchor / Rust. Responsible for smart contract architecture, tranche engine design and frontend integration.
- *[ADD OTHER TEAM MEMBERS IF APPLICABLE — role, background, full-time status]*

The team is building full-time. All members are in the same timezone.

---

## Local Setup

```bash
# Clone the repository
git clone https://github.com/Vinisilva0010/frenzy-protocol.git
cd frenzy-protocol

# Install dependencies
yarn install

# Build the Anchor program
anchor build

# Run the full test suite (including adversarial scenarios)
anchor test

# Start the frontend
cd app
yarn dev
```

**Requirements:** Rust, Solana CLI, Anchor CLI, Node.js 18+

---

## Links

| Resource | URL |
|---|---|
| Live site | [https://strata.zanvexis.com](https://strata.zanvexis.com) |
| Analytics dashboard | [https://strata.zanvexis.com/analytics](https://strata.zanvexis.com/radar) |
| GitHub | [https://github.com/Vinisilva0010/frenzy-protocol](https://github.com/Vinisilva0010/frenzy-protocol) |
| Submission video | `[INSERT LOOM LINK]` |
| Devnet program ID | `BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx` |
