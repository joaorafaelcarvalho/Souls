# Catálogo de cartas

## Objetivo

O catálogo permite adicionar cartas através de ficheiros JSON independentes, sem modificar o motor de combate nem manter uma lista manual de imports.

A implementação está em [packages/game-content](../packages/game-content).

## Cartas atuais

O catálogo contém as cinco definições originais e vinte novas definições da [Card Expansion v1](./card-expansion-v1.md). As cinco originais permanecem preservadas; as novas cartas usam um placeholder de arte até existir ilustração definitiva.

| Nome | Tipo | Nível | ATK | DEF |
| --- | --- | ---: | ---: | ---: |
| Cavaleiro | melee | 0 | 500 | 500 |
| Arqueiro | ranged | 0 | 500 | 0 |
| Defensor | melee | 0 | 0 | 1000 |
| Mago | ranged | 0 | 500 | 0 |
| Cavaleiro Negro | melee | 1 | 700 | 500 |

O catálogo contém atualmente 26 definições, incluindo a adição narrativa `Matriarca dos Selos`. Os níveis e valores são os dados reais dos JSONs; em particular, o `Cavaleiro Negro` original permanece nível 1 no repositório.

Os níveis 0 e os valores acima são fixtures temporárias para esta fase de teste. Não constituem balanceamento final. Não foram adicionadas habilidades, raridades, descrições ou efeitos especiais.

## Estrutura

```text
packages/
└── game-content/
    ├── cards/
    │   ├── melee/
    │   │   ├── cavaleiro.json
    │   │   ├── defensor.json
    │   │   └── cavaleiro-negro.json
    │   ├── ranged/
    │   │   ├── arqueiro.json
    │   │   └── mago.json
    │   ├── src/
    │   │   ├── catalog/
    │   │   ├── loaders/
    │   │   └── validators/
    │   └── tests/
apps/
└── web/
    └── public/
        └── images/
            └── cards/
                ├── melee/
                └── ranged/
```

## CardDefinition

Uma definição é uma entrada permanente do catálogo:

```json
{
  "id": "0b4e6d2a-1f83-4c57-8a90-2d6f1b3e4a75",
  "name": "Cavaleiro",
  "level": 0,
  "type": "melee",
  "attack": 500,
  "defense": 500,
  "image": "/images/cards/melee/cavaleiro.png"
}
```

Campos:

- `id`: UUID permanente e imutável;
- `name`: nome apresentado;
- `level`: inteiro entre 0 e 4;
- `type`: `melee` ou `ranged`;
- `attack`: ATK não negativo;
- `defense`: DEF não negativo;
- `image`: referência pública usada apenas pela apresentação.

O UUID não é regenerado quando o catálogo é carregado. O nome nunca é chave primária.

## CardInstance

Uma instância é uma cópia concreta usada numa partida:

```ts
interface CardInstance {
  instanceId: string;
  cardDefinitionId: string;
  ownerId: 1 | 2;
}
```

`instanceId` é gerado com `globalThis.crypto.randomUUID()` quando a partida é inicializada. Cada cópia recebe um UUID diferente, mesmo quando várias cópias referenciam a mesma definição.

A mão, o baralho, o tabuleiro e o descarte guardam `instanceId`. A definição é consultada através de `cardDefinitionId`.

## Baralhos

Além de conter exatamente 20 referências a CardDefinitionId, um baralho oficial deve respeitar a distribuição N0=10, N1=4, N2=3, N3=2, N4=1.

Um baralho contém 20 referências a `CardDefinitionId`:

```ts
interface PlayerSetup {
  id: 1 | 2;
  deck: readonly string[];
}
```

A criação da partida e [validateDeckReferences](../packages/game-content/src/validators/validateDeckReferences.ts) verificam que:

- cada baralho tem exatamente 20 referências;
- cada UUID existe no catálogo;
- cada cópia concreta recebe um `instanceId` único;
- não existe ainda limite de cópias da mesma definição.

Além da validação de referências, validateOfficialDeckReferences em packages/game-content/src/validators/officialDeck.ts valida a distribuição oficial por nível. Não há uma regra adicional de cópias por definição nesta fase.

## Carregamento e validação

O frontend usa [loadBrowserCardCatalog](../packages/game-content/src/loaders/loadBrowserCatalog.ts), baseado em `import.meta.glob`. Assim:

- os cinco JSONs são descobertos sem imports manuais;
- novas definições futuras podem ser adicionadas como ficheiros;
- o browser não usa `node:fs`;
- UUIDs, campos, tipos, níveis, valores e referências de imagem são validados;
- UUIDs duplicados provocam erro claro.

O game-core volta a validar as referências quando cria uma partida, mas não carrega JSONs nem imagens.

## Imagens

Cada carta de teste tem uma imagem/placeholder SVG próprio em [apps/web/public/images/cards](../apps/web/public/images/cards):

- Cavaleiro: `melee/cavaleiro.png`;
- Arqueiro: `ranged/arqueiro.png`;
- Defensor: `melee/defensor.png`;
- Mago: `ranged/mago.png`;
- Cavaleiro Negro: `melee/cavaleiro-negro.png`.

O catálogo guarda apenas o caminho. O backend e o motor não carregam nem interpretam imagens.

## Integração das ilustrações

As ilustrações fornecidas foram integradas como PNGs originais, sem recorte ou alteração artística, em [apps/web/public/images/cards](../apps/web/public/images/cards). A definição guarda apenas a referência pública correspondente. Os SVGs técnicos anteriores podem permanecer no diretório como recursos não utilizados, mas não são referenciados pelo catálogo atual.

A referência da imagem é resolvida pelo componente [Card](./components/Card.md) através de CardDefinition.image. Nenhum componente usa o nome da carta para escolher a imagem.
## Como adicionar uma carta futuramente

1. Gere um UUID permanente uma única vez.
2. Crie um JSON na pasta `melee` ou `ranged`.
3. Use apenas os campos aprovados.
4. Adicione uma imagem distinta em `apps/web/public/images/cards`.
5. Referencie a imagem como `/images/cards/<tipo>/<ficheiro>`.
6. Execute:

```powershell
npm run typecheck
npm run test:ci
npm run build
```

7. Para usar a definição num baralho, inclua o UUID na lista de 20 referências.
8. Não use o nome da carta como chave.
9. Não altere game-core nem regras oficiais para registar conteúdo.

## Testes

Os testes do catálogo estão em [packages/game-content/tests](../packages/game-content/tests). Confirmam que o catálogo real contém exatamente as cinco cartas, com atributos corretos, UUIDs únicos e níveis 0 temporários.
