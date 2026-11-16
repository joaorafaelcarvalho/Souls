# Persistência backend

## Estado atual

Não existe base de dados, ORM, migração, cache ou armazenamento de partidas. O endpoint de health não depende de persistência.

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