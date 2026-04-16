"use client";

import { useEffect, useState, useMemo } from "react";
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import frenzyIdl from "@/idl/frenzy_vault.json";

import '@solana/wallet-adapter-react-ui/styles.css';

const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

// =========================================================
// 1. O CONTEÚDO DO DASHBOARD (Agora com o botão de Saque)
// =========================================================
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

  // 🔥 A MÁGICA DO SAQUE 🔥
  const handleWithdraw = async () => {
    if (!publicKey || !wallet) {
      alert("Conecte sua carteira primeiro!");
      return;
    }

    // Pergunta simples para o MVP (no futuro a gente faz um modal bonitão)
    const amountStr = window.prompt(`Você tem ${vaultBalance.toFixed(3)} SOL disponíveis. Quanto deseja sacar?`, "1");
    if (!amountStr) return;

    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > vaultBalance) {
      alert("Valor inválido ou superior ao saldo do cofre.");
      return;
    }

    try {
      // 1. Prepara o motor do Anchor no Frontend
      const provider = new anchor.AnchorProvider(connection, (window as any).solana, { commitment: "confirmed" });
      const program = new anchor.Program(frenzyIdl as any, provider);

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("frenzy_state"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const lamports = new anchor.BN(amountNum * 1_000_000_000);

      // 2. Monta a transação de saque batendo na função withdraw do Rust
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

      // 3. Pede pro usuário assinar e envia pra rede
      const signature = await sendTransaction(tx, connection);
      alert(`🚀 Transação enviada! Assinatura: ${signature}\nAguarde alguns segundos...`);

      // 4. Confirmação na rede
      await connection.confirmTransaction(signature, "confirmed");
      alert("✅ Saque concluído com sucesso! O dinheiro já está na sua carteira.");
      
      // Atualiza a tela
      fetchVaultData();

    } catch (err: any) {
      console.error("Erro no saque:", err);
      alert("❌ Falha no saque: " + err.message);
    }
  };

  const safeAllocation = vaultBalance * 0.5;
  const aggressiveAllocation = vaultBalance * 0.5;
  const mockSafeYield = (safeAllocation * 0.08).toFixed(4); 
  const mockAggressiveYield = (aggressiveAllocation * 1.50).toFixed(4); 

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", color: "white" }}>
      <h1 style={{ color: "#14F195" }}>FRENZY PROTOCOL | Painel de Controle</h1>
      <p style={{ color: "#aaa" }}>Gerencie seu risco e acompanhe seus rendimentos on-chain.</p>
      
      <div style={{ margin: "20px 0" }}>
        <WalletMultiButton />
      </div>

      {!publicKey ? (
        <div style={{ border: "1px dashed #14F195", padding: "2rem", marginTop: "2rem", textAlign: "center" }}>
          <h2>Clique no botão acima para conectar sua Phantom.</h2>
        </div>
      ) : (
        <>
          {isLoading && vaultBalance === 0 ? (
            <p style={{ color: "#14F195", animation: "pulse 2s infinite" }}>Buscando seu cofre na blockchain...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              
              <div style={{ border: "2px solid #14F195", padding: "1.5rem", borderRadius: "12px", background: "#111" }}>
                <h2 style={{ margin: 0, color: "#aaa" }}>Total no Cofre (TVL)</h2>
                <h1 style={{ fontSize: "3rem", margin: "10px 0", color: "white" }}>{vaultBalance.toFixed(3)} SOL</h1>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>Endereço do Cofre (PDA): {vaultPdaAddress}</p>
                <button 
                  onClick={handleWithdraw} // 🔥 O BOTÃO LIGADO NA FUNÇÃO 🔥
                  style={{ background: "#14F195", color: "black", padding: "10px 20px", cursor: "pointer", fontWeight: "bold", border: "none", borderRadius: "6px" }}
                >
                  Sacar Fundos
                </button>
              </div>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ border: "1px solid #3b82f6", padding: "1rem", flex: "1 1 300px", borderRadius: "12px", background: "#111" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#3b82f6" }}>🛡️ Paz de Espírito (50%)</h3>
                  <p>Alocação: <strong>{safeAllocation.toFixed(3)} SOL</strong></p>
                  <p>Estratégia: Jito Liquid Staking</p>
                  <p style={{ color: "#14F195" }}>Lucro Estimado: +{mockSafeYield} SOL</p>
                </div>

                <div style={{ border: "1px solid #ef4444", padding: "1rem", flex: "1 1 300px", borderRadius: "12px", background: "#111" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#ef4444" }}>🔥 Aceleração Máxima (50%)</h3>
                  <p>Alocação: <strong>{aggressiveAllocation.toFixed(3)} SOL</strong></p>
                  <p>Estratégia: Raydium HFT / Memecoins</p>
                  <p style={{ color: "#14F195" }}>Lucro Estimado: +{mockAggressiveYield} SOL</p>
                </div>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}

// =========================================================
// 2. A CARCAÇA BLINDADA
// =========================================================
export default function DashboardWrapper() {
  const endpoint = "https://api.devnet.solana.com";
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
            <DashboardContent />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}