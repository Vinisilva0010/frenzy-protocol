"use client";

import '@dialectlabs/blinks/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { useMemo, useState, useEffect, useRef } from 'react';
import { Blink, useBlink } from '@dialectlabs/blinks';
import { useBlinkSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
// ==========================================
// 1. HYDRATION FIX: O Botão Blindado
// ==========================================
function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-12 w-48 bg-zinc-300 border-[4px] border-black shadow-[4px_4px_0px_0px_#000] animate-pulse"></div>;
  }

  return (
    <div className="wallet-brutalist-override">
      <WalletMultiButton className="!bg-[#00E1FD] !text-black !font-black !uppercase !border-[4px] !border-black !rounded-none !shadow-[6px_6px_0px_0px_#000] hover:!translate-y-1 hover:!translate-x-1 hover:!shadow-none !transition-all !h-12 !px-6" />
    </div>
  );
}

// ==========================================
// 2. O MOTOR DO BLINK (Lógica Intacta)
// ==========================================
function BlinkRenderer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { adapter } = useBlinkSolanaWalletAdapter('https://api.devnet.solana.com');
  const { connected } = useWallet(); 
  
  // 🔥 A MÁGICA ENTRA AQUI: O Next.js decide o link sozinho!
  const API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://frenzy.zanvexis.com';

  const { blink, isLoading } = useBlink({ 
    // Usando a crase (`) para juntar a variável com o resto do caminho
    url: `${API_URL}/api/actions/frenzy`
  });

  if (!mounted) return null;

  if (!connected) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-white border-[6px] border-black shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
        <h2 className="text-black text-2xl md:text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
          AWAITING AUTHENTICATION
        </h2>
        <p className="text-zinc-500 font-mono text-xs md:text-sm font-bold uppercase mt-2">
          Connect your wallet at the top to access the X-Feed Simulation.
        </p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white border-[6px] border-black">
        <p className="text-black font-mono font-black text-sm uppercase animate-pulse">
          INITIALIZING BLINK...
        </p>
      </div>
    );
  }

  if (!blink) return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#f4f4f0] border-[6px] border-black shadow-[inset_0px_0px_10px_rgba(0,0,0,0.1)]">
      <div className="bg-black text-[#14F195] font-mono font-black text-[10px] md:text-xs p-2 text-center uppercase border-b-[4px] border-black sticky top-0 z-10">
        X-FEED SECURE ENVIRONMENT
      </div>
      <div className="p-2 md:p-4">
        <Blink 
          blink={blink} 
          adapter={adapter}
          securityLevel="all" 
          stylePreset="default"
        />
      </div>
    </div>
  );
}

