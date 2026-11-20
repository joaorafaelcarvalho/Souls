# SOULS

SOULS é um jogo estratégico de cartas por turnos para dois jogadores. A entrega atual inclui o motor de regras, o catálogo modular, os modos locais e uma primeira partida PvP Online privada com servidor autoritativo.

A referência normativa das mecânicas é o [regulamento SOULS v0.7](./docs/game-rules.md). O backend expõe salas privadas online por HTTP e WebSocket; o catálogo continua a ser carregado localmente no processo servidor.

## Estado atual

Implementado:

- workspace npm com [apps/web](./apps/web), [apps/api](./apps/api), [packages/game-core](./packages/game-core), [packages/game-content](./packages/game-content) e [packages/game-online](./packages/game-online);
- TypeScript estrito, ESLint, Vitest e React Testing Library;
- catálogo JSON com cinco cartas originais e vinte cartas da Card Expansion v1;
- UUID permanente para cada CardDefinition e UUID individual para cada CardInstance;
- validação e descoberta automática de definições via `import.meta.glob`;
- cinco ilustrações PNG distintas em `apps/web/public/images/cards`;
- preparação, compras, posicionamento, ataques, descarte, Souls, dano e vitória;
- animação sequencial de combate por colunas, com efeitos visuais, velocidade 2×, reduced motion e salto;
- VFX cinematográficos de combate com SVG, CSS e feedback de HP/Souls;
- ecrã final de vitória/derrota com resumo real e botão de revanche;
- sorteio oficial apresentado por moeda medieval, passagem local integrada com as duas compras obrigatórias e anúncio visual nas transições sem compra;
- tutorial interativo determinístico com etapas guiadas, destaques do tabuleiro, compra e combate reais;
- Códice das Almas com galeria oficial, pesquisa, filtros, ordenação e detalhes narrativos provisórios;
- Deck Builder local com baralhos guardados, validação oficial 10/4/3/2/1, estatísticas e preparação do PvP Local;
- Balance Lab Node independente com agentes reproduzíveis, simulações smoke/balance/extended e relatórios JSON/CSV/Markdown;
- auditoria final Balance Lab v0.7.2 com baralhos legais, experiências agente/baralho separadas e guia de playtesting humano;
- modo Jogador vs IA v1.0 com dificuldades Fácil, Normal e Difícil, controlador local e decisões sanitizadas;
- códice visual de regras SOULS v0.7 consultável durante a partida;
- loading cinematográfico inicial e menu principal com entrada para a partida existente;
- protótipo React com mão horizontal, tabuleiro vertical 6×4, cartas completas e estado real;
- composição responsiva em três zonas: jogador 2 à esquerda, tabuleiro ao centro e informação do jogo/ronda à direita;
- endpoint Fastify `GET /health`;
- salas privadas online com código de convite, dois participantes e lobby;
- servidor autoritativo online que reutiliza `game-core`, valida baralhos no catálogo e processa comandos versionados;
- WebSocket persistente, tokens anónimos de sessão, reconexão temporária e encerramento por expiração;
- projeções autorizadas sem mão ou baralho futuro do adversário;
- revanche online mediante aceitação dos dois participantes;
- ecrãs PvP Online integrados no menu e no tabuleiro existente.
- manifesto de Sound Design v1.0 com prompts, caminhos, mixagem e rastreabilidade pendente; não existem ainda assets sonoros finais.

Os níveis 0 e os valores das cinco cartas são temporários para testes e não são balanceamento final.

Ainda não implementado:

- persistência de salas após reinício e coordenação entre múltiplos processos;
- consulta remota do catálogo;
- autenticação de contas, matchmaking, rankings, chat e serviços externos;
- tutorial avançado para cartas de níveis superiores, IA tutorial e progresso remoto;
- cartas definitivas, balanceamento ou direção artística.

## Execução

```powershell
npm install
npm run dev:web
```

Abra [http://localhost:5173/](http://localhost:5173/). Para a API técnica, use outro terminal com 
`npm run dev:api`.

O PvP Online usa `http://localhost:3000` e `ws://localhost:3000/online` por omissão. Consulte [.env.example](./.env.example) e [SOULS-PVP-ONLINE-v1.0-implementation.md](./docs/SOULS-PVP-ONLINE-v1.0-implementation.md) para testar dois clientes na mesma rede.

Para executar o laboratório de balanceamento:

```powershell
npm run balance:smoke
```

## Qualidade

```powershell
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

## Documentação

- [AGENTS.md](./AGENTS.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [Arquitetura](./docs/architecture.md)
- [Catálogo de cartas](./docs/cards.md)
- [Regulamento SOULS v0.7](./docs/game-rules.md)
- [Mecânicas](./docs/game-mechanics.md)
- [Modelos de dados](./docs/data-models.md)
- [Estratégia de testes](./docs/testing.md)
- [Documentação de componentes](./docs/components/README.md)
- [Navegação frontend](./docs/frontend/navigation.md)
- [Tutorial interativo](./docs/tutorial.md)
- [Códice das Almas](./docs/codex-of-souls.md)
- [Deck Builder](./docs/deck-builder.md)
- [Coleção de cartas](./docs/card-collection.md)
- [Economia futura](./docs/future-economy.md)
- [Balance Lab](./docs/balance-lab.md)
- [Jogador vs IA](./docs/pve.md)
- [Playtesting humano](./docs/human-playtesting.md)
- [Bíblia narrativa](./docs/lore/world.md)
- [Card Expansion v1](./docs/card-expansion-v1.md)
- [Animações de combate](./docs/combat-animations.md)
- [API](./docs/api.md)
- [Implementação PvP Online v1.0](./docs/SOULS-PVP-ONLINE-v1.0-implementation.md)
- [Sound Design v1.0](./docs/SOULS-SOUND-DESIGN-v1.0.md)

A auditoria do npm reportou vulnerabilidades transitivas. Não foi executado 
`npm audit fix`.
