# SOULS — Sound Design v1.0

## Estado da entrega

Esta entrega prepara a identidade sonora e o contrato de assets, mas não contém ficheiros de áudio finais.

A auditoria encontrou:

- nenhum Audio Manager;
- nenhum manifesto de áudio anterior;
- nenhum controlo de volume ou mute;
- nenhum ficheiro WAV, OGG, MP3 ou outro asset sonoro;
- nenhum callback de áudio na timeline de combate.

Não existe uma ferramenta de geração de áudio disponível nesta sessão. Por isso, não foram criados ficheiros vazios, sons sintéticos provisórios ou assets de origem desconhecida. A produção sonora e a reprodução no jogo continuam pendentes.

O manifesto tipado está em [audioManifest.ts](../apps/web/src/shared/audio/audioManifest.ts) e os seus testes verificam IDs, caminhos, bindings e estados pendentes.

## 1. Conceito artístico

SOULS deve soar a um reino medieval esquecido: ruínas góticas, magia ancestral, perigo controlado e uma melancolia épica. A música deve favorecer concentração durante a partida; os efeitos devem ser curtos, legíveis e ter espaço de volume para não competir com a informação do tabuleiro.

Direções permitidas:

- dark fantasy medieval;
- orquestra cinematográfica atmosférica;
- cordas graves, violoncelos e contrabaixos;
- coros etéreos sem palavras;
- sinos distantes, vento, pedra e instrumentos medievais discretos;
- percussão moderada e energia sobrenatural associada às Souls.

Evitar música eletrónica moderna evidente, batidas pop, melodias alegres, vozes com palavras, imitação de jogos/filmes existentes e qualquer gravação sem licença verificável.

## 2. Manifesto de assets

Todos os itens abaixo estão marcados como `missing` e `license: pending` até serem fornecidos e avaliados. Os caminhos são os destinos web esperados em `apps/web/public`.

| ID | Caminho de distribuição | Duração sugerida | Loop | Estado |
|---|---|---:|:---:|---|
| `music.menu` | `/audio/music/menu.ogg` | 90–150 s | sim | em falta |
| `music.battle` | `/audio/music/battle.ogg` | 120–180 s | sim | em falta |
| `music.victory` | `/audio/music/victory.ogg` | 15–30 s | não | em falta |
| `music.defeat` | `/audio/music/defeat.ogg` | 15–30 s | não | em falta |
| `sfx.ui.hover` | `/audio/sfx/ui/hover.ogg` | 0,1–0,2 s | não | em falta |
| `sfx.ui.click` | `/audio/sfx/ui/click.ogg` | 0,1–0,3 s | não | em falta |
| `sfx.card.select` | `/audio/sfx/card/select.ogg` | 0,2–0,4 s | não | em falta |
| `sfx.card.draw` | `/audio/sfx/card/draw.ogg` | 0,3–0,7 s | não | em falta |
| `sfx.card.place` | `/audio/sfx/card/place.ogg` | 0,2–0,5 s | não | em falta |
| `sfx.card.summon` | `/audio/sfx/card/summon.ogg` | 0,5–1,2 s | não | em falta |
| `sfx.card.draw-failed` | `/audio/sfx/card/draw-failed.ogg` | 0,3–0,8 s | não | em falta |
| `sfx.combat.melee` | `/audio/sfx/combat/melee-01.ogg` | 0,3–0,8 s | não | em falta |
| `sfx.combat.ranged` | `/audio/sfx/combat/ranged-01.ogg` | 0,3–0,9 s | não | em falta |
| `sfx.combat.impact` | `/audio/sfx/combat/impact.ogg` | 0,2–0,6 s | não | em falta |
| `sfx.combat.block` | `/audio/sfx/combat/block.ogg` | 0,3–0,7 s | não | em falta |
| `sfx.combat.destroy` | `/audio/sfx/combat/destroy.ogg` | 0,8–1,5 s | não | em falta |
| `sfx.soul.gain` | `/audio/sfx/soul/gain.ogg` | 0,4–1,0 s | não | em falta |
| `sfx.soul.spend` | `/audio/sfx/soul/spend.ogg` | 0,3–0,8 s | não | em falta |
| `sfx.player.damage` | `/audio/sfx/player/damage.ogg` | 0,2–0,6 s | não | em falta |

