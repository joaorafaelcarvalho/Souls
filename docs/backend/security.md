# Segurança backend

Este documento descreve a segurança da sessão online anónima e os limites que continuam fora do escopo. Não existe autenticação de contas.

## Estado atual

- há `GET /health`, endpoints de sala e WebSocket;
- não há contas de utilizadores;
- há tokens aleatórios de sessão anónima associados a cada participante;
- o código público da sala não autentica nem identifica um jogador;
- o estado não persiste;
- o servidor escuta localmente por omissão em `127.0.0.1`.

Mensagens WebSocket têm limite de tamanho e parser explícito. O servidor valida origem, token, pertença à sala, jogador ativo, partida, versão, fase, IDs de cartas e limites de coordenadas. A visão por jogador exclui mãos, baralhos futuros e descartes privados do adversário.

## Trabalho futuro

Fora do escopo desta versão:

- autenticação de contas e gestão de identidade persistente;
- autorização externa a tokens anónimos de sala;
- rotação/revogação persistente de credenciais;
- observabilidade e auditoria de logs sensíveis;
- limites distribuídos quando existirem várias instâncias;
- HTTPS/WSS e gestão de segredos no deployment.

HTTPS/WSS, gestão de segredos, observabilidade e limites distribuídos devem ser configurados no deployment. O token de sessão não é uma conta nem uma credencial reutilizável depois de a sala expirar.
