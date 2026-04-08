# FRENZY Protocol - Colosseum 2026
MASTER BLUEPRINT V2: FRENZY PROTOCOL
"Self-Directed Risk-Split Execution Vault com Transparência Extrema"

Nós somos uma infraestrutura on-chain (um toolkit) que permite ao usuário dividir seu risco de forma autônoma e segura direto do X (Twitter), protegido contra MEV e auxiliado por uma IA que atua apenas como camada de sinal.

FASE 1: O COFRE (Anchor 1.0) - A Matemática é a Lei
Onde a gente trava o capital e cria as regras imutáveis que não dependem do seu Qwen 3.6.

Passo 1.1: Estrutura do Vault (zero_copy). Criar o estado do cofre. Ele terá duas "gavetas" lógicas: a Safety Sleeve (Gaveta Segura) e a Chaos Sleeve (Gaveta do Caos).

Passo 1.2: A Gaveta Segura (Integração Kamino). 50% de cada depósito feito pelo Blink vai automaticamente e imediatamente para um cofre de rendimento passivo e seguro de USDC na Kamino Finance (stablecoin, baixo risco).

Passo 1.3: A Gaveta do Caos (A PDA de Execução). Os outros 50% ficam destravados, permitindo que a nossa Program Derived Address (PDA) assine transações de swap via Jupiter.

Passo 1.4: Guardrails (Travas de Segurança Hardcoded). É isso que salva o projeto de ser uma red flag. O contrato terá limites cravados em pedra:

Max Daily Loss: Se a gaveta do caos perder mais de 10% do valor no dia, o contrato congela operações agressivas.

Kill-Switch: Uma função de emergência que fecha todas as posições da Raydium e devolve tudo pra USDC se o mercado sangrar.

Passo 1.5: LiteSVM. Testes unitários paranoicos em memória garantindo que o Kill-Switch funciona antes de subir pra Devnet.

FASE 2: O MOTOR DE EXECUÇÃO (Backend Rust + Qwen 3.6)
O cão de guarda rodando na sua máquina que caça as oportunidades, mas respeita a lei do Cofre.

Passo 2.1: A Camada de Sinal (Qwen 3.6). Seu modelo local roda escutando o mercado. Ele analisa e cospe um sinal: "Comprar Token X".

Passo 2.2: Avaliação de Risco (Backend). O backend em Rust recebe o sinal da IA, mas antes de agir, ele verifica o Smart Contract: "Atingimos o Max Daily Loss?". Se sim, ele ignora a IA. Se não, ele avança.

Passo 2.3: Roteamento Jupiter & Execução Jito. O Rust empacota a ordem da IA usando o jup-ag-sdk, assina com a autoridade da PDA do nosso Cofre e envia pela porta dos fundos do validador usando o jito-sdk-rust com a tag dontfront. MEV protection absoluta.

FASE 3: A PORTA DE ENTRADA (Blinks + UI C.O.S.M.O.)
O funil de captação viral onde a estética brutalista brilha.

Passo 3.1: API Actions (/api/actions). A rota que processa o clique no Twitter e manda a instrução pro usuário assinar o depósito.

Passo 3.2: O Card Brutalista. Nada de "Deixe nosso fundo gerir seu dinheiro". A cópia vai ser: "SEPARE SEU RISCO. 50% SEGURO. 50% CAOS.". O design vai ser aquele soco na cara: outline grosso (border: 5px solid #000), botão gritante pulando na tela, elementos 2D surreais, suor e ruído digital.

FASE 4: O PALCO DOS JURADOS (Transparência Radical 3D)
Onde a gente ganha o Hackathon.

Passo 4.1: O Dashboard "No-Trust". Um site Next.js/Three.js onde os VCs vão entrar e ver que nós não pedimos confiança, nós provamos.

Passo 4.2: Audit Trail. Uma tabela brutalista mostrando em tempo real: "A IA recomendou X, o Cofre executou Y, a proteção Jito economizou Z em slippage".

Passo 4.3: O Vídeo de 3 Minutos. Gravamos você (fundador) explicando que resolveu a dor do degen abstraindo a infraestrutura institucional (Jito/Jupiter) e colocando limites on-chain inquebráveis.