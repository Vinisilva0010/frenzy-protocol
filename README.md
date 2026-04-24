# Adevar Labs Hackathon – Security & Architecture

## 1. Project Overview (Security Context)

**FRENZY Protocol** is a Solana-native vault that routes user deposits from social surfaces (X/Twitter via Solana Actions/Blinks) into a **90% / 10% tranche structure** inspired by Brazilian structured credit (FIDC-style senior and subordinated slices).[web:46]

- **90% Conservative Profile (Senior Tranche)**  
  Capital-preservation–first layer, designed to mirror a senior slice of a credit fund: priority on withdrawals and target yield, protected by the first-loss buffer.[web:46][web:110]

- **10% Aggressive Profile (Subordinated / First-Loss Tranche)**  
  High-voltage layer that absorbs first losses in exchange for all excess yield (“alpha”) above the senior target.[web:46][web:110]

In the target production architecture, vault liquidity is routed (through regulated partners) into **Brazilian structured credit** – receivables, card flows, invoices and corporate contracts – seeking returns aligned with CDI + credit spread, rather than speculative DeFi farming.[web:100][web:114]

For the Adevar Labs hackathon, **all off-chain flows and BRL exposure are simulated**. The on-chain logic, tranche math and default/waterfall behavior are real and executed on Solana devnet. No user interacts with real-world credit risk at this stage.

Security is not treated as a “module” of the protocol; it is the core product requirement. If we fail on isolation, withdrawal discipline or oracle integrity, the architecture collapses regardless of how strong the RWA narrative is.

---

## 2. Threat Model at a Glance

We explicitly model four main classes of risk:

1. **On-chain smart contract risk**
   - Logic errors in tranche accounting, default waterfall or withdrawal calculation.
   - PDA hijacking or CPI abuse to drain or re-route vault state.
   - Integer overflow/underflow and precision bugs in financial math.

2. **Liquidity and bank-run risk**
   - Stampedes towards exits, flash-loan–amplified bank runs.
   - Mismatch between on-chain “available balance” and real-world credit liquidity.

3. **Oracle / bridge risk**
   - Malicious or compromised yield reporter pushing fake PnL or default data.
   - Desync between off-chain credit positions and on-chain accounting.

4. **Off-chain RWA and counterparty risk (future mainnet phase)**
   - Failure of credit originators, FIDC vehicles or registries.[web:118]
   - Legal/operational risk in BRL custody and receivables registration.[web:111][web:115]

The current hackathon implementation focuses primarily on classes 1–3, with class 4 modeled and mitigated at the design level for future regulated deployment.

---

## 3. Architecture Overview

### 3.1 Isolated Vault Model (No Global Honeypots)

FRENZY explicitly avoids a single global pool of liquidity. Instead, we use an **Isolated Vaults Model**:

- Each user (or each vault position, depending on design choice) is mapped to its own **Program Derived Address (PDA)**.
- Tranche balances, accrued yield and withdrawal state are stored in per-vault accounts, not in a single shared “god account”.
- A compromise in one PDA (e.g., through misconfiguration or misuse) **cannot cascade into a full protocol drain**, because there is no monolithic, shared state that holds all deposits.

This design trades some storage efficiency for strict blast-radius containment, which is a desirable trade-off in a protocol that plans to interface with institutional capital and RWAs.

### 3.2 90% / 10% Tranche Engine

Within each vault, the contract maintains an internal split:

- `senior_shares` (90% nominal target)  
- `junior_shares` (10% nominal target)

**On deposits**

- Incoming amount is split deterministically into senior and junior “shares”, according to the user’s chosen profile and the global 90/10 ratio.
- Accounting is done via checked math to maintain the invariant that `senior + junior = total vault shares`.

**On profit (alpha) injections**

- The contract first credits the senior side up to its target (CDI + configured spread, in the simulated model).
- Any remaining profit is assigned entirely to the junior side.

**On default (loss) events**

- Loss amounts are deducted from the junior side first.
- Only after junior shares are exhausted can losses be propagated to the senior side.

