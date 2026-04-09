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
    // 1. O Twitter nos envia quem é o usuário que clicou
    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return Response.json({ error: "Conta inválida" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    // 2. Lemos o valor do botão que ele clicou (1 ou 5 SOL)
    const url = new URL(req.url);
    const amount = Number(url.searchParams.get("amount")) || 1;

    // 3. Conectamos na nossa rede local (A mesma do backend/Anchor)
    const connection = new Connection("http://127.0.0.1:8899");

    // 4. A Chave do nosso Cofre. 
    // TODO: Cole aqui a chave pública (endereço) do seu Agente ou do Cofre
    const VAULT_PUBKEY = new PublicKey("7aSDp11gPbCCew7yMSQKuBLr6pcKfgwRPtp2QgAE89f3");

    // 5. Montamos a instrução de transferência on-chain
    const transferIx = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: VAULT_PUBKEY,
      lamports: amount * 1_000_000_000, // A Solana não entende 1 SOL, ela entende 1 bilhão de Lamports
    });

    const tx = new Transaction();
    tx.add(transferIx);
    tx.feePayer = account; // Quem paga a taxa de rede é o usuário, não a gente
    
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    // 6. Empacotamos e devolvemos pro Phantom do usuário ler
    // 6. Empacotamos e devolvemos pro Phantom do usuário ler
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction", // <-- A CORREÇÃO É ESTA LINHA
        transaction: tx,
        message: `Pronto para depositar ${amount} SOL. O FRENZY assume daqui.`,
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    console.error("Erro na montagem da Action:", err);
    return Response.json({ error: "Falha na criação da transação" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};