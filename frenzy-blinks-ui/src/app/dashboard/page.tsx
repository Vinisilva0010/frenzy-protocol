"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ConnectionProvider, WalletProvider,
  useConnection, useAnchorWallet
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { motion } from "framer-motion";
import frenzyIdl from "@/idl/frenzy_vault.json";
import '@solana/wallet-adapter-react-ui/styles.css';

const PROGRAM_ID = new PublicKey("BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx");

// ── HELPER: cria program com anchorWallet (único padrão no projeto) ──
function getProgram(connection: anchor.web3.Connection, anchorWallet: anchor.Wallet) {
  const provider = new anchor.AnchorProvider(connection, anchorWallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  return new anchor.Program(frenzyIdl as any, provider);
}

// ── HELPER: deriva os dois PDAs principais ──
function getPdas(publicKey: PublicKey) {
  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("frenzy_state"), publicKey.toBuffer()],
    PROGRAM_ID
  );
  const [protocolConfigPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("protocol_config")],
    PROGRAM_ID
  );
  return { vaultPda, protocolConfigPda };
}

// ==========================================
// HYDRATION FIX
// ==========================================
export function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-12 w-48 bg-zinc-800 border-[4px] border-[#14F195] shadow-[6px_6px_0px_0px_#14F195] animate-pulse" />;
  }
  return (
    <div className="wallet-brutalist-override">
      <WalletMultiButton className="!bg-[#14F195] !text-black !font-black !uppercase !border-[4px] !border-[#14F195] !rounded-none !shadow-[6px_6px_0px_0px_#14F195] hover:!translate-y-1 hover:!translate-x-1 hover:!shadow-none !transition-all !h-12 !px-6" />
    </div>
  );
}

