"use client";

import '@dialectlabs/blinks/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { useMemo } from 'react';
import { Blink, useBlink } from '@dialectlabs/blinks';
import { useBlinkSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// ==========================================
// 1. O MOTOR DE RENDERIZAÇÃO
// ==========================================
function BlinkRenderer() {
  const { adapter } = useBlinkSolanaWalletAdapter('https://api.devnet.solana.com');
  
  // URL com bypass de cache agresivo pra Vercel não entregar lixo antigo
  const { blink, isLoading } = useBlink({ 
    url: 'https://frenzy.zanvexis.com/api/actions/frenzy?v=15' 
  });

  if (isLoading) {
    return <p className="text-[#14F195] mt-8 text-xl font-bold animate-pulse text-center">⏳ Sincronizando com a Devnet...</p>;
  }

  if (!blink) {
    return <p className="text-red-500 mt-8 text-xl font-bold text-center">🚨 Erro: Blink não encontrado.</p>;
  }

  return (
    <div className="mt-8 w-full">
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
// 2. A CARCAÇA BLINDADA DA PÁGINA
// ==========================================
export default function DemoPage() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [], []); // Puxa os adapters padrão (Phantom, Solflare, etc)

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4 font-sans">
            <h1 className="text-[#14F195] text-3xl font-black mb-6 uppercase tracking-widest text-center drop-shadow-md">
              FRENZY Protocol Live Demo
            </h1>
            <div className="mt-10 flex justify-center">
          <a
            href="/dashboard"
            className="inline-block bg-[#14F195] text-black font-black uppercase px-8 py-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            Ir para o Dashboard
          </a>
        </div>
            
            {/* Caixa de contenção para garantir que o Card não seja esmagado */}
            <div className="w-full max-w-lg bg-white/5 p-6 rounded-2xl border border-[#14F195]/20 shadow-[0_0_30px_rgba(20,241,149,0.1)] flex flex-col items-center">
              <BlinkRenderer />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}