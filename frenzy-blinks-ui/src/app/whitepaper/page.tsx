"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ConservativePage() {
  // Barra de progresso de leitura no topo (Ciano para Segurança)
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
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans relative selection:bg-[#00E1FD] selection:text-black">
      
      {/* 1. BARRA DE PROGRESSO DE LEITURA */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-[#00E1FD] origin-left z-50 border-b-[4px] border-black"
        style={{ scaleX }}
      />

      {/* 2. BACKGROUND ARCHITECTURE (Blueprint Style) */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-32">
        
        {/* 3. CABEÇALHO DO DOSSIÊ */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-16">
          <div className="inline-block bg-black text-[#00E1FD] font-mono font-black text-xs md:text-sm px-4 py-1 border-[4px] border-black shadow-[4px_4px_0px_0px_#00E1FD] mb-6 uppercase tracking-widest">
            FRENZY PROTOCOL // OFFICIAL DEEP DIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: "var(--font-bebas)" }}>
            THE 90% SHIELD: <br/>
            <span className="text-zinc-400">THE CONSERVATIVE PROFILE</span>
          </h1>
        </motion.div>

        {/* 4. O PLAYER DE VÍDEO BRUTALISTA */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp} 
          className="w-full bg-[#111111] border-[8px] border-black p-4 shadow-[15px_15px_0px_0px_#000] mb-24 hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_#000] transition-all duration-300"
        >
          <div className="border-b-[4px] border-zinc-800 pb-2 mb-4 flex justify-between items-center px-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-[#00E1FD] border-2 border-black rounded-full animate-pulse"></div>
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
              <strong className="text-2xl md:text-3xl font-black bg-black text-[#00E1FD] px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>Where the 90% of your money goes (Conservative Profile)</strong>
            </p>
            <p className="mb-6">
              The Conservative Profile is the part of the vault designed for those who don't want adrenaline, they want predictability.
            </p>
            <p>
              Here, 90% of what you deposit focuses on protecting your capital and seeking an income similar to fixed-income investments in the Brazilian market, backed by Solana technology.
            </p>
          </motion.section>

          {/* SEÇÃO 1 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#00E1FD] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>1. Where the money goes when you deposit</strong>
            </p>
            <p className="mb-6">
              When you deposit into FRENZY, the money doesn't go to a person's or company's account. It enters a smart contract on the Solana network, a "code vault" that registers everything publicly and automatically.
            </p>
            <p>
              Inside this vault, the system separates the capital into two parts: 90% goes to the Conservative Profile (you are here) and 10% goes to the Aggressive Profile, which takes on more risk in exchange for higher potential returns.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-black text-white p-8 md:p-12 border-[6px] border-black shadow-[15px_15px_0px_0px_#00E1FD] my-16 rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "THE MONEY DOESN'T GO TO A PERSON'S ACCOUNT. IT ENTERS A CODE VAULT ON THE SOLANA NETWORK."
            </p>
          </motion.div>

          {/* SEÇÃO 2 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#14F195] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>2. How these 90% work in the real world</strong>
            </p>
            <p className="mb-6">
              The 90% of the Conservative Profile don't just sit idle on the blockchain.
            </p>
            <p className="mb-6">
              They are connected to the Brazilian credit market through regulated structures, such as FIDCs (Credit Rights Investment Funds) and securitization companies, which finance businesses using receivables portfolios (e.g., credit card receivables, trade notes, and corporate contracts).
            </p>
            <p>
              In practice, your money becomes part of a structure that lends to companies, and these companies pay interest to use that capital.
            </p>
          </motion.section>

          {/* SEÇÃO 3 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-[#FFE600] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>3. How much it can yield (no lies)</strong>
            </p>
            <p className="mb-6">
              The Conservative Profile doesn't promise a fixed monthly yield number.
            </p>
            <p className="mb-6">
              The idea is to track the logic of Brazilian fixed income, which typically uses the CDI (Interbank Deposit Certificate) as a benchmark, currently hovering around 14–15% per year (varying over time).
            </p>
            <p className="mb-6">
              Structured credit funds similar to what inspired FRENZY usually aim for ranges like "CDI plus a credit premium", something like CDI +2% to CDI +5% per year, depending on the risk, the quality of the receivables, and the market scenario.
            </p>
            <p>
              FRENZY is inspired by this type of operation, but does not guarantee an exact percentage: the actual return may fall above or below this range, depending on the behavior of the economy, interest rates, and the credit portfolio.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-white p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_0px_#FFE600] my-16 -rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "THE IDEA IS TO TRACK THE LOGIC OF BRAZILIAN FIXED INCOME, CURRENTLY HOVERING AROUND 14-15% PER YEAR."
            </p>
          </motion.div>

          {/* SEÇÃO 4 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#9945FF] text-white px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>4. How the 10% protects your 90%</strong>
            </p>
            <p className="mb-6">
              All credit carries default risk. To protect the Conservative Profile, FRENZY uses a classic "protection layers" model.
            </p>
            <p className="mb-6">
              The 90% of the Conservative Profile sit on top, with priority of payment; the 10% of the Aggressive Profile sit at the bottom and act as the "first loss piece".
            </p>
            <p className="mb-6">
              If some of the financed companies delay or fail to pay, the expected losses are deducted first from the Aggressive Profile's balance.
            </p>
            <p>
              The goal is that your capital in the Conservative Profile is only affected in extreme scenarios, when losses exceed this 10% protection buffer.
            </p>
          </motion.section>

          {/* SEÇÃO 5 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-[#FF3366] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>5. How the backing is guaranteed in the real world</strong>
            </p>
            <p className="mb-6">
              To ensure this doesn't just become a "pretty internet story", the receivables that generate the Conservative Profile's yield are structured to be registered in financial infrastructures authorized by the Central Bank of Brazil, such as receivables registrars and asset registration platforms (e.g., CERC or B3).
            </p>
            <p>
              This registration is the exact same mechanism used in traditional credit operations in Brazil, proving that there are real contracts behind it, with real companies owing this money, and that these assets can be fully audited.
            </p>
          </motion.section>

          {/* SEÇÃO 6 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-white border-2 border-black text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>6. Withdrawals: why it isn't T+0</strong>
            </p>
            <p className="mb-6">
              Unlike an idle balance in a digital account, corporate credit doesn't return instantly.
            </p>
            <p className="mb-6">
              Because your money is financing real-world operations, FRENZY does not offer T+0 (instant) withdrawals in this Conservative Profile.
            </p>
            <p className="mb-6">
              Redemption requests follow liquidity windows aligned with the credit portfolio—for example, T+30 windows, similar to credit funds and other fixed-income products dealing with less liquid assets.
            </p>
            <p>
              This prevents bank runs that could harm all participants and keeps the protocol healthy in the long term.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 3 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-[#14F195] p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_0px_#000] my-16 rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "BECAUSE YOUR MONEY FINANCES REAL OPERATIONS, REDEMPTIONS FOLLOW LIQUIDITY WINDOWS, KEEPING THE PROTOCOL HEALTHY."
            </p>
          </motion.div>

          {/* SEÇÃO 7 (HACKATHON DISCLAIMER) */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-black text-white px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>7. Current state: simulation, not real money yet</strong>
            </p>
            <p className="mb-6">
              In the current stage, for the hackathon, all of this works as a simulation. The smart contract already implements the split logic between 90% Conservative and 10% Aggressive, simulated yield calculation, and loss absorption, but using Solana test networks.
            </p>
            <p className="mb-6">
              The part about converting to BRL, investing in real FIDCs, and integrating with registrars is not yet active in production: this relies on partnerships with institutions regulated by the CVM (Brazilian SEC) and other financial system authorities.
            </p>
            <p>
              Meanwhile, you can see on the interface how the money would behave in the real world, but without actual financial risk.
            </p>
          </motion.section>
          
          {/* FIM DA LEITURA - AÇÕES */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-full text-center pt-24 pb-12 flex flex-col md:flex-row justify-center gap-6"
          >
            <a 
              href="/demo" 
              className="inline-block bg-[#00E1FD] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[10px_10px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-4xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                TEST THE PROTOCOL
              </span>
            </a>
            
            <a 
              href="/alpha" 
              className="inline-block bg-[#FF3366] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[10px_10px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-4xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                READ THE 10% ENGINE
              </span>
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}