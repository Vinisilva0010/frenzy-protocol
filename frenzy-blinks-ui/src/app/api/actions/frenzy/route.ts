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
  Transaction,
} from "@solana/web3.js";

export const OPTIONS = async (req: Request) => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

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

// O LEÃO: Processando o clique do botão
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
    
    // Provider "dummy" para o Blink (não precisa de carteira real aqui, o usuário assina no Phantom)
    const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
    
    // PEGUE O ID REAL COM 'anchor keys list'
    const VAULT_STATE_PUBKEY = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");
    
    // Usamos 'as any' no IDL para o TypeScript parar de reclamar das versões
    const program = new anchor.Program(frenzyIdl as any, provider);

    // 🚀 A CHAMADA DO CONTRATO
   const depositIx = await program.methods
      .splitDeposit(lamports) 
      .accounts({
        user: account,
        vaultState: VAULT_STATE_PUBKEY, // <-- Exatamente como pede o seu lib.rs
      })
      .instruction();

    const tx = new Transaction();
    tx.add(depositIx);
    tx.feePayer = account; 
    
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: tx,
        message: `FRENZY Contract Called! Depositing ${amount} SOL.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error("Erro na integração:", err);
    return Response.json({ error: "Falha na transação do contrato" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};

