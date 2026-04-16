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
// 1. O PORTEIRO (CORS)
// ==========================================
export const OPTIONS = async () => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 2. A VITRINE COM INPUT LIVRE
// ==========================================
export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "FRENZY Protocol",
    icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/", 
    description: "Defina sua estratégia HFT. Digite o valor que deseja depositar no cofre e deixe o protocolo dividir seu risco.",
    label: "Depositar", // Label padrão do botão
    links: {
      actions: [
        {
          type: "transaction",
          label: "Confirmar Depósito", // Texto dentro do botão
          // O {amount} entre chaves indica que é um parâmetro vindo do input
          href: "/api/actions/frenzy?amount={amount}",
          parameters: [
            {
              name: "amount", // Nome da variável que o POST vai ler
              label: "Valor em SOL (ex: 0.5, 2, 10)", // Placeholder no campo
              required: true,
            },
          ],
        },
      ],
    },
  };

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 3. O MOTOR (Processa o valor digitado)
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

    // O Next.js/Blinks injeta o valor digitado no searchParams automaticamente
    const url = new URL(req.url);
    const amount = Number(url.searchParams.get("amount"));

    // Validação básica de segurança
    if (!amount || amount <= 0) {
      return Response.json({ error: "Valor inválido" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const lamports = new anchor.BN(amount * 1_000_000_000);

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
    const program = new anchor.Program(frenzyIdl as any, provider);

    const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("frenzy_state"), account.toBuffer()],
      PROGRAM_ID
    );

    const instructions = [];
    const vaultAccountInfo = await connection.getAccountInfo(vaultPda);
    
    if (!vaultAccountInfo) {
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

    const depositIx = await program.methods
      .splitDeposit(lamports) 
      .accounts({
        user: account,
        vaultState: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    instructions.push(depositIx);

    const { blockhash } = await connection.getLatestBlockhash("confirmed");

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
        message: `Sucesso! Enviando ${amount} SOL para o FRENZY Protocol.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (err) {
    console.error("Erro no POST:", err);
    return Response.json({ error: "Falha na transação" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};