O manifesto também reserva `melee-02/03.ogg` e `ranged-02.ogg` como variações. Masters devem ser entregues em WAV; a distribuição deve ter OGG e MP3 quando a ferramenta de produção os disponibilizar.

## 3. Música

### `music.menu` — Whispers of the Fallen Kingdom

Ambiente sombrio de castelo abandonado, cordas graves, coro sem palavras, sinos distantes e evolução lenta. Deve criar mistério sem impactos fortes e terminar num loop sem corte audível.

Prompt de produção:

> Original dark fantasy medieval orchestral ambience for a gothic card strategy game. Ancient ruined kingdom at night, distant wordless choir, deep cellos, low strings, subtle medieval instruments, haunting bells, mystical atmosphere, slow evolving cinematic composition, melancholic and mysterious, restrained dynamics, immersive seamless loop, instrumental only, no modern electronic drums, no vocals, no recognizable existing melodies.

### `music.battle` — The Last Covenant

Tema de combate estratégico com tensão gradual, cordas, percussão medieval contida e coro sombrio. Deve suportar vários turnos sem ficar agressivo ou repetitivo.

Prompt de produção:

> Original epic dark fantasy orchestral battle soundtrack for a medieval tactical card game. Deep cinematic strings, restrained war drums, ancient wordless choir, ominous brass, mystical atmosphere, tense strategic pacing, gradual intensity, gothic ruined castle setting, powerful but controlled, seamless looping battle music, instrumental only, no modern electronic beats, no identifiable existing compositions.

### `music.victory` — Crown of Ashes

Triunfo solene e melancólico, com abertura marcante, cordas ascendentes e coro discreto. Deve terminar naturalmente no ecrã de resultado.

### `music.defeat` — The Fading Soul

Queda elegante e melancólica, com cello grave, coro distante e sinos fúnebres subtis. Deve terminar suavemente sem excesso dramático.

O lobby e o tutorial reutilizam `music.menu`; não há faixas adicionais previstas.

## 4. Efeitos sonoros

Os prompts abaixo são briefings de produção original, não assets concluídos.

| ID | Briefing/prompt resumido |
|---|---|
| `sfx.ui.hover` | toque curto, discreto e arcano para passagem sobre botão |
| `sfx.ui.click` | clique táctil de metal/pedra, curto e legível |
| `sfx.card.select` | seleção de carta com brilho mágico suave |
| `sfx.card.draw` | carta de pergaminho a sair de baralho medieval com shimmer subtil |
| `sfx.card.place` | carta encantada pousada num tabuleiro de pedra antiga |
| `sfx.card.summon` | selo arcano, pulso profundo e energia violeta a emergir |
| `sfx.card.draw-failed` | pulso mágico oco e eco espectral de uma compra vazia |
| `sfx.combat.melee` | lâmina pesada a cortar o ar, com 2–3 variações e final limpo |
| `sfx.combat.ranged` | corda de arco, projétil veloz e rasto violeta subtil |
| `sfx.combat.impact` | colisão curta de aço contra armadura/escudo, com transient forte |
| `sfx.combat.block` | golpe contra escudo antigo reforçado, sem destruição |
| `sfx.combat.destroy` | crack místico, fragmentação e energia espectral a dissipar-se |
| `sfx.soul.gain` | absorção de energia espiritual com brilho ascendente e chime etéreo |
| `sfx.soul.spend` | energia espectral consumida num ritual, com ressonância descendente |
| `sfx.player.damage` | pulso grave sobrenatural, distinto da destruição de uma carta |

Ganhar e gastar Soul devem parecer provenientes da mesma fonte mágica, mas com direções melódicas opostas. Os sons de melee, ranged, impacto e destruição devem ser marcadores distintos para a timeline visual.

## 5. Contextos e eventos

