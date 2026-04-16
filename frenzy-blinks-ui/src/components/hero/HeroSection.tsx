"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
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

const btnStyle = {
  fontFamily: "var(--font-bebas)",
  letterSpacing: "0.2em",
} as React.CSSProperties;

const FRENZY_LETTERS   = ["F", "R", "E", "N", "Z", "Y"];
const PROTOCOL_LETTERS = ["P", "R", "O", "T", "O", "C", "O", "L"];

// Componente de letra com efeito de túnel
function TunnelLetter({
  char,
  delay,
  color,
  style,
}: {
  char: string;
  delay: number;
  color: string;
  style: React.CSSProperties;
}) {
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] selection:bg-[#9945FF] selection:text-white"
      style={{ perspective: "1200px" }}
    >
      
      {/* ------------------------------------------------------------ */}
      {/* NOVO FUNDO - JOGO DE IMAGENS - REFATORADO PARA MOBILE */}
      {/* ------------------------------------------------------------ */}
      
      {/* Parede da Esquerda - O Cofre Frio (Geleira Institucional) */}
      <div 
        className="absolute inset-y-0 left-0 z-[1] w-full md:w-1/2 overflow-hidden pointer-events-none select-none opacity-20 md:opacity-40"
        style={{
          // Máscara CSS pra derreter a imagem pro centro
          maskImage: "radial-gradient(circle at left, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at left, black 20%, transparent 80%)",
        }}
      >
        <Image
          src="/bg-cyber3.webp" // Joga sua imagem aqui
          alt="Institutional Cryogenic Vault Wall"
          fill
          className="object-cover object-left"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Parede da Direita - A Máquina de Caos (Fornalha Degen) */}
      <div 
        className="absolute inset-y-0 right-0 z-[1] w-full md:w-1/2 overflow-hidden pointer-events-none select-none opacity-20 md:opacity-40"
        style={{
          // Máscara CSS pra derreter a imagem pro centro
          maskImage: "radial-gradient(circle at right, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at right, black 20%, transparent 80%)",
        }}
      >
        <Image
          src="/bg-cyber3.webp" // Joga sua imagem aqui
          alt="Chaotic Overheating Degen Server Wall"
          fill
          className="object-cover object-right  "
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* ------------------------------------------------------------ */}
      {/* FIM DO NOVO FUNDO */}
      {/* ------------------------------------------------------------ */}


      {/* Blob de luz centralizado para dar profundidade ao cofre 3D */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
      >
        <div
          className="h-[80vw] w-[80vw] md:h-[60vw] md:w-[60vw] max-h-[700px] max-w-[700px] rounded-full opacity-20 md:opacity-25 blur-[100px] md:blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, #9945FF 0%, #14F195 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Partículas Three.js no fundo, atrás do conteúdo */}
      <div aria-hidden="true" className="absolute inset-0 z-[3]">
        <HeroCanvas />
      </div>

      {/* PERSONAGEM ESQUERDA — De volta e MAIOR no mobile */}
      <motion.div
        initial={{ opacity: 0, x: -120, rotate: -15 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
        aria-hidden="true"
        // Largura ajustada com clamp pra ficar maior em telas pequenas
        className="absolute bottom-[-5%] md:bottom-0 left-0 z-[15] w-[clamp(150px,25vw,400px)] pointer-events-none select-none opacity-80 md:opacity-100"
      >
        <motion.div
          animate={{
            y:      [0, -18, 0, -10, 0],
            rotate: [-6, -10, -4, -8, -6],
            scaleX: [1, 0.94, 1, 0.97, 1],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          <Image
            src="/char-left.png"
            alt=""
            width={420}
            height={520}
            className="w-full h-auto object-contain drop-shadow-[8px_0px_0px_#14F195]"
            priority
            sizes="(max-width: 768px) 40vw, 20vw"
          />
        </motion.div>
      </motion.div>

      {/* PERSONAGEM DIREITA — De volta e MAIOR no mobile */}
      <motion.div
        initial={{ opacity: 0, x: 120, rotate: 15 }}
        animate={{ opacity: 1, x: 0, rotate: 8 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
        aria-hidden="true"
        // Largura ajustada com clamp pra ficar maior em telas pequenas
        className="absolute bottom-[-5%] md:bottom-0 right-0 z-[15] w-[clamp(150px,25vw,400px)] pointer-events-none select-none opacity-80 md:opacity-100"
      >
        <motion.div
          animate={{
            x:      [0, -4, 4, -3, 3, -2, 2, 0],
            y:      [0, -3, 0, -5, 0, -2, 0, 0],
            rotate: [8, 6, 10, 7, 9, 8, 7, 8],
            scaleY: [1, 1.04, 0.97, 1.02, 1, 0.99, 1.01, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.85, 1],
          }}
        >
          <Image
            src="/char-right.png"
            alt=""
            width={420}
            height={520}
            className="w-full h-auto object-contain drop-shadow-[-8px_0px_0px_#9945FF]"
            priority
            sizes="(max-width: 768px) 40vw, 20vw"
          />
        </motion.div>
      </motion.div>

      {/* CONTEÚDO PRINCIPAL - Padding ajustado pro mobile */}
      <div className="relative z-[20] flex min-h-screen flex-col items-center justify-center px-4 pb-32 pt-16 md:pb-24 md:pt-8 text-center">

        {/* FRENZY — Ajuste de clamp no mobile para ficar MAIOR */}
        <div
          className="leading-[0.85] tracking-tighter overflow-visible"
          style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}
        >
          <div className="flex flex-row items-end justify-center overflow-visible">
            {FRENZY_LETTERS.map((char, i) => (
              <TunnelLetter
                key={i}
                char={char}
                delay={i * 0.08}
                color="#14F195"
                style={{
                  ...titleGreenStyle,
                  // Aumentei a base mínima do clamp pra ficar maior no celular
                  fontSize: "clamp(4.5rem, 18vw, 16rem)", 
                }}
              />
            ))}
          </div>
        </div>

        {/* PROTOCOL - Ajuste de clamp no mobile para ficar MAIOR */}
        <div
          className="mb-8 md:mb-6 leading-none tracking-tighter overflow-visible"
          style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}
        >
          <div className="flex flex-row items-end justify-center overflow-visible">
            {PROTOCOL_LETTERS.map((char, i) => (
              <TunnelLetter
                key={i}
                char={char}
                delay={FRENZY_LETTERS.length * 0.08 + 0.1 + i * 0.06}
                color="#ffffff"
                style={{
                  ...titleWhiteStyle,
                  // Aumentei a base mínima do clamp pra ficar maior no celular
                  fontSize: "clamp(1.8rem, 7vw, 6.5rem)",
                }}
              />
            ))}
          </div>
        </div>

        {/* COFRE 3D CENTRAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.35 }}
          aria-hidden="true"
          className="w-[clamp(220px,40vw,480px)] h-[clamp(220px,40vw,480px)]"
        >
          <VaultCanvas />
        </motion.div>

        {/* BOTÃO DE CTA BRUTAL - Padding adaptado pro mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
          className="mt-8 md:mt-6"
        >
          <a
            href="/demo"
            className="inline-block border-[4px] md:border-[6px] border-black bg-[#14F195] px-[clamp(1.8rem,6vw,4.5rem)] py-[clamp(0.9rem,1.8vw,1.3rem)] text-[clamp(1.1rem,2.8vw,1.8rem)] font-black uppercase text-black shadow-[6px_6px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] transition-all duration-75 hover:translate-x-[6px] hover:translate-y-[6px] md:hover:translate-x-[8px] md:hover:translate-y-[8px] hover:shadow-none active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
            style={btnStyle}
          >
            ENTER THE VAULT
          </a>
        </motion.div>

      </div>
    </section>
  );
}