"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

const STORY_DATA = [
  {
    step: 1,
    image: "/hacker-1.webp",
    title: "THE ATTACK VECTOR",
    desc: "A malicious actor attempts to exploit the liquidity pool. Traditional protocols would panic, but FRENZY's hybrid risk management engine is already waiting. 50% of the capital is locked in Deep Safety.",
    color: "#9945FF" 
  },
  {
    step: 2,
    image: "/hacker-2.webp",
    title: "MEV SHIELD ACTIVATED",
    desc: "The attacker tries a sandwich attack to drain slippage. Denied. FRENZY routes transactions through Jito bundles. Front-running is architecturally impossible. Value leakage is zero.",
    color: "#FF3366" 
  },
  {
    step: 3,
    image: "/hacker-3.webp",
    title: "IDL IMMUTABILITY",
    desc: "Desperate, the hacker attacks the contract logic. The Anchor Rust infrastructure holds the line. The splitDeposit instruction is immutable on the Solana L1. No proxies, no backdoors. The code is the law.",
    color: "#00E1FD" 
  },
  {
    step: 4,
    image: "/hacker-4.webp",
    title: "THE WATCHDOG WAKES UP",
    desc: "The sudden network anomaly alerts the FRENZY Sentinel. Powered by a pure Rust Tokio backend and Groq LPU inference, the AI Oracle processes the threat in milliseconds.",
    color: "#FFE600" 
  },
  {
    step: 5,
    image: "/hacker-5.webp",
    title: "AUTONOMOUS KILL SWITCH",
    desc: "Threat neutralized. The triggerKillSwitch is fired on-chain. Operations are hard-locked, protecting the vault from cascading liquidations. The attacker is burned. Your capital sleeps safely.",
    color: "#14F195" 
  }
];

export default function SecurityStory() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // O SEGREDO DO SCROLL BUTTERY SMOOTH: O Amortecedor de Física
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, // Força da mola
    damping: 30,    // Resistência (evita que fique quicando)
    restDelta: 0.001
  });

  // RECALIBRAÇÃO PARA 500vh: Mais rápido, usando o smoothProgress
  const op1 = useTransform(smoothProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const op2 = useTransform(smoothProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
  const op3 = useTransform(smoothProgress, [0.35, 0.4, 0.55, 0.6], [0, 1, 1, 0]);
  const op4 = useTransform(smoothProgress, [0.55, 0.6, 0.75, 0.8], [0, 1, 1, 0]);
  const op5 = useTransform(smoothProgress, [0.75, 0.8, 1], [0, 1, 1]);

  const opacities = [op1, op2, op3, op4, op5];

  return (
    // REDUZIDO PARA 500vh: Rolagem mais curta, entrega mais rápida
    <section ref={containerRef} className="relative h-[500vh] w-full bg-black border-y-[8px] border-black">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {STORY_DATA.map((slide, index) => (
          <motion.div
            key={slide.step}
            style={{ opacity: opacities[index] }}
            className="absolute inset-0 w-full h-full flex flex-col justify-end md:justify-center p-6 md:p-12 pointer-events-none"
          >
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center scale-110"
                priority={index === 0 || index === 1} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>

            {/* CAIXA DE TEXTO BRUTALISTA */}
            <div className="relative z-[10] w-full max-w-[700px] border-[6px] md:border-[8px] border-black bg-[#0A0A0A] p-6 md:p-10 shadow-[10px_10px_0px_0px_#000] mb-12 md:mb-0 pointer-events-auto">
              
              <div className="flex items-center gap-4 border-b-4 border-zinc-800 pb-4 mb-6">
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black font-black text-3xl text-black"
                  style={{ backgroundColor: slide.color, fontFamily: "var(--font-bebas)" }}
                >
                  {slide.step}
                </div>
                <h2 
                  className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none"
                  style={{ fontFamily: "var(--font-bebas)", textShadow: `3px 3px 0px ${slide.color}` }}
                >
                  {slide.title}
                </h2>
              </div>

              <p className="text-zinc-300 font-mono text-base md:text-xl leading-relaxed">
                {slide.desc}
              </p>
              
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}