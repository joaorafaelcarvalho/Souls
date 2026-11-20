# SOULS — PvP Online v1.0

## 1. Objetivo

Esta implementação acrescenta partidas privadas entre dois clientes através de uma API Fastify autoritativa. O cliente envia intenções; o servidor valida a sessão, a sala, a versão e a ação, executa o [game-core](../packages/game-core) e publica uma projeção autorizada para cada participante.

Não foram alteradas as regras de [SOULS v0.7](./game-rules.md), os atributos do catálogo, o PvP Local, o modo Jogador vs IA ou o Tutorial.

## 2. Arquitetura

```text
React/Vite ── HTTP: criar/entrar ──┐
React/Vite ── WebSocket: comandos ─┼── Fastify / online room service
                                  │       ├── catálogo oficial
                                  │       ├── game-core
                                  │       └── projeção por jogador
                                  └── estado em memória
```

O pacote [game-online](../packages/game-online) contém contratos de rede e a função pura `createAuthorizedGameView`. O `game-core` continua independente de transporte, React, Fastify, DOM e ficheiros.

## 3. Bibliotecas utilizadas

- Fastify, já utilizado pela API;
- `ws` 8.x para o servidor WebSocket persistente;
- APIs nativas de Node para `crypto`, carregamento do catálogo no backend e timers;
- React/Vite e `CombatAnimationSequencer`, já utilizados pelo frontend.

Não foram adicionadas bases de dados, Redis, contas, matchmaking público ou serviços externos.

## 4. Salas

- `POST /online/rooms` cria uma sala e devolve `roomId`, código público e token privado;
- `POST /online/rooms/join` aceita um código válido e associa o segundo participante;
- os códigos têm seis caracteres aleatórios, excluem caracteres ambíguos e só existem enquanto a sala estiver em memória;
- cada sala aceita no máximo dois participantes;
- tentativas de criação/entrada têm um limite simples por IP e janela de um minuto;
- a sala expira após 30 minutos sem atividade, com limpeza periódica do processo.

O código público não é uma credencial de jogador. O token privado é devolvido apenas à resposta que criou/entrou na sala e é enviado no primeiro `hello` do WebSocket, nunca na URL ou nas mensagens públicas.

## 5. Identidades de sessão

Esta versão usa identidades anónimas de sessão, não contas. O token é gerado por `crypto.randomBytes`, associado internamente a `Jogador 1` ou `Jogador 2`, e necessário para reconectar e enviar comandos. Uma segunda ligação com o mesmo token substitui a ligação anterior; uma ligação antiga não pode desligar a nova.

## 6. Baralhos

O cliente envia apenas os 20 `CardDefinitionId` escolhidos no Deck Builder. O servidor valida as referências e a distribuição oficial `10/4/3/2/1` através de `game-content`, guarda uma cópia validada e usa os atributos do catálogo local. ATK, DEF, nível, custo e imagens nunca são aceites do browser.

## 7. Sincronização

Cada partida tem um `matchId` e uma versão monotónica. Um comando de jogo inclui ambos e um `commandId` único. O servidor rejeita uma partida antiga, uma versão antiga, jogador não ativo, fase inválida, payload desconhecido ou ação ilegal. Os `commandId` já processados são lembrados por participante, evitando efeitos duplicados por reenvio.

As operações da partida são aplicadas de forma síncrona no event loop do servidor. O resultado e os eventos só são publicados depois de o novo estado oficial estar pronto.

## 8. WebSocket

O endpoint é `ws://<host>:<port>/online` em desenvolvimento. O primeiro pacote é:

```json
{ "type": "hello", "roomId": "…", "sessionToken": "…" }
```

Depois do `hello`, o servidor publica `room-updated` e `match-updated`. Os comandos cobertos são seleção/validação de baralho, preparação, posicionamento, retirada, fim de posicionamento, compras, ataque, revanche e saída. O cliente reconecta automaticamente a mesma sessão após uma quebra temporária.

## 9. Segurança e privacidade

Cada cliente recebe `AuthorizedGameView` própria. A mão, instâncias e baralho futuro do adversário não atravessam a mensagem de rede. Os eventos de compra adversária omitem o `instanceId`; eventos de combate só referenciam cartas que já estavam públicas no tabuleiro. Reconexões recebem a mesma projeção filtrada.

O servidor valida tamanho e forma das mensagens, origem CORS configurada, sala, token, participante, fase, turno, versão e comando. O servidor não aceita HP, Souls, dano, vencedor, atributos ou estado enviados pelo browser.

## 10. Fluxo completo

1. O cliente cria ou entra numa sala por HTTP.
2. O cliente abre o WebSocket e autentica o token no `hello`.
3. Cada participante envia um baralho por IDs e marca-se como preparado.
4. Quando ambos estão preparados, o servidor chama `initializeGame`.
5. O servidor distribui as mãos, sorteia a prioridade com uma fonte aleatória segura e publica a primeira visão autorizada.
6. Cada intenção passa pelo `game-core`; o resultado, eventos e traço de combate são enviados a ambos.
7. O frontend reproduz o traço por colunas e atualiza HP durante o playback, sem alterar o resultado oficial.
8. Ao terminar, o servidor publica o resultado oficial e aguarda a revanche consensual.

