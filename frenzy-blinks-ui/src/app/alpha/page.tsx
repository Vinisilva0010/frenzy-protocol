"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function AlphaPage() {
  // Barra de progresso de leitura no topo (Agora em Rosa Choque)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // FIX DO TYPESCRIPT: 'any' aniquila o erro de tipagem estrita do Framer Motion
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans relative selection:bg-[#FF3366] selection:text-white">
      
      {/* 1. BARRA DE PROGRESSO DE LEITURA (ROSA) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-[#FF3366] origin-left z-50 border-b-[4px] border-black"
        style={{ scaleX }}
      />

      {/* 2. BACKGROUND ARCHITECTURE (Linhas de Velocidade / Grid) */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-32">
        
        {/* 3. CABEÇALHO DO DOSSIÊ */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-16">
          <div className="inline-block bg-black text-[#FF3366] font-mono font-black text-xs md:text-sm px-4 py-1 border-[4px] border-black shadow-[4px_4px_0px_0px_#FF3366] mb-6 uppercase tracking-widest">
            FRENZY PROTOCOL // OFFICIAL DEEP DIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: "var(--font-bebas)" }}>
            THE 10% ENGINE: <br/>
            <span className="text-zinc-400">THE AGGRESSIVE PROFILE</span>
          </h1>
        </motion.div>

        {/* 4. O PLAYER DE VÍDEO BRUTALISTA */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp} 
          className="w-full bg-[#111111] border-[8px] border-black p-4 shadow-[15px_15px_0px_0px_#000] mb-24 hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_#000] transition-all duration-300"
        >
          <div className="border-b-[4px] border-zinc-800 pb-2 mb-4 flex justify-between items-center px-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-[#FF3366] border-2 border-black rounded-full animate-pulse"></div>
              <span className="text-white font-mono font-black text-sm uppercase tracking-widest">EXECUTIVE BRIEFING</span>
            </div>
            <span className="text-zinc-500 font-mono text-xs">VIDEO_FEED_READY</span>
          </div>
          
          <div className="relative w-full aspect-video bg-black border-[4px] border-black overflow-hidden flex items-center justify-center group">
             {/* Insira seu IFRAME do YouTube Aqui */}
            <p className="text-zinc-600 font-mono text-xl uppercase font-black z-0">
              [ INSERT YOUTUBE EMBED HERE ]
            </p>
          </div>
        </motion.div>

        {/* 5. O CONTEÚDO DO DOCUMENTO (EM INGLÊS INSTITUCIONAL) */}
        <div className="space-y-20 text-lg md:text-2xl font-medium text-zinc-900 leading-relaxed max-w-4xl mx-auto">
          
          {/* INTRODUÇÃO */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-black text-[#FF3366] px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>Where the 10% of your money goes (Aggressive Profile)</strong>
            </p>
            <p className="mb-6">
              The Aggressive Profile is FRENZY's risk and reward engine. It was built for the investor who accepts volatility and doesn't mind being the system's "shield", as long as they are disproportionately compensated for it.
            </p>
            <p>
              Here, the 10% of the vault's capital acts as the protocol's frontline, assuming the risks in exchange for capturing all the excess profit from the operation.
            </p>
          </motion.section>

          {/* SEÇÃO 1 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#FF3366] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>1. The rule of the game: You are the system's "guarantor"</strong>
            </p>
            <p className="mb-6">
              While the 90% of the Conservative Profile are protected at the top, your money in the Aggressive Profile sits at the base of the structure.
            </p>
            <p>
              You are financing the exact same companies and receivables in Brazil, but your legal role is to act as the "first-loss piece". The system can only guarantee security for the most conservative participants because your money is down there, accepting to absorb the initial impacts.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-black text-white p-8 md:p-12 border-[6px] border-black shadow-[15px_15px_0px_0px_#FFE600] my-16 rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "THE SYSTEM ONLY GUARANTEES SECURITY BECAUSE YOUR MONEY IS AT THE BASE ABSORBING THE INITIAL IMPACTS."
            </p>
          </motion.div>

          {/* SEÇÃO 2 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#14F195] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>2. The math of profit: Why is the risk worth it?</strong>
            </p>
            <p className="mb-6">
              If you take all the risk, your reward must be aggressive. It works like this: the real-world credit portfolio generates a total profit. The protocol first pays the fixed and predictable slice agreed with the Conservatives. Everything left over goes 100% to the Aggressive Profile.
            </p>
            <p>
              Because this excess profit ("Alpha") falls entirely into a much smaller bucket (representing only 10% of the vault), the multiplier effect is gigantic. When the economy is doing well and default rates are low, the profitability of the Aggressive Profile can explode to levels far above traditional fixed income.
            </p>
          </motion.section>

          {/* SEÇÃO 3 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-[#111111] text-[#FF3366] px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>3. The default scenario (What you can lose)</strong>
            </p>
            <p className="mb-6">
              There is no free lunch. If the market turns and the financed companies default, the bill comes straight to you.
            </p>
            <p className="mb-6">
              If the overall operation suffers a 4% loss, for example, the Conservative loses nothing, but that entire 4% is sucked straight out of the Aggressive Profile's balance. You will see your balance drop.
            </p>
            <p>
              It is a high-voltage investment: you can lose part or even all of your capital if defaults in the real world are extreme.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-white p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_0px_#FF3366] my-16 -rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "EXCESS PROFIT FALLS INTO A MUCH SMALLER BUCKET. THE MULTIPLIER EFFECT IS GIGANTIC."
            </p>
          </motion.div>

          {/* SEÇÃO 4 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#FFE600] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>4. Where does this exist in the real world?</strong>
            </p>
            <p className="mb-6">
              This is not a theoretical crypto invention. In the traditional financial market, this structure is known as the "Subordinated Tranche" (Cota Subordinada) of a FIDC.
            </p>
            <p>
              Large banks, asset managers, and qualified investors buy these tranches every day in Brazil. They know that, with the right credit analysis, the premium for taking on this risk usually puts a lot of money in their pockets over the long term.
            </p>
          </motion.section>

          {/* SEÇÃO 5 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-white border-2 border-black text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>5. Withdrawals: The last to leave</strong>
            </p>
            <p className="mb-6">
              The money is lent out in the real world, so withdrawals are not T+0 (instantaneous).
            </p>
            <p>
              Furthermore, because the Aggressive Profile is the guarantee that the protocol will not break, its liquidity is the most restricted. Redemption requests follow strict windows, and you can only withdraw if the fund has the financial health to release the protection without exposing the Conservative Profile.
            </p>
          </motion.section>

          {/* SEÇÃO 6 (HACKATHON DISCLAIMER) */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-black text-white px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>6. Current state: Simulation and Proof of Concept</strong>
            </p>
            <p className="mb-6">
              Within the hackathon, you will not lose real money. The system is running in a simulation environment. The Solana smart contract has already been programmed to calculate this brutal math: if you press the default simulation button on the dashboard, you will see the Aggressive balance melt. If you press the profit button, you will see the balance skyrocket.
            </p>
            <p>
              The official connection with real-world FIDCs and fiat currency (BRL) will be the next stage of regulatory development.
            </p>
          </motion.section>
          
          {/* FIM DA LEITURA - AÇÕES */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-full text-center pt-24 pb-12 flex flex-col md:flex-row justify-center gap-6"
          >
            <a 
              href="/demo" 
              className="inline-block bg-[#FF3366] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[10px_10px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-4xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                TEST THE PROTOCOL
              </span>
            </a>
            
            <a 
              href="/whitepaper" 
              className="inline-block bg-[#00E1FD] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[10px_10px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-4xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                READ THE 90% SHIELD
              </span>
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}