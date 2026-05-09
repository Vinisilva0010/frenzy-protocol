"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SsiTrustLayer() {
  return (
    <div className="min-h-screen bg-[#111111] p-4 md:p-8 font-mono text-black selection:bg-[#FF3366] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        
        {/* ========================================== */}
        {/* HERO SECTION (PT1 & PT2 Integration) */}
        {/* ========================================== */}
        <section className="bg-[#14F195] border-[6px] md:border-[8px] border-black p-6 md:p-12 shadow-[15px_15px_0px_0px_#000] md:shadow-[25px_25px_0px_0px_#000] relative">
          <div className="absolute top-0 right-0 bg-black text-[#14F195] px-4 py-2 font-black text-sm md:text-lg uppercase border-b-[6px] border-l-[6px] border-black">
            STRATA_OS // SSI_MODULE
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 mt-8" style={{ fontFamily: "var(--font-bebas)" }}>
            Verifiable Identity for Real-World Yield
          </h1>
          <p className="text-xl md:text-3xl font-black uppercase leading-relaxed mb-6 border-l-[6px] border-black pl-4">
            A self-sovereign identity layer for Strata Protocol — enabling private KYC, machine-wallet authorization, risk-based tranche access, yield provenance, and cross-chain trust.
          </p>
          <div className="bg-black text-white p-4 inline-block border-[4px] border-white mb-8">
            <p className="font-bold text-sm md:text-lg uppercase tracking-widest text-[#14F195]">
              Built for Solana. Designed for real-world finance. Ready for autonomous economies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t-[6px] border-black pt-8">
            <div>
              <h2 className="text-3xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>
                Build the trust layer for programmable yield
              </h2>
              <p className="font-bold text-lg">
                Integrate decentralized identity, verifiable credentials, zero-knowledge proofs, and Solana-native attestations into Strata’s vault architecture.
              </p>
            </div>
            <div className="bg-white border-[4px] border-black p-6">
              <p className="font-black uppercase mb-4 text-zinc-500">Enable:</p>
              <ul className="grid grid-cols-2 gap-4 font-bold uppercase text-sm md:text-base">
                <li className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FF3366] border-2 border-black inline-block"></span> verified users</li>
                <li className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FF3366] border-2 border-black inline-block"></span> authorized machines</li>
                <li className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FF3366] border-2 border-black inline-block"></span> private compliance</li>
                <li className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FF3366] border-2 border-black inline-block"></span> auditable yield</li>
                <li className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FF3366] border-2 border-black inline-block"></span> cross-chain identity</li>
                <li className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FF3366] border-2 border-black inline-block"></span> policy-based DeFi</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 bg-black text-white p-4 text-center border-[4px] border-black">
            <p className="font-black text-lg md:text-xl uppercase">
              SSI turns Strata into more than a vault. It turns it into a verifiable financial infrastructure layer.
            </p>
          </div>
        </section>

        {/* ========================================== */}
        {/* INTRODUCTION */}
        {/* ========================================== */}
        <section className="bg-white border-[6px] border-black p-6 md:p-10 shadow-[15px_15px_0px_0px_#000]">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
            SSI Trust Layer for Strata Protocol
          </h2>
          <p className="text-xl font-bold uppercase text-[#FF3366] mb-8">
            Privacy-preserving identity, compliance, and authorization for Solana-based real-world yield
          </p>
          
          <p className="text-lg font-bold mb-6">
            Strata introduces a Solana-native vault architecture for structured yield, combining Senior and Junior risk layers with on-chain financial logic. Our SSI contribution adds a missing trust layer around that financial engine: verifiable identity, private credentials, machine authorization, AML/KYC readiness, and auditable yield provenance.
          </p>
          
          <div className="bg-[#111111] text-white p-6 border-[4px] border-[#14F195]">
            <p className="font-black uppercase mb-4 text-[#14F195]">The goal is simple:</p>
            <ul className="space-y-2 font-bold text-lg">
              <li><span className="text-[#14F195] mr-2">{">"}</span> Strata controls the vault mechanics.</li>
              <li><span className="text-[#14F195] mr-2">{">"}</span> SSI controls who or what is allowed to interact with them.</li>
            </ul>
          </div>
          
          <p className="text-lg font-bold mt-6">
            With this architecture, Strata can evolve from a wallet-based vault experience into an identity-aware, compliance-ready, machine-compatible, and cross-chain extensible protocol.
          </p>
        </section>

        {/* ========================================== */}
        {/* THE PROBLEM */}
        {/* ========================================== */}
        <section className="bg-[#FF3366] border-[6px] border-black p-6 md:p-10 shadow-[15px_15px_0px_0px_#000]">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6" style={{ fontFamily: "var(--font-bebas)" }}>
            The Problem
          </h2>
          <p className="text-xl font-black uppercase mb-6 border-b-[4px] border-black pb-4">
            Real-world yield protocols need more than smart contracts.
          </p>
          
          <p className="font-bold text-lg mb-4">
            They need to answer critical questions before allowing deposits, withdrawals, yield updates, or automated treasury actions:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              "Who controls this wallet?",
              "Has this participant passed KYC or KYB?",
              "Is this user eligible for the Senior or Junior tranche?",
              "Has the user accepted first-loss risk?",
              "Is this machine wallet authorized to allocate funds?",
              "Who injected the yield?",
              "Which real-world event or revenue source produced the capital?",
              "Can this be audited without exposing private user data?"
            ].map((q, idx) => (
              <div key={idx} className="bg-black text-white p-3 border-[2px] border-black flex gap-3 items-start">
                <span className="text-[#FF3366] font-black">?</span>
                <span className="font-bold">{q}</span>
              </div>
            ))}
          </div>
          
          <p className="text-lg font-bold bg-white border-[4px] border-black p-6">
            Traditional Web3 systems often expose too much, trust too much, or rely on centralized off-chain databases. Our SSI layer solves this by combining decentralized identifiers, verifiable credentials, zero-knowledge proofs, Solana-native attestations, and backend policy enforcement.
          </p>
        </section>

        {/* ========================================== */}
        {/* WHAT THIS ADDS TO STRATA */}
        {/* ========================================== */}
        <section className="space-y-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter" style={{ fontFamily: "var(--font-bebas)", textShadow: "4px 4px 0px #14F195" }}>
            What This Adds to Strata
          </h2>

          <div className="grid grid-cols-1 gap-6">
            
            {/* ITEM 1 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>1. Identity-aware deposits</h3>
              <p className="font-bold mb-4">Instead of allowing any wallet to request a vault transaction, Strata can require that the wallet prove who or what it represents.</p>
              <p className="font-black text-sm text-zinc-500 uppercase mb-2">For example:</p>
              <ul className="list-disc list-inside font-bold space-y-1 mb-4">
                <li>A human investor proves KYC eligibility.</li>
                <li>A company proves KYB approval.</li>
                <li>A machine wallet proves it belongs to an authorized device.</li>
                <li>An admin wallet proves it belongs to a valid yield operator.</li>
              </ul>
              <p className="font-bold bg-[#111111] text-white p-3 border-[2px] border-black">This allows Strata to support more serious RWA, compliance, and institutional use cases without turning the blockchain into a place for storing private data.</p>
            </div>

            {/* ITEM 2 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>2. Private KYC, KYB, and AML readiness</h3>
              <p className="font-bold mb-4">Our SSI layer allows users to prove eligibility without exposing unnecessary information. A user does not need to reveal full personal data on-chain. Instead, the user can prove:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["KYC passed", "jurisdiction allowed", "risk tier acceptable", "credential not expired", "sanctions screening valid", "product eligibility confirmed"].map((tag, i) => (
                  <span key={i} className="bg-[#14F195] border-[2px] border-black px-2 py-1 font-black uppercase text-xs">{tag}</span>
                ))}
              </div>
              <p className="font-bold">SAS is designed to associate off-chain information such as KYC checks, geographic eligibility, membership, or accreditation status with a wallet, using attestations that are signed, verifiable, and reusable across applications without exposing sensitive data on-chain.</p>
            </div>

            {/* ITEM 3 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>3. Senior and Junior tranche suitability</h3>
              <p className="font-bold mb-4">Strata’s public model separates capital into a conservative Senior layer and a first-loss Junior layer. Our SSI layer can enforce different eligibility rules for each one.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border-[4px] border-black p-4">
                  <p className="font-black uppercase mb-2 bg-black text-white inline-block px-2">Senior tranche:</p>
                  <ul className="list-none font-bold text-sm space-y-1">
                    <li>- requires KYC/KYB</li>
                    <li>- requires allowed jurisdiction</li>
                    <li>- requires acceptable AML status</li>
                  </ul>
                </div>
                <div className="border-[4px] border-black p-4 bg-[#FF3366]">
                  <p className="font-black uppercase mb-2 bg-black text-white inline-block px-2">Junior tranche:</p>
                  <ul className="list-none font-bold text-sm space-y-1">
                    <li>- requires KYC/KYB</li>
                    <li>- requires high-risk suitability</li>
                    <li>- requires first-loss disclosure acceptance</li>
                    <li>- requires stricter investment limits</li>
                  </ul>
                </div>
              </div>
              <p className="font-black uppercase">This allows Strata to align access with risk.</p>
            </div>

            {/* ITEM 4 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>4. Machine-to-machine DeFi support</h3>
              <p className="font-bold mb-4">The same SSI model can support machine wallets and autonomous agents. For example, in an e-waste ecosystem:</p>
              <div className="bg-[#111111] text-[#14F195] p-4 border-[4px] border-black font-mono text-sm mb-4">
                <p>{">"} A smart collection point receives recyclable material.</p>
                <p>{">"} The system verifies the custody event.</p>
                <p>{">"} The machine wallet receives operational credit.</p>
                <p>{">"} Idle funds are allocated to Strata Senior.</p>
                <p>{">"} Yield helps subsidize logistics, maintenance, or recycling operations.</p>
              </div>
              <p className="font-black uppercase text-sm mb-2">SSI makes this safe by proving:</p>
              <ul className="list-disc list-inside font-bold space-y-1 mb-4">
                <li>The machine is real.</li>
                <li>The machine is authorized.</li>
                <li>The operator is approved.</li>
                <li>The policy allows Senior-only allocation.</li>
                <li>The transaction is within treasury limits.</li>
              </ul>
              <p className="font-bold">This turns Strata into a potential treasury layer for verified machine economies, DePIN systems, IoT networks, and autonomous operational wallets.</p>
            </div>

            {/* ITEM 5 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>5. Yield provenance and auditability</h3>
              <p className="font-bold mb-4">For real-world yield, it is not enough to say “yield was received.” We need to know where it came from.</p>
              <p className="font-bold mb-2">Our architecture introduces a yield provenance layer:</p>
              <div className="bg-black text-white p-4 border-[4px] border-black font-bold uppercase text-xs md:text-sm mb-6 flex flex-wrap items-center gap-2">
                physical event <span className="text-[#FF3366]">→</span> operational revenue <span className="text-[#FF3366]">→</span> treasury allocation <span className="text-[#FF3366]">→</span> Strata deposit <span className="text-[#FF3366]">→</span> yield received <span className="text-[#FF3366]">→</span> yield usage
              </div>
              <p className="font-bold mb-2">For an e-waste ecosystem, this means we can trace:</p>
              <div className="bg-black text-[#14F195] p-4 border-[4px] border-black font-bold uppercase text-xs md:text-sm mb-4 flex flex-wrap items-center gap-2">
                Collection event <span className="text-white">→</span> manufacturer reverse-logistics payment <span className="text-white">→</span> machine wallet balance <span className="text-white">→</span> Strata Senior allocation <span className="text-white">→</span> yield received <span className="text-white">→</span> logistics subsidy
              </div>
              <p className="font-black uppercase">The result is an auditable chain from physical activity to financial allocation.</p>
            </div>

            {/* ITEM 6 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>6. Stronger admin and oracle authorization</h3>
              <p className="font-bold mb-4">Strata’s security page describes separation between yield admin and emergency admin roles. Our SSI layer can strengthen that model by requiring verifiable role credentials before sensitive actions are allowed.</p>
              <p className="font-black text-sm text-zinc-500 uppercase mb-2">For example:</p>
              <ul className="list-none font-bold space-y-2">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black inline-block"></span> -Only a credentialed yield admin can inject yield.</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black inline-block"></span> -Only a credentialed emergency operator can trigger emergency workflows.</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-black inline-block"></span> -Only a credentialed auditor can approve yield reports.</li>
              </ul>
              <p className="font-bold mt-4">This adds identity-aware control on top of wallet-based RBAC.</p>
            </div>

            {/* ITEM 7 */}
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
              <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>7. Optional Authorization PDA enforcement</h3>
              <p className="font-bold mb-4">For MVP, the SSI layer can gate the API that builds Strata transactions. For production, it can go further:</p>
              <div className="flex flex-col items-center justify-center font-bold text-sm bg-black text-white border-[4px] border-black p-4 mb-4 text-center">
                <p>SSI proof verified off-chain</p>
                <span className="text-[#14F195] my-1">↓</span>
                <p>Backend creates short-lived Authorization PDA</p>
                <span className="text-[#14F195] my-1">↓</span>
                <p>User or machine submits Strata transaction</p>
                <span className="text-[#14F195] my-1">↓</span>
                <p>Anchor program checks Authorization PDA</p>
                <span className="text-[#14F195] my-1">↓</span>
                <p>Action executes only if authorization is valid</p>
              </div>
              <p className="font-bold">This prevents users, bots, or machines from bypassing the frontend/API and directly calling the program without eligibility.</p>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* BENEFITS FOR STRATA */}
        {/* ========================================== */}
        <section className="bg-[#14F195] border-[6px] border-black p-6 md:p-10 shadow-[15px_15px_0px_0px_#000]">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-8" style={{ fontFamily: "var(--font-bebas)" }}>
            Benefits for Strata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[4px] border-black bg-white p-4">
              <h4 className="font-black uppercase mb-2 text-lg">Compliance without unnecessary data exposure</h4>
              <p className="font-bold text-sm">Strata can support KYC, KYB, AML, accreditation, jurisdiction, and risk-suitability workflows without putting sensitive identity data on-chain.</p>
            </div>
            <div className="border-[4px] border-black bg-white p-4">
              <h4 className="font-black uppercase mb-2 text-lg">Better institutional readiness</h4>
              <p className="font-bold text-sm">Real-world yield products require stronger trust, audit, and eligibility controls. SSI makes the protocol more suitable for institutional, RWA, and regulated environments.</p>
            </div>
            <div className="border-[4px] border-black bg-white p-4">
              <h4 className="font-black uppercase mb-2 text-lg">Safer Junior tranche access</h4>
              <p className="font-bold text-sm">The Junior tranche carries first-loss risk. SSI allows Strata to require explicit eligibility and risk-acceptance proofs before allowing access.</p>
            </div>
            <div className="border-[4px] border-black bg-white p-4">
              <h4 className="font-black uppercase mb-2 text-lg">Machine-wallet compatibility</h4>
              <p className="font-bold text-sm">Autonomous devices, treasury agents, IoT nodes, and DePIN participants can interact with Strata under verifiable policies and strict limits.</p>
            </div>
            <div className="border-[4px] border-black bg-white p-4">
              <h4 className="font-black uppercase mb-2 text-lg">Cross-chain identity extensibility</h4>
              <p className="font-bold text-sm">The same user or machine can bind Solana identity, our system credentials, and EVM addresses into a unified identity graph for future cross-chain authorization.</p>
            </div>
            <div className="border-[4px] border-black bg-white p-4">
              <h4 className="font-black uppercase mb-2 text-lg">Stronger audit trails</h4>
              <p className="font-bold text-sm mb-2">Every sensitive action can be linked to:</p>
              <div className="flex flex-wrap gap-1 text-xs font-black uppercase text-white">
                <span className="bg-black px-1 py-0.5">wallet signature</span>
                <span className="bg-black px-1 py-0.5">DID</span>
                <span className="bg-black px-1 py-0.5">credential proof</span>
                <span className="bg-black px-1 py-0.5">policy decision</span>
                <span className="bg-black px-1 py-0.5">proof hash</span>
                <span className="bg-black px-1 py-0.5">transaction hash</span>
                <span className="bg-black px-1 py-0.5">timestamp</span>
              </div>
              <p className="font-bold text-sm mt-2">without exposing private credential contents.</p>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* EXAMPLE USE CASES */}
        {/* ========================================== */}
        <section>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tighter" style={{ fontFamily: "var(--font-bebas)", textShadow: "4px 4px 0px #FF3366" }}>
            Example Use Cases
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#FF3366]">
              <h4 className="font-black text-xl uppercase mb-4 border-b-[4px] border-black pb-2">Human investor onboarding</h4>
              <ul className="space-y-2 font-bold text-sm font-mono">
                <li>1. User connects wallet.</li>
                <li>2. User proves KYC and jurisdiction eligibility.</li>
                <li>3. User proves risk suitability.</li>
                <li>4. Backend authorizes Senior or Junior access.</li>
                <li>5. Strata transaction is generated only if policy passes.</li>
              </ul>
            </div>

            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#FF3366]">
              <h4 className="font-black text-xl uppercase mb-4 border-b-[4px] border-black pb-2">Institutional treasury</h4>
              <ul className="space-y-2 font-bold text-sm font-mono">
                <li>1. Company wallet proves KYB.</li>
                <li>2. Treasury policy allows Senior-only allocation.</li>
                <li>3. Backend verifies limits.</li>
                <li>4. Authorized deposit is executed.</li>
                <li>5. Audit log records the policy decision.</li>
              </ul>
            </div>

            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#FF3366]">
              <h4 className="font-black text-xl uppercase mb-4 border-b-[4px] border-black pb-2">E-waste machine wallet</h4>
              <ul className="space-y-2 font-bold text-sm font-mono">
                <li>1. Collection machine receives recycling material.</li>
                <li>2. Machine signs custody event.</li>
                <li>3. Operational credit is issued.</li>
                <li>4. Idle balance is allocated to Strata Senior.</li>
                <li>5. Yield subsidizes logistics or recycling operations.</li>
              </ul>
            </div>

            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#FF3366]">
              <h4 className="font-black text-xl uppercase mb-4 border-b-[4px] border-black pb-2">Yield admin control</h4>
              <ul className="space-y-2 font-bold text-sm font-mono">
                <li>1. Yield admin wallet signs update.</li>
                <li>2. SSI credential proves valid admin role.</li>
                <li>3. Backend checks policy.</li>
                <li>4. Yield update is accepted only from authorized operator.</li>
              </ul>
            </div>

            <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#FF3366] lg:col-span-2">
              <h4 className="font-black text-xl uppercase mb-4 border-b-[4px] border-black pb-2">Cross-chain proof layer</h4>
              <ul className="space-y-2 font-bold text-sm font-mono">
                <li>1. Solana wallet proves did:sol identity.</li>
                <li>2. Our credential system proves private eligibility.</li>
                <li>3. EVM compatible address is bound to the same identity.</li>
                <li>4. Future EVM contracts can recognize the same verified participant.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* POSITIONING STATEMENT */}
        {/* ========================================== */}
        <section className="bg-black text-white border-[6px] border-[#14F195] p-6 md:p-12 shadow-[15px_15px_0px_0px_#14F195]">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 text-[#14F195]" style={{ fontFamily: "var(--font-bebas)" }}>
            Positioning Statement
          </h2>
          <p className="text-xl md:text-2xl font-bold uppercase leading-relaxed mb-6">
            Our SSI contribution transforms Strata from a purely wallet-driven vault into a verifiable, privacy-preserving, compliance-aware, and machine-compatible financial protocol layer.
          </p>
          <div className="bg-[#111111] border-[4px] border-white p-6 mb-6">
            <p className="font-black text-lg uppercase text-[#FF3366] mb-2">It does not replace Strata’s Solana vault logic.</p>
            <p className="font-black text-lg uppercase text-[#14F195]">It enhances it.</p>
          </div>
          <ul className="space-y-3 font-bold text-lg border-l-[4px] border-[#14F195] pl-4">
            <li><span className="text-[#14F195] mr-2">-</span> Strata provides structured real-world yield mechanics.</li>
            <li><span className="text-[#14F195] mr-2">-</span> SSI provides identity, authorization, privacy, and provenance.</li>
            <li><span className="text-[#14F195] mr-2">-</span> Together, they create a safer foundation for real-world, machine-driven, and compliance-ready DeFi.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}