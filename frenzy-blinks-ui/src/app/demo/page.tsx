"use client";

import '@dialectlabs/blinks/index.css';
import { Blink, useBlink } from '@dialectlabs/blinks';
import { useBlinkSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana';

export default function DemoPage() {
  // Conecta o motor visual direto na Devnet
  const { adapter } = useBlinkSolanaWalletAdapter('https://api.devnet.solana.com');
  
  // A API nova agora usa useBlink e pede só a URL aqui dentro
  const { blink, isLoading } = useBlink({ 
    url: 'https://frenzy.zanvexis.com/api/actions/frenzy?v=11' 
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-[#14F195] text-2xl font-black mb-8 uppercase tracking-widest text-center">
          FRENZY Protocol Live Demo
        </h1>
        
        {isLoading || !blink ? (
          <p className="text-[#14F195] animate-pulse">Carregando Motor On-Chain...</p>
        ) : (
          // O componente agora recebe 'blink' e o 'adapter' separados!
          <Blink 
            blink={blink} 
            adapter={adapter}
            securityLevel="all" 
            stylePreset="default"
          />
        )}
      </div>
    </div>
  );
}