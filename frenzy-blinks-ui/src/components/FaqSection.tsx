"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Banco de dados do FAQ baseado na documentação tática do FRENZY
const FAQ_DATA = [
  {
    id: "01",
    question: "HOW DOES THE 90% / 10% SPLIT ACTUALLY WORK?",
    answer:
      "Every deposit goes into a Solana smart contract vault. On-chain, the contract mathematically splits the position into two internal buckets: 90% is tagged as the Senior, Conservative layer, and 10% as the Junior, Aggressive layer. PnL, losses and withdrawals are always calculated with this split in mind: the Senior layer gets paid first and is protected by design, while the Junior layer takes first loss and captures all excess upside.",
    color: "#9945FF", // Rare Purple
  },
  {
    id: "02",
    question: "WHAT HAPPENS IF THERE ARE DEFAULTS OR A CREDIT SHOCK?",
    answer:
      "If the real-world credit portfolio suffers losses, they are applied to the Junior (Aggressive) layer first. For example, if the overall credit pool takes a 4% hit, that 4% is absorbed entirely by the 10% Junior capital while the 90% Senior capital remains untouched. Only if cumulative losses exceed the 10% protection buffer does the Senior, Conservative layer start to be affected. In short: Junior is built to eat the pain first.",
    color: "#14F195", // Toxic Green
  },
  {
    id: "03",
    question: "WHERE DOES THE YIELD COME FROM, IF THIS IS NOT JUST DEFI FARMING?",
    answer:
      "Yield does not come from token inflation or random farming rewards. The idea is to route on-chain liquidity into Brazilian structured credit: receivables funds and securitized credit portfolios that lend to real companies. Those borrowers pay interest in fiat. That interest, net of fees and risk, is what the protocol reflects back into the vault as yield. During the hackathon phase, this behavior is simulated, but the target architecture is pure real-world credit, not speculative DeFi loops.",
    color: "#00E1FD", // Anomaly Cyan
  },
  {
    id: "04",
    question: "IS THIS LIVE WITH REAL MONEY OR JUST A PROOF OF CONCEPT?",
    answer:
      "Right now, FRENZY runs as a Proof of Concept on Solana test environments. The smart contracts, tranche math and default/waterfall logic are real and executable on-chain, but all off-chain flows (BRL conversion, FIDC allocation, registries) are simulated via the dashboard. No user is exposed to real credit risk at this stage. A mainnet, real-capital deployment would only happen after partnerships with regulated credit platforms and the appropriate licensing path in Brazil.",
    color: "#FF3366", // Radioactive Pink
  },
  {
    id: "05",
    question: "HOW DO I DEPOSIT IF THERE IS NO TRADITIONAL DAPP CONNECT BUTTON?",
    answer:
      "FRENZY is built around Solana Actions and Blinks. Instead of forcing you to go to a separate DeFi dashboard, deposits can be triggered directly from surfaces like X (Twitter) or from lightweight widgets. When you click a Frenzy Action, your wallet still signs a normal Solana transaction, but the entry point is the social feed, not a heavy dapp. Under the hood, it all lands in the same vault smart contract.",
    color: "#FF00FF", // Neon Pink
  },
  {
    id: "06",
    question: "WHAT IS THE REAL DIFFERENCE BETWEEN THE CONSERVATIVE AND AGGRESSIVE PROFILES?",
    answer:
      "Both profiles are backed by exposure to the same underlying credit engine, but they sit in very different positions in the waterfall. The Conservative profile is Senior: it has priority on withdrawals and gets paid its target yield before anyone else. It does not share in leveraged upside, but it is shielded by the 10% protection buffer. The Aggressive profile is Junior: it absorbs first loss and in exchange receives all the extra yield above the Senior target, which can produce very high returns in good credit environments, but also large drawdowns in bad ones.",
    color: "#FBBF24", // Gold
  },
  {
    id: "07",
    question: "CAN I LOSE MONEY IN THE AGGRESSIVE PROFILE?",
    answer:
      "Yes. The Aggressive profile is explicitly built as the first-loss layer. If defaults in the credit portfolio stay below the 10% protection cushion, the Junior capital will see volatility but can still come out ahead because it receives all excess yield. If defaults spike and eat through that cushion, the Junior layer can lose a significant share of its capital, up to 100% in extreme stress scenarios. It is a high-voltage position and should be treated as such.",
    color: "#F97316", // Orange
  },
  {
    id: "08",
    question: "CAN I LOSE MONEY IN THE CONSERVATIVE PROFILE?",
    answer:
      "The Conservative profile is designed to be protected by the structure, not magically risk-free. As long as cumulative losses in the credit pool stay within the 10% protection provided by the Junior layer, the Senior capital should remain intact and continue to receive its target yield. If there is a systemic credit event so large that losses blow past that 10% cushion, the Senior layer can start to take losses too. The architecture reduces risk, it does not delete it from reality.",
    color: "#22C55E", // Green
  },
  {
    id: "09",
    question: "WHY IS THERE NO INSTANT WITHDRAWAL (NO D+0 LIQUIDITY)?",
    answer:
      "Because the underlying assets are not volatile tokens that you can dump on an exchange; they are real-world credit positions that settle on their own timetable. To avoid fake liquidity and DeFi-style bank runs, withdrawals follow windows aligned with the credit portfolio, such as D+30 or D+60 cycles. The smart contract enforces time locks that mirror the real-world liquidity of the fund, instead of pretending that long-dated credit can be cashed out instantly.",
    color: "#3B82F6", // Blue
  },
  {
    id: "10",
    question: "HOW DO YOU PLAN TO HANDLE REGULATION AND SECURITIES RULES?",
    answer:
      "Digitizing claims on Brazilian credit is not a game; it touches securities law. The current hackathon version is deliberately restricted to simulation and testnet. For a real-money deployment, the roadmap includes plugging into tokenization platforms and credit structures that already operate under CVM rules in Brazil, such as regulated FIDCs or sandbox/crowdfunding frameworks. FRENZY is the web3 rails and user experience layer, not a shortcut around regulation.",
    color: "#A855F7", // Purple
  },
];

