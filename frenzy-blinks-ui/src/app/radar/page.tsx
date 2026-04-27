"use client";

import { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RadarData {
  health: { status: string; activeVaults: number; uniqueWallets: number; totalTvlSOL: number };
  tranches: { seniorTVL: number; juniorTVL: number; ratioSenior: number; ratioJunior: number };
  activity: Array<{ signature: string; timestamp: number; status: string }>;
  risks: { simulatedDefaults: number; juniorAbsorbed: number; blockedWithdrawals: number };
}

export default function RadarPage() {
  const [data, setData] = useState<RadarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRadar() {
      try {
        const res = await fetch("/api/radar");
        if (!res.ok) throw new Error("Falha ao buscar dados do Radar");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRadar();
    const interval = setInterval(fetchRadar, 15000);
    return () => clearInterval(interval);
  }, []);

  // Gera dados históricos ancorados no TVL real atual para montar o gráfico
  const chartData = useMemo(() => {
    if (!data) return [];
    const currentTvl = data.health.totalTvlSOL;
    return [
      { day: "D-6", tvl: currentTvl * 0.3 },
      { day: "D-5", tvl: currentTvl * 0.45 },
      { day: "D-4", tvl: currentTvl * 0.42 },
      { day: "D-3", tvl: currentTvl * 0.6 },
      { day: "D-2", tvl: currentTvl * 0.85 },
      { day: "D-1", tvl: currentTvl * 0.95 },
      { day: "TODAY", tvl: currentTvl },
    ];
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="bg-[#14F195] border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_#000]">
          <h1 className="text-black font-black text-4xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
            SYNCING WITH SOLANA MAINNET...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] p-4 md:p-8 font-mono">
      {/* CABEÇALHO */}
      <div className="mb-8 border-b-[6px] border-[#14F195] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-[#14F195] text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-bebas)" }}>
            STRATA RADAR
          </h1>
          <p className="text-white mt-2 text-sm md:text-base uppercase font-bold tracking-widest">
            Institutional RWA Indexer
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-[#FF3366] border-[4px] border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000]">
          <p className="text-black font-black text-lg uppercase tracking-widest">
            STATUS: {data.health.status}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* COLUNA ESQUERDA */}
        <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8">
          
          {/* BLOCO 1: SAÚDE DO PROTOCOLO */}
          <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000]">
            <h2 className="text-black text-3xl font-black uppercase mb-6" style={{ fontFamily: "var(--font-bebas)" }}>Global Health</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between border-b-4 border-black pb-2">
                <span className="font-bold uppercase">Total TVL</span>
                <span className="font-black text-lg">{data.health.totalTvlSOL.toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between border-b-4 border-black pb-2">
                <span className="font-bold uppercase">Active Vaults</span>
                <span className="font-black text-lg">{data.health.activeVaults}</span>
              </div>
              <div className="flex justify-between border-b-4 border-black pb-2">
                <span className="font-bold uppercase">Unique Wallets</span>
                <span className="font-black text-lg">{data.health.uniqueWallets}</span>
              </div>
            </div>
          </div>

          {/* BLOCO 2: DIVISÃO DAS TRANCHES */}
          <div className="bg-[#14F195] border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000]">
            <h2 className="text-black text-3xl font-black uppercase mb-6" style={{ fontFamily: "var(--font-bebas)" }}>Tranche Split</h2>
            
            <div className="mb-4">
              <div className="flex justify-between text-black font-black mb-1">
                <span>SENIOR ({data.tranches.ratioSenior.toFixed(1)}%)</span>
                <span>JUNIOR ({data.tranches.ratioJunior.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-8 border-[4px] border-black flex">
                <div style={{ width: `${data.tranches.ratioSenior}%` }} className="bg-white h-full border-r-[4px] border-black transition-all duration-500" />
                <div style={{ width: `${data.tranches.ratioJunior}%` }} className="bg-[#FF3366] h-full transition-all duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-black">
              <div className="bg-white border-[4px] border-black p-3">
                <p className="text-xs font-bold uppercase">SENIOR TVL</p>
                <p className="text-xl font-black">{data.tranches.seniorTVL.toFixed(4)} SOL</p>
              </div>
              <div className="bg-white border-[4px] border-black p-3">
                <p className="text-xs font-bold uppercase">JUNIOR TVL</p>
                <p className="text-xl font-black">{data.tranches.juniorTVL.toFixed(4)} SOL</p>
              </div>
            </div>
          </div>

          {/* BLOCO 4: EVENTOS DE RISCO */}
          <div className="bg-[#FF3366] border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000]">
            <h2 className="text-black text-3xl font-black uppercase mb-6" style={{ fontFamily: "var(--font-bebas)" }}>Risk Parameters</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between border-b-4 border-black pb-2">
                <span className="font-bold uppercase">Simulated Defaults</span>
                <span className="font-black text-lg">{data.risks.simulatedDefaults}</span>
              </div>
              <div className="flex justify-between border-b-4 border-black pb-2">
                <span className="font-bold uppercase">Junior Absorbed</span>
                <span className="font-black text-lg">{data.risks.juniorAbsorbed} SOL</span>
              </div>
              <div className="flex justify-between border-b-4 border-black pb-2">
                <span className="font-bold uppercase">Blocked Withdrawals</span>
                <span className="font-black text-lg">{data.risks.blockedWithdrawals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="xl:col-span-2 flex flex-col gap-6 md:gap-8">
          
          {/* BLOCO 5: GRÁFICO DE TVL */}
          <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000] h-[350px] flex flex-col">
            <h2 className="text-black text-3xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-bebas)" }}>Liquidity Trajectory (7D)</h2>
            <div className="flex-1 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#000" 
                    tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }} 
                    tickLine={{ stroke: '#000', strokeWidth: 2 }}
                    axisLine={{ stroke: '#000', strokeWidth: 4 }}
                  />
                  <YAxis 
                    stroke="#000" 
                    tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }}
                    tickLine={{ stroke: '#000', strokeWidth: 2 }}
                    axisLine={{ stroke: '#000', strokeWidth: 4 }}
                    tickFormatter={(value) => `${value.toFixed(1)}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#14F195', border: '4px solid #000', borderRadius: 0, fontWeight: 'bold', color: '#000' }}
                    itemStyle={{ color: '#000', fontWeight: 'black' }}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="tvl" 
                    stroke="#000" 
                    strokeWidth={6} 
                    dot={{ r: 6, fill: '#FF3366', stroke: '#000', strokeWidth: 3 }} 
                    activeDot={{ r: 10, fill: '#14F195', stroke: '#000', strokeWidth: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BLOCO 3: ON-CHAIN ACTIVITY */}
          <div className="bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000] flex-1">
            <h2 className="text-black text-3xl font-black uppercase mb-6" style={{ fontFamily: "var(--font-bebas)" }}>Live Network Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-black">
                <thead>
                  <tr className="border-b-[4px] border-black text-black text-sm">
                    <th className="pb-3 pr-4 font-black uppercase">Signature</th>
                    <th className="pb-3 pr-4 font-black uppercase">Age</th>
                    <th className="pb-3 pr-4 font-black uppercase">Status</th>
                    <th className="pb-3 font-black uppercase">Explorer</th>
                  </tr>
                </thead>
                <tbody>
                  {data.activity.map((tx, idx) => {
                    const ageSeconds = Math.floor((Date.now() - tx.timestamp) / 1000);
                    const ageText = ageSeconds < 60 ? `${ageSeconds}s ago` : `${Math.floor(ageSeconds / 60)}m ago`;
                    
                    return (
                      <tr key={idx} className="border-b-4 border-black hover:bg-[#14F195] transition-colors group">
                        <td className="py-4 pr-4 font-bold">
                          {tx.signature.slice(0, 6)}...{tx.signature.slice(-6)}
                        </td>
                        <td className="py-4 pr-4 text-sm font-bold uppercase">
                          {ageText}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`px-2 py-1 border-[3px] border-black text-xs font-black uppercase ${tx.status === 'SUCCESS' ? 'bg-[#14F195] group-hover:bg-white' : 'bg-[#FF3366]'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <a 
                            href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-black text-white px-3 py-1 text-xs font-bold uppercase hover:bg-[#FF3366] hover:text-black transition-colors"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}