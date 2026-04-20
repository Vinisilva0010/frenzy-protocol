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
// 0. RATE LIMITER MEMORY STORE
// ==========================================
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

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
  // --- SHIELD INITIALIZATION ---
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  const now = Date.now();
  
  const client = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  
  if (now - client.lastReset > 60000) {
    client.count = 1;
    client.lastReset = now;
  } else {
    client.count++;
  }
  rateLimitMap.set(ip, client);

  if (client.count > 30) {
    return new Response('{"error":"Rate limit exceeded. Too many requests."}', {
      status: 429,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
  // --- END SHIELD ---

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
  // --- SHIELD INITIALIZATION ---
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  const now = Date.now();
  
  const client = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  
  if (now - client.lastReset > 60000) {
    client.count = 1;
    client.lastReset = now;
  } else {
    client.count++;
  }
  rateLimitMap.set(ip, client);

  if (client.count > 30) {
    return new Response('{"error":"Rate limit exceeded. Too many requests."}', {
      status: 429,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
  // --- END SHIELD ---

  try {
    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return Response.json({ error: "Invalid account structure" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const url = new URL(req.url);
    const amount = Number(url.searchParams.get("amount"));

    if (!amount || amount <= 0) {
      return Response.json({ error: "Invalid amount value" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
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
        message: `Success. Routing ${amount} SOL to FRENZY Protocol Vaults.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (err) {
    console.error("POST Engine Error:", err);
    return Response.json({ error: "Transaction assembly failed" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};