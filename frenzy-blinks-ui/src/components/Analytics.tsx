"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { motion, AnimatePresence } from "framer-motion";
import frenzyIdl from "@/idl/frenzy_vault.json";

const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");
const RPC_ENDPOINT = "https://api.devnet.solana.com";

interface GlobalStats {
  totalVaults: number;
  totalTVL: number;
  globalSafe: number;
  globalChaos: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // BLINDAGEM CONTRA O ERRO DE WINDOW E HYDRATION
  const [mounted, setMounted] = useState(false);
  
  // Controle de qual Balão (Aba) está ativo na tela
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    // Libera a renderização do que depende do navegador (Globo 3D)
    setMounted(true);
    
    // ==========================================
    // LÓGICA DO MOTOR ON-CHAIN (INTOCÁVEL)
    // ==========================================
    async function fetchGlobalData() {
      try {
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
        const program = new anchor.Program(frenzyIdl as any, provider);

        const allVaults = await (program.account as any).vaultState.all();

        let safeSum = 0;
        let chaosSum = 0;

        allVaults.forEach((vault: any) => {
          safeSum += vault.account.safetyBalance.toNumber();
          chaosSum += vault.account.chaosBalance.toNumber();
        });

        setStats({
          totalVaults: allVaults.length,
          globalSafe: safeSum / 1_000_000_000,
          globalChaos: chaosSum / 1_000_000_000,
          totalTVL: (safeSum + chaosSum) / 1_000_000_000,
        });

      } catch (error) {
        console.error("Erro ao varrer a blockchain:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 15000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // DADOS DOS BALÕES (CONTEÚDO DINÂMICO)
  // ==========================================
  const tabsData = [
    {
      id: 0,
      title: "THE RADAR",
      color: "#ffffff",
      content: (
        <>
          <p className="text-black font-mono font-bold text-base md:text-xl leading-relaxed uppercase">
            You are looking at the FRENZY Global Radar.
          </p>
          <p className="text-zinc-600 font-mono text-sm md:text-base mt-4 font-bold uppercase">
            This terminal maps the total liquidity and status of every autonomous vault currently executing on the Solana Network. Select a data node below.
          </p>
        </>
      )
    },
    {
      id: 1,
      title: "GLOBAL TVL",
      color: "#FFE600",
      content: stats ? (
        <>
          <h2 className="text-black text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
            {stats.totalTVL.toFixed(2)} <span className="text-4xl">SOL</span>
          </h2>
          <p className="text-black font-mono font-black text-sm md:text-lg mt-4 border-t-4 border-black pt-2 uppercase">
            Distributed across [ {stats.totalVaults} ] active vaults
          </p>
        </>
      ) : null
    },
    {
      id: 2,
      title: "DEEP SAFETY",
      color: "#00E1FD",
      content: stats ? (
        <>
          <h2 className="text-black text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
            {stats.globalSafe.toFixed(2)} <span className="text-4xl">SOL</span>
          </h2>
          <p className="text-black font-mono font-black text-sm md:text-lg mt-4 border-t-4 border-black pt-2 uppercase">
            Locked in institutional infrastructure
          </p>
        </>
      ) : null
    },
    {
      id: 3,
      title: "MAX ALPHA",
      color: "#FF3366",
      content: stats ? (
        <>
          <h2 className="text-black text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
            {stats.globalChaos.toFixed(2)} <span className="text-4xl">SOL</span>
          </h2>
          <p className="text-black font-mono font-black text-sm md:text-lg mt-4 border-t-4 border-black pt-2 uppercase">
            Deployed in high-frequency trenches
          </p>
        </>
      ) : null
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#111111] overflow-hidden flex flex-col items-center justify-between py-12 px-4">
      
      {/* ========================================== */}
      {/* 1. O GLOBO 3D EM CSS (RENDERIZADO SÓ NO CLIENTE) */}
      {/* ========================================== */}
      {mounted && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none" style={{ perspective: "1000px" }}>
          <motion.div 
            animate={{ rotateY: 360, rotateX: 20 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[0, 45, 90, 135].map((deg, i) => (
              <div 
                key={`v-${i}`} 
                className="absolute inset-0 border-[4px] md:border-[6px] border-white rounded-full opacity-30" 
                style={{ transform: `rotateY(${deg}deg)` }} 
              />
            ))}
            {[-60, -30, 0, 30, 60].map((deg, i) => (
              <div 
                key={`h-${i}`} 
                className="absolute left-1/2 top-1/2 border-[4px] md:border-[6px] border-white rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2" 
                style={{ 
                  width: `${Math.cos(deg * (Math.PI / 180)) * 100}%`, 
                  height: `${Math.cos(deg * (Math.PI / 180)) * 100}%`,
                  transform: `rotateX(90deg) translateZ(${Math.sin(deg * (Math.PI / 180)) * (window.innerWidth > 768 ? 300 : 150)}px)` 
                }} 
              />
            ))}
            <div className="absolute top-[20%] left-[20%] w-[100px] h-[100px] bg-[#00E1FD] rounded-full blur-[40px] opacity-60" style={{ transform: 'translateZ(150px)' }} />
            <div className="absolute bottom-[20%] right-[30%] w-[120px] h-[120px] bg-[#9945FF] rounded-full blur-[50px] opacity-50" style={{ transform: 'translateZ(-100px)' }} />
          </motion.div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. CABEÇALHO SUPERIOR                       */}
      {/* ========================================== */}
      <div className="relative z-10 w-full text-center mt-4">
        <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)", textShadow: "4px 4px 0px #000" }}>
          ON-CHAIN RADAR
        </h1>
        <div className="inline-block bg-black border-[4px] border-[#14F195] px-4 py-1 mt-2 shadow-[4px_4px_0px_0px_#14F195]">
          <p className="text-[#14F195] font-mono font-black text-xs md:text-sm uppercase tracking-widest">
            {isLoading ? "SCANNING NETWORK..." : "NETWORK SYNCED"}
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. O BALÃO DE GIBI (DISPLAY CENTRAL)       */}
      {/* ========================================== */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-3xl my-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full"
          >
            <div 
              className="bg-white border-[8px] border-black p-8 md:p-12 shadow-[20px_20px_0px_0px_#000]"
              style={{ backgroundColor: tabsData[activeTab].color }}
            >
              <div className="border-b-[6px] border-black pb-2 mb-6">
                <h2 className="text-black font-black text-2xl md:text-4xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                  {tabsData[activeTab].title}
                </h2>
              </div>
              
              {isLoading && activeTab !== 0 ? (
                <div className="py-10 text-center">
                  <p className="text-black font-mono font-black text-xl uppercase animate-pulse">
                    AGGREGATING BLOCKS...
                  </p>
                </div>
              ) : (
                tabsData[activeTab].content
              )}
            </div>

            <div 
              className="absolute -bottom-[28px] left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderTop: `30px solid black`
              }}
            >
              <div 
                className="absolute -top-[38px] -left-[12px] w-0 h-0"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderTop: `20px solid ${tabsData[activeTab].color}`
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================== */}
      {/* 4. OS 4 BOTÕES DE CONTROLE (NAVEGAÇÃO)      */}
      {/* ========================================== */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
        {[
          { id: 0, label: "INFO", desc: "What is this?" },
          { id: 1, label: "TVL", desc: "Total Protocol" },
          { id: 2, label: "SAFETY", desc: "Locked Reserve" },
          { id: 3, label: "ALPHA", desc: "Active Chaos" }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveTab(btn.id)}
            className={`
              flex flex-col items-center justify-center p-4 border-[4px] md:border-[6px] border-black transition-all
              ${activeTab === btn.id 
                ? 'bg-[#14F195] translate-y-2 shadow-none' 
                : 'bg-white shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000]'
              }
            `}
          >
            <span className="text-black font-black text-xl md:text-3xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
              {btn.label}
            </span>
            <span className="text-black font-mono font-bold text-[9px] md:text-xs uppercase mt-1">
              {btn.desc}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}