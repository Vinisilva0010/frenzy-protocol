import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import frenzyIdl from "@/idl/frenzy_vault.json";

// Força o Next.js a revalidar o cache dessa rota a cada 15 segundos.
// Isso blinda o seu RPC contra ataques de DDoS e sobrecarga de acessos.
export const revalidate = 15;

const PROGRAM_ID = new PublicKey("BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx");
const RPC_ENDPOINT = "https://api.devnet.solana.com";

export async function GET() {
  try {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
    const program = new anchor.Program(frenzyIdl as any, provider);

    // ==========================================
    // 1. AGREGAÇÃO DE ESTADO (Bloco 1 e 2)
    // ==========================================
    // Puxa todas as instâncias de VaultState de uma vez
    const allVaults = await (program.account as any).vaultState.all();

    let totalSenior = 0;
    let totalJunior = 0;
    const uniqueDepositors = new Set();

    allVaults.forEach((vault: any) => {
      totalSenior += vault.account.seniorTranche.toNumber();
      totalJunior += vault.account.juniorTranche.toNumber();
      uniqueDepositors.add(vault.account.authority.toBase58());
    });

    const tvlSeniorSOL = totalSenior / 1_000_000_000;
    const tvlJuniorSOL = totalJunior / 1_000_000_000;
    const totalTVL = tvlSeniorSOL + tvlJuniorSOL;

    // ==========================================
    // 2. HISTÓRICO DE ATIVIDADE (Bloco 3 - Solscan Feed)
    // ==========================================
    // Busca as últimas 15 assinaturas de transação que interagiram com o nosso contrato
    const recentSignatures = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 15 });
    
    const activityFeed = recentSignatures.map((sig) => ({
      signature: sig.signature,
      timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
      status: sig.err ? "FAILED" : "SUCCESS",
      // Em uma indexação avançada, faríamos o parse da transação para saber se foi depósito ou saque.
      // Para o MVP do Radar, a assinatura prova a atividade on-chain.
    }));

    // ==========================================
    // 3. ESTRUTURAÇÃO DO PAYLOAD
    // ==========================================
    const payload = {
      health: {
        status: "OPERACIONAL", // Isso pode ser dinâmico lendo a ProtocolConfig no futuro
        activeVaults: allVaults.length,
        uniqueWallets: uniqueDepositors.size,
        totalTvlSOL: totalTVL,
      },
      tranches: {
        seniorTVL: tvlSeniorSOL,
        juniorTVL: tvlJuniorSOL,
        ratioSenior: totalTVL > 0 ? (tvlSeniorSOL / totalTVL) * 100 : 90,
        ratioJunior: totalTVL > 0 ? (tvlJuniorSOL / totalTVL) * 100 : 10,
      },
      activity: activityFeed,
      // Bloco 4 (Riscos) e Bloco 5 (Gráfico) exigem simulação ou banco de dados histórico off-chain.
      // Por enquanto, enviaremos dados base para montar a UI.
      risks: {
        simulatedDefaults: 0,
        juniorAbsorbed: 0,
        blockedWithdrawals: 0, 
      }
    };

    return NextResponse.json(payload);

  } catch (error) {
    console.error("Erro na indexação do Radar:", error);
    return NextResponse.json({ error: "Falha ao sincronizar com a Solana" }, { status: 500 });
  }
}