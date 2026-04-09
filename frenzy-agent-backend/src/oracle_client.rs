use anyhow::{anyhow, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};

// O sinal que o Cofre vai receber
#[derive(Debug, PartialEq)]
pub enum FrenzySignal {
    Split5050,   // Mercado neutro — split padrão
    Split8020,   // Mercado favorável — mais agressivo
    KillSwitch,  // Mercado sangrando — lockdown
}

// Payload de mercado que o backend envia para a IA
#[derive(Serialize)]
pub struct MarketContext {
    pub token: String,
    pub price_change_24h_pct: f64,
    pub volume_change_24h_pct: f64,
    pub rsi_14: f64,
    pub chaos_balance_usd: f64,
    pub max_daily_loss_bps: u16,
    pub current_loss_bps: u16,
}

// Estrutura da API Groq (compatível com OpenAI)
#[derive(Serialize)]
struct GroqRequest {
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    max_tokens: u16,
}

#[derive(Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Deserialize)]
struct GroqResponse {
    choices: Vec<Choice>,
}

#[derive(Deserialize)]
struct Choice {
    message: Message,
}

pub struct OracleClient {
    http: Client,
    api_key: String,
    model: String,
}

impl OracleClient {
    pub fn new(api_key: String) -> Self {
        Self {
            http: Client::new(),
            api_key,
            model: "llama-3.1-8b-instant".to_string(), // rápido e grátis
        }
    }

    pub async fn get_signal(&self, ctx: &MarketContext) -> Result<FrenzySignal> {
        let system_prompt = r#"
Você é o Oráculo do FRENZY Protocol. Analise os dados de mercado e responda
APENAS com uma das três strings exatas, sem explicação, sem pontuação extra:

50/50    -> mercado neutro, continuar split padrão
80/20    -> mercado favorável, aumentar exposição ao caos
KILL_SWITCH -> perda crítica detectada ou mercado em colapso

Regras absolutas:
- Se current_loss_bps >= max_daily_loss_bps * 0.8 -> KILL_SWITCH obrigatório
- Se price_change_24h_pct < -8.0 -> KILL_SWITCH obrigatório
- Se rsi_14 < 25 ou rsi_14 > 80 -> avaliar KILL_SWITCH
- Se price_change_24h_pct > 5.0 e rsi_14 entre 40-65 -> 80/20
- Caso contrário -> 50/50
"#;

        let user_prompt = format!(
            r#"Dados de mercado:
token: {}
price_change_24h: {}%
volume_change_24h: {}%
rsi_14: {}
chaos_balance_usd: ${}
max_daily_loss_bps: {} ({}%)
current_loss_bps: {} ({}%)

Responda APENAS: 50/50, 80/20 ou KILL_SWITCH"#,
            ctx.token,
            ctx.price_change_24h_pct,
            ctx.volume_change_24h_pct,
            ctx.rsi_14,
            ctx.chaos_balance_usd,
            ctx.max_daily_loss_bps,
            ctx.max_daily_loss_bps as f64 / 100.0,
            ctx.current_loss_bps,
            ctx.current_loss_bps as f64 / 100.0,
        );

        let body = GroqRequest {
            model: self.model.clone(),
            messages: vec![
                Message { role: "system".to_string(), content: system_prompt.to_string() },
                Message { role: "user".to_string(), content: user_prompt },
            ],
            temperature: 0.0, // determinístico — sem criatividade
            max_tokens: 10,   // só precisa de "KILL_SWITCH" = 2 tokens
        };

        let response = self.http
            .post("https://api.groq.com/openai/v1/chat/completions")
            .bearer_auth(&self.api_key)
            .json(&body)
            .send()
            .await
            .map_err(|e| anyhow!("Groq HTTP error: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(anyhow!("Groq API error {}: {}", status, text));
        }

        let groq_resp: GroqResponse = response.json().await
            .map_err(|e| anyhow!("Groq parse error: {}", e))?;

        let raw = groq_resp.choices
            .into_iter()
            .next()
            .ok_or_else(|| anyhow!("Groq retornou choices vazio"))?
            .message
            .content
            .trim()
            .to_uppercase();

        // Parse defensivo — se a IA alucinar, vai para KILL_SWITCH por segurança
        match raw.as_str() {
            "50/50" => Ok(FrenzySignal::Split5050),
            "80/20" => Ok(FrenzySignal::Split8020),
            "KILL_SWITCH" => Ok(FrenzySignal::KillSwitch),
            _ => {
                tracing::warn!("Groq retornou sinal não reconhecido: '{}' — aplicando KILL_SWITCH defensivo", raw);
                Ok(FrenzySignal::KillSwitch)
            }
        }
    }
}