function FaqItem({ 
  item, 
  isOpen, 
  onClick 
}: { 
  item: typeof FAQ_DATA[0]; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.div 
      className="relative mb-6 border-[6px] md:border-[8px] border-black bg-[#0A0A0A] overflow-hidden"
      // Feedback físico brutal no hover e no clique
      whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px #000" }}
      style={{
        boxShadow: isOpen ? "0px 0px 0px 0px #000" : "10px 10px 0px 0px #000",
        transform: isOpen ? "translate(4px, 4px)" : "translate(0px, 0px)",
        transition: "box-shadow 0.1s ease-out, transform 0.1s ease-out",
      }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
        style={{ backgroundColor: isOpen ? item.color : "#0A0A0A" }}
      >
        <span 
          className={`text-2xl md:text-4xl font-black uppercase tracking-tighter ${isOpen ? "text-black" : "text-white"}`}
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          {item.id} // {item.question}
        </span>
        
        {/* Ícone de Cross brutalista que gira no clique */}
        <motion.div 
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex-shrink-0 ml-4 w-10 h-10 md:w-12 md:h-12 border-4 border-black flex items-center justify-center ${isOpen ? "bg-black" : "bg-white"}`}
        >
          <span className={`text-2xl font-black leading-none ${isOpen ? "text-white" : "text-black"}`}>
            +
          </span>
        </motion.div>
      </button>

      {/* Corpo da Resposta com física de mola (Spring) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          >
            <div className="p-6 md:p-8 border-t-[6px] md:border-t-[8px] border-black bg-[#0A0A0A]">
              <p className="text-zinc-300 text-base md:text-xl font-mono leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id); // Primeiro item já vem aberto rasgando a tela

  return (
    <section className="relative w-full bg-[#0A0A0A] py-24 md:py-32 px-4 md:px-12 border-y-[6px] border-black overflow-hidden">
      
      {/* Background Noise opcional pra dar textura */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "clamp(2rem, 4vw, 4rem) clamp(2rem, 4vw, 4rem)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col xl:flex-row gap-12 xl:gap-24">
        
        {/* Coluna da Esquerda: Título Gigante */}
        <div className="xl:w-1/3 flex flex-col justify-start">
          <h2 
            className="text-[clamp(4rem,10vw,8rem)] font-black uppercase text-white leading-[0.85] tracking-tighter"
            style={{ 
              fontFamily: "var(--font-bebas)",
              WebkitTextStroke: "2px #000",
              textShadow: "8px 8px 0px #9945FF" // Sombra roxa agressiva
            }}
          >
            INTEL<br/>BASE
          </h2>
          <p className="text-zinc-400 font-mono mt-8 uppercase tracking-widest text-sm md:text-base border-l-4 border-[#14F195] pl-4">
            [ CLASSIFIED PROTOCOL DOCUMENTATION ] <br/>
            READ BEFORE DEPLOYING CAPITAL.
          </p>
        </div>

        {/* Coluna da Direita: Os Accordions */}
        <div className="xl:w-2/3 flex flex-col">
          {FAQ_DATA.map((item) => (
            <FaqItem 
              key={item.id} 
              item={item} 
              isOpen={openId === item.id} 
              onClick={() => setOpenId(openId === item.id ? null : item.id)} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}