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
            THE AGGRESSIVE 50%: <br/>
            <span className="text-zinc-400">THE HIGH-PERFORMANCE ENGINE</span>
          </h1>
        </motion.div>

        {/* 4. O PLAYER DE VÍDEO BRUTALISTA */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp} 
          className="w-full bg-[#111111] border-[8px] border-black p-4 shadow-[15px_15px_0px_0px_#000] mb-24 hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_#000] transition-all duration-300"
        >
          <div className="border-b-[4px] border-zinc-800 pb-2 mb-4 flex justify-between items-center px-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-[#FF3366] border-2 border-black rounded-full animate-pulse"></div>
              <span className="text-white font-mono font-black text-sm uppercase tracking-widest">EXECUTIVE BRIEFING</span>
            </div>
            <span className="text-zinc-500 font-mono text-xs">VIDEO_FEED_READY</span>
          </div>
          
          {/* CONTAINER DO YOUTUBE (Cole seu link de Embed aqui igual na outra tela) */}
          <div className="relative w-full aspect-video bg-black border-[4px] border-black overflow-hidden flex items-center justify-center group">
            <p className="text-zinc-600 font-mono text-xl uppercase font-black z-0">
              [ INSERT YOUTUBE EMBED HERE ]
            </p>
            {/* Exemplo: <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/SEU_ID?rel=0&modestbranding=1" title="FRENZY Alpha Pitch" allowFullScreen></iframe> */}
          </div>
        </motion.div>

        {/* 5. O CONTEÚDO DO DOCUMENTO (TRADUÇÃO EXATA E INTOCADA) */}
        <div className="space-y-24 text-lg md:text-2xl font-medium text-zinc-900 leading-relaxed max-w-4xl mx-auto">
          
          {/* SEÇÃO 1 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#FF3366] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>The High-Performance Engine: Capturing Exponential Opportunities</strong>
            </p>
            <p className="mb-8">
              Security preserves your wealth, but it is innovation that multiplies your capital. Within our protocol, the second half of your deposit is automatically directed to our High-Performance Pillar. This is where FRENZY stops being just a vault and starts acting as a search engine for the highest yields in the decentralized market.
            </p>
            <p className="mb-8">
              The cryptocurrency market is fast, aggressive, and waits for no one. The best opportunities usually last days or even just a few hours. Instead of requiring you to sit in front of the computer all day trying to guess what the next big coin or trend will be, our Smart Contract does this heavy lifting for you, in real-time.
            </p>
            <p className="mb-8">
              In practice, here is what happens: we use this half of your capital to provide liquidity on the largest decentralized exchanges on Solana, such as Raydium and Orca. Every day, thousands of people buy and sell new tokens. For these trades to exist, the market needs "pools of money", called Liquidity Pools.
            </p>
            <p>
              Our protocol takes your share of the High-Performance Pillar and provides this liquidity to the pools. Whenever someone, anywhere in the world, makes a trade in these coin pairs, they pay a fee. Our system captures these fees at blockchain speed and returns them straight to your vault, increasing the balance held in your name.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-black text-white p-8 md:p-12 border-[6px] border-black shadow-[15px_15px_0px_0px_#FFE600] my-16 rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "THE MARKET WAITS FOR NO ONE. OUR SMART CONTRACT DOES THE HEAVY LIFTING FOR YOU, IN REAL-TIME."
            </p>
          </motion.div>

          {/* SEÇÃO 2 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#111111] text-[#14F195] px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>What does this mean for you?</strong>
            </p>
            
            <p className="mb-8">
              <span className="font-bold text-black border-b-[4px] border-[#FF3366]">You gain exposure to exponential yields.</span> While the traditional market celebrates returns of 10% a year, liquidity provision strategies and participation in new tokens on the blockchain can generate return rates of 100%, 300% or more in certain market cycles. It is the chance to multiply your capital by participating in the hottest trends on the Solana network, without needing to be a professional trader.
            </p>
            
            <p className="mb-8">
              <span className="font-bold text-black border-b-[4px] border-[#FF3366]">All of this happens with intelligent automation.</span> You participate in extremely profitable (and volatile) markets without needing to understand complex charts, without opening dozens of websites, and without tracking the market 24/7. The technology decides where to allocate, how to capture fees, and how to return the results to your vault, in a 100% automated way.
            </p>

            <p>
              <span className="font-bold text-black border-b-[4px] border-[#FF3366]">And, at the same time, there is calculated risk.</span> Aggressive strategies naturally involve the risk of a token losing value. This is exactly why our architecture was designed in two pillars: since only 50% of your capital enters the High-Performance Engine, even in the worst-case scenario, your Security Pillar (the other 50%) continues earning constant interest, cushioning drops and working to recover potential losses over time.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-[#FF3366] text-black p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_0px_#000] my-16 -rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "OUR SYSTEM CAPTURES THESE FEES AT BLOCKCHAIN SPEED AND RETURNS THEM STRAIGHT TO YOUR VAULT."
            </p>
          </motion.div>

          {/* SEÇÃO 3 (FECHAMENTO PICA) */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-8 p-6 bg-white border-[6px] border-black shadow-[10px_10px_0px_0px_#FF3366] text-xl md:text-3xl font-bold leading-relaxed">
              If the market drops, you are not totally exposed: there is a foundation of protection sustaining your wealth. If the market takes off, you are positioned to capture a significant part of that movement. This is the logic used by high-net-worth individuals and institutional players, now available to you in a few clicks, within a single protocol.
            </p>
          </motion.section>
          
          {/* FIM DA LEITURA - AÇÃO (CTAs) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-full text-center pt-12 pb-12 flex flex-col md:flex-row justify-center gap-6"
          >
            <a 
              href="/demo" 
              className="inline-block bg-[#FF3366] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[10px_10px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-4xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                TEST THE PROTOCOL NOW
              </span>
            </a>
            
            <a 
              href="/whitepaper" 
              className="inline-block bg-[#00E1FD] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[10px_10px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-4xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                READ THE 50% SHIELD
              </span>
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}