// ==========================================
// DASHBOARD
// ==========================================
function DashboardContent() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const publicKey = anchorWallet?.publicKey ?? null;

  const [vaultBalance, setVaultBalance]   = useState<number>(0);
  const [seniorBalance, setSeniorBalance] = useState<number>(0);
  const [juniorBalance, setJuniorBalance] = useState<number>(0);
  const [hasVault, setHasVault]           = useState<boolean | null>(null); // null = ainda carregando
  const [isLoading, setIsLoading]         = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [vaultPdaAddress, setVaultPdaAddress] = useState<string>("");

  // ── FETCH ────────────────────────────────────────────────────────
  const fetchVaultData = async () => {
    if (!publicKey || !anchorWallet) return;
    setIsLoading(true);
    try {
      const program = getProgram(connection, anchorWallet as anchor.Wallet);
      const { vaultPda } = getPdas(publicKey);
      setVaultPdaAddress(vaultPda.toBase58());

      const vaultData = await (program.account as any).vaultState.fetch(vaultPda);
      const seniorSol = vaultData.seniorTranche.toNumber() / 1_000_000_000;
      const juniorSol = vaultData.juniorTranche.toNumber() / 1_000_000_000;

      setSeniorBalance(seniorSol);
      setJuniorBalance(juniorSol);
      setVaultBalance(seniorSol + juniorSol);
      setHasVault(true);
    } catch {
      setSeniorBalance(0);
      setJuniorBalance(0);
      setVaultBalance(0);
      setHasVault(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!publicKey) {
      setHasVault(null);
      setSeniorBalance(0);
      setJuniorBalance(0);
      setVaultBalance(0);
      return;
    }
    fetchVaultData();
  }, [publicKey]);

  // ── ABRIR CONTA ──────────────────────────────────────────────────
  const handleOpenAccount = async () => {
    if (!publicKey || !anchorWallet) return;
    try {
      const program = getProgram(connection, anchorWallet as anchor.Wallet);
      const { vaultPda } = getPdas(publicKey);

      const signature = await program.methods
        .initialize(2000)
        .accounts({ authority: publicKey, vaultState: vaultPda })
        .rpc();

      await connection.confirmTransaction(signature, "confirmed");
      alert("✅ Cofre FIDC-X ativado!");
      fetchVaultData();
    } catch (err: any) {
      console.error(err);
      alert(`Falha: ${err.message}`);
    }
  };

  // ── SAQUE ────────────────────────────────────────────────────────
  const handleWithdraw = async () => {
    if (!publicKey || !anchorWallet) return;

    const amountStr = window.prompt(`Saldo: ${vaultBalance.toFixed(3)} SOL. Quanto sacar?`, "0.1");
    if (!amountStr) return;

    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > vaultBalance) {
      alert("Valor inválido.");
      return;
    }

    try {
      const program = getProgram(connection, anchorWallet as anchor.Wallet);
      const { vaultPda, protocolConfigPda } = getPdas(publicKey);
      const lamports = new anchor.BN(Math.floor(amountNum * 1_000_000_000));

      const signature = await program.methods
        .withdraw(lamports)
        .accounts({ user: publicKey, protocolConfig: protocolConfigPda, vaultState: vaultPda })
        .rpc();

      await connection.confirmTransaction(signature, "confirmed");
      alert(`✅ Saque de ${amountNum} SOL concluído!`);
      fetchVaultData();
    } catch (err: any) {
      const msg = err.logs?.find((l: string) => l.includes("WithdrawalCooldown"))
        ? "⏳ Cooldown de 24h ativo."
        : err.logs?.find((l: string) => l.includes("GlobalWithdrawal"))
        ? "🚫 Cota global atingida."
        : `Falhou: ${err.message}`;
      alert(msg);
    }
  };

  // ── ORACLE ───────────────────────────────────────────────────────
  const handleOracleInjection = async (type: "PROFIT" | "DEFAULT") => {
    if (!publicKey || !anchorWallet) return;
    
    // 1. Liga o Loading (trava os botões)
    setIsSimulating(true); 

    try {
      const program = getProgram(connection, anchorWallet as anchor.Wallet);
      const { vaultPda, protocolConfigPda } = getPdas(publicKey);

      const totalPayment = new anchor.BN(
        Math.floor((type === "PROFIT" ? 0.20 : 0.02) * 1_000_000_000)
      );

      const signature = await program.methods
        .devnetYieldSimulator(totalPayment)
        .accounts({
          admin: publicKey,
          protocolConfig: protocolConfigPda,
          vaultState: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await connection.confirmTransaction(signature, "confirmed");
      alert(`✅ ${type === "PROFIT" ? "Lucro" : "Calote"} simulado! Waterfall calculado on-chain.`);
      fetchVaultData();
      
    } catch (err: any) {
      // Ignora o erro se o usuário fechou a Phantom de propósito
      if (err.message.includes("User rejected the request")) return;
      
      alert(`Simulação falhou: ${err.message}`);
    } finally {
      // 2. Desliga o Loading (destrava os botões, dê erro ou sucesso)
      setIsSimulating(false); 
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-[#111111] border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
        <div>
          <h1 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
            VAULT TELEMETRY
          </h1>
          <p className="text-[#14F195] font-mono text-xs md:text-sm uppercase font-bold tracking-widest mt-1">
            Real-time On-chain Risk Management
          </p>
        </div>
        <div className="mt-6 md:mt-0"><ClientWalletButton /></div>
      </div>

      {/* SEM CARTEIRA */}
      {!publicKey ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#111111] border-[6px] border-black p-12 text-center shadow-[15px_15px_0px_0px_#00E1FD]">
          <div className="w-20 h-20 bg-black border-[6px] border-[#00E1FD] mx-auto mb-6 flex items-center justify-center">
            <span className="text-[#00E1FD] text-4xl font-mono font-black">?</span>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
            AWAITING CONNECTION
          </h2>
          <p className="text-zinc-500 font-mono mt-4 uppercase">Initialize your phantom wallet to access telemetry data.</p>
        </motion.div>

      ) : hasVault === null || isLoading ? (
        /* CARREGANDO */
        <div className="w-full bg-[#111111] border-[6px] border-black p-12 text-center shadow-[10px_10px_0px_0px_#FF3366]">
          <p className="text-[#FF3366] font-mono font-black text-xl uppercase tracking-widest animate-pulse">
            SYNCING BLOCKCHAIN DATA...
          </p>
        </div>

      ) : !hasVault ? (
        /* ONBOARDING */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-[#111111] border-[8px] border-black p-10 shadow-[15px_15px_0px_0px_#FFE600] text-center">
          <div className="inline-block bg-[#FFE600] text-black px-4 py-1 border-[4px] border-black mb-6 font-mono font-black uppercase text-sm">
            Acesso Restrito
          </div>
          <h2 className="text-white text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4" style={{ fontFamily: "var(--font-bebas)" }}>
            BEM-VINDO AO FRENZY PROTOCOL
          </h2>
          <p className="text-zinc-400 font-mono text-sm md:text-base uppercase max-w-2xl mx-auto mb-10 leading-relaxed">
            Você está a um clique de acessar o mercado de crédito privado brasileiro (FIDC).
            Ative seu cofre institucional on-chain para alocar capital com proteção sênior.
          </p>
          <button onClick={handleOpenAccount}
            className="bg-[#14F195] text-black font-black uppercase px-12 py-5 border-[6px] border-black shadow-[8px_8px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
            <span className="text-3xl tracking-widest block" style={{ fontFamily: "var(--font-bebas)" }}>ATIVAR COFRE RWA</span>
            <span className="text-xs font-mono font-bold mt-1 block">(Smart Contract Setup)</span>
          </button>
        </motion.div>

      ) : (
        /* DASHBOARD ATIVO */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8">

          {/* TVL + SAQUE */}
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
            <button onClick={handleWithdraw}
              className="block w-full md:w-auto bg-black text-[#14F195] font-black uppercase px-12 py-5 border-[6px] border-black shadow-[8px_8px_0px_0px_#14F195] hover:bg-[#14F195] hover:text-black hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
              <span className="text-2xl tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>WITHDRAW CAPITAL</span>
            </button>
          </div>

          {/* TRANCHES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111111] border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_#00E1FD]">
              <div className="border-b-[4px] border-[#00E1FD] pb-4 mb-6">
                <h3 className="text-[#00E1FD] font-black text-3xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>SENIOR TRANCHE</h3>
                <p className="text-zinc-500 font-mono text-xs uppercase font-bold mt-1">Brazil RWA (Fixed Yield Hedge)</p>
              </div>
              <p className="text-zinc-400 font-mono text-sm mb-2 uppercase">Active Allocation:</p>
              <p className="text-white text-4xl font-black font-mono">{seniorBalance.toFixed(3)} SOL</p>
            </div>
            <div className="bg-[#111111] border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_#FF3366]">
              <div className="border-b-[4px] border-[#FF3366] pb-4 mb-6">
                <h3 className="text-[#FF3366] font-black text-3xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>JUNIOR TRANCHE</h3>
                <p className="text-zinc-500 font-mono text-xs uppercase font-bold mt-1">High-Yield Credit (Subordinated)</p>
              </div>
              <p className="text-zinc-400 font-mono text-sm mb-2 uppercase">Active Allocation:</p>
              <p className="text-white text-4xl font-black font-mono">{juniorBalance.toFixed(3)} SOL</p>
            </div>
          </div>

          {/* ORACLE */}
          <div className="mt-8 bg-zinc-900 border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_#14F195]">
            <div className="flex flex-col mb-4 border-b-[2px] border-zinc-700 pb-4">
              <h4 className="text-white font-black text-2xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-bebas)" }}>
                INSTITUTIONAL STRESS TEST (DEVNET SIMULATOR)
              </h4>
              <p className="text-zinc-400 font-mono text-xs font-bold uppercase mt-1">
                Simulate Real-World Credit Events on the Blockchain
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => handleOracleInjection("PROFIT")}
                className="w-full bg-[#14F195] text-black font-black uppercase px-6 py-4 border-[4px] border-black hover:translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_0px_#000] hover:shadow-none transition-all">
                <span className="text-lg tracking-widest block" style={{ fontFamily: "var(--font-bebas)" }}>SIMULATE MARKET PROFIT</span>
                <span className="text-[10px] font-mono block mt-1">Senior filled first, Junior gets Alpha</span>
              </button>
              <button onClick={() => handleOracleInjection("DEFAULT")}
              disabled={isSimulating}
                className="w-full bg-[#FF3366] text-white font-black uppercase px-6 py-4 border-[4px] border-black hover:translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_0px_#000] hover:shadow-none transition-all">
                <span className="text-lg tracking-widest block" style={{ fontFamily: "var(--font-bebas)" }}>SIMULATE CREDIT DEFAULT</span>
                <span className="text-[10px] font-mono block mt-1">Junior absorbs loss, Senior is protected</span>
              </button>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// WRAPPER
// ==========================================
export default function DashboardWrapper() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-[#111111] font-sans relative overflow-x-hidden pt-10">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "24px 24px" }} />
            <DashboardContent />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}