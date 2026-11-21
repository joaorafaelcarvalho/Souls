# SOULS — Arquitetura Flutter futura

## Estado

Esta é uma proposta para uma tarefa futura. Não existe `apps/mobile`, não foi instalado Flutter, não foram criados projetos Android/iOS e não há ficheiros Dart artificiais no repositório atual.

Flutter usa Dart e não pode importar diretamente `packages/game-core` ou outro package TypeScript. A futura aplicação deverá escolher entre:

1. modo online, enviando comandos JSON ao backend Node autoritativo;
2. modo offline, depois de existir uma implementação Dart equivalente comprovada por fixtures;
3. uma solução híbrida explicitamente desenhada, sem criar dois motores divergentes por acidente.

## Estrutura recomendada quando o projeto for criado

```text
apps/mobile/
├── android/
├── ios/
├── lib/
│   ├── core/
│   │   ├── config/
│   │   ├── networking/
│   │   ├── persistence/
│   │   └── theme/
│   ├── features/
│   │   ├── main_menu/
│   │   ├── game/
│   │   ├── deck_builder/
│   │   ├── pvp_local/
│   │   ├── pvp_online/
│   │   ├── pve/
│   │   ├── tutorial/
│   │   └── settings/
│   ├── models/                  # modelos manuais somente quando não gerados
│   ├── generated/               # modelos/schemas gerados
│   └── main.dart
├── assets/
├── test/
└── pubspec.yaml
```

Cada feature pode separar `presentation/`, `data/` e `domain/` quando houver complexidade real. Não criar pastas ou classes vazias só para preencher esta árvore.

## Modo online recomendado

```text
Flutter UI
   │ comandos JSON versionados
   ▼
Node/Fastify + WebSocket
   │ valida comandos e executa
   ▼
game-core TypeScript + game-content
   │ snapshots autorizados/eventos
   ▼
Flutter models + estado de apresentação
```

O Flutter não recebe mãos privadas do adversário, não decide vencedor, não calcula dano e não transmite áudio. Deve usar os mesmos formatos de sala, comandos, snapshots, eventos e erros que a Web. A fonte futura desses formatos deve ser JSON Schema/OpenAPI versionado, com tipos Dart/TypeScript gerados ou validados.

Até existir schema formal, o cliente Flutter não deve copiar interfaces TypeScript manualmente sem testes de payload.

## Modo offline futuro

O modo offline exigirá um motor Dart equivalente ou outra solução validada. Não é seguro converter parcialmente `game-core` nem duplicar regras de compra, Souls ou combate dentro de widgets.

Pré-requisitos:

- fixtures JSON de estados iniciais, comandos, aleatoriedade, eventos e estados finais;
- comparação determinística TypeScript/Dart;
- cobertura de compra normal/falhada, 500 HP, Souls, posicionamento, bloqueio, destruição, dano residual, ataque combinado, retirada e vitória;
- política clara para atualizações de regras e versão do motor;
- validação dos mesmos UUIDs, níveis, ATK, DEF e composição de baralhos.

Enquanto esses gates não existirem, o modo online é a opção arquitetural segura.

## Dados e assets

- As cartas atuais já têm JSONs em [`packages/game-content/cards`](../../packages/game-content/cards); no futuro o Flutter deve consumir uma exportação/manifest controlado, não uma segunda edição manual.
- O Flutter deverá receber URLs ou cópias versionadas de imagens, fontes, VFX, música e SFX através de um pipeline de assets ainda não criado.
- O Audio Engine de cada plataforma será diferente: Web usa a infraestrutura em `apps/web`; Flutter deverá selecionar uma biblioteca Dart posteriormente. A primeira seleção de 19 IDs/23 ficheiros licenciados está em `apps/web/public/audio` e é rastreada em `SOULS-AUDIO-LICENSES.md`; os ficheiros e IDs podem ser comuns, mas o código de reprodução não será partilhado.
- A licença e o hash de cada asset devem ser verificáveis antes de sincronizar para Mobile.

## Compatibilidade Android/iOS

A implementação futura deve considerar:

- layouts responsivos, orientação, safe areas e tamanhos mínimos de carta;
- gestos de toque, seleção, arrasto e acessibilidade;
- escalabilidade do tabuleiro e performance de VFX/animações;
- cache e memória de imagens/áudio;
- autoplay/retoma e ciclo de vida do áudio;
- persistência local de definições/baralhos;
- WebSocket, timeout, reconexão e suspensão/retoma da aplicação;
- retomada segura de uma sala sem repetir eventos históricos;
- formatos de imagem/áudio suportados nos dois sistemas.

Não converter CSS React automaticamente para widgets Flutter. A interface será nativa, mantendo identidade visual e recursos oficiais.

## Próximos passos

1. estabilizar schemas de rede sem alterar o protocolo;
2. aumentar [`tests/game-fixtures`](../../tests/game-fixtures);
3. decidir geração de modelos Dart;
4. criar o projeto Flutter numa tarefa separada;
5. integrar primeiro lobby/partida online;
6. só depois avaliar motor Dart offline.
