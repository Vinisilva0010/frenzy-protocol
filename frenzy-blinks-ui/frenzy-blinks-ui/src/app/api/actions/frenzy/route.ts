import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";

// O Twitter exige o método OPTIONS para checar o CORS (segurança) antes de carregar o Blink
export const OPTIONS = async (req: Request) => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// A Vitrine: O que o Twitter renderiza quando o usuário vê o link
export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "FRENZY Protocol",
    // TODO: Trocar pela sua arte brutal no estilo Smiling Friends (URL de uma imagem pública)
    icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/", 
    description: "50% Paz de Espírito. 50% Aceleração Máxima. Separe seu risco e fuja do caos do mercado direto da timeline.",
    label: "Entrar no Cofre",
    links: {
      actions: [
        {
          type: "transaction", // <-- A CORREÇÃO É ESTA LINHA
          label: "Depositar 1 SOL",
          href: "/api/actions/frenzy?amount=1",
        },
        {
          type: "transaction", // <-- A CORREÇÃO É ESTA LINHA
          label: "Depositar 5 SOL",
          href: "/api/actions/frenzy?amount=5",
        },
      ],
    },
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};