This structure mirrors the **senior/subordinated logic used in Brazilian FIDC structures**: senior quotas protected, subordinated quotas acting as a “protection cushion” and taking first loss in exchange for higher expected returns.[web:46][web:110]

### 3.3 On-Chain ↔ Off-Chain Boundary

In the PoC:

- All off-chain events (profit, loss, defaults) are injected via a privileged actor called **Yield Admin**.
- Yield Admin is responsible for pushing:
  - synthetic profit events (for alpha simulations),
  - synthetic default events (for loss simulations).

For mainnet:

- Yield Admin becomes a **multisig contract** controlled by custodians/auditors.
- Long term, the design migrates to **oracles / Functions** that fetch signed statements from credit platforms, BRL custodians or registries, minimizing trusted human input.[web:92]

---

## 4. Core Security Mechanisms

### 4.1 CI/CD “Continuous Auditor” Pipeline

We treat our GitHub Actions pipeline as a **first-pass auditor**:

- Every push runs in a clean-room container that:
  - downloads the Solana SBF toolchain,
  - builds the program (`anchor build`),
  - runs **Rust Clippy** with strict lints for memory safety and undefined behavior,
  - executes the full test suite with `anchor test`, including adversarial tests against:
    - malformed accounts,
    - re-entrancy attempts via CPI,
    - boundary conditions in tranche math.

- If any of these steps fail, the CI blocks the merge and prevents the code from being promoted towards mainnet.

The goal is that **no unaudited, untested Rust hits production**, even before an external audit.

### 4.2 PDA Hijack Prevention

All state transitions that affect funds or vault accounting are protected with **strict Anchor constraints**:

- `#[account(has_one = authority)]` ensures that only the expected authority can drive operations on a given vault.
- Seed-based derivations (`seeds = [b"vault", user.key().as_ref()], bump`) bind PDAs cryptographically to specific owners and roles.
- CPI calls are limited and structured to avoid writing into arbitrary accounts.

This makes it **mathematically impossible** (within the threat model of Solana’s runtime) for an attacker to redirect withdrawals or mutate vault state by swapping out accounts at the call site without satisfying all constraints.

### 4.3 Overflow / Underflow Immunity

All numerical operations that touch balances, shares, yield and default logic use safe math:

- Rust’s checked operations (or explicit `checked_add`, `checked_sub`, `checked_mul`) are used for all calculations.
- Any overflow or underflow condition bubbles up as an error and reverts the transaction at the SVM level.
- No unchecked casting between integer sizes is allowed in critical paths.

This prevents classic integer-based exploits such as:

- tricking the contract into thinking there is “infinite” liquidity,
- underflowing balances to bypass withdrawal checks,
- precision-warping in interest or default distribution.

### 4.4 Anti-Bank-Run & Withdrawal Cooldowns

Bank runs are a real risk in protocols that pretend to offer instantaneous liquidity on top of long-dated credit assets.

FRENZY implements **two layers** of protection:

1. **Per-vault cooldown (PoC / DeFi-focused defense)**  
   - The contract reads the Solana cluster clock (`Clock::get()`) and enforces a minimum cooldown between withdrawals (e.g., 24 hours) per vault.
   - Rapid, repeated withdrawals – which could be combined with flash-loan style behaviors – are rejected with a `WithdrawalCooldownActive` error.

2. **Liquidity windows aligned to credit (RWA model)**  
   - At the architecture level, the design assumes withdrawals are only allowed in windows aligned with the underlying credit portfolio (e.g., D+30 / D+60), reflecting how FIDC and structured credit funds operate in the real world.[web:110][web:120]
   - On-chain, this is modeled via configuration parameters and time-lock logic so the protocol never pretends to offer D+0 liquidity for non-D+0 assets.

Together, these mechanisms reduce the chance of:

- panic withdrawals draining the protocol at the worst possible time,
- attackers exploiting timing gaps between real-world liquidity and on-chain accounting.

### 4.5 Oracle & Yield Admin Safeguards

In the PoC:

- A single **Yield Admin** key can push profit and default events for simulation purposes.

Recognizing the centralization risk, the mainnet roadmap is:

