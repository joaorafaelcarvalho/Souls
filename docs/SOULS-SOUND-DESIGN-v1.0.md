# SOULS — Sound Design v1.0

## Estado da entrega

Esta entrega contém a infraestrutura de reprodução, a integração com os acontecimentos existentes e uma seleção de assets de áudio reais com licenças confirmadas.

A auditoria confirmou:

- Audio Manager centralizado em `apps/web/src/shared/audio/audioManager.ts`;
- provider React persistente, controlos de volume/mute e preferências locais;
- callbacks de áudio nos controladores local, online, tutorial e na timeline de combate;
- Os 19 IDs têm assets licenciados integrados. O menu usa o loop CC0 `Dark Place`; combate, vitória e derrota usam as faixas CC-BY correspondentes.

Não existe uma ferramenta de conversão de áudio disponível nesta sessão. Por isso, foram mantidos os formatos originais (OGG, MP3 e WAV), sem criar ficheiros vazios ou música sintética. A licença e a rastreabilidade estão em [SOULS-AUDIO-LICENSES.md](../SOULS-AUDIO-LICENSES.md); a implementação técnica está descrita em [SOULS-AUDIO-ENGINE-v1.0-implementation.md](./SOULS-AUDIO-ENGINE-v1.0-implementation.md).

O manifesto tipado está em [audioManifest.ts](../apps/web/src/shared/audio/audioManifest.ts) e os seus testes verificam IDs, caminhos, bindings e estados `ready`/`missing`.

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

Os caminhos abaixo são os destinos web em `apps/web/public`. Os assets disponíveis estão marcados como `ready`, com licença e origem no manifesto.

| ID | Caminho de distribuição | Duração sugerida | Loop | Estado |
|---|---|---:|:---:|---|
| `music.menu` | `/audio/music/menu.ogg` | 90–150 s | sim | CC0 / disponível; Dark Place |
| `music.battle` | `/audio/music/battle-theme.mp3` | 240–300 s | sim | CC-BY 4.0 / disponível; duração observada 248,21 s |
| `music.victory` | `/audio/music/victory-theme.mp3` | 90–150 s | não | CC-BY 3.0 / disponível; duração observada 117,87 s |
| `music.defeat` | `/audio/music/defeat-theme.mp3` | 60–90 s | não | CC-BY 3.0 / disponível; duração observada 77,15 s |
| `sfx.ui.hover` | `/audio/sfx/ui/hover.ogg` | 0,1–0,2 s | não | CC0 / disponível |
| `sfx.ui.click` | `/audio/sfx/ui/click.ogg` | 0,1–0,3 s | não | CC0 / disponível |
| `sfx.card.select` | `/audio/sfx/card/select.ogg` | 0,2–0,4 s | não | CC0 / disponível |
| `sfx.card.draw` | `/audio/sfx/card/draw.ogg` | 0,3–0,7 s | não | CC0 / disponível |
| `sfx.card.place` | `/audio/sfx/card/place.ogg` | 0,2–0,5 s | não | CC0 / disponível |
| `sfx.card.summon` | `/audio/sfx/card/summon.ogg` | 0,5–1,2 s | não | CC0 / disponível |
| `sfx.card.draw-failed` | `/audio/sfx/card/draw-failed.ogg` | 0,3–0,8 s | não | CC0 / disponível |
| `sfx.combat.melee` | `/audio/sfx/combat/melee-01.ogg` | 0,3–0,8 s | não | CC0 / disponível |
| `sfx.combat.ranged` | `/audio/sfx/combat/ranged-01.wav` | 0,3–0,9 s | não | CC0 / disponível |
| `sfx.combat.impact` | `/audio/sfx/combat/impact.ogg` | 0,2–0,6 s | não | CC0 / disponível |
| `sfx.combat.block` | `/audio/sfx/combat/block.ogg` | 0,3–0,7 s | não | CC0 / disponível |
| `sfx.combat.destroy` | `/audio/sfx/combat/destroy.ogg` | 0,8–1,5 s | não | CC0 / disponível |
| `sfx.soul.gain` | `/audio/sfx/soul/gain.ogg` | 0,4–1,0 s | não | CC0 / disponível |
| `sfx.soul.spend` | `/audio/sfx/soul/spend.ogg` | 0,3–0,8 s | não | CC0 / disponível |
| `sfx.player.damage` | `/audio/sfx/player/damage.ogg` | 0,2–0,6 s | não | CC0 / disponível |

