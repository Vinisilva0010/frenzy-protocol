"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Banco de dados do FAQ baseado na documentação tática do FRENZY
const FAQ_DATA = [
  {
    id: "01",
    question: "HOW DOES THE CORE SPLIT ACTUALLY WORK?",
    answer: "It is pure math executed on-chain. When you call the splitDeposit instruction, the Anchor smart contract automatically routes 50% of your capital to a secure, cold VaultState. The remaining 50% is injected into our high-frequency acceleration engine. No human intervention.",
    color: "#9945FF", // Rare Purple
  },
  {
    id: "02",
    question: "WHAT HAPPENS DURING A MARKET FLASH CRASH?",
    answer: "The Watchdog wakes up. Our pure Rust backend continuously queries the network. If the Oracle detects an abrupt dump crossing our critical threshold, it fires the triggerKillSwitch command instantly, hard-locking your funds and shielding you from cascading liquidations while you sleep.",
    color: "#14F195", // Toxic Green
  },
  {
    id: "03",
    question: "WHY GROQ LPU INSTEAD OF TRADITIONAL SERVERS?",
    answer: "Latency is the enemy. By piping our Rust market context directly into Groq LPU hardware, we achieve ultrafast inference speeds with a virtually non-existent memory footprint. We don't wait for blocks; we anticipate them.",
    color: "#00E1FD", // Anomaly Cyan
  },
  {
    id: "04",
    question: "HOW DO I DEPOSIT IF THERE IS NO DAPP TO CONNECT TO?",
    answer: "Friction is dead. We use Next.js 16 and Turbopack to render Solana Blinks directly into your X (Twitter) timeline. You click 'DEPOSIT' on a tweet, our API constructs the Base64 transaction payload, and your Phantom wallet prompts the signature. You never leave the social feed.",
    color: "#FF00FF", // Radioactive Pink
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