# Persistência backend

## Estado atual

Não existe base de dados, ORM, migração ou cache. O serviço online mantém salas, tokens, baralhos validados, estado e versões apenas em memória.

O reinício do processo encerra todas as salas. A reconexão só funciona enquanto o mesmo processo continua vivo e dentro do período de expiração.

## Direção possível

O brief permite considerar PostgreSQL numa fase posterior. Antes de configurar uma solução será necessário aprovar:

- quais entidades persistem;
- ciclo de vida de uma partida;
- formato e versionamento do estado;
- estratégia de concorrência;
- retenção e eliminação;
- migrações;
- separação entre estado autorizado e eventos;
- testes de recuperação.

Até lá, não criar schema, cliente de base de dados ou repositório fictício.
