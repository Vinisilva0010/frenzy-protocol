"use client";

import { useEffect, useState, useMemo } from "react";
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";

// Importa o CSS mágico que transforma aquele texto num Botão de verdade
import '@solana/wallet-adapter-react-ui/styles.css';

const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

// =========================================================
// 1. O CONTEÚDO DO DASHBOARD (Onde a matemática roda)
// =========================================================
function DashboardContent() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vaultPdaAddress, setVaultPdaAddress] = useState<string>("");

  useEffect(() => {
    if (!publicKey) {
      setVaultBalance(0);
      setVaultPdaAddress("");
      return;
    }

    const fetchVaultData = async () => {
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
        console.error("Erro ao buscar dados do cofre:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultData();
    const interval = setInterval(fetchVaultData, 10000);
    return () => clearInterval(interval);
    
  }, [publicKey, connection]);

  const safeAllocation = vaultBalance * 0.5;
  const aggressiveAllocation = vaultBalance * 0.5;
  const mockSafeYield = (safeAllocation * 0.08).toFixed(4); 
  const mockAggressiveYield = (aggressiveAllocation * 1.50).toFixed(4); 

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto", color: "white" }}>
      <h1 style={{ color: "#14F195" }}>FRENZY PROTOCOL | Painel de Controle</h1>
      <p style={{ color: "#aaa" }}>Gerencie seu risco e acompanhe seus rendimentos on-chain.</p>
      
      {/* Aqui está o botão oficial. Agora ele vai renderizar com estilo! */}
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
                  onClick={() => alert("A função de Saque será liberada em breve!")}
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
// 2. A CARCAÇA BLINDADA (Envelopa a página com a carteira)
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