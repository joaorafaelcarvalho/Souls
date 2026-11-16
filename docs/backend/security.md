# Segurança backend

Este documento descreve limites e trabalho futuro. Não existe ainda uma implementação de autenticação ou autorização.

## Estado atual

- apenas `GET /health`;
- não há dados de utilizadores;
- não há sessões;
- não há credenciais;
- não há persistência;
- não há WebSockets;
- o servidor escuta localmente por omissão em `127.0.0.1`.

## Trabalho futuro

Antes de aceitar partidas em rede será necessário decidir e documentar:

- autenticação e gestão de identidade;
- autorização sobre intenções e partidas;
- validação de payloads;
- limites de tamanho, frequência e concorrência;
- tratamento de erros sem exposição de dados;
- logs e dados sensíveis;
- origem permitida e política de CORS;
- transporte seguro e gestão de segredos;
- proteção contra reenvio e ordem inválida de ações.

Não introduzir estes mecanismos antecipadamente como se fossem requisitos já aprovados.