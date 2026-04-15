import * as anchor from "@coral-xyz/anchor";
import frenzyIdl from "@/idl/frenzy_vault.json";

import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";

import {
  Connection,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";

// ==========================================
// 1. O PORTEIRO (CORS para pré-atendimento)
// ==========================================
export const OPTIONS = async () => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 2. A VITRINE (A requisição GET)
// ==========================================
export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "FRENZY Protocol",
    icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/", 
    description: "50% Paz de Espírito. 50% Aceleração Máxima. Separe seu risco e fuja do caos do mercado direto da timeline.",
    label: "Entrar no Cofre",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Depositar 1 SOL",
          href: "/api/actions/frenzy?amount=1",
        },
        {
          type: "transaction",
          label: "Depositar 5 SOL",
          href: "/api/actions/frenzy?amount=5",
        },
      ],
    },
  };

  // Carimbo CORS garantido aqui!
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 3. O MOTOR (O processamento do Depósito)
// ==========================================
export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return Response.json({ error: "Conta inválida" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const url = new URL(req.url);
    const amount = Number(url.searchParams.get("amount")) || 1;
    const lamports = new anchor.BN(amount * 1_000_000_000);

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
    const program = new anchor.Program(frenzyIdl as any, provider);

    // O seu Program ID real na Devnet
    const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

    // Derivando o Cofre (PDA) matemático do usuário
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("frenzy_state"), account.toBuffer()],
      PROGRAM_ID
    );

    const instructions = [];

    // Lógica inteligente: o usuário já tem cofre?
    const vaultAccountInfo = await connection.getAccountInfo(vaultPda);
    
    if (!vaultAccountInfo) {
      // Se não tiver, embutimos a criação (init-if-needed)
      const initIx = await program.methods
        .initialize(1000) 
        .accounts({
          authority: account,
          vaultState: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
        
      instructions.push(initIx);
    }

    // A Instrução Principal: Depósito
    const depositIx = await program.methods
      .splitDeposit(lamports) 
      .accounts({
        user: account,
        vaultState: vaultPda,
      })
      .instruction();

    instructions.push(depositIx);

    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    // Empacotando em Versioned Transaction (formato aceito pela Phantom)
    const messageV0 = new TransactionMessage({
      payerKey: account,
      recentBlockhash: blockhash,
      instructions: instructions,
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: tx,
        message: `FRENZY Protocol: Cofre acessado! Depositando ${amount} SOL.`,
      },
    });

    // Carimbo CORS garantido no sucesso!
    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (err) {
    console.error("Erro na integração:", err);
    // Carimbo CORS garantido no erro!
    return Response.json({ error: "Falha na transação do contrato" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};