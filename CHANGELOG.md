# Changelog

## [Por lançar]

### Adicionado

- PvP Online v1.0 com salas privadas em memória, códigos de convite, identidades anónimas de sessão, lobby de baralhos, servidor autoritativo baseado no game-core, WebSocket, projeções privadas, versões/command IDs, reconexão temporária e revanche consensual;
- pacote game-online com contratos de rede e visão autorizada partilhada entre API e frontend;
- integração de 19 assets licenciados do OpenGameArt no Audio Engine, com manifesto atualizado, rastreabilidade em `SOULS-AUDIO-LICENSES.md` e músicas oficiais de menu, combate, vitória e derrota; a validação auditiva humana permanece pendente;
- preparação Multiplatform Architecture v1.0 com auditoria da árvore real, plano de migração seguro, proposta Flutter sem criação de projeto Mobile e três fixtures JSON portáteis validadas contra o game-core;

- modal de passagem de turno integrado com as duas compras obrigatórias, WebP de saque congelado na primeira frame antes do clique e animação sincronizada até ao posicionamento;
- tutorial concluído com compras falhadas jogáveis, comparação de níveis superiores e desafio final de posicionamento/combate;
- seleção de cartas do campo preservada durante a seleção de uma carta da mão, permitindo executar a retirada estratégica válida;
- enquadramento da animação WebP de saque centrado pelo conteúdo visível e correção da seleção de cartas no campo na etapa Soul Harvest do tutorial;
- SOULS v0.7: Soul Harvest, ações de posicionamento partilhadas, bloqueios sem penalização, atributos atualizados de cinco cartas, tutorial/Códice/Balance Lab e testes de regressão;
- inspeção modal centrada na etapa 3 do tutorial, esquema visual da ordem dos turnos e cenário combinado com Cavaleiro adversário;
- Codex das Almas em viewport completo com transição de entrada, catálogo/lore atualizado e suporte a novas cartas e facções;
- Deck Builder local com catálogo oficial, baralhos de 20 cartas, persistência local, estatísticas e preparação do PvP Local;
- Balance Lab independente com agentes legais, seeds reproduzíveis, simulação smoke e relatórios JSON/CSV/Markdown;
- Balance Lab v1.1 com baralhos estratégicos de 20 cartas, cenário negativo sem cartas gratuitas, telemetria de dano causado/recebido, cobertura determinística de invocações dos níveis 0–4, diagnósticos de cartas não escolhidas/sem Souls/sem espaço, seeds emparelhadas com inversão de prioridade e relatórios detalhados;
- Auditoria Balance Lab v1.1 com 1 000 partidas controladas, análise por carta, economia de Souls, prioridade inicial, comparação v1.0/v1.1 e findings diagnósticos;
- auditoria Balance Lab v0.7.1 com nova execução identificada, comparação histórica emparelhada v0.6/v0.7, economia/esgotamento, compras falhadas, níveis de invocação e validação dos comandos realmente executados;
- Balance Lab v0.7.2 com validação partilhada da distribuição oficial 10/4/3/2/1, perfis estratégicos legais, cobertura das 26 cartas, experiências agente/baralho e baseline para playtesting humano;
- modo Jogador vs IA v1.0 integrado no menu, com pacote game-ai partilhado, dificuldades Fácil/Normal/Difícil, visão sanitizada e controlador de turnos oficiais;
- modo Jogador vs IA v1.1 com delays visuais entre ações, sincronização com handoff/anúncio de turnos, HP atualizado por troca e compra falhada, playback de penalizações e painel final reduzido a Revanche/Menu Principal;
- IA Difícil v1.1 com proteção heurística de ranged, avaliação por coluna e planeamento defesa → ranged sem acesso a informação oculta;
- cinco cartas de teste no catálogo: Cavaleiro, Arqueiro, Defensor, Mago e Cavaleiro Negro;
- cinco ilustrações PNG fornecidas, integradas por referência no catálogo;
- identidade Dark Fantasy com tokens de pedra, ferro, bronze, dourado e Souls;
- dimensionamento do tabuleiro limitado por largura e altura disponíveis;
- componente Card reutilizável com moldura cinematográfica, ícones, variantes mão/tabuleiro e fallback de imagem;
- refinamento Visual Base v1 das cartas: ilustração dominante, hierarquia tipográfica, atributos em painéis e título movido para o rail esquerdo;
- background das ilustrações nas cartas, nome na zona superior, valores compactos no rodapé e mão ampliada no rail direito;
- painel Análise da Partida alimentado por GameEvent e fundo local atmosférico em ruínas góticas;
- tabuleiro com casas verticais 2:3 sem coordenadas ou labels técnicos visíveis;
- mão horizontal abaixo do tabuleiro;
- composição desktop em três zonas para usar a largura do ecrã: jogador 2 à esquerda, tabuleiro ao centro e jogo/ronda à direita;
- mão posicionada abaixo do status do jogador 1 na coluna direita, deixando o centro exclusivamente para o tabuleiro;
- cartas completas no tabuleiro;
- validação central de colocação no game-core;
- casas inválidas desativadas de acordo com a carta selecionada;
- limite visual mais compacto para o tabuleiro;
- traço determinístico de combate no game-core e sequenciador visual frontend por colunas/trocas;
- efeitos de destaque, impacto, destruição, velocidade 2×, salto e reduced motion;
- VFX cinematográficos de combate: carga dos atacantes, raios SVG, marcador X de destruição, impacto e feedback de HP/Souls;
- efeitos WebP de ataque diferenciados por categoria: relâmpago dourado para ranged e impacto violeta para melee;
- variantes WebP adicionais de impacto melee/ranged alternadas com os efeitos de ataque existentes;
- versões grandes dos impactos melee/ranged e alternância exclusiva sem sobreposição de animações;
- botão de regras com o estilo comum do menu e Voltar com confirmação no lugar de Reiniciar;
- estandarte dark fantasy local atrás do menu e confirmação de Voltar através de diálogo interno, sem pop-up nativo;
- transição menu→jogo refinada e cabeçalho da partida reorganizado com logo transparente e controlos laterais;
- menu principal clareado e elevado, botão de regras no menu e desistência com retorno seguro ao menu;
- ocultação imediata das cartas destruídas durante a reprodução, com overlay de desintegração sincronizado com as consequências;
- ecrã cinematográfico de vitória/derrota com resumo da partida e revanche limpa;
- códice visual de regras SOULS v0.6 consultável durante a partida, com mapa do tabuleiro, fases, custos e combate;
- Loading Screen cinematográfico de aproximadamente 2 segundos e Main Menu com JOGAR, CÓDICE DAS ALMAS e CONFIGURAÇÕES;
- carta-modelo das regras ajustada à proporção 2:3, com atributos explicados numa coluna lateral;
- assets decorativos transparentes locais para a espada, estátuas, estandartes, arquitetura e base do resultado;
- visão autorizada da partida com `activePlayerId`/`viewerPlayerId` separados e contrato de comandos local reutilizável para futura sessão online;
- animação de moeda baseada em `turn.firstPlayerId`, handoff local de confirmação e anúncio visual de turnos sem alterar o motor;
- faces I/II da moeda substituídas pelos assets medievais transparentes fornecidos, com rotação 3D desacelerada e aterragem progressiva;
- animações WebP completas das moedas integradas, substituindo a rotação CSS duplicada;
- modo Tutorial Interativo v1 com dezasseis etapas, cenários determinísticos, destaques de linhas, compra/combate oficiais e conclusão própria;
- Códice das Almas com galeria oficial, pesquisa normalizada, filtros, ordenação, detalhes e lore provisório separado;
- Card Expansion v1 com 20 novas definições, níveis 0–4, UUIDs permanentes e placeholder visual comum;
- testes de catálogo, validação de categorias, apresentação e remoção real da carta da mão após colocação.

### Limitações conhecidas

- as cinco cartas têm nível 0 e valores temporários para testes;
- não existe persistência após reinício nem sincronização entre múltiplas instâncias; o teste visual com dois browsers ainda é manual;
- as ilustrações PNG são recursos fornecidos para o protótipo e a direção artística definitiva continua pendente;
- npm reporta vulnerabilidades transitivas; não foi aplicado 
pm audit fix`.
## [0.1.0] — Fundação local

- Criada a arquitetura local sem Git, GitHub, CI/CD remoto ou deploy.
- Separados game-core, game-content, frontend e backend.
- Criados contratos, catálogo UUID, resolvers de combate e protótipo local.
- painel de inspeção de cartas no rail direito, integrado à seleção da mão e do tabuleiro;
