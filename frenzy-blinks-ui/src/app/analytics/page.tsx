"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
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

  useEffect(() => {
    async function fetchGlobalData() {
      try {
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        // Criamos um provider de leitura (não precisa de carteira conectada)
        const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
        const program = new anchor.Program(frenzyIdl as any, provider);

        // 🔥 A MÁGICA DE PERFORMANCE: Puxa todas as contas de uma vez
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
    // Atualiza a cada 15 segundos para dar o efeito de "Tempo Real"
    const interval = setInterval(fetchGlobalData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-8 flex flex-col items-center">
      <h1 className="text-[#14F195] text-4xl font-black mb-2 uppercase tracking-widest text-center">
        Global Analytics
      </h1>
      <p className="text-gray-400 mb-12 text-center">Transparência on-chain. Verifique, não confie.</p>

      {isLoading || !stats ? (
        <div className="flex flex-col items-center mt-20">
          <div className="w-16 h-16 border-4 border-[#14F195] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#14F195] font-bold animate-pulse">Varrendo blocos da Solana...</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TVL GLOBAL */}
          <div className="bg-[#111] border-[2px] border-[#14F195] p-8 rounded-xl shadow-[6px_6px_0px_0px_#14F195] md:col-span-2 text-center">
            <h2 className="text-gray-400 font-bold text-xl mb-2">Total Value Locked (TVL)</h2>
            <p className="text-5xl md:text-7xl font-black text-white">{stats.totalTVL.toFixed(2)} <span className="text-2xl text-[#14F195]">SOL</span></p>
            <p className="text-sm text-gray-500 mt-4">Distribuído em {stats.totalVaults} cofres autônomos</p>
          </div>

          {/* DIVISÃO GLOBAL */}
          <div className="bg-[#111] border-[2px] border-[#3b82f6] p-6 rounded-xl shadow-[4px_4px_0px_0px_#3b82f6]">
            <h3 className="text-[#3b82f6] font-black text-2xl mb-2">🛡️ Reserva Global (Safe)</h3>
            <p className="text-4xl font-bold">{stats.globalSafe.toFixed(2)} SOL</p>
            <p className="text-gray-500 mt-2 text-sm">Alocado em liquidez de baixo risco.</p>
          </div>

          <div className="bg-[#111] border-[2px] border-[#ef4444] p-6 rounded-xl shadow-[4px_4px_0px_0px_#ef4444]">
            <h3 className="text-[#ef4444] font-black text-2xl mb-2">🔥 Capital de Risco (Chaos)</h3>
            <p className="text-4xl font-bold">{stats.globalChaos.toFixed(2)} SOL</p>
            <p className="text-gray-500 mt-2 text-sm">Operando em estratégias agressivas.</p>
          </div>

        </div>
      )}
    </div>
  );
}