## 11. Reconexão e abandono

Uma quebra de WebSocket não altera HP, Souls, prioridade ou turno. A sala fica disponível para reconexão até expirar. O frontend tenta reconectar com o mesmo token e recebe um snapshot completo autorizado.

Uma saída explícita encerra a sala online e não é convertida numa vitória por combate. A expiração também produz um encerramento separado. Não há recompensas, ranking ou estatísticas competitivas por abandono.

O estado é exclusivamente em memória: reiniciar o processo perde salas e partidas; não existe recuperação após reinício nem sincronização entre múltiplas instâncias.

## 12. Revanche

Cada participante tem de aceitar a revanche da partida terminada. Só depois das duas aceitações o servidor cria um novo `matchId`, reinicializa HP, Souls, mãos, baralho, tabuleiro, versão e comandos pendentes, mantendo as composições validadas.

## 13. Integração visual

O menu de modos inclui `PVP ONLINE`. Os ecrãs de criação/entrada e lobby reutilizam o fundo, tipografia, painéis e botões existentes. A partida usa o mesmo `GameBoard`, `PlayerHand`, `PlayerStatus`, log, regras e resultado. A perspetiva do tabuleiro inverte a ordem visual das linhas quando o cliente é o Jogador 2, sem modificar as coordenadas oficiais.

## 14. Ficheiros principais

- [packages/game-online/src/index.ts](../packages/game-online/src/index.ts): projeção autorizada e protocolo;
- [apps/api/src/modules/online/application/onlineRoomService.ts](../apps/api/src/modules/online/application/onlineRoomService.ts): salas, sessões, partidas e comandos;
- [apps/api/src/modules/online/interfaces/registerOnlineWebSocket.ts](../apps/api/src/modules/online/interfaces/registerOnlineWebSocket.ts): transporte WebSocket;
- [apps/api/src/modules/online/interfaces/registerOnlineRoutes.ts](../apps/api/src/modules/online/interfaces/registerOnlineRoutes.ts): criação/entrada HTTP;
- [apps/api/src/modules/online/infrastructure/loadServerCardCatalog.ts](../apps/api/src/modules/online/infrastructure/loadServerCardCatalog.ts): catálogo oficial no processo servidor;
- [apps/web/src/features/online/application/useOnlineGame.ts](../apps/web/src/features/online/application/useOnlineGame.ts): adaptador React e reconexão;
- [apps/web/src/features/online/presentation/OnlineRoomScreen.tsx](../apps/web/src/features/online/presentation/OnlineRoomScreen.tsx): seleção, entrada e lobby;
- [.env.example](../.env.example): configuração local de API, CORS e WebSocket.

## 15. Testes realizados

- testes de salas: criação, entrada, terceiro participante, códigos inválidos, baralho inválido, privacidade, partida autoritativa, duplicação, versão antiga e expiração;
- teste HTTP + WebSocket real com `server.listen`, criação de sala, `hello` autenticado e verificação de que o token não é devolvido na mensagem;
- regressão da suíte frontend e dos pacotes existentes;
- lint e typecheck dos módulos alterados.

O teste visual com dois browsers independentes e a validação entre dois computadores ainda requer execução manual com dois processos de frontend apontados para o mesmo servidor.

## 16. Configuração e comandos

Copiar [.env.example](../.env.example) para a configuração local equivalente. Em desenvolvimento:

```powershell
npm install
npm run dev:api
npm run dev:web
```

Por omissão, a API escuta `127.0.0.1:3000` e o frontend usa `http://localhost:3000` / `ws://localhost:3000/online`. Para dois computadores, iniciar a API com `HOST=0.0.0.0`, definir `WEB_ORIGIN` para a origem do frontend e apontar `VITE_API_URL`/`VITE_WS_URL` para o endereço acessível da máquina servidor. A firewall e a rede local continuam a ser responsabilidade do ambiente.

## 17. Deployment

Em produção, colocar a API num processo persistente com suporte a HTTP Upgrade/WebSocket, configurar HTTPS/WSS e uma origem explícita. Uma hospedagem Vite estática sozinha não fornece o servidor multiplayer. A implementação atual aceita um único processo e memória local; escalabilidade horizontal exige uma decisão futura sobre armazenamento e coordenação.

## 18. Limitações conhecidas

- não existe persistência após reinício;
- não existe autenticação de contas, matchmaking público, ranking, chat ou serviços externos;
- não há política de vitória por desconexão no `game-core`;
- o catálogo de servidor é lido do workspace no arranque da API, não é consultado remotamente;
- a reconexão cobre quebra temporária enquanto o processo continua vivo;
- a validação de dois clientes em browsers reais permanece um passo manual ainda não executado por esta entrega.
