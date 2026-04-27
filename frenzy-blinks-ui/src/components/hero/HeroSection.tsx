"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";

// Importações dinâmicas pra não travar a hidratação
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const VaultCanvas = dynamic(() => import("./VaultCanvas"), { ssr: false });

const fira = { fontFamily: "var(--font-fira)" } as React.CSSProperties;

// Estilos de texto brutais - RECALIBRADOS PARA MOBILE
const titleGreenStyle = {
  fontFamily: "var(--font-bebas)",
  WebkitTextStroke: "clamp(2px, 0.5vw, 6px) #000",
  textShadow: "clamp(5px, 1vw, 12px) clamp(5px, 1vw, 12px) 0px #9945FF",
} as React.CSSProperties;

const titleWhiteStyle = {
  fontFamily: "var(--font-bebas)",
  WebkitTextStroke: "clamp(1.5px, 0.4vw, 5px) #000",
  textShadow: "clamp(4px, 0.8vw, 10px) clamp(4px, 0.8vw, 10px) 0px #000",
} as React.CSSProperties;

const FRENZY_LETTERS   = ["S", "T", "R", "A", "T", "A"];
const PROTOCOL_LETTERS = ["P", "R", "O", "T", "O", "C", "O", "L"];

// Componente de letra com efeito de túnel
function TunnelLetter({ char, delay, color, style }: { char: string; delay: number; color: string; style: React.CSSProperties; }) {
  return (
    <motion.span
      className="inline-block"
      style={{ color, ...style }}
      animate={{
        scale:   [0.3, 1.08, 1],
        opacity: [0, 1, 1],
        filter: [
          "blur(12px) brightness(3)",
          "blur(2px) brightness(1.5)",
          "blur(0px) brightness(1)",
        ],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Infinity,
        repeatDelay: FRENZY_LETTERS.length * 0.08 + 2.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {char}
    </motion.span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // 1. O MOTOR DA ANIMAÇÃO DE SCROLL
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  // 2. TIMELINE DAS FRASES E DA HERO
  // Frase 1 (0% a 25%)
  const text1Opacity = useTransform(smoothScroll, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
  const text1Y = useTransform(smoothScroll, [0, 0.25], [50, -50]);

  // Frase 2 (25% a 50%)
  const text2Opacity = useTransform(smoothScroll, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothScroll, [0.25, 0.5], [50, -50]);

  // Frase 3 (50% a 75%)
  const text3Opacity = useTransform(smoothScroll, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const text3Y = useTransform(smoothScroll, [0.5, 0.75], [50, -50]);

  // A HERO REAL (75% a 100% surge de vez)
  const heroOpacity = useTransform(smoothScroll, [0.75, 0.85], [0, 1]);
  const heroScale = useTransform(smoothScroll, [0.75, 0.85], [0.8, 1]);
  const heroBlur = useTransform(smoothScroll, [0.75, 0.85], ["blur(10px)", "blur(0px)"]);

  // 3. EFEITO DO FUNDO 3D (O Grid se move em direção ao usuário)
  const gridTranslateY = useTransform(smoothScroll, [0, 1], ["0%", "50%"]);

  return (
    // Transformamos a seção em 400vh (4 telas de altura). O usuário rola, mas o conteúdo fica "sticky".
    <section ref={sectionRef} className="relative h-[400vh] w-full bg-[#0A0A0A] selection:bg-[#9945FF] selection:text-white">
      
      {/* O CONTAINER STICKY QUE TRAVA A CÂMERA */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center" style={{ perspective: "1200px" }}>
        
        {/* ========================================== */}
        {/* FUNDO 3D EXCLUSIVO: MALHA DE PERSPECTIVA   */}
        {/* ========================================== */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-end justify-center">
          <motion.div 
            className="w-[200vw] h-[100vh] opacity-30 md:opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(rgba(20, 241, 149, 0.3) 2px, transparent 2px),
                linear-gradient(90deg, rgba(20, 241, 149, 0.3) 2px, transparent 2px)
              `,
              backgroundSize: "60px 60px",
              transformOrigin: "top",
              transform: "perspective(500px) rotateX(60deg)",
              y: gridTranslateY // Move para a frente conforme o scroll
            }}
          />
          {/* Degrade preto pra sumir o grid no horizonte */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0A0A0A] to-[#0A0A0A] z-10"></div>
        </div>

        {/* Blob de luz centralizado para dar profundidade */}
        <div aria-hidden="true" className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
          <div
            className="h-[80vw] w-[80vw] md:h-[60vw] md:w-[60vw] max-h-[700px] max-w-[700px] rounded-full opacity-20 md:opacity-25 blur-[100px] md:blur-[120px]"
            style={{ background: "radial-gradient(circle, #9945FF 0%, #14F195 60%, transparent 100%)" }}
          />
        </div>

        {/* Partículas Three.js no fundo */}
        <div aria-hidden="true" className="absolute inset-0 z-[3]">
          <HeroCanvas />
        </div>

        {/* ========================================== */}
        {/* A SEQUÊNCIA DE TEXTOS (MARKETING)          */}
        {/* ========================================== */}
        
       {/* TEXTO 1 */}
<motion.div 
  style={{ opacity: text1Opacity, y: text1Y }} 
  className="absolute inset-0 z-20 flex items-center justify-center px-4"
>
  <h2
    className="text-white text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter text-center leading-[0.85]"
    style={{ fontFamily: "var(--font-bebas)" }}
  >
    A SOLANA VAULT<br />
    FOR <span className="text-zinc-500">BRAZILIAN YIELD.</span>
  </h2>
</motion.div>

      {/* TEXTO 2 */}
<motion.div 
  style={{ opacity: text2Opacity, y: text2Y }} 
  className="absolute inset-0 z-20 flex items-center justify-center px-4"
>
  <h2
    className="text-white text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter text-center leading-[0.85]"
    style={{ fontFamily: "var(--font-bebas)" }}
  >
    DEPOSIT USDC OR SOL.<br />
    WE LEND IT INTO <span className="text-[#FF3366]">REAL CREDIT.</span>
  </h2>
</motion.div>

      {/* TEXTO 3 */}
<motion.div 
  style={{ opacity: text3Opacity, y: text3Y }} 
  className="absolute inset-0 z-20 flex items-center justify-center px-4"
>
  <h2
    className="text-white text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter text-center leading-[0.85]"
    style={{ fontFamily: "var(--font-bebas)" }}
  >
    90% CONSERVATIVE LAYER.<br />
    <span className="text-[#00E1FD]">10% FIRST-LOSS, HIGH UPSIDE.</span>
  </h2>
</motion.div>

        {/* ========================================== */}
        {/* A HERO PRINCIPAL (Surge no final do Scroll)*/}
        {/* ========================================== */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
          className="absolute inset-0 z-[20] flex flex-col items-center justify-center px-4 pt-16 md:pt-8 text-center"
        >
          {/* PERSONAGEM ESQUERDA */}
          <div className="absolute bottom-[-5%] md:bottom-0 left-0 z-[15] w-[clamp(150px,25vw,400px)] pointer-events-none select-none opacity-80 md:opacity-100">
            <motion.div
              animate={{ y: [0, -18, 0, -10, 0], rotate: [-6, -10, -4, -8, -6], scaleX: [1, 0.94, 1, 0.97, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              <Image src="/char-left.png" alt="" width={720} height={620} className="w-full h-auto object-contain drop-shadow-[8px_0px_0px_#14F195]" priority sizes="(max-width: 768px) 40vw, 20vw" />
            </motion.div>
          </div>

          {/* PERSONAGEM DIREITA */}
          <div className="absolute bottom-[-5%] md:bottom-0 right-0 z-[15] w-[clamp(150px,25vw,400px)] pointer-events-none select-none opacity-80 md:opacity-100">
            <motion.div
              animate={{ x: [0, -4, 4, -3, 3, -2, 2, 0], y: [0, -3, 0, -5, 0, -2, 0, 0], rotate: [8, 6, 10, 7, 9, 8, 7, 8], scaleY: [1, 1.04, 0.97, 1.02, 1, 0.99, 1.01, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.85, 1] }}
            >
              <Image src="/char-right.png" alt="" width={490} height={720} className="w-full h-auto object-contain drop-shadow-[-8px_0px_0px_#9945FF]" priority sizes="(max-width: 790px) 40vw, 20vw" />
            </motion.div>
          </div>

          {/* FRENZY TITLE */}
          <div className="leading-[0.85] tracking-tighter overflow-visible" style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}>
            <div className="flex flex-row items-end justify-center overflow-visible">
              {FRENZY_LETTERS.map((char, i) => (
                <TunnelLetter key={i} char={char} delay={i * 0.08} color="#14F195" style={{ ...titleGreenStyle, fontSize: "clamp(4.5rem, 18vw, 16rem)" }} />
              ))}
            </div>
          </div>

          {/* PROTOCOL TITLE */}
          <div className="mb-8 md:mb-6 leading-none tracking-tighter overflow-visible" style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}>
            <div className="flex flex-row items-end justify-center overflow-visible">
              {PROTOCOL_LETTERS.map((char, i) => (
                <TunnelLetter key={i} char={char} delay={FRENZY_LETTERS.length * 0.08 + 0.1 + i * 0.06} color="#ffffff" style={{ ...titleWhiteStyle, fontSize: "clamp(1.8rem, 7vw, 6.5rem)" }} />
              ))}
            </div>
          </div>

          {/* COFRE 3D CENTRAL */}
          <div className="w-[clamp(220px,40vw,480px)] h-[clamp(220px,40vw,480px)]">
            <VaultCanvas />
          </div>

        </motion.div>
      </div>
    </section>
  );
}