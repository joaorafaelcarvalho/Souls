# OnlineRoomScreen

[OnlineRoomScreen](../../apps/web/src/features/online/presentation/OnlineRoomScreen.tsx) apresenta a entrada do PvP Online e o lobby privado.

## Responsabilidades

- criar uma sala através de `POST /online/rooms`;
- entrar com um código através de `POST /online/rooms/join`;
- mostrar apenas o estado público de ligação/preparação dos participantes;
- selecionar um baralho local e enviar os seus `CardDefinitionId`;
- confirmar ou cancelar a preparação;
- sair explicitamente da sala.

O componente não cria partidas, não calcula legalidade de combate e não recebe tokens do adversário. A execução da partida pertence ao [useOnlineGame](../../apps/web/src/features/online/application/useOnlineGame.ts) e ao servidor autoritativo.
