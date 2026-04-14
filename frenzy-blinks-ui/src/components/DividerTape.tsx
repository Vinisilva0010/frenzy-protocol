"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TECH_LOGOS = [
  { src: "/tech-solana.webp", alt: "Solana" },
  { src: "/tech-anchor.webp", alt: "Anchor" },
  { src: "/tech-rust.webp", alt: "Rust" },
  { src: "/tech-next.webp", alt: "Next.js" },
  { src: "/tech-groq.webp", alt: "Groq LPU" },
];

// Duplicamos a lista para criar a ilusão de loop infinito sem saltos
const DOUBLE_LOGOS = [...TECH_LOGOS, ...TECH_LOGOS];

export default function TechMarquee() {
  return (
    <div className="relative z-[50] w-full bg-[#0A0A0A] border-y-[6px] border-black py-8 md:py-12 overflow-hidden select-none">
      
      {/* Container de animação */}
      <motion.div 
        className="flex items-center gap-16 md:gap-32 w-max"
        animate={{
          x: ["0%", "-50%"], // Move metade da largura total (que é o array original)
        }}
        transition={{
          duration: 20, // Velocidade ajustada para compensar o tamanho maior das imagens
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {DOUBLE_LOGOS.map((logo, index) => (
          <div 
            key={index} 
            // CLEAN CODE: Sem grayscale, sem hover de transição inútil. Cores reais 100% do tempo.
            className="flex items-center gap-6"
          >
            {/* AQUI ESTÁ A REFATORAÇÃO DE TAMANHO: Imagens massivas e agressivas */}
            <div className="relative w-28 h-28 md:w-40 md:h-40">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-cover scale-110"
              />
            </div>
            <span 
              // Tipografia escalada pra bater de frente com o tamanho dos logos
              className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              {logo.alt}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Overlay de gradiente para suavizar as bordas e dar profundidade */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#0A0A0A] to-transparent z-[2]" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#0A0A0A] to-transparent z-[2]" />
    </div>
  );
}