# SOULS — Audio Engine v1.0 — Implementação

## Estado da entrega

| Área | Estado |
|---|---|
| Infraestrutura de reprodução | Implementada |
| Integração com acontecimentos oficiais | Implementada no frontend local, PvE, tutorial e adaptador online |
| Assets de áudio licenciados disponíveis | Sim — 19 dos 19 IDs estão `ready` e licenciados |
| Validação auditiva | Pendente — a reprodução técnica está integrada, mas falta avaliação humana |

Não foram criados ficheiros de áudio vazios, música sintética ou conteúdo de origem desconhecida. Os assets selecionados estão rastreados em [`SOULS-AUDIO-LICENSES.md`](../SOULS-AUDIO-LICENSES.md).

## 1. Arquitetura implementada

O áudio pertence à camada web partilhada e não altera o motor de regras:

- [`audioManager.ts`](../apps/web/src/shared/audio/audioManager.ts) mantém uma instância central, cacheia elementos `HTMLAudioElement`, gere música, efeitos, volume, mute, transições, limites e diagnósticos;
- [`AudioProvider.tsx`](../apps/web/src/shared/audio/AudioProvider.tsx) mantém o manager através das transições React e expõe `useAudio`;
- [`audioEvents.ts`](../apps/web/src/shared/audio/audioEvents.ts) traduz `GameEvent`, eventos autorizados online e marcadores da timeline para os IDs já existentes no manifesto;
- [`audioManifest.ts`](../apps/web/src/shared/audio/audioManifest.ts) continua a ser o único catálogo de IDs, caminhos, buses e ganhos;
- os controladores recebem callbacks de observação. O áudio não calcula dano, Souls, destruições, fases ou vencedor.

Não foram adicionadas dependências externas nem imports de React, DOM ou áudio a `packages/game-core`.

## 2. Audio Manager

O manager fornece operações reais:

- `playMusic`, `pauseMusic`, `resumeMusic` e `stopMusic` usam `HTMLAudioElement`;
- a música usa loop conforme o manifesto e não reinicia quando o mesmo ID continua ativo;
- a troca entre faixas usa crossfade de 420 ms por omissão e mantém apenas uma faixa ativa no fim;
- `playSfx` reutiliza vozes, reinicia a voz disponível, suprime chamadas duplicadas num intervalo curto de 70 ms e limita a oito efeitos simultâneos por omissão;
- os volumes aplicam `master × bus × asset`, com buses independentes para música, SFX e UI;
- mute reduz o volume efetivo a zero sem alterar os valores guardados, evitando saltos ao reativar;
- `preload` permite carregar apenas os IDs necessários ao contexto atual;
- `dispose` interrompe música, efeitos, crossfade e o contexto Web Audio provisório.

Quando um ficheiro falha, o jogo continua utilizável. O diagnóstico mantém o estado runtime (`loading`, `ready`, `missing`, `blocked`, `error` ou `unsupported`) e o logger de desenvolvimento só reporta uma transição de estado por asset, evitando erros repetidos durante a partida.

Os efeitos UI `sfx.ui.hover`, `sfx.ui.click` e `sfx.card.select` podem usar um tom Web Audio original e provisório apenas quando o asset final não pôde ser reproduzido. Este fallback não é usado para música nem é apresentado como banda sonora definitiva.

## 3. Integração React e preferências

[`App.tsx`](../apps/web/src/App.tsx) monta `AudioProvider` uma única vez. A música é selecionada por contexto:

| Contexto | ID |
|---|---|
| Menu, modo, códice e preparação | `music.menu` |
| Lobby online | `music.menu` |
| Tutorial | `music.menu` |
| Partida local, PvE ou online | `music.battle` |
| Resultado com vitória do cliente | `music.victory` |
| Resultado com derrota do cliente | `music.defeat` |

O efeito de contexto depende apenas da transição de contexto, não de cada renderização do tabuleiro. A revanche e o regresso ao menu também limpam os SFX ativos.

O botão de configurações do menu abre [`AudioSettingsPanel.tsx`](../apps/web/src/shared/audio/AudioSettingsPanel.tsx), com volume geral, música, efeitos e mute. As preferências são guardadas em `localStorage` com a chave `souls.audio.settings.v1` e restauradas na próxima abertura.

## 4. Autoplay e disponibilidade de assets

O manager tenta reproduzir a faixa no momento em que o contexto entra. Se o browser rejeitar a chamada por autoplay, guarda a faixa pendente. O provider instala listeners de `pointerdown`, `touchstart` e `keydown` para tentar a retoma após a primeira interação do utilizador.

O carregamento é feito através do caminho do manifesto. Os 19 assets disponíveis são carregados a partir de `/audio`. Formato inválido, erro de reprodução ou indisponibilidade da API também não bloqueiam o jogo. Em desenvolvimento, o diagnóstico identifica o ID e o caminho.

## 5. Eventos oficiais

Os controladores só chamam áudio depois de uma operação oficial ser aceite:

