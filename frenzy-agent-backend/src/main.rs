use dotenvy::dotenv;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::signature::{Keypair, Signer};
use std::env;
use tracing::{error, info, Level};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 1. Inicializa o motor de logs de alta performance
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();
    info!("Iniciando o Motor de Execução FRENZY...");

    // 2. Carrega as variáveis de ambiente com segurança
    if dotenv().is_err() {
        error!("Arquivo .env não encontrado. O sistema requer variáveis seguras para operar.");
        return Err(anyhow::anyhow!("Falta arquivo .env"));
    }

    // 3. Extrai e remonta o Keypair do Agente
    let agent_priv_key = env::var("AGENT_PRIVATE_KEY")
        .expect("FATAL: Variável AGENT_PRIVATE_KEY não definida no .env");
    
    let agent_keypair = Keypair::from_base58_string(&agent_priv_key);
    info!("Identidade do Agente Carregada: {}", agent_keypair.pubkey());

    // 4. Conecta na rede Solana via RPC
    let rpc_url = env::var("RPC_URL").unwrap_or_else(|_| "http://127.0.0.1:8899".to_string());
    let rpc_client = RpcClient::new(rpc_url.clone());

    // 5. Check de pulso: O validador está vivo e nós temos saldo?
    match rpc_client.get_balance(&agent_keypair.pubkey()).await {
        Ok(balance) => {
            let sol_balance = balance as f64 / 1_000_000_000.0;
            info!("Conectado à rede: {}", rpc_url);
            info!("Combustível do Agente (Saldo): {:.4} SOL", sol_balance);
        }
        Err(e) => {
            error!("Falha grave ao conectar com o RPC. O Surfpool está rodando? Erro: {}", e);
            return Err(e.into());
        }
    }

    info!("======================================================");
    info!("FRENZY Backend Online. Status: AGUARDANDO SINAIS DA IA");
    info!("======================================================");

    // 6. O Loop Infinito (Onde a mágica de leitura do Qwen vai entrar)
    loop {
        // Pausa de 3 segundos para não espamar a máquina (simulando heartbeat)
        tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
        
        // TODO: Plugar requisição HTTP para a API do Qwen 3.6
        // TODO: Plugar SDK do Jupiter para cotar tokens
        // TODO: Assinar e atirar via Jito (dontfront)
    }
}