O manifesto reserva estes contextos musicais:

| Contexto | Música |
|---|---|
| menu | `music.menu` |
| lobby | `music.menu` |
| tutorial | `music.menu` |
| batalha local/online | `music.battle` |
| resultado vencedor | `music.victory` |
| resultado derrotado | `music.defeat` |

Os eventos oficiais já existentes podem receber bindings quando existir Audio Manager:

- `card-drawn` → `sfx.card.draw`;
- `card-invoked` → `sfx.card.summon`;
- `card-retired` → `sfx.card.place`;
- `draw-failed` → `sfx.card.draw-failed`, seguido do feedback efetivo de Soul ou HP;
- `card-destroyed` → `sfx.combat.destroy`;
- `souls-gained` → `sfx.soul.gain`;
- `souls-spent` → `sfx.soul.spend`;
- `damage-dealt` → `sfx.player.damage`.

Os marcadores de swing melee, lançamento ranged, impacto e bloqueio pertencem à timeline visual do combate e ainda não existem como eventos de domínio. Não devem ser inferidos de qualquer renderização React genérica.

## 6. Mixagem e volume

O manifesto reserva esta mixagem inicial, sujeita a avaliação auditiva:

```text
master: 1.00
music:  0.35
sfx:    0.80
ui:     0.65
muted:  false
```

Cada asset também possui ganho relativo próprio. O futuro Audio Manager deve aplicar `master × bus × asset`, expor mute sem alterar o estado do jogo e evitar que uma transição mantenha duas músicas ativas.

## 7. Integração pendente

Para concluir a integração será necessário:

1. escolher uma ferramenta/fornecedor de produção original;
2. gerar ou fornecer os masters WAV;
3. verificar licenças e preencher a rastreabilidade;
4. exportar OGG/MP3 sem clipping e sem silêncio inicial indevido;
5. adicionar os ficheiros nos caminhos do manifesto;
6. aprovar um Audio Manager único para carregar, fazer cache, tocar, parar, fazer loop e aplicar volumes;
7. ligar os eventos oficiais e os marcadores da timeline;
8. validar menu, lobby, tutorial, PvP Local, PvE, PvP Online e resultados.

O PvP Online deverá reproduzir áudio localmente a partir dos snapshots/eventos autorizados; o servidor não deve transportar nem decidir áudio.

## 8. Direitos e rastreabilidade

Nenhum asset foi incluído, logo nenhum ficheiro possui ainda origem ou licença aprovada. Para cada entrega futura registar:

| Campo | Estado |
|---|---|
| nome do ficheiro | pendente |
| origem/ferramenta | pendente |
| autor/fornecedor | pendente |
| licença | pendente |
| atribuição | pendente |
| restrições de distribuição | pendente |
| master e versão exportada | pendente |

Não adicionar música comercial, gravações copiadas de outros jogos ou ficheiros de origem desconhecida.

## 9. Testes e verificação

Implementado nesta fase:

- teste técnico do manifesto para IDs únicos, caminhos, mappings e estado `missing`;
- tipagem explícita de contextos, buses, ganhos, durações sugeridas e formatos;
- nenhum carregamento de ficheiros inexistentes no frontend.

Ainda pendente:

- reprodução real no browser;
- equilíbrio de volumes;
- qualidade dos loops;
- sincronização de swing/impacto/destruição com o combate;
- mute e controlos de volume visíveis;
- verificação auditiva humana;
- teste de sobreposição com velocidade 2× e salto de animações.

Os testes técnicos do projeto continuam a ser executados com `npm run lint`, `npm run typecheck`, `npm run test:ci` e `npm run build`. A aprovação auditiva só poderá ser declarada depois de existirem assets reais.

## 10. Limitações conhecidas

- não há produção musical ou de efeitos concluída nesta entrega;
- não há Audio Manager para reutilizar ou integrar;
- o manifesto é um contrato de preparação, não um catálogo de ficheiros existentes;
- não foram introduzidas dependências ou serviços externos de geração de áudio;
- não foram alteradas regras, eventos normativos ou o motor SOULS.
