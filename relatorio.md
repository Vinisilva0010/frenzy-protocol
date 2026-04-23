🇧🇷 FRENZY Protocol | FIDC-X
The Global Bridge to Brazil’s High-Yield Credit Market via Solana Actions (Blinks).

🚨 O Crime Silencioso (The Macro Opportunity)
Existe um mercado de R$ 400 bilhões no Brasil (FIDC - Fundos de Investimento em Direitos Creditórios) rendendo de 15% a 25% ao ano em cima de recebíveis e cartões de crédito.
Um investidor institucional em São Paulo consegue acesso. Um investidor de varejo em Berlim, Nova York ou Tóquio não consegue — não por falta de interesse, mas por falta de infraestrutura.

A Europa e os EUA pagam 4% a.a. O Brasil paga +20% a.a.
O FRENZY Protocol é a infraestrutura de 1 clique que arbitra essa assimetria massiva de juros para o mundo inteiro usando a Solana.

⚙️ O Motor (Institutional Subordination Engine)
Não somos apenas um cofre de repasse. O Smart Contract do FRENZY (escrito em Rust/Anchor) é um motor on-chain de Tranching de Crédito (Waterfall).

Abandone os modelos amadores de "50/50". O nosso protocolo permite a configuração de um Subordination Ratio (ex: 20% / 80%), dividindo o risco do mundo real de forma matemática:

🛡️ SENIOR TRANCHE (Deep Safety - Brazil RWA): O capital blindado. Tem prioridade absoluta no recebimento. Absorve 0% dos calotes iniciais. Feito para o investidor que quer bater a inflação global com risco minimizado (Target: 10% - 15% APY).

☢️ JUNIOR TRANCHE (Max Alpha - High Yield Credit): A cota subordinada. Se o mercado balançar, esta cota absorve a inadimplência para proteger a Sênior. MAS, se as faturas forem pagas, a Júnior engole 100% do lucro excedente (Alpha) dos juros rotativos de +300% a.a. do Brasil.

🔒 Segurança Nível Adevar Labs (Security Architecture)
Segurança não é promessa, é matemática provada. O FRENZY foi arquitetado com padrões institucionais:

Formal Invariant Coverage: Testes matemáticos rigorosos. Total Senior + Total Junior == Total TVL sempre.

Double-Layer Anti-Bank Run (Sybil-Resistant):

Individual Cooldown: Travas de 24h por usuário via Clock::get().

Global Withdrawal Quota: Uma trava sistêmica (Global TVL Limit). Se o protocolo sofrer um ataque Sybil coordenado, as portas se fecham automaticamente.

Imunidade a Math Overflow: Todo o cálculo de Waterfall (Cascata) utiliza checked_add, checked_sub, checked_mul e checked_div, com conversões seguras para u128.

Isolamento de Estado: Contas PDA individuais evitam poluição de estado e colisões na EVM/SVM.

🏗️ Mainnet Roadmap & Devnet Simulation (Para VCs e Juízes)
Sabemos que plugar RWA (Ativos do Mundo Real) exige KYC e integração B2B com entidades reguladas (CVM) como AmFi ou Credix.

No Hackathon: O protocolo utiliza o módulo DevnetYieldSimulator, protegido pela feature flag do Rust #[cfg(feature = "devnet-simulation")]. Isso garante aos auditores que o simulador é fisicamente impossível de ser compilado na Mainnet. O simulador permite que juízes executem Stress Tests institucionais ao vivo (Cenários de Lucro e Calote) para validar a matemática do nosso Subordination Engine.

O Pós-Hackathon (Destino dos $250k):

Dia 1-30: Licenciamento jurídico e parceria CVM.

Dia 30-60: Substituição do DevnetYieldSimulator por chamadas CPI (Cross-Program Invocation) reais para oráculos institucionais.

Dia 90: Lançamento Mainnet. Meta Realista: $1M USDC de TVL captados exclusivamente via Blinks no X/Twitter.

🎨 [PARA O CEO] GLOSSÁRIO DE UI/UX (Use no Frontend)
Use estas exatas palavras no seu painel Next.js para manter a narrativa de Wall Street:

Título do Dashboard: VAULT TELEMETRY: REAL-TIME RWA RISK MANAGEMENT

Botão de Depósito (Sênior): DEPOSIT INTO SENIOR (FIXED YIELD HEDGE)

Botão de Depósito (Júnior): DEPOSIT INTO JUNIOR (SUBORDINATED ALPHA)

Cofre Sênior (Texto Secundário): Protected Brazil Credit - Absorbs 0% Initial Default

Cofre Júnior (Texto Secundário): High-Frequency Revolving Credit - Max Alpha Exposure

Botão do Simulador (Sucesso): SIMULATE MARKET PROFIT (WATERFALL CALCULATION)

Botão do Simulador (Crise): SIMULATE CREDIT DEFAULT (STRESS TEST)