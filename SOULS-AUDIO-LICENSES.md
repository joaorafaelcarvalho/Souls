# SOULS — Licenças e créditos de áudio

## Estado da verificação

Verificação e download realizados em 21 de novembro de 2026 a partir das páginas OpenGameArt indicadas nos pedidos. As seis fontes de efeitos sonoros declaram CC0; as quatro músicas integradas usam CC0, CC-BY 4.0 ou CC-BY 3.0, com atribuição mantida quando aplicável. O [FAQ do OpenGameArt](https://opengameart.org/content/faq) explica as obrigações de atribuição das licenças CC-BY. O projeto mantém os links e os textos de atribuição para rastreabilidade.

Este registo não substitui aconselhamento jurídico. Cada distribuição deve manter este ficheiro junto do código e dos assets.

## Packs verificados e descarregados

| Recurso | Autor | Licença declarada | Ficheiro/packs descarregados | Inventário |
|---|---|---|---|---|
| [Dark Place (loop)](https://opengameart.org/content/dark-place-loop) | SkyleTheFrench | CC0 | `dark_place.ogg` | 1 OGG |
| [Battle Theme B for RPG](https://opengameart.org/content/battle-theme-b-for-rpg) | cynicmusic | CC0 | `battleThemeB.mp3` | 1 MP3 |
| [20 Sword Sound Effects](https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes) | StarNinjas | CC0 | `sword_-_starninjas_1.zip`, `sword_clash_-_starninjas_0.zip` | 10 ataques OGG + 10 clashes OGG |
| [10 Impact/Shield Blocks](https://opengameart.org/content/10-impactshield-blocks) | StarNinjas | CC0 | `impact_-_starninjas.zip` | 10 impactos OGG |
| [Fantasy Weapons and Apparel SFX Library](https://lpc.opengameart.org/content/fantasy-weapons-and-apparel-sfx-library) | Vehicle | CC0 | `weapons-apparel.zip` | 126 WAV + 1 preview OGG |
| [80 CC0 RPG SFX](https://opengameart.org/content/80-cc0-rpg-sfx) | rubberduck | CC0 | `80-CC0-RPG-SFX_0.zip` | 80 OGG |
| [Dark Souls Type Boss Theme](https://opengameart.org/content/dark-souls-type-boss-theme) | Philémon Weber (ProjectHelmet / Helmet) | CC-BY 4.0 | `helmet-quest-of-the-elf_s-scrolls-06-boss-theme-arcanos_-sorcerer-of-the-old-banished-woods_0.mp3` | 1 MP3 |
| [The Precipice of Victory](https://opengameart.org/content/the-precipice-of-victory-rpg-orchestral-essentials-battle-results-music) | Jonathan Shaw (InspectorJ) | CC-BY 3.0 | `The Precipice of Victory MP3.zip` | 1 MP3 + documentação de atribuição |
| [The Fallen](https://opengameart.org/content/the-fallen-rpg-orchestral-essentials-defeated-music) | Jonathan Shaw (InspectorJ) | CC-BY 3.0 | `The Fallen MP3_0.zip` | 1 MP3 + documentação de atribuição |

Os packs foram extraídos numa pasta temporária. Apenas os ficheiros selecionados na tabela seguinte foram copiados para `apps/web/public/audio`; os restantes não foram adicionados ao repositório. O pack Dark Place foi verificado, descarregado e integrado como `music.menu`, sem conversão.

## Ficheiros integrados

| ID do manifesto | Ficheiro no projeto | Ficheiro original | Autor | Licença |
|---|---|---|---|---|
| `music.menu` | `apps/web/public/audio/music/menu.ogg` | `dark_place.ogg` | SkyleTheFrench | CC0 |
| `music.battle` | `apps/web/public/audio/music/battle-theme.mp3` | `helmet-quest-of-the-elf_s-scrolls-06-boss-theme-arcanos_-sorcerer-of-the-old-banished-woods_0.mp3` | Philémon Weber (ProjectHelmet / Helmet) | CC-BY 4.0 |
| `music.victory` | `apps/web/public/audio/music/victory-theme.mp3` | `The Precipice of Victory MP3.mp3` | Jonathan Shaw (InspectorJ) | CC-BY 3.0 |
| `music.defeat` | `apps/web/public/audio/music/defeat-theme.mp3` | `The Fallen MP3.mp3` | Jonathan Shaw (InspectorJ) | CC-BY 3.0 |
| `sfx.ui.hover` | `apps/web/public/audio/sfx/ui/hover.ogg` | `item_misc_01.ogg` | rubberduck | CC0 |
| `sfx.ui.click` | `apps/web/public/audio/sfx/ui/click.ogg` | `metal_01.ogg` | rubberduck | CC0 |
| `sfx.card.select` | `apps/web/public/audio/sfx/card/select.ogg` | `item_gem_01.ogg` | rubberduck | CC0 |
| `sfx.card.draw` | `apps/web/public/audio/sfx/card/draw.ogg` | `book_01.ogg` | rubberduck | CC0 |
| `sfx.card.place` | `apps/web/public/audio/sfx/card/place.ogg` | `item_wood_01.ogg` | rubberduck | CC0 |
| `sfx.card.summon` | `apps/web/public/audio/sfx/card/summon.ogg` | `spell_01.ogg` | rubberduck | CC0 |
| `sfx.card.draw-failed` | `apps/web/public/audio/sfx/card/draw-failed.ogg` | `lock_01.ogg` | rubberduck | CC0 |
| `sfx.combat.melee` | `apps/web/public/audio/sfx/combat/melee-01.ogg` | `sword.1.ogg` | StarNinjas | CC0 |
| `sfx.combat.melee` variant | `apps/web/public/audio/sfx/combat/melee-02.ogg`, `melee-03.ogg` | `sword.2.ogg`, `sword.3.ogg` | StarNinjas | CC0 |
| `sfx.combat.ranged` | `apps/web/public/audio/sfx/combat/ranged-01.wav` | `arrow-feathers-01.wav` | Vehicle | CC0 |
| `sfx.combat.ranged` variants | `apps/web/public/audio/sfx/combat/ranged-02.wav`, `ranged-03.wav` | `arrow-feathers-02.wav`, `arrow-feathers-03.wav` | Vehicle | CC0 |
| `sfx.combat.impact` | `apps/web/public/audio/sfx/combat/impact.ogg` | `impact.1.ogg` | StarNinjas | CC0 |
| `sfx.combat.block` | `apps/web/public/audio/sfx/combat/block.ogg` | `sword_clash.1.ogg` | StarNinjas | CC0 |
| `sfx.combat.destroy` | `apps/web/public/audio/sfx/combat/destroy.ogg` | `spell_fire_01.ogg` | rubberduck | CC0 |
| `sfx.soul.gain` | `apps/web/public/audio/sfx/soul/gain.ogg` | `item_gem_02.ogg` | rubberduck | CC0 |
| `sfx.soul.spend` | `apps/web/public/audio/sfx/soul/spend.ogg` | `spell_02.ogg` | rubberduck | CC0 |
| `sfx.player.damage` | `apps/web/public/audio/sfx/player/damage.ogg` | `creature_hurt_01.ogg` | rubberduck | CC0 |

## Atribuições obrigatórias

Os textos de atribuição indicados nas páginas/arquivos dos autores são mantidos desta forma:

- `"Dark Place (loop)"` — SkyleTheFrench, CC0; atribuição opcional segundo a página original.
- `"Dark souls type boss theme"` — Philémon Weber (Helmet), licenciado sob [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- `"The Precipice of Victory"` — Composed by Jonathan Shaw (www.jshaw.co.uk), licenciado sob [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- `"The Fallen"` — Composed by Jonathan Shaw (www.jshaw.co.uk), licenciado sob [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/).

Os ficheiros foram apenas copiados/extraídos e renomeados para os destinos do manifesto. Não foram convertidos, normalizados ou editados.

## Checksums dos ficheiros musicais

| Ficheiro no projeto | SHA-256 |
|---|---|
| `apps/web/public/audio/music/menu.ogg` | `C78A433139ACE4A050B5D4A1B9B94BCF1F04D059345C849C7C234A2FE0EDA102` |
| `apps/web/public/audio/music/battle-theme.mp3` | `9850019376D71F4E0088850476D5552B22333EE5649DE95531601856CAED1E81` |
| `apps/web/public/audio/music/victory-theme.mp3` | `8C2D6E9EC3FCE4417974ECFF1A63706A0FD9FFF95AB1554633478138F9B1346A` |
| `apps/web/public/audio/music/defeat-theme.mp3` | `D90A8FACC55581AAA0EB41F762748C3139D9F19512DAF282E552C48F3C960B92` |

## Estado do menu

`music.menu` está integrado a partir de `dark_place.ogg`, em loop, com licença CC0 confirmada. Nenhum ficheiro artificial ou convertido foi criado.

## Conversão e formato

Não havia `ffmpeg`, `sox`, `lame` ou `oggenc` disponível no ambiente. Os OGG/MP3 foram mantidos nos formatos originais; os três efeitos de arco foram mantidos em WAV, que é reproduzível pelo browser, e o manifesto passou a declarar `wav` como formato de distribuição aceito. Não foram criados ficheiros vazios nem foi alterado o conteúdo binário dos assets.

## Tentativas de download

Os downloads finais foram concluídos. Duas variantes de URL inicialmente inferidas devolveram 404 e foram corrigidas a partir dos links presentes no HTML original:

- `sword_clash_-_starninjas.zip` → `sword_clash_-_starninjas_0.zip`;
- `80-CC0-RPG-SFX.zip` → `80-CC0-RPG-SFX_0.zip`.

Não foram utilizados ficheiros obtidos por URLs alternativos sem confirmação na página do recurso.

## Qualidade pendente

Os sons estão integrados tecnicamente, mas a avaliação auditiva humana ainda deve confirmar:

- se `arrow-feathers` funciona como lançamento ranged ou precisa de um som de arco mais explícito;
- se os sons de UI/cartas mantêm coerência com a identidade Dark Fantasy;
- se os níveis relativos e os loops de menu/batalha precisam de ajuste;
- se os fades e níveis relativos entre combate, vitória e derrota precisam de ajuste após avaliação humana.
