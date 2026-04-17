"use client";

import { useEffect, useState, useMemo } from "react";
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { motion } from "framer-motion";
import frenzyIdl from "@/idl/frenzy_vault.json";

import '@solana/wallet-adapter-react-ui/styles.css';

const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

// ==========================================
// 1. HYDRATION FIX: O Botão Blindado
// ==========================================
export function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-12 w-48 bg-zinc-800 border-[4px] border-[#14F195] shadow-[6px_6px_0px_0px_#14F195] animate-pulse"></div>;
  }

  return (
    <div className="wallet-brutalist-override">
      <WalletMultiButton className="!bg-[#14F195] !text-black !font-black !uppercase !border-[4px] !border-[#14F195] !rounded-none !shadow-[6px_6px_0px_0px_#14F195] hover:!translate-y-1 hover:!translate-x-1 hover:!shadow-none !transition-all !h-12 !px-6" />
    </div>
  );
}

// ==========================================
// 2. A LÓGICA DO DASHBOARD (INTOCÁVEL)
// ==========================================
function DashboardContent() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
  
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vaultPdaAddress, setVaultPdaAddress] = useState<string>("");

  const fetchVaultData = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("frenzy_state"), publicKey.toBuffer()],
        PROGRAM_ID
      );
      
      setVaultPdaAddress(vaultPda.toBase58());

      const balanceLamports = await connection.getBalance(vaultPda);
      const balanceSol = balanceLamports / 1_000_000_000;
      
      setVaultBalance(balanceSol > 0.002 ? balanceSol - 0.002 : 0); 
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
    const interval = setInterval(fetchVaultData, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleWithdraw = async () => {
    if (!publicKey || !wallet) {
      alert("Conecte sua carteira primeiro!");
      return;
    }

    const amountStr = window.prompt(`Você tem ${vaultBalance.toFixed(3)} SOL disponíveis. Quanto deseja sacar?`, "1");
    if (!amountStr) return;

    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > vaultBalance) {
      alert("Valor inválido ou superior ao saldo do cofre.");
      return;
    }

    try {
      const provider = new anchor.AnchorProvider(connection, (window as any).solana, { commitment: "confirmed" });
      const program = new anchor.Program(frenzyIdl as any, provider);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("frenzy_state"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const lamports = new anchor.BN(amountNum * 1_000_000_000);

      const tx = await program.methods
        .withdraw(lamports)
        .accounts({
          user: publicKey,
          vaultState: vaultPda,
        })
        .transaction();

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signature = await sendTransaction(tx, connection);
      alert(`🚀 Transação enviada! Assinatura: ${signature}\nAguarde alguns segundos...`);

      await connection.confirmTransaction(signature, "confirmed");
      alert("✅ Saque concluído com sucesso!");
      fetchVaultData();

    } catch (err: any) {
      console.error("Erro no saque:", err);
      alert("❌ Falha no saque: " + err.message);
    }
  };

  const handleInjectYield = async () => {
    if (!publicKey || !wallet) return;

    try {
      const provider = new anchor.AnchorProvider(connection, (window as any).solana, { commitment: "confirmed" });
      const program = new anchor.Program(frenzyIdl as any, provider);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("frenzy_state"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const safeYield = new anchor.BN(0.05 * 1_000_000_000);
      const chaosYield = new anchor.BN(0.15 * 1_000_000_000);

      const tx = await program.methods
        .injectMockYield(safeYield, chaosYield)
        .accounts({
          admin: publicKey,
          vaultState: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signature = await sendTransaction(tx, connection);
      alert(`⏳ Oráculo simulando 30 dias de mercado... Assinatura: ${signature}`);

      await connection.confirmTransaction(signature, "confirmed");
      alert("🤑 Alpha injetado com sucesso! Atualizando cofres...");
      
      fetchVaultData();
    } catch (err: any) {
      console.error("Erro ao simular rendimento:", err);
      alert("❌ Falha na simulação: " + err.message);
    }
  };

  const safeAllocation = vaultBalance * 0.5;
  const aggressiveAllocation = vaultBalance * 0.5;

  return (
    <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-8">
      
      {/* HEADER DO DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-[#111111] border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
        <div>
          <h1 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
            VAULT TELEMETRY
          </h1>
          <p className="text-[#14F195] font-mono text-xs md:text-sm uppercase font-bold tracking-widest mt-1">
            Real-time On-chain Risk Management
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <ClientWalletButton />
        </div>
      </div>

      {!publicKey ? (
        // TELA DE BLOQUEIO (SEM CARTEIRA)
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#111111] border-[6px] border-black p-12 text-center shadow-[15px_15px_0px_0px_#00E1FD]"
        >
          <div className="w-20 h-20 bg-black border-[6px] border-[#00E1FD] mx-auto mb-6 flex items-center justify-center">
            <span className="text-[#00E1FD] text-4xl font-mono font-black">?</span>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
            AWAITING CONNECTION
          </h2>
          <p className="text-zinc-500 font-mono mt-4 uppercase">
            Initialize your phantom wallet to access telemetry data.
          </p>
        </motion.div>
      ) : (
        <>
          {isLoading && vaultBalance === 0 ? (
            // TELA DE CARREGAMENTO
            <div className="w-full bg-[#111111] border-[6px] border-black p-12 text-center shadow-[10px_10px_0px_0px_#FF3366]">
              <p className="text-[#FF3366] font-mono font-black text-xl uppercase tracking-widest animate-pulse">
                SYNCING BLOCKCHAIN DATA...
              </p>
            </div>
          ) : (
            // DASHBOARD ATIVO
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-8"
            >
              
              {/* PAINEL PRINCIPAL: TVL E SAQUE */}
              <div className="w-full bg-white border-[8px] border-black p-8 md:p-10 shadow-[15px_15px_0px_0px_#14F195] relative">
                <div className="absolute top-0 right-0 bg-black text-[#14F195] px-4 py-1 border-b-[6px] border-l-[6px] border-black">
                  <span className="font-mono text-xs font-black uppercase">LIVE DATA</span>
                </div>
                
                <h2 className="text-zinc-500 font-mono text-sm md:text-base uppercase font-black mb-2">TOTAL VALUE LOCKED (TVL)</h2>
                <h1 className="text-black text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6" style={{ fontFamily: "var(--font-bebas)" }}>
                  {vaultBalance.toFixed(3)} <span className="text-4xl md:text-6xl text-zinc-300">SOL</span>
                </h1>
                
                <div className="bg-[#f4f4f0] border-[4px] border-black p-4 mb-8 inline-block">
                  <p className="text-black font-mono text-xs md:text-sm font-bold break-all">
                    VAULT PDA: <span className="text-[#9945FF]">{vaultPdaAddress}</span>
                  </p>
                </div>

                <button 
                  onClick={handleWithdraw}
                  className="block w-full md:w-auto bg-black text-[#14F195] font-black uppercase px-12 py-5 border-[6px] border-black shadow-[8px_8px_0px_0px_#14F195] hover:bg-[#14F195] hover:text-black hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  <span className="text-2xl tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>
                    WITHDRAW CAPITAL
                  </span>
                </button>
              </div>

              {/* O SPLIT: AS DUAS ESTRATÉGIAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 50% DEEP SAFETY */}
                <div className="bg-[#111111] border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_#00E1FD]">
                  <div className="border-b-[4px] border-[#00E1FD] pb-4 mb-6">
                    <h3 className="text-[#00E1FD] font-black text-3xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>DEEP SAFETY</h3>
                    <p className="text-zinc-500 font-mono text-xs uppercase font-bold mt-1">Jito Liquid Staking</p>
                  </div>
                  <p className="text-zinc-400 font-mono text-sm mb-2 uppercase">Active Allocation:</p>
                  <p className="text-white text-4xl font-black font-mono">{safeAllocation.toFixed(3)} SOL</p>
                </div>

                {/* 50% MAX ALPHA */}
                <div className="bg-[#111111] border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_#FF3366]">
                  <div className="border-b-[4px] border-[#FF3366] pb-4 mb-6">
                    <h3 className="text-[#FF3366] font-black text-3xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>MAX ALPHA</h3>
                    <p className="text-zinc-500 font-mono text-xs uppercase font-bold mt-1">High-Frequency Exposure</p>
                  </div>
                  <p className="text-zinc-400 font-mono text-sm mb-2 uppercase">Active Allocation:</p>
                  <p className="text-white text-4xl font-black font-mono">{aggressiveAllocation.toFixed(3)} SOL</p>
                </div>

              </div>

              {/* MODO DEUS / ADMIN (PITCH DO HACKATHON) */}
              <div className="mt-8 bg-[#FFE600] border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#000]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-black font-black text-2xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>ADMIN OVERRIDE: ORACLE INJECTION</h4>
                    <p className="text-black font-mono text-xs font-bold uppercase mt-1">Simulate 30 days of market yield (+0.2 SOL)</p>
                  </div>
                  <button 
                    onClick={handleInjectYield}
                    className="w-full md:w-auto bg-black text-[#FFE600] font-black uppercase px-8 py-4 border-[4px] border-black hover:bg-white hover:text-black transition-colors"
                  >
                    <span className="text-xl tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>EXECUTE SIMULATION</span>
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

// ==========================================
// 3. O ENVELOPAMENTO PRINCIPAL (BACKGROUND ESCURO)
// ==========================================
export default function DashboardWrapper() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* FUNDO ESCURO INDUSTRIAL COM BOLINHAS */}
          <div className="min-h-screen bg-[#111111] font-sans relative overflow-x-hidden pt-10">
            <div 
              className="absolute inset-0 z-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
                backgroundSize: "24px 24px"
              }}
            />
            <DashboardContent />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}