// ==========================================
// 3. A ENGENHARIA DE SCROLL E O CELULAR
// ==========================================
export default function DemoPage() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [], []); 
  const containerRef = useRef<HTMLElement>(null);

  // Sensor de Scroll e Amortecedor de Física
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  // Mapeamento dos 4 Quadradinhos (Distâncias Maiores pro PC)
  const c1X = useTransform(smoothProgress, [0, 0.4], [0, -380]);
  const c1Y = useTransform(smoothProgress, [0, 0.4], [0, -250]);

  const c2X = useTransform(smoothProgress, [0, 0.4], [0, 380]);
  const c2Y = useTransform(smoothProgress, [0, 0.4], [0, -250]);

  const c3X = useTransform(smoothProgress, [0, 0.4], [0, -380]);
  const c3Y = useTransform(smoothProgress, [0, 0.4], [0, 200]);

  const c4X = useTransform(smoothProgress, [0, 0.4], [0, 380]);
  const c4Y = useTransform(smoothProgress, [0, 0.4], [0, 200]);

  // Blink subindo
  const blinkOpacity = useTransform(smoothProgress, [0.3, 0.6], [0, 1]);
  const blinkScale = useTransform(smoothProgress, [0.3, 0.6], [0.9, 1]);
  
  // Opacidade do texto inicial do celular
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          
          {/* Pista de Scroll (3 Telas de Altura) - Sem o overflow-x-hidden que quebrava o sticky */}
          <section 
            ref={containerRef} 
            className="relative h-[300vh] w-full bg-[#f4f4f0] font-sans border-y-[12px] border-black clip-path-bounds"
          >
            <div 
              className="absolute inset-0 z-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
                backgroundSize: "24px 24px"
              }}
            />

            {/* Viewport Travada na Tela (Sticky Corrigido) */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
              
              {/* Header Fixo de Navegação Institucional */}
              <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-start z-50 pointer-events-auto">
                <div className="bg-white border-[6px] border-black p-4 shadow-[6px_6px_0px_0px_#000]">
                  <h1 className="text-black text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
                    STRATA PROTOCOL
                  </h1>
                  <p className="text-zinc-600 font-mono font-bold uppercase text-[10px] md:text-xs tracking-widest mt-1">
                    Demo Environment
                  </p>
                </div>
                <ClientWalletButton />
              </div>

              {/* O CELULAR LARANJA BRUTALISTA (MAIOR NO PC) */}
              <div className="relative w-[340px] h-[700px] md:w-[420px] md:h-[850px] bg-[#FF6600] border-[8px] border-black rounded-[50px] p-4 flex flex-col shadow-[20px_20px_0px_0px_#000] pointer-events-auto z-20">
                
                {/* Notch Superior do Celular */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] md:w-[150px] h-[25px] md:h-[30px] bg-black rounded-b-[15px] z-30"></div>

                {/* TELA DO CELULAR */}
                <div className="flex-1 bg-white border-[6px] border-black rounded-[35px] relative flex flex-col items-center justify-center mt-2">
                  
                  {/* Título Central (Some ao Rolar) */}
                  <motion.div style={{ opacity: headerOpacity }} className="absolute text-center px-4 top-[10%]">
                    <h2 className="text-black text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)", lineHeight: 0.9 }}>
                      SCROLL TO<br/>UNPACK
                    </h2>
                    <p className="text-zinc-500 font-mono text-[10px] md:text-xs uppercase font-bold mt-2">
                      Initialize Risk Management
                    </p>
                  </motion.div>

                  {/* OS 4 QUADRADINHOS DE EXPLICAÇÃO */}
                 {/* Q1: Deep Safety */}
                  <motion.div 
                    style={{ x: c1X, y: c1Y }} 
                    className="absolute w-[135px] h-[135px] md:w-[160px] md:h-[160px] bg-[#14F195] border-[6px] border-black p-3 md:p-4 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-center text-center z-40 top-[25%] left-[5%] md:left-[10%]"
                  >
                    <h3
                      className="text-black font-black text-xl md:text-2xl uppercase leading-none mb-2"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      90% SAFE LAYER
                    </h3>
                    <p className="text-black font-mono text-[9px] md:text-[11px] font-bold uppercase leading-tight">
                      CAPITAL-FIRST DESIGN. SENIOR TRANCHE FOCUSED ON PRESERVATION BEFORE UPSIDE.
                    </p>
                  </motion.div>

                  {/* Q2: Max Alpha */}
                    <motion.div 
                      style={{ x: c2X, y: c2Y }} 
                      className="absolute w-[135px] h-[135px] md:w-[160px] md:h-[160px] bg-[#FF3366] border-[6px] border-black p-3 md:p-4 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-center text-center z-40 top-[25%] right-[5%] md:right-[10%]"
                    >
                      <h3
                        className="text-black font-black text-xl md:text-2xl uppercase leading-none mb-2"
                        style={{ fontFamily: "var(--font-bebas)" }}
                      >
                        10% FIRST LOSS
                      </h3>
                      <p className="text-black font-mono text-[9px] md:text-[11px] font-bold uppercase leading-tight">
                        HIGH-VOLTAGE UPSIDE. YOU ABSORB FIRST LOSSES TO CAPTURE EXCESS YIELD.
                      </p>
                    </motion.div>
                  {/* Q3: Deterministic */}
                  <motion.div 
                    style={{ x: c3X, y: c3Y }} 
                    className="absolute w-[135px] h-[135px] md:w-[160px] md:h-[160px] bg-[#00E1FD] border-[6px] border-black p-3 md:p-4 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-center text-center z-40 bottom-[25%] left-[5%] md:left-[10%]"
                  >
                    <h3
                      className="text-black font-black text-xl md:text-2xl uppercase leading-none mb-2"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      RULES ON-CHAIN
                    </h3>
                    <p className="text-black font-mono text-[9px] md:text-[11px] font-bold uppercase leading-tight">
                      FIXED SPLIT: 90% CONSERVATIVE, 10% AGGRESSIVE. NO HIDDEN LEVERS, ONLY CODE.
                    </p>
                  </motion.div>

                  {/* Q4: Zero Friction */}
                  <motion.div 
                    style={{ x: c4X, y: c4Y }} 
                    className="absolute w-[135px] h-[135px] md:w-[160px] md:h-[160px] bg-[#9945FF] border-[6px] border-black p-3 md:p-4 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-center text-center z-40 bottom-[25%] right-[5%] md:right-[10%]"
                  >
                    <h3 className="text-black font-black text-xl md:text-2xl uppercase leading-none mb-2" style={{ fontFamily: "var(--font-bebas)" }}>NO FRICTION</h3>
                    <p className="text-black font-mono text-[9px] md:text-[11px] font-bold uppercase leading-tight">Execute directly from your X social feed.</p>
                  </motion.div>

                  {/* O BLINK */}
                  <motion.div 
                    style={{ opacity: blinkOpacity, scale: blinkScale, pointerEvents: useTransform(blinkOpacity, v => v > 0.5 ? "auto" : "none") }}
                    className="absolute inset-0 w-full h-full p-2 md:p-4 z-30 flex items-center justify-center bg-white rounded-[30px] overflow-hidden"
                  >
                    <BlinkRenderer />
                  </motion.div>

                </div>

                {/* O BOTÃO HOME (Retrô iPhone 6 Style) COM LINK PRO DASHBOARD */}
                <div className="w-full h-[80px] md:h-[90px] flex flex-col items-center justify-center mt-2">
                  <p className="text-black font-mono text-[10px] md:text-xs font-black uppercase mb-1">
                    VIEW PORTFOLIO
                  </p>
                  <a 
                    href="/dashboard"
                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-white border-[6px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-pointer group relative"
                  >
                    <div className="w-4 h-4 md:w-5 md:h-5 border-[3px] border-zinc-300 rounded-sm group-hover:border-black transition-colors"></div>
                  </a>
                </div>

              </div>

            </div>
          </section>
          
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}