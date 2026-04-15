"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// O Program ID do seu Smart Contract na Devnet
const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

export default function DashboardPage() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  // Estados para guardar a lógica da Blockchain
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vaultPdaAddress, setVaultPdaAddress] = useState<string>("");

  // Efeito que roda automático assim que a carteira é conectada
  useEffect(() => {
    if (!publicKey) {
      setVaultBalance(0);
      setVaultPdaAddress("");
      return;
    }

    const fetchVaultData = async () => {
      setIsLoading(true);
      try {
        // 1. A Matemática HFT: Achando o cofre do usuário
        const [vaultPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("frenzy_state"), publicKey.toBuffer()],
          PROGRAM_ID
        );
        
        setVaultPdaAddress(vaultPda.toBase58());

        // 2. Batendo na rede para ver o saldo real trancado no contrato
        const balanceLamports = await connection.getBalance(vaultPda);
        const balanceSol = balanceLamports / 1_000_000_000;
        
        // 3. Salvando no estado (descontando uma merreca que a Solana cobra de "aluguel" da conta)
        // Se o saldo for muito baixo (só o aluguel), zeramos visualmente.
        setVaultBalance(balanceSol > 0.002 ? balanceSol - 0.002 : 0); 
      } catch (error) {
        console.error("Erro ao buscar dados do cofre:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultData();
    
    // Atualiza a cada 10 segundos para ser tempo real (opcional)
    const interval = setInterval(fetchVaultData, 10000);
    return () => clearInterval(interval);
    
  }, [publicKey, connection]);

  // =========================================================
  // LÓGICA DE DIVISÃO (Simulação para o Produto Mínimo Viável)
  // =========================================================
  const safeAllocation = vaultBalance * 0.5;
  const aggressiveAllocation = vaultBalance * 0.5;

  // Rendimentos simulados para o Pitch (Mostra a visão do produto)
  const mockSafeYield = (safeAllocation * 0.08).toFixed(4); // 8% APY
  const mockAggressiveYield = (aggressiveAllocation * 1.50).toFixed(4); // 150% APY

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>FRENZY PROTOCOL | Painel de Controle</h1>
      <p>Gerencie seu risco e acompanhe seus rendimentos on-chain.</p>
      
      {/* Botão Oficial da Solana para conectar carteira */}
      <div style={{ margin: "20px 0" }}>
        <WalletMultiButton />
      </div>

      {!publicKey ? (
        <div style={{ border: "1px solid gray", padding: "2rem", marginTop: "2rem" }}>
          <h2>Conecte sua carteira para ver seu cofre.</h2>
        </div>
      ) : (
        <>
          {isLoading && vaultBalance === 0 ? (
            <p>Buscando dados na blockchain...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              
              {/* CARD PRINCIPAL: VISÃO GERAL */}
              <div style={{ border: "2px solid black", padding: "1.5rem" }}>
                <h2>Total no Cofre (TVL)</h2>
                <h1 style={{ fontSize: "3rem", margin: "0" }}>{vaultBalance.toFixed(3)} SOL</h1>
                <p>Endereço do Cofre (PDA): {vaultPdaAddress}</p>
                <button 
                  onClick={() => alert("A função de Saque no contrato Rust será conectada aqui!")}
                  style={{ background: "black", color: "white", padding: "10px 20px", cursor: "pointer" }}
                >
                  Sacar Fundos
                </button>
              </div>

              {/* CARDS DE ESTRATÉGIA (Onde a mágica acontece) */}
              <div style={{ display: "flex", gap: "20px" }}>
                
                {/* 50% CONSERVADOR */}
                <div style={{ border: "1px solid blue", padding: "1rem", flex: 1 }}>
                  <h3>🛡️ Paz de Espírito (50%)</h3>
                  <p>Alocação: <strong>{safeAllocation.toFixed(3)} SOL</strong></p>
                  <p>Estratégia: Jito Liquid Staking</p>
                  <p style={{ color: "green" }}>Lucro Estimado (8% APY): +{mockSafeYield} SOL</p>
                </div>

                {/* 50% AGRESSIVO */}
                <div style={{ border: "1px solid red", padding: "1rem", flex: 1 }}>
                  <h3>🔥 Aceleração Máxima (50%)</h3>
                  <p>Alocação: <strong>{aggressiveAllocation.toFixed(3)} SOL</strong></p>
                  <p>Estratégia: Raydium HFT / Memecoins</p>
                  <p style={{ color: "green" }}>Lucro Estimado (150% APY): +{mockAggressiveYield} SOL</p>
                </div>

              </div>
              
              {/* HISTÓRICO LÓGICO */}
              <div style={{ border: "1px solid gray", padding: "1rem" }}>
                <h3>Histórico de Ações</h3>
                <ul>
                  <li>Depósito via X (Blink) - Sucesso</li>
                  <li>Divisão de Risco Executada - Sucesso</li>
                </ul>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}