O manifesto inclui três variantes melee e três variantes ranged. Os efeitos ranged permanecem em WAV porque não havia conversor local disponível; o browser suporta o formato e a origem CC0 está registada.

## 3. Música

### `music.menu` — Dark Place (loop)

Loop ambiente oficial de SkyleTheFrench, usado no menu principal, lobby e tutorial. A faixa original `dark_place.ogg` foi mantida sem conversão e é reproduzida em loop através do Audio Manager.

### `music.battle` — Dark Souls Type Boss Theme

Tema de combate oficial selecionado para as partidas, composto por Philémon Weber (ProjectHelmet / Helmet) e utilizado sem conversão. O loop do manifesto fica ativo durante toda a partida e o Audio Manager não o reinicia por turnos, fases ou animações.

### `music.victory` — The Precipice of Victory

Faixa oficial de resultado composta por Jonathan Shaw (InspectorJ), reproduzida uma vez quando a vitória oficial do jogador local é confirmada. A licença CC-BY 3.0 e a atribuição estão registadas em [SOULS-AUDIO-LICENSES.md](../SOULS-AUDIO-LICENSES.md).

### `music.defeat` — The Fallen

Faixa oficial de resultado composta por Jonathan Shaw (InspectorJ), reproduzida uma vez quando a derrota oficial do jogador local é confirmada. A licença CC-BY 3.0 e a atribuição estão registadas em [SOULS-AUDIO-LICENSES.md](../SOULS-AUDIO-LICENSES.md).

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

Os eventos oficiais existentes usam os bindings do Audio Manager:

- `card-drawn` → `sfx.card.draw`;
- `card-invoked` → `sfx.card.place`;
- `card-retired` → `sfx.card.place`;
- `draw-failed` → `sfx.card.draw-failed`, seguido do feedback efetivo de Soul ou HP;
- `card-destroyed` → `sfx.combat.destroy`;
- `souls-gained` → `sfx.soul.gain`;
- `souls-spent` → `sfx.soul.spend`; quando a razão é `invocation`, acrescenta `sfx.card.summon`;
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

Cada asset também possui ganho relativo próprio. O Audio Manager aplica `master × bus × asset`, expõe mute sem alterar o estado do jogo e evita que uma transição mantenha duas músicas ativas.

## 7. Pendências de produção e validação

Para concluir a primeira entrega sonora será necessário:

1. validar auditivamente menu, lobby, tutorial, PvP Local, PvE, PvP Online e resultados;
2. ajustar a mixagem, os loops e os sons ranged após a avaliação humana;
3. converter WAV quando existir uma ferramenta aprovada, sem substituir os originais licenciados.

O PvP Online deverá reproduzir áudio localmente a partir dos snapshots/eventos autorizados; o servidor não deve transportar nem decidir áudio.

## 8. Direitos e rastreabilidade

Os 19 assets disponíveis estão registados individualmente em [SOULS-AUDIO-LICENSES.md](../SOULS-AUDIO-LICENSES.md), com origem, autor, URL da página, ficheiro original, licença e destino no projeto.

Não adicionar música comercial, gravações copiadas de outros jogos ou ficheiros de origem desconhecida.

## 9. Testes e verificação

Implementado nesta fase:

- teste técnico do manifesto para IDs únicos, caminhos, mappings e estado `missing`;
- verificação de 19 assets `ready` com origem OpenGameArt e licença confirmada;
- tipagem explícita de contextos, buses, ganhos, durações sugeridas e formatos;
- carregamento controlado, cache, reprodução, crossfade, volumes, mute, autoplay pendente e diagnóstico no Audio Manager;
- integração dos eventos oficiais e dos marcadores da timeline de combate, incluindo cancelamento por salto.

Ainda pendente:

- avaliação auditiva humana no browser;
- equilíbrio de volumes;
- qualidade dos loops;
- sincronização de swing/impacto/destruição com o combate;
- mute e controlos de volume visíveis;
- teste de sobreposição com velocidade 2× e salto de animações.

Os testes técnicos do projeto continuam a ser executados com `npm run lint`, `npm run typecheck`, `npm run test:ci` e `npm run build`. A aprovação auditiva só poderá ser declarada depois de existirem assets reais.

## 10. Limitações conhecidas

- a seleção inicial ainda precisa de avaliação auditiva e eventual substituição;
- os WAV ranged não foram convertidos por falta de ferramenta local;
- não foram introduzidas dependências ou serviços externos de geração de áudio;
- não foram alteradas regras, eventos normativos ou o motor SOULS.
