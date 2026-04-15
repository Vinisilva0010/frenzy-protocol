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

// ... [O SEU GET E OPTIONS CONTINUAM IGUAIS AQUI EM CIMA] ...

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
    const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
    const program = new anchor.Program(frenzyIdl as any, provider);

    // 1. A CHAVE MESTRA: O seu Program ID real
    const PROGRAM_ID = new PublicKey("HGZqmfyEWnCjq3rZ2xKbfZhZ4yCXMs4QMQhunexpGW7e");

    // 2. A MÁGICA HFT: Derivando o Cofre (PDA) on-the-fly para o usuário que clicou
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("frenzy_state"), account.toBuffer()],
      PROGRAM_ID
    );

    // 3. A CHAMADA DO CONTRATO
    const depositIx = await program.methods
      .splitDeposit(lamports) 
      .accounts({
        user: account,
        vaultState: vaultPda, // <-- Agora sim, o cofre exato!
        systemProgram: SystemProgram.programId, // Garantia de segurança pro Anchor
      })
      .instruction();

    const { blockhash } = await connection.getLatestBlockhash();

    // 4. PADRÃO OURO: Empacotando em Versioned Transaction
    const messageV0 = new TransactionMessage({
      payerKey: account,
      recentBlockhash: blockhash,
      instructions: [depositIx],
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    // 5. A RESPOSTA FINAL PARA A PHANTOM
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: tx,
        message: `FRENZY Contract Called! Depositando ${amount} SOL com sucesso.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error("Erro na integração:", err);
    return Response.json({ error: "Falha na transação do contrato" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};