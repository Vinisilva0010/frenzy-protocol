mod oracle_client;
mod executor;
use dotenvy::dotenv;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::signature::{Keypair, Signer};
use std::env;
use tracing::{error, info, Level};

use crate::oracle_client::{MarketContext, OracleClient, FrenzySignal};
use crate::executor::JitoExecutor;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 1. Inicializa logs
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();
    info!("Iniciando o Motor de Execução FRENZY...");

    if dotenv().is_err() {
        error!("Arquivo .env não encontrado.");
        return Err(anyhow::anyhow!("Falta arquivo .env"));
    }

    // 2. Conecta a Carteira da Solana
    let agent_priv_key = env::var("AGENT_PRIVATE_KEY").expect("FATAL: Variável AGENT_PRIVATE_KEY ausente");
    let agent_keypair = Keypair::from_base58_string(&agent_priv_key);
    info!("Identidade do Agente (Solana): {}", agent_keypair.pubkey());

    let rpc_url = env::var("RPC_URL").unwrap_or_else(|_| "http://127.0.0.1:8899".to_string());
    let rpc_client = RpcClient::new(rpc_url.clone());

    if let Ok(balance) = rpc_client.get_balance(&agent_keypair.pubkey()).await {
        info!("Combustível (Saldo): {:.4} SOL", balance as f64 / 1_000_000_000.0);
    }

    // 3. Conecta o Oráculo da Groq
    let groq_api_key = env::var("GROQ_API_KEY").expect("FATAL: GROQ_API_KEY ausente no .env");
    let oracle = OracleClient::new(groq_api_key);

    info!("======================================================");
    info!("FRENZY Backend Online. Status: CAÇANDO OPORTUNIDADES");
    info!("======================================================");

    // 4. O Loop Infinito de Mercado
    loop {
        // Simulando a leitura de dados do mercado (em produção virá da Jupiter/Raydium)
        let ctx = MarketContext {
            token: "SOL".to_string(),
            price_change_24h_pct: 6.5,    // Mercado subindo bem!
            volume_change_24h_pct: 120.0,
            rsi_14: 55.0,                 // Saudável, não esticado
            chaos_balance_usd: 1000.0,
            max_daily_loss_bps: 1000,     
            current_loss_bps: 0,          // Sem perdas hoje
        };

        info!("Enviando contexto de mercado (SOL: {}%) para o Oráculo...", ctx.price_change_24h_pct);

      match oracle.get_signal(&ctx).await {
            Ok(signal) => {
                match signal {
                    FrenzySignal::Split5050 => info!("🎯 DECISÃO DA IA: Manter SPLIT 50/50. Mercado Neutro."),
                    FrenzySignal::Split8020 => info!("🎯 DECISÃO DA IA: Aumentar risco para 80/20. Mercado Favorável."),
                    FrenzySignal::KillSwitch => error!("🚨 DECISÃO DA IA: KILL SWITCH ATIVADO! Fechar posições imediatamente!"),
                }

                // Dispara a execução via Jupiter/Jito
                let executor = JitoExecutor::new();
                if let Err(e) = executor.execute_strategy(&signal, &rpc_client, &agent_keypair).await {
                    error!("Falha na execução on-chain: {}", e);
                }
            }
            Err(e) => {
                error!("Falha grave de comunicação com a Groq API: {}", e);
            }
        }

        // Dorme por 10 segundos antes do próximo ciclo
        tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
    }
}