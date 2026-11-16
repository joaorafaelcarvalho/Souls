# Desenvolvimento local

Este guia descreve o processo de desenvolvimento da fundação local do SOULS. O projeto não define nesta fase processos de GitHub, branches, commits ou Pull Requests.

## Preparar o ambiente

1. Instale Node.js 24 e npm.
2. Na raiz, execute `npm install`.
3. Confirme que os comandos de qualidade funcionam antes de iniciar uma alteração.

```powershell
npm install
npm run typecheck
npm run test:ci
```

## Organização

- `apps/web`: apresentação React, composição da aplicação, mocks de apresentação e estilos.
- `apps/api`: Fastify, configuração e interfaces HTTP.
- `packages/game-core`: modelos e regras puras do jogo.
- `docs`: decisões, regras e contratos documentados.

Funcionalidades frontend futuras devem ser organizadas por domínio funcional em `src/features`. Uma feature deve conter apenas as camadas necessárias.

## Convenções

- Use nomes em inglês no código, seguindo a nomenclatura dos contratos do domínio.
- Use nomes de ficheiros coerentes com o símbolo principal.
- Use `PascalCase` para componentes e tipos, `camelCase` para funções e valores.
- Use imports de tipo explícitos quando o símbolo for usado apenas como tipo.
- Prefira unions discriminadas e composição a hierarquias de classes.
- Evite exportar uma função cujo comportamento ainda não esteja implementado.
- Mantenha strings de interface em português apenas quando fizerem parte da apresentação atual; os contratos do código permanecem claros e estáveis.

## Processo de implementação local

1. Leia as instruções em [AGENTS.md](./AGENTS.md) e a documentação relevante.
2. Confirme se a alteração é uma regra oficial, uma decisão arquitetural ou uma implementação local.
3. Atualize primeiro os contratos necessários.
4. Implemente a regra no game-core quando for comportamento do jogo.
5. Mantenha API e frontend como consumidores do motor, não como duplicações.
6. Adicione testes para o comportamento real.
7. Atualize documentação e changelog.
8. Execute lint, typecheck, testes e build.

## Componentes React

Para adicionar um componente:

- coloque-o na feature ou área partilhada correta;
- defina props tipadas e uma responsabilidade única;
- mantenha decisões de jogo fora do componente;
- use CSS Modules e tokens `--souls-*`;
- adicione ou atualize a ficha em [docs/components](./docs/components/README.md);
- crie um teste de composição quando o risco justificar.

## Adicionar uma carta

Para adicionar uma carta, leia [docs/cards.md](./docs/cards.md), crie um JSON com UUID permanente em [packages/game-content/cards](./packages/game-content/cards), adicione a imagem em [apps/web/public/images/cards](./apps/web/public/images/cards) e execute as verificações. Os baralhos devem referenciar UUIDs de definições, nunca nomes. Não altere o game-core para registar conteúdo.
## Documentação

- O regulamento completo fica apenas em [docs/game-rules.md](./docs/game-rules.md).
- Documentos operacionais devem referenciar o regulamento em vez de o duplicar.
- Registe distinções entre implementado, planeado e pendente.
- Atualize [docs/decisions.md](./docs/decisions.md) quando houver uma decisão arquitetural aprovada.
- Adicione uma entrada em [CHANGELOG.md](./CHANGELOG.md) para alterações relevantes.

## Comandos de verificação

```powershell
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

No PowerShell, `npm.cmd` pode substituir `npm` se necessário. Para trabalhar com o frontend e a API, use terminais separados:

```powershell
npm run dev:web
npm run dev:api
```

## Propostas arquiteturais

Se uma alteração introduzir uma convenção permanente, uma nova dependência, uma capacidade de rede ou uma mudança das regras, pare antes de a tratar como decisão oficial. Descreva a proposta, o impacto e as alternativas em [docs/decisions.md](./docs/decisions.md) e peça aprovação explícita.