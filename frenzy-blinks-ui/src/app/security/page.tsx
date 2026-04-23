"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SecurityAuditPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // VETORES DE ATAQUE ATUALIZADOS PARA A FASE 2
  const attackVectors = [
    {
      id: "01",
      title: "ZERO-TRUST MATH",
      color: "#00E1FD",
      shadowDesk: "shadow-[12px_12px_0px_0px_#00E1FD]",
      shadowHover: "hover:shadow-[6px_6px_0px_0px_#00E1FD]",
      content: (
        <p className="text-zinc-400 font-mono text-sm">
          Instead of trusting the frontend UI to calculate yields, <strong className="text-white">100% of the financial math happens on-chain</strong>. The Smart Contract strictly calculates the Senior/Junior splits internally using <code className="bg-black text-[#00E1FD] px-1 py-0.5 border border-zinc-700">checked_math</code>, making yield manipulation impossible.
        </p>
      )
    },
    {
      id: "02",
      title: "STRICT MEMORY LAYOUT",
      color: "#FFE600",
      shadowDesk: "shadow-[12px_12px_0px_0px_#FFE600]",
      shadowHover: "hover:shadow-[6px_6px_0px_0px_#FFE600]",
      content: (
        <p className="text-zinc-400 font-mono text-sm">
          We utilize Zero-Copy serialization with a rigid <strong className="text-white">88-byte architectural layout</strong>. If a malicious actor attempts to inject a corrupted account or a fake vault PDA, the Anchor framework rejects the memory mismatch before the code even executes.
        </p>
      )
    },
    {
      id: "03",
      title: "DECENTRALIZED RBAC",
      color: "#14F195",
      shadowDesk: "shadow-[12px_12px_0px_0px_#14F195]",
      shadowHover: "hover:shadow-[6px_6px_0px_0px_#14F195]",
      content: (
        <p className="text-zinc-400 font-mono text-sm">
          Total separation of powers via our <code className="bg-black text-[#14F195] px-1 py-0.5 border border-zinc-700">ProtocolConfig</code>. The wallet that injects daily yields (<strong className="text-white">yield_admin</strong>) has zero access to protocol governance, eliminating Single Points of Failure (SPOF) if an oracle key is compromised.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans relative selection:bg-[#FFE600] selection:text-black overflow-hidden">
      
      {/* BARRA DE PROGRESSO */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-[#FFE600] origin-left z-50 border-b-[4px] border-black"
        style={{ scaleX }}
      />

      {/* BACKGROUND BRUTALISTA */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: "center center"
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border-[2px] border-[#FFE600] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-[#FFE600] -translate-y-1/2 opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 h-full w-[1px] bg-[#FFE600] -translate-x-1/2 opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-32">
        
        {/* HEADER */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-20 text-center md:text-left">
          <div className="inline-block bg-[#FFE600] text-black font-mono font-black text-xs md:text-sm px-4 py-1 border-[4px] border-black shadow-[6px_6px_0px_0px_#000] mb-6 uppercase tracking-widest">
            STATUS: SECURE // AUDIT: PHASE 2 COMPLETE
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white" style={{ fontFamily: "var(--font-bebas)", textShadow: "6px 6px 0px #000" }}>
            INSTITUTIONAL GRADE <br/>
            <span className="text-[#14F195]">SECURITY ARCHITECTURE</span>
          </h1>
          <p className="mt-6 text-zinc-400 font-mono font-bold text-lg md:text-xl uppercase border-l-[4px] border-[#14F195] pl-4 max-w-3xl">
            Mathematical certainty, isolated vaults, and continuous protection against systemic DeFi risks.
          </p>
        </motion.div>

        {/* SECURITY STATEMENT */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="bg-white text-black border-[8px] border-black p-8 md:p-12 shadow-[20px_20px_0px_0px_#14F195] mb-24 relative"
        >
          <div className="absolute -top-[12px] -left-[12px] right-[100px] h-[24px] bg-[#FFE600] border-y-[4px] border-black z-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)" }}></div>

          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8" style={{ fontFamily: "var(--font-bebas)" }}>
            THE SECURITY-FIRST APPROACH
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-medium text-lg leading-relaxed text-zinc-800">
            <div>
              <h3 className="font-black font-mono text-xl uppercase mb-4 text-[#FF3366]">No Global Honeypots</h3>
              <p className="mb-6">
                Most DeFi protocols pool all user funds into massive, single contracts—creating a multi-million dollar target for hackers. FRENZY is different. We engineered an <strong className="text-black bg-[#00E1FD] px-1">Isolated Vault Architecture</strong>.
              </p>
              <p>
                Every user gets their own cryptographically isolated PDA (Program Derived Address). An attack vector on one state cannot cause systemic cascading failures across the protocol.
              </p>
            </div>
            
            <div className="bg-[#111111] text-white p-6 border-[6px] border-black shadow-[8px_8px_0px_0px_#FFE600] -rotate-1">
              <h3 className="font-black font-mono text-xl uppercase mb-4 text-[#FFE600]">Verified by Adevar Labs</h3>
              <p className="font-mono text-sm leading-relaxed text-zinc-300">
                To bridge traditional Real World Assets (RWAs) to the blockchain, trust is not enough. We require verifiable truth. 
              </p>
              <p className="font-mono text-sm leading-relaxed text-zinc-300 mt-4 border-l-[2px] border-[#FFE600] pl-4">
                Our architecture has undergone adversarial validation by <strong className="text-[#FFE600]">Adevar Labs</strong>, ensuring our mitigations against low-level reentrancy, overflow attacks, and unauthorized Oracle injections are practically impenetrable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* VETORES DE ATAQUE (O FLEX) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-24">
          <div className="mb-10 border-b-[6px] border-zinc-800 pb-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: "var(--font-bebas)" }}>
              ATTACK VECTORS & <span className="text-[#FF3366]">MITIGATIONS</span>
            </h2>
            <p className="text-zinc-500 font-mono uppercase mt-2">How our Rust Smart Contracts neutralize threats instantly.</p>
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {attackVectors.map((card, i) => (
              <div key={i} className={`bg-[#111111] border-[6px] border-black p-8 ${card.shadowDesk} hover:translate-x-1 hover:translate-y-1 ${card.shadowHover} transition-all group`}>
                <div className={`w-12 h-12 border-[4px] border-black flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`} style={{ backgroundColor: card.color }}>
                  <span className="text-black font-black font-mono text-xl">{card.id}</span>
                </div>
                <h3 className="text-white font-black text-2xl uppercase mb-3" style={{ fontFamily: "var(--font-bebas)" }}>{card.title}</h3>
                {card.content}
              </div>
            ))}
          </div>

          {/* MOBILE SLIDER */}
          <div className="block md:hidden">
            <div className="relative min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-[#111111] border-[6px] border-black p-6"
                  style={{ boxShadow: `8px 8px 0px 0px ${attackVectors[activeCard].color}` }}
                >
                  <div className="w-10 h-10 border-[3px] border-black flex items-center justify-center mb-4" style={{ backgroundColor: attackVectors[activeCard].color }}>
                    <span className="text-black font-black font-mono text-lg">{attackVectors[activeCard].id}</span>
                  </div>
                  <h3 className="text-white font-black text-xl uppercase mb-3" style={{ fontFamily: "var(--font-bebas)" }}>{attackVectors[activeCard].title}</h3>
                  {attackVectors[activeCard].content}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {attackVectors.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCard(idx)}
                  className={`w-3 h-3 rounded-none border-[2px] border-black transition-colors ${activeCard === idx ? "bg-white" : "bg-zinc-800"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* TEST SUITE PROOF */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-24">
          <div className="w-full bg-[#1e1e1e] border-[8px] border-black shadow-[15px_15px_0px_0px_#9945FF] overflow-hidden">
            <div className="bg-black border-b-[4px] border-black px-4 py-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FF3366] rounded-full border-[2px] border-black"></div>
              <div className="w-4 h-4 bg-[#FFE600] rounded-full border-[2px] border-black"></div>
              <div className="w-4 h-4 bg-[#14F195] rounded-full border-[2px] border-black"></div>
              <span className="ml-4 text-zinc-500 font-mono text-xs uppercase overflow-hidden text-ellipsis whitespace-nowrap">anchor test --skip-local-validator</span>
            </div>
            
            {/* TIREI O ASPECT RATIO FIXO: Agora o container abraça o tamanho real da imagem */}
            <div className="w-full bg-black relative p-2 md:p-4">
              <div className="w-full border-2 border-dashed border-zinc-700 bg-zinc-900/50 overflow-hidden flex items-center justify-center">
                {/* COLE SEU PRINT GERAL DOS TESTES AQUI */}
                <img 
                  src="/img-suite1.png" 
                  alt="Test Suite Execution" 
                  className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white border-[6px] border-black p-6 mt-6 shadow-[8px_8px_0px_0px_#000] rotate-1">
            <p className="text-black font-mono font-black text-sm md:text-base uppercase text-center">
              "We actively simulate low-level intrusions, vault setups, and ownership handovers to guarantee the contract executes securely in every scenario."
            </p>
          </div>
        </motion.div>

       {/* ADVANCED MODULES (OS 4 SLOTS) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="mb-10 border-b-[6px] border-zinc-800 pb-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: "var(--font-bebas)" }}>
              ADVANCED <span className="text-[#00E1FD]">SECURITY MODULES</span>
            </h2>
            <p className="text-zinc-500 font-mono uppercase mt-2">Active defense systems running in production.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Slot 1: Bank Run */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#FFE600] transition-colors group">
              <h3 className="text-white group-hover:text-[#FFE600] font-black text-3xl uppercase mb-4 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                01. Anti-Bank Run & Time-Locks
              </h3>
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Liquidity is the oxygen of DeFi. To neutralize "Flash Loan" attacks and extreme panic scenarios, we deployed a strict temporal circuit breaker. Any consecutive withdrawal attempt before the <strong className="text-white">24-hour cooling window</strong> is blocked directly by the blockchain clock (<code className="text-[#FFE600] bg-zinc-900 px-1">Clock::get()</code>).
              </p>
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#FFE600] transition-colors bg-zinc-900 relative">
                {/* COLE SEU PRINT DO TESTE 'frenzy_vault.ts' AQUI */}
                <img 
                  src="/img-vault-test.png" 
                  alt="Vault Math Test Proof" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>

            {/* Slot 2: Kill Switch */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#FF3366] transition-colors group">
              <h3 className="text-white group-hover:text-[#FF3366] font-black text-3xl uppercase mb-4 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                02. The Emergency Kill-Switch
              </h3>
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                In the event of unprecedented network volatility, the isolated <strong className="text-white">emergency_admin</strong> can flip the Global Kill-Switch. This instantly freezes all protocol operations, pausing deposits and withdrawals to preserve treasury capital until the anomaly is resolved.
              </p>
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#FF3366] transition-colors bg-zinc-900 relative">
                {/* COLE SEU PRINT DO TESTE 'setup.ts' AQUI */}
                <img 
                  src="/img-setup-test.png" 
                  alt="Setup & RBAC Test Proof" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>

            {/* Slot 3: Secure Handover */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#14F195] transition-colors group">
              <h3 className="text-white group-hover:text-[#14F195] font-black text-3xl uppercase mb-4 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                03. Secure Protocol Handover
              </h3>
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Decentralization requires secure transitions. Our protocol includes a rigorously tested handover sequence, ensuring that administrative privileges (Master, Yield, and Emergency keys) can be safely migrated to institutional multisig wallets without exposing the protocol to intermediary takeover attacks.
              </p>
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#14F195] transition-colors bg-zinc-900 relative">
                {/* COLE SEU PRINT DO TESTE 'handover.ts' AQUI */}
                <img 
                  src="/img-handover-test.png" 
                  alt="Handover Test Proof" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>

            {/* Slot 4: API Shield */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#9945FF] transition-colors group relative">
              <div className="absolute top-0 right-0 bg-zinc-900 group-hover:bg-[#9945FF] text-zinc-500 group-hover:text-white font-black text-[10px] px-3 py-1 uppercase font-mono border-b-[4px] border-l-[4px] border-zinc-800 group-hover:border-black transition-all">
                FULL-STACK DEFENSE
              </div>
              <h3 className="text-white group-hover:text-[#9945FF] font-black text-3xl uppercase mb-4 mt-2 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                04. Blink API Shielding
              </h3>
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Smart contracts are only as secure as their access points. To protect our Solana Actions (Blinks), we implemented strict dynamic rate-limiting algorithms to filter out DDoS spam, alongside cryptographic CORS policies to guarantee clients interact cleanly with our RPC nodes.
              </p>
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#9945FF] transition-colors bg-zinc-900 relative">
                {/* SUA IMAGEM DE API PODE FICAR AQUI */}
                <img 
                  src="/api.png" 
                  alt="API Shield" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}