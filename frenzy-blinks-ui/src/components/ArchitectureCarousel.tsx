"use client";

import { useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

const CARDS_DATA = [
  {
    id: "01",
    title: "THE CORE SPLIT",
    desc: "Open-source risk management vault. Capital is mathematically split: 50% locked in institutional safety, 50% deployed for maximum acceleration. Autonomous engine, zero manual clicks.",
    color: "#9945FF",
  },
  {
    id: "02",
    title: "ON-CHAIN ENGINE",
    desc: "Native Rust smart contracts via Anchor framework. The VaultState secures the core. The splitDeposit instruction executes low-level on Solana, ensuring immutable rules.",
    color: "#14F195",
  },
  {
    id: "03",
    title: "THE WATCHDOG",
    desc: "Pure async Rust backend powered by Tokio. A low-latency RPC Oracle integrated with Groq LPU hardware for ultrafast market inference and zero-bloat memory footprint.",
    color: "#00E1FD",
  },
  {
    id: "04",
    title: "KILL SWITCH",
    desc: "Hard-coded hedge fund grade safety lock. If the Oracle detects an abrupt market dump, triggerKillSwitch is instantly fired, locking funds and preventing cascading liquidations.",
    color: "#FF00FF",
  },
  {
    id: "05",
    title: "BLINK SHOWCASE",
    desc: "Next.js 16 + Turbopack API infrastructure. We bypass traditional wallet connection friction by rendering Solana Blinks directly into the X feed to capture liquidity instantly.",
    color: "#FFE600",
  },
  {
    id: "06",
    title: "1-CLICK EXECUTION",
    desc: "Anchor IDL imported directly to the frontend. The API builds complex Base64 transactions. Users sign via Phantom extension without ever leaving their social media timeline.",
    color: "#FF3366",
  },
];

// O Card Individual com a física 3D do Framer Motion
function ArchitectureCard({ data }: { data: typeof CARDS_DATA[0] }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative shrink-0 w-[85vw] md:w-[450px] aspect-[4/5] md:aspect-square flex flex-col justify-between border-[6px] md:border-[8px] border-black bg-[#0A0A0A] p-6 md:p-8 transition-shadow duration-300 shadow-[10px_10px_0px_0px_#000] md:shadow-[15px_15px_0px_0px_#000] hover:shadow-[20px_20px_0px_0px_#000]"
    >
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${data.color} 0%, transparent 70%)` }}
      />

      <div className="absolute top-4 right-6 z-[1] opacity-50" style={{ transform: "translateZ(30px)" }}>
        <span 
          className="text-6xl md:text-8xl font-black text-transparent"
          style={{ fontFamily: "var(--font-bebas)", WebkitTextStroke: `2px ${data.color}` }}
        >
          {data.id}
        </span>
      </div>

      <div className="relative z-10 pointer-events-none" style={{ transform: "translateZ(40px)" }}>
        <h3 
          className="text-3xl md:text-4xl font-black uppercase text-white mb-6 tracking-tighter leading-none"
          style={{ fontFamily: "var(--font-bebas)", textShadow: `3px 3px 0px ${data.color}` }}
        >
          {data.title}
        </h3>
      </div>

      <div className="relative z-10 mt-auto pointer-events-none" style={{ transform: "translateZ(50px)" }}>
        <div className="border-t-4 border-white pt-4">
          <p className="text-zinc-300 text-sm md:text-base font-mono leading-relaxed">
            {data.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArchitectureCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Engenharia de Drag to Scroll no Desktop
  const handleMouseDown = (e: ReactMouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplicador de velocidade do arrasto
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="relative w-full bg-[#0A0A0A] py-24 overflow-hidden border-y-[6px] border-black">
      
      {/* BACKGROUND PLACEHOLDER (Z-INDEX 0) */}
      <div className="absolute inset-0 z-[0] opacity-30 pointer-events-none select-none">
        <Image
          src="/carousel-bg.webp" // Mude isso para o nome exato da imagem que você gerar
          alt="Digital Landscape"
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

      <div className="relative z-[10] px-4 md:px-12 mb-12 text-center md:text-left pointer-events-none">
        <h2 
          className="text-[clamp(3rem,8vw,6rem)] font-black uppercase text-white leading-none tracking-tighter"
          style={{ 
            fontFamily: "var(--font-bebas)",
            WebkitTextStroke: "2px #000",
            textShadow: "6px 6px 0px #14F195"
          }}
        >
          THE ENGINE
        </h2>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        // Desativa o snap enquanto arrasta pra não dar conflito físico de GPU
        className={`relative z-[10] flex overflow-x-auto gap-6 md:gap-12 px-[7.5vw] md:px-[10vw] pb-16 pt-8 ${
          isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          perspective: "1200px"
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />

        {CARDS_DATA.map((item) => (
          // Injetamos a classe de snap-center na div pai para manter o alinhamento
          <div key={item.id} className="snap-center shrink-0">
            <ArchitectureCard data={item} />
          </div>
        ))}
        
        <div className="shrink-0 w-[5vw] md:w-[5vw]" aria-hidden="true" />
      </div>
    </section>
  );
}