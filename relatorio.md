DOSSIÊ DE ARQUITETURA: FRENZY PROTOCOL
Visão Geral (O Big Picture):
Um protocolo DeFi na Solana desenhado para o hackathon Colosseum. O sistema divide o risco do usuário automaticamente: 50% em ativos seguros e 50% em exposição agressiva (caos/alpha), utilizando um Oráculo de Inteligência Artificial de baixíssima latência para ler o mercado e disparar transações protegidas contra robôs de MEV. Tudo envelopado numa interface de 1-clique via Solana Blinks no X (Twitter).

🛠️ 1. O Arsenal (Tech Stack Utilizado)
Blockchain/Contratos: Solana & Anchor Framework (Test Validator/Localnet).

Backend (O Motor): Rust puro, assíncrono (Tokio), Reqwest para HTTP.

Inteligência Artificial (O Oráculo): API da Groq (Hardware LPU) rodando modelo Llama 3 (substituindo IA local para poupar os 8GB de RAM da sua máquina).

Frontend & API (A Vitrine): Next.js 16 (App Router, Turbopack), @solana/actions, TailwindCSS.

Design System: Estética "Smiling Friends" (Cartunesco, cores chapadas e contrastantes da Solana - Verde/Roxo), mas com acabamento de alta confiança (Bank-grade UX) para evitar alarmes de scam.

🚀 2. O QUE JÁ CONSTRUÍMOS E VALIDAMOS (O Progresso)
Fase 1: A Fundação On-Chain (Smart Contracts)

Subimos a rede local da Solana (Surfpool).

Configuramos o ambiente do Anchor para compilar e testar a matemática do cofre (Vault) no nível da blockchain.

Fase 2: O Cão de Guarda (Backend em Rust)

Conexão Segura: Lemos a Private Key (Base58) do agente via .env e conectamos com a Solana via RPC local. O robô já sabe quem é e quanto combustível (SOL) tem.

O Pivô de Infraestrutura (Genialidade): Percebemos que rodar IA local pesaria demais nos seus 8GB de RAM. Pivotamos para a API da Groq. O Rust agora monta um contexto de mercado (MarketContext), atira pra nuvem e recebe a decisão em milissegundos.

Programação Defensiva (Kill Switch): O código tem regras estritas. Se o mercado desabar mais de 8% num dia, a IA grita KILL_SWITCH e o Rust entra em modo de lockdown para proteger o capital.

Simulador de Execução: Criamos o módulo executor.rs que recebe a decisão do Oráculo e simula o roteamento no Jupiter e o empacotamento anti-MEV no Jito.

Fase 3: A Rota de Conversão (Solana Blinks & Actions)

Criamos o projeto Next.js 16 do zero. Tivemos um conflito de dependências com a versão experimental 2.0 da Solana, mas agimos rápido e forçamos a versão 1.x estável para garantir a fundação.

API GET (A Vitrine): Montamos o JSON que o Twitter lê para renderizar o Card com a nossa copy: "50% Paz de Espírito. 50% Aceleração Máxima".

API POST (O Motor da Transação): Construímos a lógica que recebe a chave pública do usuário que clicou no Twitter, monta a transação não assinada (SystemProgram.transfer) de 1 SOL ou 5 SOL, converte para Base64 e devolve pro Phantom assinar.

Validação Hacker: Testamos a rota via terminal usando curl e confirmamos que o Next.js está cuspindo a transação perfeitamente.

🎯 3. O QUE FALTA PARA O PRODUTO FINAL (O Roadmap)
Agora nós temos blocos isolados muito fortes. O que falta é a "Cola de Integração" para transformar isso num produto nível Colosseum.

Passo 1: Ligar o Blink ao Smart Contract Real (Prioridade)

O problema: Hoje, o botão no Twitter faz uma transferência de SOL burra (de carteira pra carteira).

A solução: Importar a IDL (Interface) do seu contrato Anchor para o Next.js. O método POST vai parar de fazer transferência simples e vai chamar a instrução real deposit do seu protocolo.

Passo 2: O Túnel Ngrok (Teste no Mundo Real)

O X (Twitter) não consegue acessar o seu localhost. Precisamos instalar e rodar o Ngrok para gerar um link público temporário HTTPS e jogar isso no validador de Blinks da Solana para ver o Card vivo e testar o fluxo abrindo a sua extensão do Phantom de verdade.

Passo 3: A UI "Smiling Friends" Premium (Frontend)

Voltar no arquivo page.tsx com as suas 3 imagens PNG renderizadas.

Aplicar o design cartunesco/bizarro, mas estruturar os contêineres, as fontes e os botões com precisão milimétrica para passar credibilidade de instituição financeira da Web3.

Passo 4: Integração Jupiter/Jito Real (Transição para Devnet)

Mudar a nossa rede do localhost para a Devnet.

Trocar aquele simulador de sleep no Rust pelas chamadas reais de API: buscar a cotação no Jupiter (quote-api) e enviar o pacote blindado pro Jito.