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
// 1. O PORTEIRO (Libera o acesso da Phantom)
// ==========================================
export const OPTIONS = async () => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 2. A VITRINE (O Card visual do X)
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

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 3. O MOTOR (A Transação HFT do Anchor)
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

    // ==========================================
    // O PULO DO GATO: O Cofre já existe?
    // ==========================================
    const vaultAccountInfo = await connection.getAccountInfo(vaultPda);
    
    if (!vaultAccountInfo) {
      // Se a conta for null, o usuário é novo. Embutimos a instrução de criação!
      // Lembra do limite de 1000 bps que você colocou no teste? Mandamos aqui.
      const initIx = await program.methods
        .initialize(1000) 
        .accounts({
          authority: account,
          vaultState: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
        
      instructions.push(initIx);
      console.log("🛠️  Adicionada instrução de inicialização do cofre.");
    }

    // ==========================================
    // A Instrução Principal: O Depósito
    // ==========================================
    const depositIx = await program.methods
      .splitDeposit(lamports) 
      .accounts({
        user: account,
        vaultState: vaultPda,
      })
      .instruction();

    instructions.push(depositIx);

    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    // Empacotando TUDO (Criação + Depósito) na mesma VersionedTransaction
    const messageV0 = new TransactionMessage({
      payerKey: account,
      recentBlockhash: blockhash,
      instructions: instructions, // <-- Agora enviamos o array dinâmico
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: tx,
        message: `FRENZY Protocol: Cofre acessado! Depositando ${amount} SOL.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (err) {
    console.error("Erro na integração:", err);
    return Response.json({ error: "Falha na transação do contrato" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};