"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RadarData {
  health: { status: string; activeVaults: number; uniqueWallets: number; totalTvlSOL: number };
  tranches: { seniorTVL: number; juniorTVL: number; ratioSenior: number; ratioJunior: number };
  activity: Array<{ signature: string; timestamp: number; status: string }>;
  risks: { simulatedDefaults: number; juniorAbsorbed: number; blockedWithdrawals: number };
}

export default function RadarTerminal() {
  const [data, setData] = useState<RadarData | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function fetchRadar() {
      try {
        const res = await fetch("/api/radar");
        if (!res.ok) throw new Error("Failed to fetch Radar data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        // Simulates a heavy system boot for the unfolding animation effect
        setTimeout(() => setBooting(false), 1200);
      }
    }

    fetchRadar();
    const interval = setInterval(fetchRadar, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-12 perspective-[1200px]">
      <AnimatePresence mode="wait">
        {booting || !data ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="flex justify-center items-center h-[400px]"
          >
            <div className="bg-white border-[6px] border-black p-8 shadow-[15px_15px_0px_0px_#14F195]">
              <h2 className="text-black text-4xl md:text-6xl font-black uppercase tracking-tighter animate-pulse" style={{ fontFamily: "var(--font-bebas)" }}>
                INITIALIZING STRATA_OS...
              </h2>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="terminal"
            initial={{ height: 0, opacity: 0, rotateX: 20 }}
            animate={{ height: "auto", opacity: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-[#111111] border-[6px] md:border-[8px] border-black shadow-[20px_20px_0px_0px_#14F195] relative overflow-hidden"
          >
            {/* TERMINAL HEADER */}
            <div className="bg-[#14F195] text-black p-3 px-6 border-b-[6px] border-black flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-mono font-black text-lg md:text-xl uppercase tracking-widest">
                  STRATA CORE // SYSTEM ACTIVE
                </span>
                <span className="hidden md:inline-block w-3 h-3 bg-black rounded-full animate-ping" />
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-white border-[3px] border-black" />
                <div className="w-6 h-6 bg-white border-[3px] border-black" />
                <div className="w-6 h-6 bg-[#FF3366] border-[3px] border-black" />
              </div>
            </div>

            {/* MAIN HUD GRID */}
            <div className="p-6 md:p-8 font-mono grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              
              {/* LEFT COLUMN: Health & Risk Data */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* TVL HERO BLOCK */}
                <div className="bg-white border-[4px] border-black p-6">
                  <p className="font-black uppercase text-zinc-500 mb-1">Total Value Locked</p>
                  <h2 className="text-black text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
                    {data.health.totalTvlSOL.toFixed(2)} <span className="text-3xl text-[#14F195]" style={{ textShadow: "2px 2px 0px #000" }}>SOL</span>
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="bg-black text-[#14F195] px-3 py-1 font-bold text-sm uppercase">
                      VAULTS: {data.health.activeVaults}
                    </span>
                    <span className="bg-black text-white px-3 py-1 font-bold text-sm uppercase">
                      WALLETS: {data.health.uniqueWallets}
                    </span>
                  </div>
                </div>

                {/* RISK PARAMETERS BLOCK */}
                <div className="bg-[#FF3366] border-[4px] border-black p-6 text-black">
                  <h3 className="font-black text-2xl uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>Risk Engine Metrics</h3>
                  <div className="space-y-3 font-bold uppercase text-sm">
                    <div className="flex justify-between border-b-2 border-black pb-1">
                      <span>Simulated Defaults</span>
                      <span className="text-xl">{data.risks.simulatedDefaults}</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black pb-1">
                      <span>Junior Absorbed</span>
                      <span className="text-xl">{data.risks.juniorAbsorbed} SOL</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black pb-1">
                      <span>Locked Withdrawals</span>
                      <span className="text-xl">{data.risks.blockedWithdrawals}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Tranches & Live Feed */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* TRANCHE SPLIT VISUALIZER */}
                <div className="bg-white border-[4px] border-black p-6">
                  <h3 className="font-black text-black text-2xl uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>Liquidity Strata</h3>
                  
                  <div className="w-full h-12 border-[4px] border-black flex relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.tranches.ratioSenior}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-[#14F195] h-full border-r-[4px] border-black flex items-center px-4"
                    >
                      <span className="text-black font-black text-sm md:text-lg">SENIOR {data.tranches.ratioSenior.toFixed(1)}%</span>
                    </motion.div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.tranches.ratioJunior}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-black h-full flex justify-end items-center px-4 flex-1"
                    >
                      <span className="text-[#FF3366] font-black text-sm md:text-lg">JUNIOR {data.tranches.ratioJunior.toFixed(1)}%</span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-black">
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-500">Protected Reserve</p>
                      <p className="text-2xl font-black">{data.tranches.seniorTVL.toFixed(4)} SOL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-zinc-500">Alpha Allocation</p>
                      <p className="text-2xl font-black text-[#FF3366]">{data.tranches.juniorTVL.toFixed(4)} SOL</p>
                    </div>
                  </div>
                </div>

                {/* LIVE ACTIVITY LOG (SCROLLING TERMINAL) */}
                <div className="bg-black border-[4px] border-[#14F195] p-4 flex-1 min-h-[200px] flex flex-col relative">
                  <div className="absolute top-0 right-0 bg-[#14F195] text-black px-2 py-1 font-bold text-xs uppercase border-b-[4px] border-l-[4px] border-black z-10">
                    TX_STREAM
                  </div>
                  
                  {/* The actual scrolling container */}
                  <div className="overflow-y-auto h-[200px] md:h-[250px] pr-2 custom-scrollbar flex flex-col gap-2 mt-4">
                    {data.activity.map((tx, idx) => {
                      const ageSeconds = Math.floor((Date.now() - tx.timestamp) / 1000);
                      const ageText = ageSeconds < 60 ? `${ageSeconds}s` : `${Math.floor(ageSeconds / 60)}m`;
                      
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs md:text-sm font-mono border-b border-zinc-800 pb-2">
                          <div className="flex gap-3 items-center text-[#14F195]">
                            <span className="text-zinc-500">[{ageText}]</span>
                            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => window.open(`https://solscan.io/tx/${tx.signature}?cluster=devnet`, '_blank')}>
                              {tx.signature.slice(0, 12)}...{tx.signature.slice(-12)}
                            </span>
                          </div>
                          <span className={`${tx.status === 'SUCCESS' ? 'text-[#14F195]' : 'text-[#FF3366]'} font-black`}>
                            [{tx.status}]
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}