| Evento | Efeito |
|---|---|
| `card-drawn` | `sfx.card.draw` |
| `card-invoked` | `sfx.card.place` |
| `souls-spent` por invocação | `sfx.soul.spend` e `sfx.card.summon` |
| `card-retired` | `sfx.card.place` |
| `draw-failed` | `sfx.card.draw-failed` |
| `souls-spent` por compra falhada | `sfx.soul.spend` |
| `card-destroyed` | `sfx.combat.destroy` |
| `souls-gained` | `sfx.soul.gain` |
| `damage-dealt` | `sfx.player.damage` |

O binding de `card-invoked` foi ajustado para representar colocação; o summon adicional só ocorre quando o próprio evento oficial confirma consumo de Souls por invocação. Não foi criado um evento de domínio novo.

## 6. Timeline de combate

Os callbacks são chamados diretamente pelo [`CombatAnimationSequencer.ts`](../apps/web/src/features/combat/application/CombatAnimationSequencer.ts) através dos controladores, por isso não dependem de timers de áudio paralelos:

- etapa `attack`: `sfx.combat.melee` ou `sfx.combat.ranged`, de acordo com as definições dos atacantes;
- etapa `impact`: `sfx.combat.impact`, ou `sfx.combat.block` quando a troca oficial está bloqueada;
- etapa `consequences`: destruição, Souls ganhas e dano ao jogador são reproduzidos para a troca visual corrente;
- `skip` emite apenas as consequências que o sequenciador apresenta e não descarrega sons das etapas omitidas;
- cancelamento, reinício e saída limpam os SFX que ainda estejam ativos.

O `game-core` continua a fornecer apenas o trace determinístico. O frontend não recalcula o combate nem agenda marcadores com tempos independentes da timeline existente.

## 7. Modos suportados

- `useLocalGame` cobre PvP Local e PvE; eventos de compra são emitidos por segmento de feedback e eventos de combate por troca;
- `useTutorialGame` reutiliza os mesmos callbacks, sem partilhar o estado da partida normal;
- `useOnlineGame` reproduz localmente os eventos autorizados pelo servidor e nunca transporta áudio; snapshots repetidos com o mesmo `matchId:version` não repetem efeitos;
- o lobby e o tutorial usam o mesmo tema de menu, conforme o documento de Sound Design.

## 8. Testes

Foram adicionados:

- [`audioManager.test.ts`](../apps/web/src/shared/audio/audioManager.test.ts): persistência, volumes, mute, cache de música, crossfade, assets ausentes, limite de SFX, deduplicação e autoplay bloqueado/retomado;
- [`audioEvents.test.ts`](../apps/web/src/shared/audio/audioEvents.test.ts): bindings oficiais e marcadores melee/ranged/impacto/bloqueio/consequências;
- [`useLocalGame.audio.test.tsx`](../apps/web/src/features/match/application/useLocalGame.audio.test.tsx): integração do callback com uma colocação aceite pelo controlador real.

O timeout anteriormente referido em `App.test.tsx` não foi reproduzido: a linha de base passou os 14 testes selecionados e, depois da implementação, a suíte web completa passou sem aumentar timeouts.

## 9. Validação executada

Na execução desta entrega:

- `npm run lint` — passou;
- `npm run typecheck` — passou em todos os workspaces;
- `npm --workspace @souls/web run test` — 24 ficheiros e 74 testes passaram;
- `npm run test:ci` — 42 ficheiros e 146 testes passaram em todos os workspaces;
- `npm run build` — passou em todos os workspaces, incluindo o bundle Vite;
- `npm run fixtures:validate` — 3 fixtures do `game-core` passaram;
- `App.test.tsx` — 11 testes passaram depois da alteração;
- validação técnica dos ficheiros licenciados — 19 assets copiados e registados;
- validação auditiva humana — ainda pendente.

A validação final de qualidade sonora, loop sem corte, mixagem e reprodução prolongada num browser real continua dependente de avaliação auditiva humana; os ficheiros e licenças já estão registados.

## 10. Ficheiros criados e modificados

Criados:

- `apps/web/src/shared/audio/audioManager.ts`;
- `apps/web/src/shared/audio/audioEvents.ts`;
- `apps/web/src/shared/audio/AudioProvider.tsx`;
- `apps/web/src/shared/audio/AudioSettingsPanel.tsx` e respetivo CSS;
- testes do manager, bindings e integração local;
- `SOULS-AUDIO-LICENSES.md` e 19 assets licenciados em `apps/web/public/audio`;
- este relatório.

Modificados:

- `App.tsx`, controladores local/online/tutorial e componentes de menu, mão, handoff, moeda, resultado e instruções;
- `audioManifest.ts`, mantendo os mesmos 19 IDs e atualizando disponibilidade/licenças/caminhos reais;
- `README.md`, `CHANGELOG.md` e `SOULS-SOUND-DESIGN-v1.0.md`.

## 11. Limitações restantes

- `music.menu` usa o loop CC0 Dark Place; as faixas de combate, vitória e derrota usam os ficheiros oficiais selecionados e as licenças CC-BY registadas;
- os WAV ranged não foram convertidos por falta de ferramenta local;
- o fallback Web Audio é deliberadamente limitado a feedback UI provisório;
- o browser e o dispositivo final ainda precisam de uma sessão manual com assets reais para confirmar autoplay, crossfade, níveis de volume e qualidade dos loops;
- o PvP Online só pode reproduzir eventos que o servidor já envia; não foram criados eventos fictícios nem transporte de áudio.
