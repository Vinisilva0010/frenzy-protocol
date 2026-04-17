"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function WhitepaperPage() {
  // Barra de progresso de leitura no topo
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
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans relative selection:bg-[#14F195] selection:text-black">
      
      {/* 1. BARRA DE PROGRESSO DE LEITURA */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-[#14F195] origin-left z-50 border-b-[4px] border-black"
        style={{ scaleX }}
      />

      {/* 2. BACKGROUND ARCHITECTURE */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-32">
        
        {/* 3. CABEÇALHO DO DOSSIÊ */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-16">
          <div className="inline-block bg-black text-[#14F195] font-mono font-black text-xs md:text-sm px-4 py-1 border-[4px] border-black shadow-[4px_4px_0px_0px_#14F195] mb-6 uppercase tracking-widest">
            FRENZY PROTOCOL // OFFICIAL DEEP DIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: "var(--font-bebas)" }}>
            THE 50% SHIELD: <br/>
            <span className="text-zinc-400">THE STEEL FOUNDATION</span>
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
          
          {/* CONTAINER DO YOUTUBE */}
            <div className="relative w-full aspect-video bg-black border-[4px] border-black overflow-hidden flex items-center justify-center group">
            <iframe 
                className="absolute inset-0 w-full h-full" 
                src="https://www.youtube.com/embed/k44WkLiwGDs?rel=0&modestbranding=1" 
                title="FRENZY Protocol Deep Dive" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
            </div>
        </motion.div>

        {/* 5. O CONTEÚDO DO DOCUMENTO (TRADUZIDO PRO INGLÊS) */}
        <div className="space-y-24 text-lg md:text-2xl font-medium text-zinc-900 leading-relaxed max-w-4xl mx-auto">
          
          {/* SEÇÃO 1 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#14F195] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>The steel foundation of your capital</strong>
            </p>
            <p className="mb-8">
              When you enter our protocol, the first thing that happens is simple: we work so you can sleep peacefully. Half of your capital, exactly 50%, goes straight to our Protection Pillar. This is the "steel foundation" of your wealth within the protocol, designed to grow steadily while hedging the risk of the rest of the strategy.
            </p>
            <p>
              Instead of leaving your Solana idle in your wallet, our smart contract puts this protected portion to work in the core engine of the Solana network itself. We use a proven financial strategy called liquid staking, where your SOL is delegated to highly trusted network validators, like Jito and Sanctum, which are currently the gold standard on Solana and pay annual yields exactly in this historical range that we use as a baseline.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-black text-white p-8 md:p-12 border-[6px] border-black shadow-[15px_15px_0px_0px_#00E1FD] my-16 rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "WE TAKE THE PROTECTED HALF AND LEND IT TO THE BEST VALIDATORS ON THE NETWORK."
            </p>
          </motion.div>

          {/* SEÇÃO 2 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#00E1FD] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>How the protection works under the hood</strong>
            </p>
            <p className="mb-8">
              For the Solana network to function, process payments, and maintain global security, it needs validators operating 24/7. These validators use SOL as "collateral" to do this work. What our protocol does is take this protected half of your capital and lend it, completely on-chain and securely, to some of the best validators on the network, like Jito and Sanctum, which are already consolidated giants within the ecosystem.
            </p>
            <p>
              In exchange for helping secure the network, Solana pays a constant reward to those who delegate stake. In practice, it’s very similar to what you see in a Certificate of Deposit (CD) or government bonds at your bank: you lend the money, and it returns it with interest. The difference is that here everything happens automatically, transparently, via smart contract, directly on the blockchain, with no manager, no phone calls, and no bureaucracy.
            </p>
          </motion.section>

          {/* SEÇÃO 3 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-[#FF3366] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>What you gain in this protected half</strong>
            </p>
            <p className="mb-8">
              This portion of your capital is your "shield" within the protocol. It has three clear objectives: to generate predictable yield, to guarantee liquidity, and to protect your wealth during sharp market downturns.
            </p>
            <p className="mb-8">
              In terms of return, this protection layer operates within a historical range of around 7% to 9% APY on Solana, functioning as a "real interest rate" that combats inflation and makes your balance grow every day, dripping yield into your vault. The difference is that, unlike traditional investments that lock your money up for months or years, here you remain in control: even while the capital is yielding, you can hit "Withdraw" at any time and get your liquidity back, straight from the blockchain, without asking anyone for permission.
            </p>
            <p>
              The psychological effect of this is powerful: even if the entire crypto market is panicking, with coins plummeting, you know that 50% of your money is shielded in a safe strategy, earning interest and buffering the impact on your total wealth. This creates room for you to chase growth with the other half, without that feeling that "everything is at risk all the time."
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-white p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_0px_#FFE600] my-16 -rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "YOU KNOW THAT 50% OF YOUR MONEY IS SHIELDED. THIS CREATES ROOM TO CHASE GROWTH WITH THE OTHER HALF."
            </p>
          </motion.div>

          {/* SEÇÃO 4 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#FFE600] text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>The future of the Protection Pillar: entering the world of RWAs</strong>
            </p>
            <p className="mb-8">
              The protection layer that lives inside Solana today will not be limited to the crypto universe forever. We are already designing the next phase of this strategy: bringing this exact same pillar into Real World Assets (RWAs), using tokens that represent traditional assets on the blockchain, such as tokenized U.S. Treasury Bills (T-Bills).
            </p>
            <p>
              In practice, this means that in the future, our protocol will be able to take your Solana in this protected half and, via integrations with RWA protocols, automatically buy shares of tokenized T-Bills. You keep the exact same vault, on the same interface, clicking the same buttons, but under the hood, you will be accessing the stability of the strongest currency in the world and the American government, with interest dropping straight into your vault, without opening an offshore account and without talking to any bank.
            </p>
          </motion.section>

          {/* SEÇÃO 5 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-[#9945FF] text-white px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>What FRENZY builds on top of this</strong>
            </p>
            <p className="mb-8">
              All this structure for protection and growth exists today, but the biggest problem in the crypto market has always been the experience: everything is complex, full of screens, technical jargon, protocol names, wallet connections, DEXs, farming, pools, transaction validation, and so on. What FRENZY does is take this pain and condense it into a single click.
            </p>
            <p className="mb-8">
              Technically, what we are offering is a structured product: a classic, validated, and well-known financial strategy, packaged simply inside a vault. The user doesn't need to know what Jito, Raydium, or any other protocol is. They don't need to go through five different screens, nor manually sign a sequence of transactions. They enter the Blink on their X (Twitter) feed, click "Enter Vault", and our smart contract automatically executes, in milliseconds, all the complex transactions required behind the strategy.
            </p>
            <p>
              From the perspective of the investor, the feeling is: "I just clicked a button on my feed, and now I have an advanced strategy running on-chain for me." From an architectural standpoint, the innovation is not in inventing a new magic yield formula, but in packaging strategies that the market already trusts into a simple, instantaneous, and fully on-chain user experience via Blinks. Almost nobody is doing this seriously today. We are.
            </p>
          </motion.section>

          {/* CITAÇÃO DE DESTAQUE 3 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-[105%] -ml-[2.5%] bg-[#14F195] p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_0px_#000] my-16 rotate-1"
          >
            <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
              "THE INNOVATION IS NOT IN INVENTING A MAGIC FORMULA, BUT IN PACKAGING STRATEGIES THE MARKET TRUSTS INTO A SINGLE CLICK."
            </p>
          </motion.div>

          {/* SEÇÃO 6 */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6">
              <strong className="text-2xl md:text-3xl font-black bg-[#111] text-[#14F195] px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>The bridge between global capital and emerging Brazil</strong>
            </p>
            <p className="mb-8">
              FRENZY's vision for the future doesn't stop at Solana or T-Bills. One of the most powerful points on our roadmap is using the same logic of "one click, multiple layers underneath" to connect global investors to the Brazilian emerging market through RWAs.
            </p>
            <p className="mb-8">
              Imagine the foreign investor sitting on Solana, who doesn't speak Portuguese, doesn't understand Brazilian bureaucracy, and has no idea how to open an account at a local broker or access the B3 (Brazilian Stock Exchange). Through FRENZY, the ideal experience is simple: they click a button, enter a vault, and our contract, via RWA protocol integrations, buys a token pegged to the Selic (Brazilian interest rate) or a basket linked to the Ibovespa, which naturally pays a much higher interest rate than the US average.
            </p>
            <p>
              The most interesting part is that we don't need to build a direct bridge to B3 or become a traditional broker. The idea is to leverage the exact RWA protocols that are already bringing Brazilian assets to the blockchain and use FRENZY as the access layer: the place where global capital arrives, clicks, and automatically gains exposure to the Brazilian economy via well-structured and regulated tokens.
            </p>
          </motion.section>

          {/* SEÇÃO 7 (CONCLUSÃO) */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <p className="mb-6 mt-12">
              <strong className="text-2xl md:text-3xl font-black bg-white border-2 border-black text-black px-2 uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>Version 2: the vault as a passport</strong>
            </p>
            <p className="mb-8">
              In our vision for Version 2, FRENZY becomes, in practice, a passport between two worlds: on this side, the global investor holding Solana; on the other side, the combination of protection in T-Bills, yield on Solana, and smart exposure to Brazil via RWAs pegged to Selic and Ibovespa. All of this within the same vault, with the same "one click on the feed" experience.
            </p>
            <p>
              What today is a protocol already functioning with a solid base of protection and continuous growth, tomorrow becomes the natural gateway for anyone in the world who wants to access, in seconds, both the security of the US and the return potential of an emerging market like Brazil — with no bureaucracy, no friction, and no need to understand all the technical details that we handle behind the scenes.
            </p>
          </motion.section>
          
          {/* FIM DA LEITURA - AÇÃO */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="w-full text-center pt-24 pb-12"
          >
            <a 
              href="/demo" 
              className="inline-block bg-[#00E1FD] text-black font-black uppercase px-12 py-6 border-[8px] border-black shadow-[15px_15px_0px_0px_#000] hover:bg-white hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[10px_10px_0px_0px_#000] transition-all"
            >
              <span className="text-3xl md:text-5xl tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                TEST THE PROTOCOL NOW
              </span>
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}