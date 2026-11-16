# SOULS

SOULS é a fundação local de um jogo estratégico de cartas por turnos para dois jogadores. A entrega atual inclui o motor de regras, o catálogo modular com cinco cartas de teste e um protótipo frontend local jogável.

A referência normativa das mecânicas é o [regulamento SOULS v0.7](./docs/game-rules.md). O backend ainda não expõe partidas ou catálogo por HTTP.

## Estado atual

Implementado:

- workspace npm com [apps/web](./apps/web), [apps/api](./apps/api), [packages/game-core](./packages/game-core) e [packages/game-content](./packages/game-content);
- TypeScript estrito, ESLint, Vitest e React Testing Library;
- catálogo JSON com cinco cartas originais e vinte cartas da Card Expansion v1;
- UUID permanente para cada CardDefinition e UUID individual para cada CardInstance;
- validação e descoberta automática de definições via `import.meta.glob`;
- cinco ilustrações PNG distintas em `apps/web/public/images/cards`;
- preparação, compras, posicionamento, ataques, descarte, Souls, dano e vitória;
- animação sequencial de combate por colunas, com efeitos visuais, velocidade 2×, reduced motion e salto;
- VFX cinematográficos de combate com SVG, CSS e feedback de HP/Souls;
- ecrã final de vitória/derrota com resumo real e botão de revanche;
- sorteio oficial apresentado por moeda medieval, confirmação de passagem local e anúncio visual de cada novo turno;
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
- endpoint Fastify `GET /health`.

Os níveis 0 e os valores das cinco cartas são temporários para testes e não são balanceamento final.

Ainda não implementado:

- comunicação frontend/backend e contratos HTTP de partidas;
- consulta remota do catálogo;
- autenticação, matchmaking, WebSockets, persistência e serviços externos;
- tutorial avançado para cartas de níveis superiores, IA tutorial e progresso remoto;
- cartas definitivas, balanceamento ou direção artística.

## Execução

```powershell
npm install
npm run dev:web
```

Abra [http://localhost:5173/](http://localhost:5173/). Para a API técnica, use outro terminal com 
`npm run dev:api`.

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

A auditoria do npm reportou vulnerabilidades transitivas. Não foi executado 
`npm audit fix`.
