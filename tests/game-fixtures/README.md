# Fixtures portáteis do game-core

Esta pasta contém dados JSON independentes da linguagem para futura verificação de conformidade entre o motor TypeScript e uma implementação Dart.

O primeiro recorte cobre `resolveColumnAttack`, porque é uma operação determinística, não depende de React/DOM e permite validar a ordem oficial de defesa, melee, ranged, destruição, dano e Souls sem duplicar o catálogo.

Os resultados foram transcritos dos testes oficiais existentes em [`packages/game-core/tests/combat.test.ts`](../../packages/game-core/tests/combat.test.ts). Não são um novo conjunto de regras.

Validação atual:

```text
npm run fixtures:validate
```

O comando compila o `game-core`, lê todos os JSONs `kind: combat-column` e compara o resultado serializado do motor atual com `expected`. O script é Node-only, não é importado pelo browser e não altera os fixtures.

Expansões futuras seguras:

- adicionar cenários de compra falhada, Souls e retirada com um formato de estado inicial explicitamente versionado;
- manter comandos, aleatoriedade e eventos esperados em JSON;
- executar os mesmos arquivos numa implementação Dart quando ela existir;
- não extrair valores de regras por conveniência nem aceitar divergências sem revisão normativa.