- replace the single key by a **multisig** (custodians + auditor),
- define strict rate limits and bounds on:
  - maximum profit per period,
  - maximum loss per period,
  - ability to pause or roll back in case of misreporting,
- progressively migrate to **oracle-based reporting** (e.g., Chainlink / Functions) where off-chain systems sign credit events that the oracle relays.[web:92]

The audit focus we are requesting from Adevar includes:

- verifying that malicious or incorrect Yield Admin inputs cannot break invariants,
- validating that no single signer can silently rewrite the economic reality of the vault without detection.

### 4.6 API Shielding & Blink Endpoint Security

Because the user entry point is often a **Solana Action/Blink** embedded in social platforms, our HTTP surfaces must behave like hardened API gateways, not marketing websites:

- **Strict CORS** rules, aligned with `@solana/actions` spec, to prevent browsers on arbitrary origins from abusing endpoints.[web:99]
- **Dynamic rate limiting** per IP and per wallet to defend against L7 spam and flood attempts aimed at RPC providers.
- Input validation for all Action payloads, rejecting malformed or unexpected instructions before they reach the signer.

---

## 5. Testing, Simulation & Observability

### 5.1 Devnet Yield Simulator

To make the tranche logic auditable and observable:

- We expose a **Devnet Yield Simulator** in the dashboard.
- Each simulation:
  - calls real program instructions on devnet,
  - updates vault PDAs with profit or default events,
  - lets users and judges see, on-chain, how:
    - senior balances behave under default,
    - junior balances explode under high alpha.

This is not a frontend-only mock; every button press results in a signed transaction and state transition validated by the Solana runtime.

### 5.2 Adversarial Tests

Our test suite includes scenarios such as:

- attempting to withdraw more than recorded balance,
- replaying old instructions or accounts,
- pushing profit/loss events that exceed reasonable bounds,
- manipulating time-lock boundaries.

Each of these is expected to fail with explicit program errors, not undefined behavior.

### 5.3 Telemetry & Future Monitoring

For a future mainnet version, our plan is to:

- attach log-based alerts on:
  - abnormal frequency of Yield Admin calls,
  - repeated withdrawal failures,
  - suspicious patterns of junior share erosion,
- feed these into a monitoring stack (e.g., Prometheus/Grafana/third-party dashboards) for human operators and potentially automated circuit breakers.

---

## 6. Regulatory & RWA Considerations

We explicitly acknowledge that:

- Tokenized claims on Brazilian credit and FIDC-like structures are treated as **securities** under local law and CVM regulation.[web:111][web:115][web:120]
- The current hackathon implementation is **simulation-only** by design, with no public capital raise or real-world credit exposure.

A production-grade deployment would:

- plug into **regulated credit vehicles** (FIDCs, securitization companies, tokenization platforms) that already operate under CVM rules in Brazil,[web:111][web:120]
- use FRENZY purely as:
  - the Web3 execution + UX layer,
  - the on-chain accounting and tranche engine,
- and operate under appropriate frameworks (e.g., CVM sandbox / crowdfunding rules, depending on partner structure).[web:111][web:119]

The Adevar Labs audit is a key step to prepare this on-chain engine to eventually sit under real-world regulatory rails.

---

## 7. What We Want From the Adevar Labs Audit

Given everything above, what we are asking from Adevar Labs is:

1. **Smart contract deep dive**
   - Validate tranche accounting invariants under extreme edge cases.
   - Attempt to break PDA constraints and CPI boundaries.
   - Stress-test checked math paths and look for precision pitfalls.

2. **Withdrawal & liquidity discipline**
   - Challenge our cooldown and time-lock design for gaps that could allow:
     - hidden bank runs,
     - liquidity desync with off-chain credit.

3. **Oracle / Yield Admin risk**
   - Model failure/malicious scenarios for the Yield Admin path.
   - Propose hard limits, circuit breakers and monitoring primitives.

4. **Architecture feedback**
   - Evaluate the Isolated Vaults Model vs. attack surfaces we might not have covered.
   - Provide guidance on what would be required, from a security standpoint, to graduate this PoC into a real RWA bridge.