# Instruções para agentes

Estas instruções aplicam-se a qualquer agente que altere este projeto.

## Leitura obrigatória

Antes de modificar código, leia:

1. [README.md](./README.md);
2. [docs/architecture.md](./docs/architecture.md);
3. [docs/game-rules.md](./docs/game-rules.md);
4. [docs/cards.md](./docs/cards.md) quando alterar conteúdo, IDs, baralhos ou imagens;
5. a documentação específica do módulo que será alterado;
6. o estado atual dos testes relevantes.

## Regras do produto

- O regulamento em [docs/game-rules.md](./docs/game-rules.md) é a única fonte normativa das mecânicas SOULS v0.7.
- Não altere mecânicas, valores, categorias, fases ou condições de vitória sem aprovação explícita do utilizador.
- Não invente cartas definitivas, habilidades, balanceamento, efeitos ou valores de combate.
- Não transforme uma hipótese de implementação numa regra oficial.
- Quando um detalhe não estiver especificado, documente-o como pendente e limite o comportamento ao que está confirmado.
- Não declare como concluída uma funcionalidade que só tem contratos ou uma apresentação visual.

## Arquitetura

- Preserve a separação entre domínio, aplicação, apresentação, conteúdo e infraestrutura.
- Toda a lógica normativa do jogo pertence a [packages/game-core](./packages/game-core).
- O conteúdo catalogado pertence a [packages/game-content](./packages/game-content).
- O game-core não pode depender de React, Fastify, DOM, HTTP, base de dados, imagens ou ficheiros JSON.
- O game-content não pode duplicar regras de combate ou fases.
- O frontend pode carregar imagens e apresentar definições, mas não calcula danos, concede Souls ou decide destruições.
- O backend pode consultar conteúdo através de contratos futuros, mas não duplica o motor.
- CardDefinition usa UUID permanente; CardInstance usa UUID próprio e referencia a definição por `cardDefinitionId`.
- Baralhos guardam referências UUID a definições e mantêm 20 cartas. Não invente limites de cópias.
- Não gere novamente o UUID de uma definição ao carregar o catálogo.
- Não use nomes de cartas como chaves primárias.
- Descubra JSONs através do mecanismo do bundler; não use `node:fs` no código executado pelo browser.
- Imagens ficam separadas das definições em `apps/web/public/images/cards`.
- Não crie abstrações sem responsabilidade concreta.
- Não introduza dependências sem necessidade demonstrável.
- Não estabeleça convenções arquiteturais duradouras novas sem aprovação.

## Qualidade

- Use TypeScript estrito e contratos explícitos.
- Prefira funções puras para cálculos determinísticos.
- Mantenha transformações de estado imutáveis quando apropriado.
- Valide entradas nos limites dos módulos.
- Crie testes proporcionais ao risco da alteração.
- Atualize a documentação e o [CHANGELOG.md](./CHANGELOG.md) quando a alteração for relevante.
- Mantenha mocks separados de dados reais e de regras do domínio.
- Execute lint, typecheck, testes e build antes de entregar, ou registe claramente a limitação.

## Escopo operacional

- Trabalhe apenas neste projeto local.
- Não altere outros projetos.
- Nesta fase, não execute Git ou GitHub, não inicialize repositórios, não crie branches, commits, remotes, Pull Requests, `.github/` ou CI/CD remoto.
- Não faça deploy nem configure alojamento, cloud ou serviços externos.
- Não implemente autenticação, matchmaking, rankings, pagamentos ou chat.
- Preserve trabalho existente e inspecione os ficheiros antes de editar.
- Toda alteração duradoura à arquitetura ou às regras deve ser proposta e aprovada pelo utilizador antes de ser considerada uma convenção oficial.
