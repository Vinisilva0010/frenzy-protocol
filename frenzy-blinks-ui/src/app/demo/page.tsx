"use client";

import '@dialectlabs/blinks/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { useMemo } from 'react';
import { Blink, useBlink } from '@dialectlabs/blinks';
import { useBlinkSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// ==========================================
// 1. O MOTOR DE RENDERIZAÇÃO DO BLINK
// ==========================================
function BlinkRenderer() {
  const { adapter } = useBlinkSolanaWalletAdapter('https://api.devnet.solana.com');
  
  // URL com bypass de cache agressivo
  const { blink, isLoading } = useBlink({ 
    url: 'https://frenzy.zanvexis.com/api/actions/frenzy?v=16' 
  });

  if (isLoading) {
    return <p className="text-[#14F195] mt-4 text-lg font-bold animate-pulse text-center">⏳ Carregando o Motor do Cofre...</p>;
  }

  if (!blink) {
    return <p className="text-red-500 mt-4 text-lg font-bold text-center">🚨 Erro: Blink não encontrado.</p>;
  }

  return (
    <div className="mt-6 w-full">
      <Blink 
        blink={blink} 
        adapter={adapter}
        securityLevel="all" 
        stylePreset="default"
      />
    </div>
  );
}

// ==========================================
// 2. A CARCAÇA BLINDADA DA PÁGINA (Com UX Explicativa)
// ==========================================
export default function DemoPage() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [], []); 

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-[#0a0a0a] font-sans text-white">
            
            {/* CABEÇALHO DA DEMO */}
            <h1 className="text-[#14F195] text-4xl md:text-5xl font-black mb-4 uppercase tracking-widest text-center drop-shadow-md">
              A MÁQUINA DE ALPHA
            </h1>
            <p className="text-gray-400 text-center max-w-2xl mb-10 text-lg">
              Faça um depósito teste usando a Devnet. O nosso Smart Contract em Rust vai interceptar o seu SOL e cortá-lo instantaneamente ao meio para equilibrar o seu risco on-chain.
            </p>

            {/* CAIXAS EXPLICATIVAS DO PROTOCOLO */}
            <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 mb-10">
              
              <div className="flex-1 bg-[#111] p-6 border-[2px] border-[#3b82f6] rounded-xl shadow-[4px_4px_0px_0px_#3b82f6] transition-transform hover:-translate-y-1">
                <h3 className="text-[#3b82f6] font-black text-xl mb-2 uppercase">🛡️ 50% Segurança</h3>
                <p className="text-sm text-gray-300">
                  Metade do seu capital é trancada em estratégias de baixo risco (Mock Jito Staking). Focado em preservação de patrimônio e yield constante para garantir sua paz de espírito.
                </p>
              </div>

              <div className="flex-1 bg-[#111] p-6 border-[2px] border-[#ef4444] rounded-xl shadow-[4px_4px_0px_0px_#ef4444] transition-transform hover:-translate-y-1">
                <h3 className="text-[#ef4444] font-black text-xl mb-2 uppercase">🔥 50% Caos Máximo</h3>
                <p className="text-sm text-gray-300">
                  A outra metade é injetada nas trincheiras (Mock Raydium/HFT). Risco extremo, volatilidade total. Onde os verdadeiros multiplicadores de capital acontecem.
                </p>
              </div>

            </div>

            {/* O BLINK (AÇÃO DO USUÁRIO) */}
            <div className="w-full max-w-md bg-white/5 p-6 rounded-2xl border border-[#14F195]/30 shadow-[0_0_40px_rgba(20,241,149,0.15)] flex flex-col items-center">
              <div className="text-center w-full pb-4 border-b border-[#14F195]/20">
                <h2 className="text-[#14F195] font-bold text-xl">1. Teste o Protocolo</h2>
                <p className="text-xs text-gray-500 mt-1">Conecte sua Phantom e faça o depósito.</p>
              </div>
              <BlinkRenderer />
            </div>

            {/* FLUXO PARA O DASHBOARD */}
            <div className="mt-16 text-center">
              <h2 className="text-gray-400 font-bold text-lg mb-4">2. Acompanhe seus Lucros</h2>
              <a
                href="/dashboard"
                className="inline-block bg-[#14F195] text-black font-black uppercase px-10 py-4 border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
              >
                Abrir o seu Cofre (Dashboard)
              </a>
            </div>

          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}