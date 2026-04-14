"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// Estilos de apoio (podem ser removidos se não usados no manifesto)
const titleGreenStyle = {
  fontFamily: "var(--font-bebas)",
  WebkitTextStroke: "clamp(1px, 0.2vw, 2px) #000",
  textShadow: "4px 4px 0px #000",
} as React.CSSProperties;

export default function BlinkSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // RECALIBRAÇÃO AGRESSIVA DAS FASES - SEM MANIFESTO
  // Fase 1 (Manifesto) FOI DELETADA DA EXISTÊNCIA.

  // Fase 2 (X Timeline): Começa VISÍVEL (1), segura até 50%, some em 60%
  const op2 = useTransform(scrollYProgress, [0, 0.5, 0.6], [1, 1, 0]);
  
  // Fase 3 (Success): Entra em 60%, fixa em 75% e domina até o fim (100%) - MAIS LENTO
  const op3 = useTransform(scrollYProgress, [0.6, 0.75, 1], [0, 1, 1]);

  // Parallax de profundidade no celular (mantido)
  const phoneScale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);

  return (
    // Pista de rolagem mantida longa pra retenção visual
    <section ref={containerRef} className="relative h-[450vh] w-full bg-[#0A0A0A]">
      
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        
        {/* Background Ambient (Cyber-Neon) */}
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none select-none">
          <Image
            src="/bg-cyber4.webp" 
            alt=""
            fill
            className="object-cover scale-110"
            priority
          />
        </div>

        {/* Floating Background Text (Native Liquidity) */}
        <div className="absolute z-[2] text-center w-full px-4 pointer-events-none opacity-10 overflow-hidden">
            <h2 
              className="text-[clamp(4rem,18vw,15rem)] font-black uppercase text-[#14F195] leading-none tracking-tighter"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              NATIVE
            </h2>
            <h2 
              className="text-[clamp(4rem,18vw,15rem)] font-black uppercase text-[#9945FF] leading-none tracking-tighter"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              LIQUIDITY
            </h2>
        </div>

        {/* IPHONE CASE BRUTALISTA */}
        <motion.div 
          style={{ scale: phoneScale }}
          className="relative z-[10] w-[clamp(290px,88vw,380px)] aspect-[9/16] border-[8px] border-black bg-[#0A0A0A] rounded-[2.5rem] shadow-[15px_15px_0px_0px_#14F195] overflow-hidden"
        >
          {/* Hardware Details (Dynamic Island) */}
          <div className="absolute top-0 inset-x-0 h-8 flex justify-center z-[50]">
            <div className="w-1/3 h-full bg-black rounded-b-2xl border-b-[4px] border-x-[4px] border-black"></div>
          </div>

          {/* FASE 1 (O MANIFESTO) FOI DELETADA. SEM SOBREPOSIÇÃO DE TEXTO. */}

          {/* PHASE 2: X TIMELINE (AGGRESSIVE ZOOM + ALIGNMENT FIX) */}
          <motion.div 
            style={{ opacity: op2 }} 
            className="absolute inset-0 z-[30] bg-black overflow-hidden"
          >
            <Image
              src="/tela-x.webp" 
              alt="FRENZY Blink"
              fill
              // CORREÇÃO: origin-center + translate-y negativo pra zerar a faixa preta
              className="object-cover scale-[1.45] origin-center -translate-y-12 pt-12"
            />
          </motion.div>

          {/* PHASE 3: TRANSACTION SUCCESS (ULTRA ZOOM + SLOWER + ALIGNMENT FIX) */}
          <motion.div 
            style={{ opacity: op3 }} 
            className="absolute inset-0 z-[20] bg-black overflow-hidden"
          >
            <Image
              src="/tela-sucesso.webp" 
              alt="Success"
              fill
              // CORREÇÃO: origin-center + translate-y negativo pra zerar a faixa preta
              className="object-cover scale-[1.6] origin-center -translate-y-16"
            />
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}