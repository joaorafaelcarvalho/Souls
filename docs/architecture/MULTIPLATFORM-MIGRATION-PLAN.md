# SOULS — Plano seguro de migração multiplataforma

## Princípios

- preservar o funcionamento atual e o regulamento em [`docs/game-rules.md`](../game-rules.md);
- não mover pastas por estética;
- não alterar contratos online sem versionamento e testes de compatibilidade;
- não duplicar catálogo, regras ou assets antes de existir uma fonte canónica;
- preferir passos pequenos, verificáveis e reversíveis;
- qualquer alteração estrutural de risco alto requer revisão explícita antes de execução.

## Estado inicial

O repositório já é um workspace npm com `apps/web`, `apps/api` e cinco packages TypeScript. Não existe aplicação Flutter, package de contratos schema-first ou package de assets partilhados. A árvore completa está em [`CURRENT-ARCHITECTURE.md`](./CURRENT-ARCHITECTURE.md).

## Passos seguros executados nesta tarefa

| Caminho atual | Alteração | Motivo | Risco/reversão |
|---|---|---|---|
| `docs/` | adicionados documentos de arquitetura atual, plano e Flutter | tornar as fronteiras explícitas sem tocar no runtime | baixo; apagar apenas os documentos novos reverte |
| nenhum diretório de fixtures | adicionados `tests/game-fixtures/combat/*.json` | criar uma base interlinguística derivada de testes existentes | baixo; JSONs isolados e validados |
| scripts root | adicionado `fixtures:validate` e `scripts/validate-game-fixtures.mjs` | verificar fixtures contra `game-core` sem modificar estado | baixo; remover script/entrada reverte |
| `README.md`/`CHANGELOG.md` | adicionar referências à preparação | descoberta da documentação e histórico | baixo |

## Migrações estruturais propostas — não executadas

### 1. Contratos schema-first

| Campo | Proposta |
|---|---|
| atual | contratos TypeScript em `packages/game-online` |
| alvo | schemas JSON versionados para comandos, snapshots, eventos, lobby e erros; tipos TS e modelos Dart gerados/validados |
| imports afetados | API, Web, testes online e futuro Mobile |
| scripts/configuração | nova validação de schema; eventual OpenAPI para HTTP |
| risco | alto: qualquer diferença quebra clientes online |
| testes | snapshots de payload, compatibilidade da versão anterior, rejeição de campos inválidos |
| reversão | manter `game-online` como adapter até todos os consumidores passarem |

Não criar `game-contracts` ainda: é uma decisão de implementação que deve começar com um schema mínimo e cobertura do protocolo atual.

### 2. Dados canónicos

| Campo | Proposta |
|---|---|
| atual | cartas já são JSON; lore/configuração estão distribuídos |
| alvo | avaliar `packages/game-content/data/` como origem canónica de cartas, config e eventualmente lore |
| imports afetados | loaders browser/Node, Deck Builder, API, Balance Lab |
| risco | médio/alto: IDs e valores não podem mudar |
| testes | contagem, UUID, campos, catálogo resultante byte/valor-equivalente, decks oficiais |
| reversão | conservar os JSONs atuais e trocar apenas o adapter de leitura |

Não mover nem reescrever os JSONs atuais nesta fase.

### 3. Assets comuns

| Campo | Proposta |
|---|---|
| atual | imagens em `apps/web/public/images`; áudio referenciado pelo manifesto Web |
| alvo | fonte canónica versionada de assets e manifests; adapters copiam para Web/Mobile somente quando Mobile existir |
| imports afetados | URLs do catálogo, CSS, Vite, futuro `pubspec.yaml`, Audio Engine |
| risco | alto para imagens e licenças; médio para manifests |
| testes | verificação de ficheiros, hash, nomes/IDs, licença e destinos |
| reversão | preservar caminhos Web e usar manifest adapter |

Não criar `packages/game-assets` vazio nem copiar assets para Flutter inexistente.

### 4. Aplicação Flutter

| Campo | Proposta |
|---|---|
| atual | não existe `apps/mobile` |
| alvo | criar projeto Flutter real em tarefa própria, com `lib/core`, features, modelos gerados, testes e adapters |
| imports afetados | nenhum enquanto o projeto não existir |
| risco | alto se misturado com npm/build atual |
| testes | `flutter test`, testes de modelos e conformidade com fixtures |
| reversão | diretório novo isolado; não alterar apps existentes |

Não instalar Flutter, gerar Android/iOS ou criar ficheiros Dart artificiais nesta tarefa.

### 5. Motor offline Dart

| Campo | Proposta |
|---|---|
| atual | `game-core` TypeScript é o motor oficial |
| alvo | decidir entre cliente offline Dart equivalente ou execução exclusivamente online via API |
| risco | muito alto: divergências alteram regras e resultados |
| testes | fixtures JSON de estado/comandos/eventos, comparação por evento e estado final |
| reversão | manter modo offline inexistente até paridade comprovada |

O Flutter não pode importar diretamente o package TypeScript. O modo online é o caminho de menor risco inicial.

## Ordem recomendada futura

1. estabilizar e versionar os payloads atuais sem alterar o protocolo;
2. aumentar fixtures portáteis para compra, Souls, retirada, vitória e turnos;
3. introduzir validação schema-first atrás de adapters compatíveis;
4. consolidar dados e manifests com testes de equivalência;
5. decidir IA offline/serviço;
6. criar `apps/mobile` isolado;
7. executar testes de conformidade TypeScript/Dart antes de habilitar modos offline.

## Gates de segurança

Uma migração estrutural só deve avançar quando:

- a árvore de imports antes/depois estiver documentada;
- os contratos antigos tiverem testes de compatibilidade;
- `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build` e fixtures passarem;
- nenhum JSON/UUID/valor oficial tiver sido alterado sem revisão;
- houver plano de reversão por etapa;
- os consumidores Web/API existentes continuarem funcionais.
