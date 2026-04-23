O MAPA DA CIRURGIA FINAL (Rumo aos 100/100)
Fase 1: O Novo Banco de Dados (Reestruturação do Estado)

Onde: src/state/vault.rs

O que faremos: Vamos abandonar a estrutura amadora e adicionar as variáveis de "fundo real". O ProtocolConfig (estado global) vai ganhar um limite diário de saques (A Trava Global Anti-Sybil). O VaultState vai ganhar o subordination_ratio_bps (A margem de segurança configurável que substitui o 50/50) e a contabilização de perdas/lucros acumulados.

Fase 2: O Motor de Subordinação (Inicialização e Depósito)

Onde: src/instructions/initialize.rs e src/instructions/deposit.rs

O que faremos: Vamos alterar a criação do cofre para que você (o Admin) defina o tamanho da proteção (ex: 20% Júnior, 80% Sênior). No depósito, em vez de rachar o dinheiro no meio cego, o contrato vai ler essa porcentagem e alocar o capital respeitando o risco real de um fundo FIDC.

Fase 3: A Muralha Anti-Bank Run Sistêmica (Saque)

Onde: src/instructions/withdraw.rs

O que faremos: Além do relógio individual de 24h, vamos puxar o estado global e checar: "O protocolo inteiro já sacou mais do que o limite permitido hoje?". Se sim, a porta fecha para todo mundo. Isso mata qualquer ataque hacker com múltiplas carteiras (Ataque Sybil) e garante a nota máxima da Adevar.

Fase 4: A Blindagem do Oráculo (A Injeção de Yield)

Onde: src/instructions/inject_yield.rs e src/lib.rs

O que faremos: Vamos mudar o nome da função para devnet_yield_simulator. A grande jogada aqui será colocar a "Feature Flag" do Rust (#[cfg(feature = "devnet-simulation")]). Isso prova pro juiz que esse código de injeção de lucros falsos é fisicamente impossível de ser rodado na Mainnet (onde ficaria o dinheiro real).

Fase 5: A Prova dos Nove (Os Testes Invariantes)

Onde: Pasta raiz de testes (tests/invariants.ts ou direto no Rust, dependendo de como você roda os testes).

O que faremos: Vamos escrever os scripts que provam para a Adevar que a matemática bate. Scripts que afirmam: Total Sênior + Total Júnior = Dinheiro Total do Cofre. Sem essa prova matemática documentada, eles não dão o prêmio de $50k.

Fase 6: O Reset e o Relançamento (Deploy e Frontend)

Onde: Terminal e page.tsx

O que faremos: 1. Apagamos o histórico antigo da Devnet (reset).
2. Rodamos o anchor build final e o anchor deploy para jogar o contrato blindado na blockchain.
3. Pegamos a nova ID do programa (se mudar) e atualizamos o seu Dashboard (Next.js) para ler as variáveis novas (que não se chamam mais 50/50).