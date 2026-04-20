"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SecurityAuditPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Estado e Timer para o Carrossel Mobile
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 4000); // Troca de card a cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  // Animação brutalista
  const fadeUp: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Dados dos vetores de ataque isolados para rodar no Desktop e no Mobile
  const attackVectors = [
    {
      id: "01",
      title: "PDA HIJACK PREVENTION",
      color: "#00E1FD",
      shadowDesk: "shadow-[12px_12px_0px_0px_#00E1FD]",
      shadowHover: "hover:shadow-[6px_6px_0px_0px_#00E1FD]",
      content: (
        <p className="text-zinc-400 font-mono text-sm">
          Anchor cryptographically validates signatures. Withdrawal operations carry strict constraints via <code className="bg-black text-[#00E1FD] px-1 py-0.5 border border-zinc-700">has_one = authority</code>, making it mathematically impossible to hijack transactions or manipulate accounts in CPI constructions.
        </p>
      )
    },
    {
      id: "02",
      title: "ORACLE SPOOFING SHIELD",
      color: "#FFE600",
      shadowDesk: "shadow-[12px_12px_0px_0px_#FFE600]",
      shadowHover: "hover:shadow-[6px_6px_0px_0px_#FFE600]",
      content: (
        <p className="text-zinc-400 font-mono text-sm">
          We implemented an isolated admin key (Kill-Switch) acting as a hardcoded <code className="bg-black text-[#FFE600] px-1 py-0.5 border border-zinc-700">ORACLE_ADMIN</code>. Any false data injection is instantly reverted, preventing cascading liquidations in the High-Performance pillar.
        </p>
      )
    },
    {
      id: "03",
      title: "MATH OVERFLOW IMMUNITY",
      color: "#14F195",
      shadowDesk: "shadow-[12px_12px_0px_0px_#14F195]",
      shadowHover: "hover:shadow-[6px_6px_0px_0px_#14F195]",
      content: (
        <p className="text-zinc-400 font-mono text-sm">
          100% of state transitions utilize safe math libraries <code className="bg-black text-[#14F195] px-1 py-0.5 border border-zinc-700">checked_math</code>. This prevents integer underflow/overflow attacks and eliminates precision manipulation vectors in u64.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans relative selection:bg-[#FFE600] selection:text-black overflow-hidden">
      
      {/* 1. BARRA DE PROGRESSO (AMARELO ALERTA) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-[#FFE600] origin-left z-50 border-b-[4px] border-black"
        style={{ scaleX }}
      />

      {/* 2. BACKGROUND DE SEGURANÇA MILITAR (Crosshairs Grid) */}
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
        
        {/* ========================================== */}
        {/* 1. CABEÇALHO DO RELATÓRIO DE AUDITORIA      */}
        {/* ========================================== */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-20 text-center md:text-left">
          <div className="inline-block bg-[#FFE600] text-black font-mono font-black text-xs md:text-sm px-4 py-1 border-[4px] border-black shadow-[6px_6px_0px_0px_#000] mb-6 uppercase tracking-widest">
            STATUS: SECURE // CLASSIFICATION: PUBLIC
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white" style={{ fontFamily: "var(--font-bebas)", textShadow: "6px 6px 0px #000" }}>
            SECURITY ARCHITECTURE <br/>
            <span className="text-[#14F195]">& AUDIT REPORT</span>
          </h1>
          <p className="mt-6 text-zinc-400 font-mono font-bold text-lg md:text-xl uppercase border-l-[4px] border-[#14F195] pl-4 max-w-3xl">
            On-chain transparency, risk mitigation, and continuous commitment to user security.
          </p>
        </motion.div>

        {/* ========================================== */}
        {/* 2. THE SECURITY STATEMENT                  */}
        {/* ========================================== */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="bg-white text-black border-[8px] border-black p-8 md:p-12 shadow-[20px_20px_0px_0px_#14F195] mb-24 relative"
        >
          <div className="absolute -top-[12px] -left-[12px] right-[100px] h-[24px] bg-[#FFE600] border-y-[4px] border-black z-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)" }}></div>

          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8" style={{ fontFamily: "var(--font-bebas)" }}>
            FRENZY PROTOCOL: SECURITY STATEMENT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-medium text-lg leading-relaxed text-zinc-800">
            <div>
              <h3 className="font-black font-mono text-xl uppercase mb-4 text-[#FF3366]">The "Security-First" Approach</h3>
              <p className="mb-6">
                FRENZY Protocol was architected with a fundamental premise: in Decentralized Finance (DeFi) and Real World Assets (RWA) integration, security is not an add-on feature—it is the very foundation of the product.
              </p>
              <p>
                Our architecture adopts an <strong className="text-black bg-[#00E1FD] px-1">Isolated Vaults Model (Smart Wallet Architecture via PDAs)</strong>. Unlike protocols that utilize massive "Honeypots" (Global Liquidity Pools) that become huge targets for exploits, each FRENZY user possesses an isolated vault state on the Solana blockchain. An isolated compromise does not generate systemic risk.
              </p>
            </div>
            
            <div className="bg-[#111111] text-white p-6 border-[6px] border-black shadow-[8px_8px_0px_0px_#FFE600] -rotate-1">
              <h3 className="font-black font-mono text-xl uppercase mb-4 text-[#FFE600]">Why Adevar Labs is crucial</h3>
              <p className="font-mono text-sm leading-relaxed text-zinc-300">
                Our Roadmap includes bridging global capital to Traditional Assets and Brazilian Fixed Income (via RWAs and institutional partnerships). To handle real institutional capital, our own adversarial testing is not enough. 
              </p>
              <p className="font-mono text-sm leading-relaxed text-zinc-300 mt-4 border-l-[2px] border-[#FFE600] pl-4">
                We need the analytical rigor of <span className="text-[#FFE600] font-black">Adevar Labs</span> to validate our mitigations against low-level reentrancy, PDA hijacking, and to ensure that the bridge between our Protection Pillar (Liquid Staking) and the user's capital is mathematically unbreakable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* 3. VETORES DE ATAQUE (O FLEX DO RUST)      */}
        {/* ========================================== */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-24">
          <div className="mb-10 border-b-[6px] border-zinc-800 pb-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: "var(--font-bebas)" }}>
              ATTACK VECTORS & <span className="text-[#FF3366]">MITIGATIONS</span>
            </h2>
            <p className="text-zinc-500 font-mono uppercase mt-2">Institutional-grade on-chain defenses implemented via Anchor/Rust.</p>
          </div>

          {/* === VERSÃO DESKTOP (GRID DE 3) === */}
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

          {/* === VERSÃO MOBILE (CARROSSEL AUTOMÁTICO) === */}
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
            
            {/* Pontos de navegação do carrossel */}
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

        {/* ========================================== */}
        {/* 4. A PROVA DO CRIME (TERMINAL DE TESTES)   */}
        {/* ========================================== */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-24">
          <div className="w-full bg-[#1e1e1e] border-[8px] border-black shadow-[15px_15px_0px_0px_#9945FF] overflow-hidden">
            <div className="bg-black border-b-[4px] border-black px-4 py-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FF3366] rounded-full border-[2px] border-black"></div>
              <div className="w-4 h-4 bg-[#FFE600] rounded-full border-[2px] border-black"></div>
              <div className="w-4 h-4 bg-[#14F195] rounded-full border-[2px] border-black"></div>
              <span className="ml-4 text-zinc-500 font-mono text-xs uppercase overflow-hidden text-ellipsis whitespace-nowrap">anchor test --skip-local-validator</span>
            </div>
            
            <div className="w-full aspect-video md:aspect-[21/9] bg-black relative flex items-center justify-center p-4">
              <div className="w-full h-full border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center bg-zinc-900/50 text-center">
                <span className="text-[#9945FF] font-mono text-xl md:text-2xl font-black mb-2 px-2"><img src="/img-suite.png" /></span>
                
              </div>
            </div>
          </div>
          
          <div className="bg-white border-[6px] border-black p-6 mt-6 shadow-[8px_8px_0px_0px_#000] rotate-1">
            <p className="text-black font-mono font-black text-sm md:text-base uppercase text-center">
              "Our test suite doesn't just validate the happy path. We actively simulate low-level intrusions in the CI/CD pipeline to guarantee the contract reverts malicious transactions."
            </p>
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* 5. ROADMAP DE SEGURANÇA (OS 4 SLOTS VAZIOS)*/}
        {/* ========================================== */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="mb-10 border-b-[6px] border-zinc-800 pb-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: "var(--font-bebas)" }}>
              ADVANCED <span className="text-[#00E1FD]">SECURITY MODULES</span>
            </h2>
            <p className="text-zinc-500 font-mono uppercase mt-2">Features currently in deployment / pending documentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slot 1: RBAC (Atualizado) */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#00E1FD] transition-colors group">
              <h3 className="text-white group-hover:text-[#00E1FD] font-black text-3xl uppercase mb-4 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                01. Decentralized Role-Based Access (RBAC)
              </h3>
              
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Institutional security requires the elimination of Single Points of Failure (SPOF). We architected a Global Protocol State (<code className="bg-zinc-900 text-[#00E1FD] px-1 py-0.5 border border-zinc-800">ProtocolConfig</code>) that rigidly separates administrative privileges into three isolated instances:
              </p>
              
              <ul className="text-zinc-400 font-mono text-sm mb-6 space-y-2 pl-4 border-l-[2px] border-zinc-800 group-hover:border-[#00E1FD] transition-colors">
                <li><strong className="text-white">Master_Admin:</strong> Exclusive governance (Immutable).</li>
                <li><strong className="text-white">Yield_Admin:</strong> Strict permission solely for injecting operational profits.</li>
                <li><strong className="text-white">Emergency_Admin:</strong> Surgically isolated solely to trigger the Kill-Switch.</li>
              </ul>
              
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                If the yield injection key is compromised, the attacker is mathematically incapable of halting the protocol or altering governance rules. This mitigation was validated at the blockchain level through our adversarial testing.
              </p>

             <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#FFE600] transition-colors bg-zinc-900 relative">
                <img 
                  src="/slot2.png" 
                  alt="Cooldown Terminal Test Proof" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>
            {/* Slot 2: Anti-Bank Run & Withdrawal Cooldown (Atualizado) */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#FFE600] transition-colors group">
              <h3 className="text-white group-hover:text-[#FFE600] font-black text-3xl uppercase mb-4 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                02. Anti-Bank Run & Withdrawal Cooldown
              </h3>
              
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                A DeFi protocol's liquidity is its oxygen. To mitigate the risks of "Bank Runs" and Flash Loan attacks during extreme market volatility, we implemented a rigid temporal circuit breaker directly at the Smart Contract level.
              </p>
              
              <ul className="text-zinc-400 font-mono text-sm mb-6 space-y-2 pl-4 border-l-[2px] border-zinc-800 group-hover:border-[#FFE600] transition-colors">
                <li><strong className="text-white">Cryptographic Time-Lock:</strong> The native Solana cluster clock (<code className="bg-zinc-900 text-[#FFE600] px-1 py-0.5 border border-zinc-800">Clock::get()</code>) validates the exact interval between withdrawals.</li>
                <li><strong className="text-white">Flash Loan Blocking:</strong> Makes it mathematically impossible for malicious algorithms to drain the vault within a single block.</li>
                <li><strong className="text-white">Treasury Preservation:</strong> Ensures the protocol and RWA managers have adequate time for institutional liquidity rebalancing.</li>
              </ul>
              
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                Any consecutive withdrawal attempt before the 24-hour (86,400 seconds) cooling-off window is summarily reverted by the Solana Virtual Machine (SVM), returning the security code <code className="bg-zinc-900 text-[#FFE600] px-1 py-0.5 border border-zinc-800">WithdrawalCooldownActive</code>.
              </p>

              {/* IMAGEM DA PROVA (TERMINAL) */}
              {/* IMAGEM DA PROVA (TERMINAL) */}
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#FFE600] transition-colors bg-zinc-900 relative">
                <img 
                  src="/slop3.png" 
                  alt="Cooldown Terminal Test Proof" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>
            {/* Slot 3: Frontend & Blink API Shielding (Atualizado) */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#14F195] transition-colors group">
              <h3 className="text-white group-hover:text-[#14F195] font-black text-3xl uppercase mb-4 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                03. Frontend & Blink API Shielding
              </h3>
              
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Smart contracts are only as secure as their access points. Since our protocol utilizes Solana Actions (Blinks) for seamless user onboarding, the API endpoints represent a potential vector for Layer 7 DDoS attacks and malicious bot spam.
              </p>
              
              <ul className="text-zinc-400 font-mono text-sm mb-6 space-y-2 pl-4 border-l-[2px] border-zinc-800 group-hover:border-[#14F195] transition-colors">
                <li><strong className="text-white">Strict CORS Implementation:</strong> API access is cryptographically restricted to verified client environments using the official <code className="bg-zinc-900 text-[#14F195] px-1 py-0.5 border border-zinc-800">@solana/actions</code> strict header definitions.</li>
                <li><strong className="text-white">Dynamic Rate Limiting:</strong> Middleware enforces strict request limits per IP address, automatically dropping malicious traffic spikes before they reach our RPC nodes.</li>
                <li><strong className="text-white">RPC Endpoint Masking:</strong> Client-side interactions never expose our dedicated institutional RPC endpoints, preventing infrastructure quota drainage.</li>
              </ul>
              
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                By securing the off-chain infrastructure, we guarantee high availability for legitimate users while completely neutralizing application-layer attacks.
              </p>

              {/* IMAGEM DA PROVA (TERMINAL) */}
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#14F195] transition-colors bg-zinc-900 relative">
                {/* Lembre-se de salvar a sua imagem com o nome 'img-api.png' na pasta 'public' */}
                <img 
                  src="/img-api.png" 
                  alt="API Shield Test Proof" 
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-4 relative z-10 group-hover:z-50 shadow-none group-hover:shadow-[15px_15px_0px_0px_#000]" 
                />
              </div>
            </div>
            {/* Slot 4: CI/CD Pipeline (Atualizado) */}
            <div className="bg-black border-[4px] border-solid border-zinc-800 p-8 hover:border-[#9945FF] transition-colors group relative">
              
              {/* BADGE: ULTIMATE DIFFERENTIATOR */}
              <div className="absolute top-0 right-0 bg-zinc-900 group-hover:bg-[#9945FF] text-zinc-500 group-hover:text-white font-black text-[10px] px-3 py-1 uppercase font-mono border-b-[4px] border-l-[4px] border-zinc-800 group-hover:border-black transition-all">
                ULTIMATE DIFFERENTIATOR
              </div>

              <h3 className="text-white group-hover:text-[#9945FF] font-black text-3xl uppercase mb-4 mt-2 transition-colors" style={{ fontFamily: "var(--font-bebas)" }}>
                04. The Continuous Auditor (CI/CD Pipeline)
              </h3>
              
              <p className="text-zinc-400 font-mono text-sm mb-4 leading-relaxed">
                Security is an ongoing commitment, not a one-time event. To prevent future regressions and catch vulnerabilities before deployment, we implemented a rigorous Continuous Integration and Continuous Deployment (CI/CD) pipeline directly into our repository architecture.
              </p>
              
              <ul className="text-zinc-400 font-mono text-sm mb-6 space-y-2 pl-4 border-l-[2px] border-zinc-800 group-hover:border-[#9945FF] transition-colors">
                <li><strong className="text-white">Automated Adversarial Testing:</strong> Every code commit automatically triggers a clean-room environment that executes our full suite of localnet security tests.</li>
                <li><strong className="text-white">Static Code Analysis:</strong> Strict Rust compilers and linters (<code className="bg-zinc-900 text-[#9945FF] px-1 py-0.5 border border-zinc-800">Clippy</code>) enforce memory safety and proactively prevent logic overflows.</li>
                <li><strong className="text-white">Immutable Deployment Gates:</strong> Vulnerable code is programmatically blocked at the repository level from reaching the mainnet environment.</li>
              </ul>
              
              <p className="text-zinc-400 font-mono text-sm mb-8 leading-relaxed">
                By automating our security audits at the foundation, we ensure that the FRENZY Protocol remains mathematically secure and tamper-proof as we scale operations toward institutional adoption.
              </p>

              {/* IMAGEM DA PROVA (TERMINAL) */}
              <div className="w-full border-[2px] border-dashed border-zinc-700 p-1 group-hover:border-[#9945FF] transition-colors bg-zinc-900 relative">
                
                <img 
                  src="/img-cicd-test.png" 
                  alt="CI/CD Pipeline Test Proof" 
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