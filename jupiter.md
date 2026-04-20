Acabamos de lançar a Plataforma de Desenvolvimento Jupiter . Uma plataforma, uma chave de API, tudo o que você precisa para desenvolver no Jupiter: documentação, chaves de API, análises, tudo em um só lugar, para que você não precise ficar alternando entre domínios para encontrar o que precisa.

Essa recompensa não é do tipo "vence o melhor aplicativo desenvolvido com Jupiter". Já vimos muitos desses.

Queremos que você crie algo que nos faça exclamar "uau!". Combine APIs de maneiras que não previmos; se precisarmos de um minuto para analisar sua proposta antes de percebermos que é genial, é isso que buscamos.

Ou, se você já está desenvolvendo algo na Solana, integre as APIs da Jupiter ao seu produto e nos conte exatamente o que deu errado no processo. Swaps, empréstimos, ordens limitadas, DCA, perps, mercados de previsão... nós abrangemos uma ampla gama de produtos. Seja qual for o seu projeto, provavelmente temos uma solução que podemos integrar.

De qualquer forma: você constrói, usa nossas novas ferramentas e nos conta honestamente como foi.

O que você está construindo com
developers.jup.ag - uma única chave dá acesso a tudo:

APIs:

Swap V2 - /order+ /executepara aterrissagem gerenciada e melhor preço em todos os roteadores, ou /buildpara instruções brutas e controle total. Swaps sem gás integrados. Esta é a nova API de swap unificada, queremos você nela. A versão anterior processou bilhões em volume, esta também processará.

Tokens - pesquisa, metadados, status de verificação, pontuações orgânicas e métricas de negociação para qualquer token Solana.

Preço - Cotação em USD de todos os tokens na Solana.

Empréstimos - rendimento sobre depósitos, empréstimos, empréstimos relâmpago.

Gatilho - ordens limitadas - simples, OCO (TP/SL), OTOCO. (NOVO)

Recorrente - DCA baseado em tempo.

Mercados de previsão - mercados binários sobre eventos do mundo real.

Perps - títulos perpétuos alavancados em Solana.

Jupiter AI Stack - queremos que você use esses recursos durante o processo de compilação:

Habilidades do Agente - arquivos de contexto que fornecem ao seu agente de codificação orientações estruturadas para a integração de APIs do Jupiter. Alimente-o com o Claude Code, Cursor, Codex ou qualquer outro serviço que você utilize.

Jupiter CLI - Nativo em JSON, não interativo. Funciona a partir do terminal, Telegram ou por meio de agentes de IA. Se o seu agente precisar executar algo, esta é a maneira.

Documentação MCP - consulte a documentação do Jupiter via MCP. Para quando seu agente não consegue acessar o sistema de arquivos.

llms.txt - Índice de documentos otimizados para LLM.

O que você enviar
Duas coisas. Ambas necessárias.

1. Seu projeto
Um projeto funcional que utiliza uma ou mais APIs do Jupiter através da Plataforma de Desenvolvedores. O inusitado é bem-vindo, e a ambição, ainda mais. "Combinei três APIs de uma forma que não deveria funcionar, mas funciona" é ótimo.

Algumas ideias para começar:

Use a API de Preços para detectar volatilidade e definir automaticamente ordens limitadas por meio do Trigger.

Crie um agente de IA que leia as probabilidades do mercado de previsão e execute negociações por meio da interface de linha de comando (CLI).

Chain Lend oferece empréstimos relâmpago com Swap V2 para um bot de arbitragem.

Crie uma estratégia de DCA que se ajuste com base nos sinais de metadados de tokens da API de Tokens.

Esses são apenas pontos de partida. Queremos ver o que você consegue criar. Experimente ao máximo e explore os limites para que você possa coletar o máximo de pontos possível para receber feedback.

Se você estiver integrando a um produto existente, mostre-nos o antes e o depois.

2. Seu Relatório de Experiência do Desenvolvedor
Isso é tão importante quanto o seu projeto.

Como foi o processo de integração? Quanto tempo levou desde o acesso ao developers.jup.ag até a sua primeira chamada de API bem-sucedida? O que te deixou confuso(a)? O que demorou mais do que deveria?

O que está quebrado ou faltando na documentação? Seja específico. Inclua o link para a página. "A documentação estava correta" não nos diz nada.

Onde as APIs te prejudicaram? Casos extremos, mensagens de erro confusas, comportamento inesperado, latência... queremos os detalhes.

Você utilizou o conjunto de ferramentas de IA? Habilidades, CLI, documentação, MCP, o que realmente ajudou, o que não ajudou, o que está faltando? O que você gostaria de ver melhorado?

Como você reconstruiria o developers.jup.ag? Não estou falando de bugs superficiais na interface do usuário, nós mesmos os encontraremos. Se você fosse o engenheiro por trás da Plataforma de Desenvolvedores, como você construiria a experiência para que os desenvolvedores interagissem com as APIs assim que as implementassem? O que você mudaria na plataforma para que as pessoas lançassem seus produtos mais rapidamente? Conte-nos o que não conseguiremos detectar internamente. Você é nosso cliente, diga-nos o que não estamos vendo.

O que você gostaria que existisse? Endpoints, suporte a SDK, funcionalidades, ferramentas, qualquer coisa.

Não enviem soluções de IA ruins. Nós realmente leremos todos os relatórios, rsrs. Não gostaríamos de ver seus prompts e tokens desperdiçados porque você não vai ganhar.

Prêmios
1.000 $jupUSD - 1º lugar. Melhor combinação de criatividade do projeto e qualidade do relatório de experiência do desenvolvedor.

750 $jupUSD - 2º lugar.

500 $jupUSD - 3º lugar.

250 $jupUSD × 3 - Melhores Relatórios DX. Estes são destinados a desenvolvedores que não estão entre os 3 primeiros. Seu projeto não precisa ser o mais chamativo. Se você encontrou bugs reais, documentou problemas reais e nos deu feedback que podemos usar na segunda-feira de manhã, estes são para você.

Como julgamos
Qualidade do relatório DX (35%) - específico, acionável e honesto. Sem enrolação. Esta é a parte mais importante da sua submissão.

Feedback sobre a pilha de IA (25%) - você usou o Skills, a CLI ou o Docs MCP? O que funcionou, o que não funcionou e o que está faltando? Estamos investindo muito nessa área e precisamos de feedback real.

Execução técnica (25%) - funciona? Qual o nível de integração?

Criatividade e ambição (15%) - você levou nossas APIs para algum lugar inesperado?

Como enviar
Obtenha sua chave de API em developers.jup.ag

Construa seu projeto

Envie sua candidatura para o Superteam Earn com:

Link para o seu projeto (repositório, aplicativo implantado ou vídeo de demonstração)

Seu relatório de experiência do desenvolvedor ( DX-REPORT.mdno seu repositório, Google Docs, Notion - qualquer plataforma, contanto que seja legível e publicamente acessível para que nossa equipe de revisão possa lê-lo).

O e-mail associado à sua conta da Plataforma de Desenvolvedores (para que possamos cruzar seus dados de uso).

