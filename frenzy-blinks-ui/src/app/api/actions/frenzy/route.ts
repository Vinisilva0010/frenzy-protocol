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

// SYSVAR_CLOCK_PUBKEY REMOVIDO — não existe mais no contrato

// ==========================================
// 0. RATE LIMITER
// ==========================================
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const client = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  if (now - client.lastReset > 60000) {
    client.count = 1;
    client.lastReset = now;
  } else {
    client.count++;
  }
  rateLimitMap.set(ip, client);
  return client.count > 30;
}

const PROGRAM_ID = new PublicKey("BLafEMNRKAimMcisFEpUg8oZuCKSSNaujdQf7moNpFyx");

// ==========================================
// 1. CORS PREFLIGHT
// ==========================================
export const OPTIONS = async () => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// ==========================================
// 2. METADATA ENDPOINT (GET)
// ==========================================
export const GET = async (req: Request) => {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  if (checkRateLimit(ip)) {
    return new Response('{"error":"Rate limit exceeded."}', {
      status: 429,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const payload: ActionGetResponse = {
    title: "FRENZY Protocol",
    icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/",
    description: "Define your HFT strategy. Enter the amount to deposit and let the protocol split your risk.",
    label: "Deposit",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Confirm Deposit",
          href: "/api/actions/frenzy?amount={amount}",
          parameters: [
            {
              name: "amount",
              label: "Amount in SOL (e.g., 0.5, 2, 10)",
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
// 3. TRANSACTION ENGINE (POST)
// ==========================================
export const POST = async (req: Request) => {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  if (checkRateLimit(ip)) {
    return new Response('{"error":"Rate limit exceeded."}', {
      status: 429,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  try {
    const body: ActionPostRequest = await req.json();
    let account: PublicKey;

    try {
      account = new PublicKey(body.account);
    } catch {
      return Response.json(
        { error: "Invalid account structure" },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const url = new URL(req.url);
    const amount = Number(url.searchParams.get("amount"));

    if (!amount || amount <= 0 || amount > 1000) {
      return Response.json(
        { error: "Invalid amount value" },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    // Arredonda para evitar floating point causando lamports fracionados
    const lamports = new anchor.BN(Math.floor(amount * 1_000_000_000));

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const provider = new anchor.AnchorProvider(connection, {} as any, {
      commitment: "confirmed",
    });

    // Blindagem contra cache do Next.js
    const idl = JSON.parse(JSON.stringify(frenzyIdl));
    idl.address = PROGRAM_ID.toBase58();
    if (idl.metadata) idl.metadata.address = PROGRAM_ID.toBase58();

    const program = new anchor.Program(idl as any, provider);

    console.log("=========================================");
    console.log("🚨 O BLINK ESTÁ CHAMANDO O MEU LOCALHOST 🚨");
    console.log("PROGRAM ID NO ANCHOR:", program.programId.toBase58());
    console.log("=========================================");



    // ── PDAs ────────────────────────────────────────────────────────
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("frenzy_state"), account.toBuffer()],
      PROGRAM_ID
    );

    // ✅ ADICIONADO: protocolConfig necessário para splitDeposit
    const [protocolConfigPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("protocol_config")],
      PROGRAM_ID
    );

    const instructions = [];

    // ── INITIALIZE (só se vault ainda não existe) ────────────────────
    const vaultAccountInfo = await connection.getAccountInfo(vaultPda);

    if (!vaultAccountInfo) {
      const initIx = await program.methods
        .initialize(2000) // ✅ CORRIGIDO: 2000bps (20%) — consistente com dashboard
        .accounts({
          authority: account,
          vaultState: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      instructions.push(initIx);
    }

    // ── SPLIT DEPOSIT ────────────────────────────────────────────────
    const depositIx = await program.methods
      .splitDeposit(lamports)
      .accounts({
        user: account,
        protocolConfig: protocolConfigPda, // ✅ ADICIONADO
        vaultState: vaultPda,
        systemProgram: SystemProgram.programId,
        // clock: REMOVIDO — não existe mais no contrato
      })
      .instruction();

    instructions.push(depositIx);

    // ── MONTA TRANSAÇÃO VERSIONADA ───────────────────────────────────
    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    const messageV0 = new TransactionMessage({
      payerKey: account,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: tx,
        message: `Success. Routing ${amount} SOL to FRENZY Protocol Vaults.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (err) {
    console.error("POST Engine Error:", err);
    return Response.json(
      { error: "Transaction assembly failed" },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};